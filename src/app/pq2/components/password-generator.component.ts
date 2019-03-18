import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { Demon, Skill, DecodedDemon, CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';
import { encodeDemon } from '../models/password-generator';

@Component({
  selector: 'app-password-generator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <table>
        <tr><th colspan="2">QR Codes</th></tr>
        <tr>
          <th [ngStyle]="{ width: '33%' }"></th>
          <th [ngStyle]="{ width: '67%' }">QR Code</th>
        </tr>
        <tr>
          <td></td>
          <td><app-qrcode [byteArray]="passBytes"></app-qrcode></td>
        </tr>
      </table>
      <table>
        <tr><th colspan="6">Persona Entry</th></tr>
        <tr>
          <th>Language</th>
          <th>Level</th>
          <th>HP</th>
          <th>MP</th>
          <th>Race</th>
          <th>Demon</th>
        </tr>
        <tr>
          <td>
            <select formControlName="language">
              <option value="jap">Japanese</option>
              <option value="eng">English</option>
            </select>
          </td>
          <td>
            <select formControlName="lvl">
              <option *ngFor="let _ of range99; let i = index" [value]="i + 1">{{ i + 1 }}</option>
            </select>
          </td>
          <td>
            <select formControlName="hp">
              <option *ngFor="let _ of range299; let i = index" [value]="i + 1">{{ i + 1 }}</option>
            </select>
          </td>
          <td>
            <select formControlName="mp">
              <option *ngFor="let _ of range99; let i = index" [value]="i + 1">{{ i + 1 }}</option>
            </select>
          </td>
          <td>
            <select formControlName="race" (change)="changeRace(form.controls.race.value)">
              <option *ngFor="let race of races" [value]="race">{{ race }}</option>
            </select>
          </td>
          <td>
            <select formControlName="demon" (change)="setDefaultValues(form.controls.demon.value)">
              <option *ngFor="let demon of demons[form.controls.race.value]" [value]="demon.name">{{ demon.name }}</option>
            </select>
          </td>
        </tr>
      </table>
      <table formArrayName="skills">
        <tr><th colspan="5">Learned Skills</th></tr>
        <tr>
          <th>Element</th>
          <th>Name</th>
          <th>Cost</th>
          <th>Effect</th>
          <th>Target</th>
        </tr>
        <ng-container *ngFor="let skill of form.controls.skills['controls']; let i = index" [formGroupName]="i">
          <tr [ngClass]="{ unique: (compendium.getSkill(skill.controls.name.value) || blankSkill).rank > 90 }">
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
              <td>{{ entry.target }}</td>
            </ng-container>
            <ng-template #noEntry>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </ng-template>
          </tr>
        </ng-container>
      </table>
    </form>
  `,
  styles: [`
    td select { width: 100%; }
    input { width: 95%; border-width: 3px; }
    input.ng-valid { border-color: lime; }
    input.ng-invalid { border-color: red; }
  `]
})
export class PasswordGeneratorComponent implements OnChanges {
  @Input() defaultRace = 'Fool';
  @Input() defaultDemon = 'Slime';
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;

  races: string[];
  elems: string[];
  demons: { [race: string]: Demon[] } = {};
  skills: { [elem: string]: Skill[] } = {};
  dcodes: { [code: number]: Demon } = {};
  scodes: { [code: number]: Skill } = {};
  form: FormGroup;

  range99 = Array(99);
  range299 = Array(299);
  passBytes: Array<number>;

  blankSkill: Skill = {
    code: 0, cost: 0, level: 0, rank: 0, target: 'Self',
    name: '-', element: '-', inherit: '-', effect: '-',
    learnedBy: [], fuse: []
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
      language: 'eng',
      lvl: 1,
      hp: 1,
      mp: 1,
      race: this.defaultRace,
      demon: this.defaultDemon,
      skills: this.fb.array(skills)
    });

    this.form.valueChanges.subscribe(form => {
      if (this.form.valid) {
        const demon = this.compendium.getDemon(form.demon);
        const dskills = form.skills.map(s => this.compendium.getSkill(s.name) || this.blankSkill);

        const decoded: DecodedDemon = {
          language: form.language,
          demonCode: demon.code,
          lvl: parseInt(form.lvl, 10),
          exp: 13568664,
          hp: parseInt(form.hp, 10),
          mp: parseInt(form.mp, 10),
          skillCodes: dskills.map(s => s.code),
        };

        this.passBytes = encodeDemon(decoded, this.compConfig.appTitle);
      }
    });
  }

  initDropdowns() {
    this.demons = {};
    this.skills = { '-': [this.blankSkill] };
    this.dcodes = {};
    this.scodes = { 0: this.blankSkill };

    if (this.compConfig && this.compendium) {
      for (const demon of this.compendium.allDemons.filter(d => d.code)) {
        if (!this.demons[demon.race]) {
          this.demons[demon.race] = [];
        }

        this.demons[demon.race].push(demon);
        this.dcodes[demon.code] = demon;
      }

      for (const skill of this.compendium.allSkills.filter(s => s.code)) {
        if (!this.skills[skill.element]) {
          this.skills[skill.element] = [];
        }

        this.skills[skill.element].push(skill);
        this.scodes[skill.code] = skill;
      }

      for (const demonList of Object.values(this.demons)) {
        demonList.sort((a, b) => b.lvl - a.lvl);
      }

      for (const skillList of Object.values(this.skills)) {
        skillList.sort((a, b) => a.rank - b.rank);
      }

      this.races = this.compConfig.races.filter(r => this.demons[r]);
      this.elems = this.compConfig.skillElems.filter(e => this.skills[e]);
      this.setDefaultValues(this.defaultDemon);
    }
  }

  changeRace(race: string) {
    const demon = this.demons[race][0];
    this.form.controls.demon.setValue(demon.name);
    this.setDefaultValues(demon.name);
  }

  setDefaultValues(name: string) {
    const skills = Array(6).fill(this.blankSkill);
    const demon = this.compendium.getDemon(name);
    let i = 0;

    for (const [sname, sentry] of Object.entries(demon.skills)) {
      if (sentry === 0) {
        skills[i++] = this.compendium.getSkill(sname);
      }
    }

    this.form.patchValue({
      lvl: Math.floor(demon.lvl),
      hp: demon.stats[0],
      mp: demon.stats[1],
      race: demon.race,
      demon: demon.name,
      skills: skills.map(s => ({ elem: s.element, name: s.name }))
    });
  }
}

@Component({
  selector: 'app-password-generator-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-password-generator
      [compendium]="compendium"
      [compConfig]="compConfig">
    </app-password-generator>
  `
})
export class PasswordGeneratorContainerComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  compConfig: CompendiumConfig;
  subscriptions: Subscription[] = [];

  constructor(
    private fusionDataService: FusionDataService,
    private title: Title
  ) {
    this.compConfig = this.fusionDataService.compConfig;
  }

  ngOnInit()    { this.setTitle(); this.subscribeAll(); }
  ngOnDestroy() { this.unsubscribeAll(); }

  setTitle() {
    this.title.setTitle(`QR Code Generator - ${this.fusionDataService.appName}`);
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
