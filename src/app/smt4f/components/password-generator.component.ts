import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Demon, Skill, DecodedDemon, CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';
import { decodeDemon, encodeDemon } from '../models/password-generator';

@Component({
  selector: 'app-password-generator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <h2>Password Generator</h2>
      <table class="entry-table">
        <thead>
          <tr><th colspan="2" class="title">Passwords</th></tr>
          <tr>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div><code>{{ engPassword.slice(0, 16) }}</code></div>
              <div><code>{{ engPassword.slice(16) }}</code></div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="entry-table">
        <thead>
          <tr><th colspan="4" class="title">Demon Entry</th></tr>
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
                <option *ngFor="let race of allRaces" [value]="race">{{ race }}</option>
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
      <table class="entry-table">
        <thead>
          <tr><th [attr.colspan]="stats.length" class="title">Stats</th></tr>
          <tr>
            <th *ngFor="let stat of stats">{{ stat }}</th>
          </tr>
        </thead>
        <tbody>
          <tr formArrayName="stats">
            <td *ngFor="let stat of form.controls.stats['controls']; let i = index">
              <select [formControlName]="i">
                <option *ngFor="let _ of range99; let i = index" [value]="i + 1">{{ i + 1 }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="entry-table">
        <thead>
          <tr><th colspan="2" class="title">Learned Skills</th></tr>
          <tr>
            <th style="width: 25%">Element</th>
            <th style="width: 75%">Name</th>
          </tr>
        </thead>
        <tbody formArrayName="skills">
          <ng-container *ngFor="let skill of form.controls.skills['controls']; let i = index" [formGroupName]="i">
            <tr>
              <td>
                <select formControlName="elem" (change)="skill.controls.name.setValue(skills[skill.controls.elem.value][0].name)">
                  <option *ngFor="let elem of allElems" [value]="elem">{{ elem }}</option>
                </select>
              </td>
              <td>
                <select formControlName="name">
                  <option *ngFor="let entry of skills[skill.controls.elem.value]" [value]="entry.name">{{ entry.name }}</option>
                </select>
              </td>
            </tr>
          </ng-container>
        </tbody>
      </table>
    </form>
  `,
  styles: [`
    td select { width: 100%; }
  `]
})
export class PasswordGeneratorComponent implements OnChanges {
  @Input() defaultDemon: string;
  @Input() encoding: string;
  @Input() encodingRegex: string;
  @Input() compendium: Compendium;
  @Input() races: string[]
  @Input() elems: string[]

  stats = ['St', 'Ma', 'Vi', 'Ag', 'Lu'];
  demons: { [race: string]: Demon[] };
  skills: { [elem: string]: Skill[] };
  dcodes: { [code: number]: Demon };
  scodes: { [code: number]: Skill };
  internalMaxSkills = 6;
  allRaces: string[];
  allElems: string[];
  form: FormGroup;

  range99 = Array(99);
  range256 = Array(256);
  japPassword = '';
  engPassword = '';
  currHP = 0;
  currMP = 0;
  price = 0;

  unknownDemon: Demon = {
    name: '???', race: '-', align: '', code: 0,
    lvl: 0, currLvl: 0, skills: {}, skillCards: {},
    price: 0, stats: [0, 0, 0, 0, 0], resists: [], ailments: [],
    inherits: 0, affinities: [], fusion: 'normal', prereq: '', searchTags: '-'
  };
  blankSkill: Skill = {
    name: '-', code: 0, element: '-', rank: 0,
    effect: '-', target: '-', cost: 0, learnedBy: [], transfer: [], level: 0
  };
  unknownSkill: Skill = {
    name: '???', code: 0, element: '-', rank: 0,
    effect: '-', target: '-', cost: 0, learnedBy: [], transfer: [], level: 0
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

      // const statsPrice = demon.pcoeff * Math.pow(decoded.stats.reduce((acc, s) => acc + s, 0), 3);
      // const overflowPrice = this.isRedux ? statsPrice : statsPrice % Math.pow(2, 32);
      // this.price = Math.floor((Math.floor(overflowPrice / 1000) + SkillCosts[maxRank] + 1300) * 0.75);

      const passBytes = encodeDemon(decoded);
      this.engPassword = passBytes.map(b => this.encoding[b]).join('');

      // this.currHP = decoded.lvl * 6 + Math.floor(decoded.stats[2] * 3 * demon.hpmod) + (demon.name === 'Knocker' ? 30 : 25);
      // this.currMP = decoded.lvl * 3 + Math.floor(decoded.stats[1] * 2 * demon.hpmod) + (demon.name === 'Knocker' ? 14 : 13);
    });
  }

  initDropdowns() {
    this.demons = { '-': [this.unknownDemon]};
    this.skills = { '-': [this.blankSkill], '???': [this.unknownSkill] };
    this.dcodes = {};
    this.scodes = { 0: this.blankSkill };

    if (this.compendium) {
      for (const demon of this.compendium.allDemons) {
        if (!this.demons[demon.race]) {
          this.demons[demon.race] = [];
        }

        this.demons[demon.race].push(demon);
        this.dcodes[demon.code] = demon;
      }

      for (const skill of this.compendium.allSkills) {
        if (!this.skills[skill.element]) {
          this.skills[skill.element] = [];
        }

        if (skill.code > 0) {
          this.skills[skill.rank < 90 ? skill.element : '???'].push(skill);
          this.scodes[skill.code] = skill;
        }
      }

      for (const demonList of Object.values(this.demons)) {
        if (demonList.length === 0) { demonList.push() }
        demonList.sort((a, b) => b.lvl - a.lvl);
      }

      for (const skillList of Object.values(this.skills)) {
        skillList.sort((a, b) => a.rank - b.rank);
      }

      this.allRaces = ['-'].concat(this.races.filter(r => this.demons[r]));
      this.allElems = ['-'].concat(this.elems.filter(e => this.skills[e]), ['???']);
      this.setDefaultValues(this.defaultDemon);
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
      const demon = this.compendium.getDemon(name);
      const innateSkills = Object.entries(demon.skills)
        .slice(0, this.internalMaxSkills)
        .filter(s => s[1] < 2)
        .map(s => this.compendium.getSkill(s[0]));
      const learnedSkills = Object.entries(demon.skills)
        .filter(s => s[1] < 100)
        .map(s => this.compendium.getSkill(s[0]));

      this.skills[this.blankSkill.element] = [this.blankSkill].concat(learnedSkills);
      this.form.setValue({
        maskByte: 0,
        lvl: Math.floor(demon.lvl),
        race: demon.race,
        demon: demon.name,
        stats: demon.stats.slice(2),
        skills: innateSkills
          .concat(Array(this.internalMaxSkills - innateSkills.length).fill(this.blankSkill))
          .map(s => ({ elem: '-', name: s.name }))
      });
    }
  }
}

@Component({
  selector: 'app-password-generator-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-password-generator
      [races]="compConfig.races"
      [elems]="compConfig.skillElems"
      [defaultDemon]="compConfig.defaultRecipeDemon"
      [encoding]="encodings[encodingIndex]"
      [encodingRegex]="encodingRegexes[encodingIndex]"
      [compendium]="compendium">
    </app-password-generator>
  `
})
export class PasswordGeneratorContainerComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  compConfig: CompendiumConfig;
  subscriptions: Subscription[] = [];
  encodingIndex = 0;
  encodings = [
    "$234567890ABCDEFGH%JKLMNOPQRSTUVWXYZabcdefghijk#mnopqrstuvwxyz-+",
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?&",
    "しんいくみＢやるＹけひＫＦとＨむＡちにＺきＷよＬをのたれＮえＳふわＪそりすＣめＰへＱＧＲＤこＭＴまつせかはＥＵてさなあもゆおうろ",
  ]
  encodingRegexes = [
    "$2-90A-H%J-Za-k#m-z+-",
    "0-9A-Za-z&?",
    "しんいくみBやるYけひKFとHむAちにZきWよLをのたれNえSふわJそりすCめPへQGRDこMTまつせかはEUてさなあもゆおうろ",
  ]

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
    this.compConfig = this.fusionDataService.compConfig;
    this.encodingIndex = this.compConfig.lang !== 'en' ? 2 :
      this.compConfig.appCssClasses.includes('smtdsj') ? 1 : 0;
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
