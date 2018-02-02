import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { Races, BaseStats, SkillElements, PasswordEncodings, SkillCosts } from '../models/constants';
import { Demon, Skill, DecodedDemon } from '../models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';
import { decodeDemon, encodeDemon } from '../models/password-generator';

@Component({
  selector: 'app-password-generator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <table>
        <thead>
          <tr><th colspan="4">Passwords</th></tr>
          <tr>
            <th [ngStyle]="{ width: '33.333%' }">Japanese Password</th>
            <th [ngStyle]="{ width: '33.333%' }">English Password</th>
            <th [ngStyle]="{ width: '33.333%' }">Custom Password</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>{{ japPassword.slice(0, 16) }}</div>
              <div>{{ japPassword.slice(16) }}</div>
            </td>
            <td>
              <div><code>{{ engPassword.slice(0, 16) }}</code></div>
              <div><code>{{ engPassword.slice(16) }}</code></div>
            </td>
            <td><app-demon-password (passwordBytes)="setPasswordValues($event)"></app-demon-password></td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr><th colspan="4">Demon Entry</th></tr>
          <tr>
            <th>Mask Byte</th>
            <th>Level</th>
            <th>Race</th>
            <th>Demon</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select formControlName="maskByte">
                <option *ngFor="let _ of range256; let i = index" [value]="i">{{ i }}</option>
              </select>
            </td>
            <td>
              <select formControlName="lvl">
                <option *ngFor="let _ of range99; let i = index" [value]="i + 1">{{ i + 1 }}</option>
              </select>
            </td>
            <td>
              <select formControlName="race" (change)="changeRace(form.controls.race.value)">
                <option value="-">-</option>
                <option *ngFor="let race of races" [value]="race">{{ race }}</option>
              </select>
            </td>
            <td>
              <select formControlName="demon" (change)="setDefaultValues(form.controls.demon.value)">
                <option *ngFor="let demon of demons[form.controls.race.value]" [value]="demon.name">{{ demon.name }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr><th colspan="8">Stats</th></tr>
          <tr>
            <th>Price</th>
            <th *ngFor="let stat of stats">{{ stat }}</th>
          </tr>
        </thead>
        <tbody>
          <tr formArrayName="stats">
            <td>{{ price }}</td>
            <td>{{ currHP }}</td>
            <td>{{ currMP }}</td>
            <td *ngFor="let stat of form.controls.stats['controls']; let i = index">
              <select [formControlName]="i">
                <option *ngFor="let _ of range99; let i = index" [value]="i + 1">{{ i + 1 }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr><th colspan="6">Learned Skills</th></tr>
          <tr>
            <th>Element</th>
            <th>Name</th>
            <th>Cost</th>
            <th>Effect</th>
            <th>Rank</th>
            <th>Inherit</th>
          </tr>
        </thead>
        <tbody formArrayName="skills">
          <tr *ngFor="let skill of form.controls.skills['controls']; let i = index" [formGroupName]="i">
            <td>
              <select formControlName="elem" (change)="skill.controls.name.setValue(skills[skill.controls.elem.value][0].name)">
                <option value="-">-</option>
                <option *ngFor="let elem of elems" [value]="elem">{{ elem }}</option>
              </select>
            </td>
            <td>
              <select formControlName="name">
                <option *ngFor="let entry of skills[skill.controls.elem.value]" [value]="entry.name">{{ entry.name }}</option>
              </select>
            </td>
            <ng-container *ngIf="compendium.getSkill(skill.controls.name.value); let entry; else noEntry">
              <td [style.color]="entry.cost ? null: 'transparent'">{{ entry.cost | skillCostToString }}</td>
              <td>{{ entry.effect }}</td>
              <td [style.color]="entry.rank !== 99 ? null: 'transparent'">{{ entry.rank }}</td>
              <td><div class="element-icon {{ entry.inherit }}">{{ entry.inherit }}</div></td>
            </ng-container>
            <ng-template #noEntry>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </ng-template>
          </tr>
        </tbody>
      </table>
    </form>
  `,
  styles: [`
    td select { width: 100%; }
  `]
})
export class PasswordGeneratorComponent implements OnChanges {
  @Input() compendium: Compendium;
  races = Races;
  stats = BaseStats;
  elems = SkillElements;
  demons: { [race: string]: Demon[] };
  skills: { [elem: string]: Skill[] };
  dcodes: { [code: number]: Demon };
  scodes: { [code: number]: Skill };
  form: FormGroup;

  range99 = Array(99);
  range256 = Array(256);
  japPassword = '';
  engPassword = '';
  currHP = 0;
  currMP = 0;
  price = 0;

  unknownDemon: Demon = {
    code: 0, pcoeff: 0, hpmod: 0, price: 0, lvl: 0,
    name: '???', align: '', race: '-', fusion: '-',
    inherits: [], skills: {}, source: {}, stats: [], resists: []
  };
  blankSkill: Skill = {
    code: 0, power: 0, accuracy: 0, cost: 0, level: 0, rank: 0,
    name: '-', element: '-', inherit: '-', effect: '-',
    learnedBy: [], transfer: []
  };
  unknownSkill: Skill = {
    code: 0, power: 0, accuracy: 0, cost: 0, level: 0, rank: 0,
    name: '???', element: '-', inherit: '-', effect: '-',
    learnedBy: [], transfer: []
  };

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnChanges() { this.initDropdowns(); }

  createForm() {
    const skills = [];

    for (let i = 0; i < 6; i++) {
      skills.push(this.fb.group({ elem: '-', name: '-' }));
    }

    this.form = this.fb.group({
      maskByte: 0,
      lvl: 1,
      race: '-',
      demon: '???',
      stats: this.fb.array(Array(5).fill(1)),
      skills: this.fb.array(skills)
    });

    this.form.valueChanges.subscribe(form => {
      const demon = this.compendium.getDemon(form.demon) || this.unknownDemon;
      const dskills = form.skills.map(s => this.compendium.getSkill(s.name) || this.blankSkill);

      const decoded: DecodedDemon = {
        demonCode: demon.code,
        lvl: parseInt(form.lvl, 10),
        exp: 0,
        stats: form.stats.map(s => parseInt(s, 10)),
        baseStats: form.stats.map(s => parseInt(s, 10)),
        skillCodes: dskills.map(s => s.code),
        maskByte: parseInt(form.maskByte, 10),
      };

      let maxRank = 0;
      for (const skill of dskills) {
        if (!demon.skills.hasOwnProperty(skill.name) && maxRank < skill.rank && skill.rank < 15) {
          maxRank = skill.rank;
        }
      }

      const n = decoded.stats.reduce((acc, s) => acc + s, 0);
      this.price = Math.floor((Math.floor((demon.pcoeff * Math.pow(n, 3)) % Math.pow(2, 32) / 1000) + SkillCosts[maxRank] + 1300) * 0.75);

      const passBytes = encodeDemon(decoded);
      this.engPassword = passBytes.map(b => PasswordEncodings.eng[b]).join('');
      this.japPassword = passBytes.map(b => PasswordEncodings.jap[b]).join('');
      this.currHP = decoded.lvl * 6 + Math.floor(decoded.stats[2] * 3 * demon.hpmod) + (demon.name === 'Knocker' ? 30 : 25);
      this.currMP = decoded.lvl * 3 + Math.floor(decoded.stats[1] * 2 * demon.hpmod) + (demon.name === 'Knocker' ? 14 : 13);
    });
  }

  initDropdowns() {
    this.demons = this.races.reduce((acc, r) => { acc[r] = []; return acc; }, { '-': [this.unknownDemon]});
    this.skills = this.elems.reduce((acc, e) => { acc[e] = []; return acc; }, { '-': [this.blankSkill, this.unknownSkill] });
    this.dcodes = {};
    this.scodes = { 0: this.blankSkill };

    if (this.compendium) {
      for (const demon of this.compendium.allDemons) {
        this.demons[demon.race].push(demon);
        this.dcodes[demon.code] = demon;
      }

      for (const skill of this.compendium.allSkills) {
        this.skills[skill.element].push(skill);
        this.scodes[skill.code] = skill;
      }

      for (const demonList of Object.values(this.demons)) {
        demonList.sort((a, b) => b.lvl - a.lvl);
      }

      for (const skillList of Object.values(this.skills)) {
        skillList.sort((a, b) => a.rank - b.rank);
      }

      this.setDefaultValues('Seraph');
    }
  }

  changeRace(race: string) {
    const demon = this.demons[race][0];
    this.form.controls.demon.setValue(demon.name);
    this.setDefaultValues(demon.name);
  }

  setPasswordValues(passwordBytes: number[]) {
    const demon = decodeDemon(passwordBytes);
    const sentries = demon.skillCodes.map(c => this.scodes[c] || this.unknownSkill);
    const dentry = Object.assign({}, this.dcodes[demon.demonCode] || this.unknownDemon, {
      lvl: demon.lvl,
      stats: [0, 0].concat(demon.stats.map(s => Math.min(Math.max(s, 1), 99))),
    });

    this.form.setValue({
      maskByte: demon.maskByte,
      lvl: dentry.lvl,
      race: dentry.race,
      demon: dentry.name,
      stats: dentry.stats.slice(2),
      skills: sentries.map(s => ({ elem: s.element, name: s.name }))
    });
  }

  setDefaultValues(name: string) {
    if (name !== this.unknownDemon.name) {
      const skills = Array(6).fill(this.blankSkill);
      const demon = this.compendium.getDemon(name);
      let i = 0;

      for (const s of Object.keys(demon.skills)) {
        skills[i++] = this.compendium.getSkill(s);
      }

      this.form.setValue({
        maskByte: 170,
        lvl: Math.floor(demon.lvl),
        race: demon.race,
        demon: demon.name,
        stats: demon.stats.slice(2),
        skills: skills.map(s => ({ elem: s.element, name: s.name }))
      });
    }
  }
}

@Component({
  selector: 'app-password-generator-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-password-generator [compendium]="compendium"></app-password-generator>
  `
})
export class PasswordGeneratorContainerComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  subscriptions: Subscription[] = [];

  constructor(
    private fusionDataService: FusionDataService,
    private title: Title
  ) { }

  ngOnInit()    { this.setTitle(); this.subscribeAll(); }
  ngOnDestroy() { this.unsubscribeAll(); }

  setTitle() {
    this.title.setTitle(`Password Generator - ${this.fusionDataService.appName}`);
  }

  subscribeAll() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(comp => {
        this.compendium = comp;
      }));
  }

  unsubscribeAll() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
