import { Component, ChangeDetectionStrategy, Input, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { SkillLevelToShortStringPipeLocale } from '../pipes';
import { Demon, Skill, FusionRecipe, Compendium, SquareChart, RecipeGeneratorConfig } from '../../compendium/models';
import { createLeftRightCombos, createLeftRightRecipe } from '../models/recipe-generator';
import Translations from '../data/translations.json';

type DemonLookup = { [key: string]: Demon[]; }
type SkillLookup = { [key: string]: Skill[]; }

@Component({
  selector: 'app-recipe-generator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <ng-template #inheritElems let-skillLookup="skillLookup">
        <td colspan="3" style="text-align: center;">
          <ng-container *ngFor="let elem of recipeConfig.inheritElems; let i = index">
            <div *ngIf="skillLookup[elem]" [ngClass]="['element-icon', elem]">{{ elem }}</div>
          </ng-container>
        </td>
      </ng-template>

      <ng-template #skillPickerHeader>
        <th style="width: 10%;">{{ msgs.Elem | translateComp:lang }}</th>
        <th style="width: 15%;">{{ msgs.Skill | translateComp:lang }}</th>
        <th style="width: 20%;">{{ msgs.Ingredient | translateComp:lang }}</th>
      </ng-template>

      <ng-template #skillPicker let-ingred="ingredControl" let-skillLookup="skillLookup">
        <td>
          <select [formControl]="ingred.controls.elem">
            <option value="-">-</option>
            <ng-container *ngFor="let elem of recipeConfig.skillElems">
              <option *ngIf="skillLookup[elem]" [value]="elem">{{ recipeConfig.displayElems[elem] || elem }}</option>
            </ng-container>
          </select>
        </td>
        <td>
          <select [formControl]="ingred.controls.skill">
            <option *ngFor="let skill of skillLookup[ingred.controls.elem.value]" [ngValue]="skill">{{ skill.name }}</option>
          </select>
        </td>
        <td>
          <select [formControl]="ingred.controls.demon">
            <option *ngFor="let demon of learnedBy[ingred.controls.skill.value.name]" [ngValue]="demon">{{ demon.name }}</option>
          </select>
        </td>
      </ng-template>

      <h2>{{ msgs.RecipeGenerator | translateComp:lang }}</h2>
      <table class="entry-table" style="width: 40%;">
        <tr><th colspan="3" class="title">{{ msgs.Target | translateComp:lang }}</th></tr>
        <tr><th colspan="3">{{ msgs.Target | translateComp:lang }}</th></tr>
        <tr>
          <td colspan="3">
            <select formControlName="demonT">
              <option *ngFor="let demon of demonTs" [ngValue]="demon">{{ demon.name }}</option>
            </select>
          </td>
        </tr>
        <tr>
          <ng-container *ngTemplateOutlet="inheritElems; context: { skillLookup: skillTs }"></ng-container>
        </tr>
      </table>
      <table class="entry-table" style="width: 70%;">
        <tr>
          <th colspan="7" class="title">Ingredients</th>
        </tr>
        <tr>
          <th colspan="3">Left Chain Target</th>
          <th></th>
          <th colspan="3">Right Chain Target</th>
        </tr>
        <tr>
          <td colspan="3">
            <select formControlName="demonL">
              <option *ngFor="let demon of demonLs" [ngValue]="demon">{{ demon.name }} ({{ demonRs[demon.name].length }})</option>
            </select>
          </td>
          <td></td>
          <td colspan="3">
            <select formControlName="demonR">
              <option *ngFor="let demon of demonRs[form.controls.demonL.value.name]" [ngValue]="demon">{{ demon.name }}</option>
            </select>
          </td>
        <tr>
        <tr>
          <ng-container *ngTemplateOutlet="inheritElems; context: { skillLookup: skillLs }"></ng-container>
          <td style=></td>
          <ng-container *ngTemplateOutlet="inheritElems; context: { skillLookup: skillRs }"></ng-container>
        </tr>
        <tr>
          <ng-container *ngTemplateOutlet="skillPickerHeader"></ng-container>
          <th style="width: 5%;"></th>
          <ng-container *ngTemplateOutlet="skillPickerHeader"></ng-container>
        </tr>
        <ng-container formArrayName="ingreds">
          <ng-container *ngFor="let ingred of form.controls.ingreds['controls']; let i = index">
            <tr *ngIf="i < maxSkills && i % 2 === 0">
              <ng-container [formGroupName]="i" *ngTemplateOutlet="skillPicker; context: {
                ingredControl: form.controls.ingreds['controls'][i],
                skillLookup: skillLs
              }"></ng-container>
              <td></td>
              <ng-container [formGroupName]="i + 1" *ngTemplateOutlet="skillPicker; context: {
                ingredControl: form.controls.ingreds['controls'][i + 1],
                skillLookup: skillRs
              }"></ng-container>
            </tr>
          </ng-container>
        </ng-container>
      </table>
      <table *ngIf="recipe" class="entry-table">
        <tr><th colspan="2" class="title">{{ msgs.FusionRecipe | translateComp:lang }}</th></tr>
        <tr>
          <th>{{ msgs.LeftChain | translateComp:lang }}</th>
          <th>{{ msgs.RightChain | translateComp:lang }}</th>
        </tr>
        <tr>
          <td style="width: 50%" *ngIf="recipeLeft.length"><ul><li *ngFor="let step of recipeLeft">{{ step }}</li></ul></td>
          <td style="width: 50%" *ngIf="!recipeLeft.length" style="padding: 1em; text-align: center;">{{ msgs.NoRecipesFound | translateComp:lang }}</td>
          <td style="width: 50%" *ngIf="recipeRight.length"><ul><li *ngFor="let step of recipeRight">{{ step }}</li></ul></td>
          <td style="width: 50%" *ngIf="!recipeRight.length" style="padding: 1em; text-align: center;">{{ msgs.NoRecipesFound | translateComp:lang }}</td>
        </tr>
        <tr *ngIf="fusionPrereq"><td colspan="2" style="padding: 1em; text-align: center;">
          {{ msgs.SpecialFusionCondition | translateComp:lang }}: {{ fusionPrereq }}
        </td></tr>
        <tr><td colspan="2" style="padding: 1em; text-align: center;">
          <ng-container *ngIf="recipe.stepR.length">
            {{ recipeResult.join(' x ') }} = {{ recipe.result }}<br>
            [{{ resultSkills.join(', ') }}]
          </ng-container>
          <ng-container *ngIf="!recipe.stepR.length">{{ msgs.NoRecipesFound | translateComp:lang }}</ng-container>
        </td></tr>
      </table>
    </form>
  `,
  styles: [`
    ul { padding: 0 1em; list-style: none; }
    td select { min-height: 25px; width: 100%; }
    div.element-icon { display: inline-block; }
  `]
})
export class RecipeGeneratorComponent implements OnChanges, OnDestroy {
  @Input() maxSkills = 8;
  @Input() compendium: Compendium;
  @Input() squareChart: SquareChart;
  @Input() recipeConfig: RecipeGeneratorConfig;
  @Input() lang = 'en';

  demonTs: Demon[];
  demonLs: Demon[];
  demonRs: DemonLookup;
  skillTs: SkillLookup;
  skillLs: SkillLookup;
  skillRs: SkillLookup;
  elemTyped: SkillLookup;
  learnedBy: DemonLookup;
  form: FormGroup;

  fusionPrereq = '';
  recipe: FusionRecipe;
  recipeLeft: string[];
  recipeRight: string[];
  recipeResult: string[];
  resultSkills: string[];
  skillLevelPipe = new SkillLevelToShortStringPipeLocale();

  subscriptions: Subscription[] = [];
  msgs = Translations.RecipeGeneratorComponent;
  internalMaxSkills = 10;

  blankDemon: Demon = {
    name: '-', race: '-', lvl: 0, currLvl: 0, price: 0, inherits: 0,
    skills: {}, stats: [], resists: [], affinities: [],
    fusion: 'normal', prereq: '', searchTags: '-'
  };

  blankSkill: Skill = {
    name: '-', element: '-', inherit: '-', rank: 99, cost: 0,
    effect: '', target: '', level: 0, learnedBy: [{ demon: '-', level: 0 }]
  };

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { this.createForm(); this.initFormSubscribes(); }

  ngOnChanges() { this.initDropdowns(); }
  ngOnDestroy() { for (const s of this.subscriptions) { s.unsubscribe(); } }

  createForm() {
    const ingreds = [];

    for (let i = 0; i < this.internalMaxSkills; i++) {
      ingreds.push(this.fb.group({ elem: '-', skill: this.blankSkill, demon: this.blankDemon }));
    }

    this.form = this.fb.group({
      demonT: '-',
      demonL: '-',
      demonR: '-',
      ingreds: this.fb.array(ingreds),
    });
  }

  createSkillLookup(demon: Demon, demonT: Demon): SkillLookup {
    const excludeElems: string[] = [];
    const { inheritElems } = this.recipeConfig;

    for (let i = 0; i < inheritElems.length; i++) {
      if (!(demon.inherits & demonT.inherits & (1 << i))) {
        excludeElems.push(inheritElems[inheritElems.length - i - 1]);
      }
    }

    const elems = this.recipeConfig.skillElems.filter(e => !excludeElems.includes(e));
    const learnedSkills = Object.keys(demon.skills)
      .filter(s => demon.skills[s] < 99)
      .map(s => this.compendium.getSkill(s))
      .filter(s => elems.includes(s.element) && s.rank < 50);

    return elems.reduce((acc, e) =>
      { acc[e] = this.elemTyped[e]; return acc; },
      { '-': [this.blankSkill].concat(learnedSkills) }
    );
  }

  updateRecipe(recipe: FusionRecipe) {
    const skillRef: { [demon: string]: string[] } = {};

    for (const [skill, demon] of Object.entries(recipe.skills)) {
      if (!skillRef[demon]) { skillRef[demon] = []; }
      const slvl = this.compendium.getDemon(demon).skills[skill];
      skillRef[demon].push(`${skill} ${this.skillLevelPipe.transform(slvl, this.lang)}`.trim());
    }

    this.recipe = recipe;
    this.recipeLeft = this.decodeRecipechain(recipe.chain1, skillRef);
    this.recipeRight = this.decodeRecipechain(recipe.chain2, skillRef);
    this.resultSkills = [];
    this.recipeResult = [];
    this.fusionPrereq = this.compendium.getDemon(recipe.result).prereq || '';

    for (const result of recipe.stepR) {
      this.recipeResult.push(skillRef[result] ? `${result} [${skillRef[result].join(', ')}]` : result);
    }

    for (const [skill, slvl] of Object.entries(this.compendium.getDemon(recipe.result).skills)
      .filter(s => s[1] < 2000)
      .sort((a, b) => a[1] - b[1])
    ) {
      this.resultSkills.push(`${skill} ${this.skillLevelPipe.transform(slvl, this.lang)}`.trim());
    }

    this.cdr.markForCheck();
  }

  private decodeRecipechain(chain: string[], skillRef: { [demon: string]: string[] }): string[] {
    const steps = [];

    for (let i = 0; i < chain.length - 2; i += 2) {
      const skills1 = skillRef[chain[i]] ? '[' + skillRef[chain[i]].join(', ') + '] ' : '';
      const skills2 = skillRef[chain[i + 1]] ? '[' + skillRef[chain[i + 1]].join(', ') + '] ' : '';
      steps.push(`${chain[i]} ${skills1}x ${chain[i + 1]} ${skills2}= ${chain[i + 2]}`);
    }

    return steps;
  }

  initDropdowns() {
    if (!this.recipeConfig || !this.compendium || !this.squareChart) { return; }

    this.demonTs = this.compendium.allDemons.filter(d => !d.isEnemy && d.fusion !== 'party' && d.fusion !== 'enemy');
    this.demonTs.sort((a, b) => a.name.localeCompare(b.name));
    this.elemTyped = { '-': [this.blankSkill] };
    this.learnedBy = { '-': [this.blankDemon] };

    for (const demon of this.demonTs) {
      for (const sname of Object.keys(demon.skills)) {
        if (!this.learnedBy[sname]) { this.learnedBy[sname] = []; }
        this.learnedBy[sname].push(demon);
      }
    }

    for (const skill of this.compendium.allSkills.filter(s => s.rank < 50 && this.learnedBy[s.name])) {
      if (!this.elemTyped[skill.inherit]) { this.elemTyped[skill.inherit] = []; }
      this.elemTyped[skill.inherit].push(skill);
    }

    for (const dl of Object.values(this.learnedBy)) { dl.sort((a, b) => a.lvl - b.lvl); }
    for (const sl of Object.values(this.elemTyped)) { sl.sort((a, b) => a.rank - b.rank); }

    this.form.controls.demonT.setValue(this.demonTs[0]);
  }

  initFormSubscribes() {
    const subs = this.subscriptions;
    const controls = this.form.controls;

    subs.push(this.form.valueChanges.pipe(auditTime(0)).subscribe(f => this.onFormChange(f)));
    subs.push(controls.demonT.valueChanges.subscribe(d => this.splitDemonT(d)));
    subs.push(controls.demonL.valueChanges.subscribe(d => this.splitDemonL(d)));
    subs.push(controls.demonR.valueChanges.subscribe(d => this.splitDemonR(d)));

    for (const [i, ingred] of controls.ingreds['controls'].entries()) {
      subs.push(ingred.controls.elem.valueChanges.subscribe(e =>
        ingred.controls.skill.setValue((i % 2 === 0 ? this.skillLs : this.skillRs)[e][0])));
      subs.push(ingred.controls.skill.valueChanges.subscribe(s => ingred.controls.demon.setValue(this.learnedBy[s.name][0])));
    }
  }

  onFormChange(form: any) {
    if (!this.form.valid) { return; }
    const ingredLs: { [skill: string]: string } = {};
    const ingredRs: { [skill: string]: string } = {};
    const disabledCount = this.internalMaxSkills - form.ingreds.length;

    for (let i = disabledCount; i < this.internalMaxSkills; i++) {
      const ingred = form.ingreds[i - disabledCount];
      const ingreds = i % 2 === 0 ? ingredLs : ingredRs;
      if (ingred.skill.name !== '-') { ingreds[ingred.skill.name] = ingred.demon.name; }
    }

    const lrConfig = {
      result: form.demonT.name,
      targetL: form.demonL.name,
      targetR: form.demonR.name,
      ingredLs,
      ingredRs
    }

    this.updateRecipe(createLeftRightRecipe(lrConfig, this.compendium, this.squareChart, this.recipeConfig));
  }

  splitDemonT(demon: Demon) {
    const combos = createLeftRightCombos(demon.name, this.compendium, this.squareChart, this.recipeConfig);
    this.demonRs = {};

    for (const [nameL, nameRs] of Object.entries(combos)) {
      this.demonRs[nameL] = nameRs.map(nameR => this.compendium.getDemon(nameR));
      this.demonRs[nameL].sort((a, b) => a.name.localeCompare(b.name));
    }

    this.demonLs = Object.keys(combos).map(nameL => this.compendium.getDemon(nameL));
    this.demonLs.sort((a, b) => this.demonRs[b.name].length - this.demonRs[a.name].length);

    if (this.demonLs.length === 0) {
      this.demonLs = [this.blankDemon];
      this.demonRs = { '-': [this.blankDemon] };
    }

    this.skillTs = this.createSkillLookup(demon, demon);
    this.form.controls.demonL.setValue(this.demonLs[0]);

    const innateCount = Object.values(demon.skills).reduce((acc, l) => acc + (l < 2 ? 1 : 0), 0);
    const emitSilent = { emitEvent: false };

    for (const [i, ingred] of this.form.controls.ingreds['controls'].entries()) {
      ingred.patchValue({ elem: '-', skill: this.blankSkill, demon: this.blankDemon }, emitSilent);
      if (this.recipeConfig.restrictInherits && i < innateCount) { ingred.disable(emitSilent); }
      else { ingred.enable(emitSilent); }
    }
  }

  splitDemonL(demon: Demon) {
    this.skillLs = this.createSkillLookup(demon, this.form.controls.demonT.value);
    this.form.controls.demonR.setValue(this.demonRs[demon.name][0]);
  }

  splitDemonR(demon: Demon) {
    this.skillRs = this.createSkillLookup(demon, this.form.controls.demonT.value);

    for (const [i, ingred] of this.form.controls.ingreds['controls'].entries()) {
      const elem = ingred.controls.elem.value;
      if (elem === '-' || !(i % 2 === 0 ? this.skillLs[elem] : this.skillRs[elem])) {
        ingred.patchValue({ elem: '-', skill: this.blankSkill, demon: this.blankDemon }, { emitEvent: false });
      }
    }
  }
}
