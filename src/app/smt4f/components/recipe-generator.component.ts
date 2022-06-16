import { Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Demon, Skill, CompendiumConfig, FusionRecipe } from '../models';
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
          <th>Skill Slots</th>
          <th>Max Lvl</th>
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
          <td>
            <select>
              <option *ngFor="let _ of range99; let i = index" [value]="99 - i">{{ 99 - i }}</option>
            </select>
          </td>
        </tr>
      </table>
      <table formArrayName="skills" class="entry-table">
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
              <td [style.color]="entry.rank !== 99 ? null: 'transparent'">{{ entry.rank }}</td>
            </ng-container>
          </tr>
        </ng-container>
      </table>
      <table *ngIf="recipe" class="entry-table">
        <tr><th colspan="2" class="title">Fusion Recipe</th></tr>
        <tr><th>Left Chain</th><th>Right Chain</th></tr>
        <tr>
          <td style="width: 50%"><ul><li *ngFor="let step of recipeLeft">{{ step }}</li></ul></td>
          <td style="width: 50%"><ul><li *ngFor="let step of recipeRight">{{ step }}</li></ul></td>
        </tr>
        <tr><td colspan="2" style="padding: 1em; text-align: center;">
          <ng-container *ngIf="recipe.stepR.length">
            {{ recipeResult.join(' x ') }} = {{ recipe.result }}<br>
            [{{ resultSkills.join(', ') }}]
          </ng-container>
          <ng-container *ngIf="!recipe.stepR.length">No recipes found</ng-container>
        </td></tr>
      </table>
    </form>
  `,
  styles: [`
    ul { padding: 0 1em; list-style: none; }
    td select { width: 100%; }
  `]
})
export class RecipeGeneratorComponent implements OnChanges {
  @Input() defaultDemon = 'Pixie';
  @Input() compendium: Compendium;
  @Input() fusionChart: FusionChart;
  @Input() compConfig: CompendiumConfig;

  range99 = Array(99);
  races: string[];
  elems: string[];
  demons: { [race: string]: Demon[] } = {};
  skills: { [elem: string]: Skill[] } = {};
  form: FormGroup;
  recipe: FusionRecipe;
  recipeLeft: string[];
  recipeRight: string[];
  recipeResult: string[];
  resultSkills: string[];

  blankDemon: Demon = {
    name: '-', race: '-', lvl: 0, currLvl: 0, price: 0,
    skills: {}, stats: [], resists: [], affinities: [], ailments: [],
    fusion: 'normal', prereq: ''
  };

  blankSkill: Skill = {
    name: '-', element: '-', rank: 99, cost: 0,
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
        this.updateRecipe(createSkillsRecipe(form.demon.name, dskills, this.compendium, this.fusionChart));
      }
    });
  }

  updateRecipe(recipe: FusionRecipe) {
    const skillRef: { [demon: string]: string[] } = {};

    for (const [skill, demon] of Object.entries(recipe.skills)) {
      if (!skillRef[demon]) { skillRef[demon] = []; }
      const slvl = this.compendium.getDemon(demon).skills[skill];
      skillRef[demon].push(skill + (slvl ? ` (${slvl})` : ''));
    }

    this.recipe = recipe;
    this.recipeLeft = this.decodeRecipechain(recipe.chain1, skillRef);
    this.recipeRight = this.decodeRecipechain(recipe.chain2, skillRef);
    this.resultSkills = [];
    this.recipeResult = [];

    for (const result of recipe.stepR) {
      this.recipeResult.push(skillRef[result] ? `${result} [${skillRef[result].join(', ')}]` : result);
    }

    for (const [skill, slvl] of Object.entries(this.compendium.getDemon(recipe.result).skills)
      .filter(s => s[1] < 2000)
      .sort((a, b) => a[1] - b[1])
    ) {
      this.resultSkills.push(skill + (slvl ? ` (${slvl})` : ''));
    }
  }

  private decodeRecipechain(chain: string[], skillRef: { [demon: string]: string[] } ): string[] {
    const steps = [];

    for (let i = 0; i < chain.length - 2; i += 2) {
      const skills1 = skillRef[chain[i]] ? '[' + skillRef[chain[i]].join(', ') + '] ' : '';
      const skills2 = skillRef[chain[i+1]] ? '[' + skillRef[chain[i+1]].join(', ') + '] ' : '';
      steps.push(`${chain[i]} ${skills1}x ${chain[i+1]} ${skills2}= ${chain[i+2]}`);
    }

    return steps;
  }

  initDropdowns() {
    if (!this.compConfig || !this.compendium || !this.fusionChart) { return; }

    this.demons = {};
    this.skills = { '-': [this.blankSkill] };

    for (const demon of this.compendium.allDemons) {
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
