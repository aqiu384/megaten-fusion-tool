import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Demon, Skill, CompendiumConfig } from '../models';
import { createSkillsRecipe } from '../models/recipe-generator';
import { Compendium } from '../models/compendium';
import { FusionChart } from '../models/fusion-chart';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-recipe-generator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <h2>Recipe Generator</h2>
      <table class="entry-table">
        <tr><th colspan="7" class="title">Demon Entry</th></tr>
        <tr>
          <th>Race</th>
          <th>Demon</th>
          <th>Other</th>
        </tr>
        <tr>
          <td>
            <select formControlName="race" (change)="setDemon(demons[form.controls.race.value][0])">
              <option *ngFor="let race of races" [value]="race">{{ race }}</option>
            </select>
          </td>
          <td>
            <select formControlName="demon" (change)="setDemon(form.controls.demon.value)">
              <option *ngFor="let demon of demons[form.controls.race.value]" [ngValue]="demon">{{ demon.name }}</option>
            </select>
          </td>
          <td>
            <label>Lock innate skills<input type="checkbox" formControlName="innateLocked" (change)="setDemon(form.controls.demon.value)"></label>
          </td>
        </tr>
      </table>
      <table formArrayName="skills" class="list-table">
        <tr><th colspan="6" class="title">Learned Skills</th></tr>
        <tr>
          <th style="width: 5%;">Elem</th>
          <th style="width: 15%;">Name</th>
          <th style="width: 10%;">Cost</th>
          <th style="width: 50%;">Effect</th>
          <th style="width: 10%;">Target</th>
          <th style="width: 10%;">Rank</th>
        </tr>
        <ng-container *ngFor="let skill of form.controls.skills['controls']; let i = index" [formGroupName]="i">
          <tr>
            <ng-container *ngIf="!form.controls.innateLocked.value || skill.controls.innate.value.name === '-'; else lockInnate">
              <td>
                <select formControlName="elem" (change)="skill.controls.custom.setValue(skills[skill.controls.elem.value][0])">
                  <option value="-">-</option>
                  <option *ngFor="let elem of elems" [value]="elem">{{ elem }}</option>
                </select>
              </td>
              <td>
                <select formControlName="custom">
                  <option [ngValue]="skill.controls.innate.value">{{ skill.controls.innate.value.name }}</option>
                  <option *ngFor="let entry of skills[skill.controls.elem.value]" [ngValue]="entry">{{ entry.name }}</option>
                </select>
              </td>
            </ng-container>
            <ng-template #lockInnate>
              <td><select disabled><option>{{ skill.controls.innate.value.element }}</option></select></td>
              <td><select disabled><option>{{ skill.controls.innate.value.name }}</option></select></td>
            </ng-template>
            <ng-container *ngIf="skill.controls.custom.value as entry">
              <td [style.color]="entry.cost ? null: 'transparent'">{{ entry.cost | skillCostToString }}</td>
              <td>{{ entry.effect }}</td>
              <td>{{ entry.target }}</td>
              <td>{{ entry.rank }}</td>
            </ng-container>
          </tr>
        </ng-container>
      </table>
  `,
  styles: [`
    td select { width: 100%; }
  `]
})
export class RecipeGeneratorComponent implements OnChanges {
  @Input() defaultDemon = 'Pixie';
  @Input() compendium: Compendium;
  @Input() fusionChart: FusionChart;
  @Input() compConfig: CompendiumConfig;

  races: string[];
  elems: string[];
  demons: { [race: string]: Demon[] } = {};
  skills: { [elem: string]: Skill[] } = {};
  form: FormGroup;

  blankDemon: Demon = {
    name: '-', race: '-', lvl: 0, currLvl: 0, price: 0,
    skills: {}, stats: [], resists: [], affinities: [], ailments: [],
    fusion: 'normal', prereq: ''
  };

  blankSkill: Skill = {
    name: '-', element: '-', rank: 0, cost: 0,
    effect: '', target: '', level: 0, learnedBy: []
  };

  constructor(private fb: FormBuilder) { this.createForm(); }

  ngOnChanges() { this.initDropdowns(); }

  createForm() {
    const skills = [];

    for (let i = 0; i < 8; i++) {
      skills.push(this.fb.group({ elem: '-', innate: this.blankSkill, custom: this.blankSkill }));
    }

    this.form = this.fb.group({
      race: '-',
      demon: this.blankDemon,
      skills: this.fb.array(skills),
      innateLocked: true
    });

    this.form.valueChanges.subscribe(form => {
      if (this.form.valid) {
        const dskills = form.skills.map(s => s.custom.name).filter(s => s !== '-');
        const recipe = createSkillsRecipe(form.demon.name, dskills, this.compendium, this.fusionChart);
      }
    });
  }

  initDropdowns() {
    if (!this.compConfig || !this.compendium || !this.fusionChart) { return; }

    this.demons = {};
    this.skills = { '-': [this.blankSkill] };

    for (const demon of this.compendium.allDemons.filter(d => d.stats[0])) {
      if (!this.demons[demon.race]) { this.demons[demon.race] = []; }
      this.demons[demon.race].push(demon);
    }

    for (const skill of this.compendium.allSkills.filter(s => s.rank < 50 && s.learnedBy.length > 0)) {
      if (!this.skills[skill.element]) { this.skills[skill.element] = []; }
      this.skills[skill.element].push(skill);
    }

    for (const demonList of Object.values(this.demons)) {
      demonList.sort((a, b) => b.lvl - a.lvl);
    }

    for (const skillList of Object.values(this.skills)) {
      skillList.sort((a, b) => a.rank - b.rank);
    }

    this.races = this.compConfig.races.filter(r => this.demons[r]);
    this.elems = this.compConfig.skillElems.filter(e => this.skills[e]);
    this.setDemon(this.compendium.getDemon(this.defaultDemon));
  }

  setDemon(demon: Demon) {
    const skills = Array(8).fill(this.blankSkill);
    let i = 0;

    for (const [sname, sentry] of Object.entries(demon.skills)) {
      if (sentry === 0) { skills[i++] = this.compendium.getSkill(sname); }
    }

    this.form.patchValue({
      race: demon.race,
      demon: demon,
      skills: skills.map(s => ({ elem: s.element, innate: s, custom: s }))
    });
  }
}

@Component({
  selector: 'app-recipe-generator-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-recipe-generator
      [compendium]="compendium"
      [fusionChart]="fusionChart"
      [compConfig]="compConfig">
    </app-recipe-generator>
  `
})
export class RecipeGeneratorContainerComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  fusionChart: FusionChart;
  compConfig: CompendiumConfig;
  subscriptions: Subscription[] = [];

  constructor(private fusionDataService: FusionDataService, private title: Title) {
    this.compConfig = this.fusionDataService.compConfig;
  }

  ngOnInit()    { this.setTitle(); this.subscribeAll(); }
  ngOnDestroy() { this.unsubscribeAll(); }

  setTitle() {
    this.title.setTitle(`Recipe Generator - ${this.fusionDataService.appName}`);
  }

  subscribeAll() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(comp => {
        this.compendium = comp;
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(chart => {
        this.fusionChart = chart;
      }));
  }

  unsubscribeAll() {
    for (const subscription of this.subscriptions) { subscription.unsubscribe(); }
  }
}
