import { Component, input, computed, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';

import { SkillLevelToShortStringPipeLocale, TranslateCompPipe } from '../pipes';
import { Demon, Skill, Compendium, SquareChart, RecipeGeneratorConfig } from '../../compendium/models';
import { createLeftRightCombos, createLeftRightRecipe } from '../models/recipe-generator';
import Translations from '../data/translations.json';

type DemonLookup = { [key: string]: Demon[]; }
type SkillLookup = { [key: string]: Skill[]; }

const BLANK_DEMON: Demon = {
  name: '-', race: '-', lvl: 0, currLvl: 0, price: 0, inherits: 0,
  skills: {}, stats: [], resists: [], affinities: [],
  fusion: 'normal', prereq: '', searchTags: '-'
};

const BLANK_SKILL: Skill = {
  name: '-', element: '-', inherit: '-', rank: 99, cost: 0,
  effect: '', target: '', level: 0, learnedBy: [{ demon: '-', level: 0 }]
};

@Component({
  selector: 'app-recipe-generator',
  imports: [CommonModule, FormsModule, TranslateCompPipe],
  template: `
    <div>
      <ng-template #inheritElems let-skillLookup="skillLookup">
        <td colspan="3" style="text-align: center;">
          @for (elem of recipeConfig().inheritElems; track elem) {
            @if (skillLookup()[elem]) {
              <div [ngClass]="['element-icon', elem]">{{ elem }}</div>
            }
          }
        </td>
      </ng-template>
    
      <ng-template #skillPickerHeader>
        <th style="width: 10%;">{{ msgs.Elem | translateComp:lang() }}</th>
        <th style="width: 15%;">{{ msgs.Skill | translateComp:lang() }}</th>
        <th style="width: 20%;">{{ msgs.Ingredient | translateComp:lang() }}</th>
      </ng-template>

      <ng-template #skillPicker let-ingred="ingred" let-skillLookup="skillLookup">
        <td>
          <select [(ngModel)]="ingred.elem" [disabled]="ingred.disabled()">
            <option value="-">-</option>
            @for (elem of recipeConfig().skillElems; track elem) {
              @if (skillLookup()[elem]) {
                <option [ngValue]="elem">{{ recipeConfig().displayElems[elem] || elem }}</option>
              }
            }
          </select>
        </td>
        <td>
          <select [(ngModel)]="ingred.skill" [disabled]="ingred.disabled()">
            @for (skill of skillLookup()[ingred.elem()]; track skill.name) {
              <option [ngValue]="skill">{{ skill.name }}</option>
            }
          </select>
        </td>
        <td>
          <select [(ngModel)]="ingred.demon" [disabled]="ingred.disabled()">
            @for (demon of learnedBy()[ingred.skill().name]; track demon.name) {
              <option [ngValue]="demon">{{ demon.name }}</option>
            }
          </select>
        </td>
      </ng-template>
    
      <h2>{{ msgs.RecipeGenerator | translateComp:lang() }}</h2>
      <table class="entry-table" style="width: 40%;">
        <tr><th colspan="3" class="title">{{ msgs.Target | translateComp:lang() }}</th></tr>
        <tr><th colspan="3">{{ msgs.Target | translateComp:lang() }}</th></tr>
        <tr>
          <td colspan="3">
            <select [(ngModel)]="demonT">
              @for (demon of demonTs(); track demon.name) {
                <option [ngValue]="demon">{{ demon.name }}</option>
              }
            </select>
          </td>
        </tr>
        <tr>
          <ng-container *ngTemplateOutlet="inheritElems; context: { skillLookup: skillTs }"></ng-container>
        </tr>
      </table>
      <table class="entry-table" style="width: 70%;">
        <tr><th colspan="7" class="title">{{ msgs.IncludeIngredients | translateComp:lang() }}</th></tr>
        <tr>
          <th colspan="3">{{ msgs.LeftChain | translateComp:lang() }}</th>
          <th></th>
          <th colspan="3">{{ msgs.RightChain | translateComp:lang() }}</th>
        </tr>
        <tr>
          <td colspan="3">
            <select [(ngModel)]="demonL">
              @for (demon of demonLs(); track demon.name) {
                <option [ngValue]="demon">{{ demon.name }} ({{ demonRs()[demon.name].length }})</option>
              }
            </select>
          </td>
          <td></td>
          <td colspan="3">
            <select [(ngModel)]="demonR">
              @for (demon of demonRs()[demonL().name]; track demon.name) {
                <option [ngValue]="demon">{{ demon.name }}</option>
              }
            </select>
          </td>
        </tr>
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
          @for (_ of ingredLs; track $index; let i = $index) {
            <tr>
              <ng-container *ngTemplateOutlet="skillPicker; context: { ingred: ingredLs[i], skillLookup: skillLs }"></ng-container>
              <td></td>
              <ng-container *ngTemplateOutlet="skillPicker; context: { ingred: ingredRs[i], skillLookup: skillRs }"></ng-container>
            </tr>
          }
        </ng-container>
      </table>

      @if (fullRecipe()) {
        <table class="entry-table">
          <tr><th colspan="2" class="title">{{ msgs.FusionRecipe | translateComp:lang() }}</th></tr>
          <tr>
            <th>{{ msgs.LeftChain | translateComp:lang() }}</th>
            <th>{{ msgs.RightChain | translateComp:lang() }}</th>
          </tr>
          <tr>
            @if (recipeLeft().length) {
              <td style="width: 50%"><ul>
                @for (step of recipeLeft(); track step) { <li>{{ step }}</li> }
              </ul></td>
            }
            @if (!recipeLeft().length) {
              <td style="width: 50%" style="padding: 1em; text-align: center;">{{ msgs.NoRecipesFound | translateComp:lang() }}</td>
            }
            @if (recipeRight().length) {
              <td style="width: 50%"><ul>
                @for (step of recipeRight(); track step) { <li>{{ step }}</li> }
              </ul></td>
            }
            @if (!recipeRight().length) {
              <td style="width: 50%" style="padding: 1em; text-align: center;">{{ msgs.NoRecipesFound | translateComp:lang() }}</td>
            }
          </tr>
          @if (fusionPrereq()) {
            <tr><td colspan="2" style="padding: 1em; text-align: center;">
              {{ msgs.SpecialFusionCondition | translateComp:lang() }}: {{ fusionPrereq() }}
            </td></tr>
          }
          <tr><td colspan="2" style="padding: 1em; text-align: center;">
            @if (fullRecipe().stepR.length) {
              {{ recipeResult().join(' x ') }} = {{ fullRecipe().result }}<br>
              [{{ resultSkills().join(', ') }}]
            }
            @if (!fullRecipe().stepR.length) {
              {{ msgs.NoRecipesFound | translateComp:lang() }}
            }
          </td></tr>
        </table>
      }
    </div>
  `,
  styles: [`
    ul { padding: 0 1em; list-style: none; }
    td select { min-height: 25px; width: 100%; }
    div.element-icon { display: inline-block; }
  `]
})
export class RecipeGeneratorComponent {
  json = JSON;
  maxSkills = input(8);
  compendium = input.required<Compendium>();
  squareChart = input.required<SquareChart>();
  recipeConfig = input.required<RecipeGeneratorConfig>();
  lang = input('en');
  msgs = Translations.RecipeGeneratorComponent;
  internalMaxSkills = 10;
  skillLevelPipe = new SkillLevelToShortStringPipeLocale();

  demonT = linkedSignal(() => this.demonTs()[0]);
  demonL = linkedSignal(() => this.demonLs()[0]);
  demonR = linkedSignal(() => this.demonRs()[this.demonL().name][0]);

  recipeInputModel = linkedSignal(() => ({
    demonT: this.demonT(),
    demonL: this.demonL(),
    demonR: this.demonR(),
    ingredLs: this.ingredLs.map(({ disabled, elem, skill, demon }) => ({
      disabled: disabled(),
      elem: elem(),
      skill: skill(),
      demon: demon()
    })),
    ingredRs: this.ingredRs.map(({ disabled, elem, skill, demon }) => ({
      disabled: disabled(),
      elem: elem(),
      skill: skill(),
      demon: demon()
    }))
  }));

  recipeInputForm = form(this.recipeInputModel);

  demonTs = computed(() => {
    const demonTs = this.compendium().allDemons.filter(d => !d.isEnemy && d.fusion !== 'party' && d.fusion !== 'enemy');
    demonTs.sort((a, b) => a.name.localeCompare(b.name));
    return demonTs;
  });

  learnedBy = computed(() => {
    const learnedBy: DemonLookup = { '-': [BLANK_DEMON] };

    for (const demon of this.demonTs()) {
      for (const sname of Object.keys(demon.skills)) {
        if (!learnedBy[sname]) { learnedBy[sname] = []; }
        learnedBy[sname].push(demon);
      }
    }

    for (const dl of Object.values(learnedBy)) { dl.sort((a, b) => a.lvl - b.lvl); }
    return learnedBy;
  });

  elemTyped = computed(() => {
    const elemTyped: SkillLookup = { '-': [BLANK_SKILL] };

    for (const skill of this.compendium().allSkills.filter(s => s.rank < 50 && this.learnedBy()[s.name])) {
      if (!elemTyped[skill.inherit]) { elemTyped[skill.inherit] = []; }
      elemTyped[skill.inherit].push(skill);
    }

    for (const sl of Object.values(elemTyped)) { sl.sort((a, b) => a.rank - b.rank); }
    return elemTyped;
  });

  demonRs = computed(() => {
    const demonRs: DemonLookup = {};
    const combos = createLeftRightCombos(this.demonT().name, this.compendium(), this.squareChart(), this.recipeConfig());

    for (const [nameL, nameRs] of Object.entries(combos)) {
      demonRs[nameL] = nameRs.map(nameR => this.compendium().getDemon(nameR));
      demonRs[nameL].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (Object.keys(demonRs).length === 0) { demonRs['-'] = [BLANK_DEMON]; }
    return demonRs;
  });

  demonLs = computed(() => {
    const demonLs = Object.keys(this.demonRs()).map(nameL => this.compendium().getDemon(nameL) || BLANK_DEMON);
    demonLs.sort((a, b) => this.demonRs()[b.name].length - this.demonRs()[a.name].length);
    return demonLs;
  });

  skillTs = computed(() => this.createSkillLookup(this.demonT()));
  skillLs = computed(() => this.createSkillLookup(this.demonL()));
  skillRs = computed(() => this.createSkillLookup(this.demonR()));
  innateCount = computed(() => Object.values(this.demonT().skills).reduce((acc, l) => acc + (l < 2 ? 1 : 0), 0));

  allIngreds = Array.from({ length: 2 }, (_, col) =>
    Array.from({ length: this.internalMaxSkills / 2 }, (_, row) =>  {
      const skillIs = col === 0 ? this.skillLs : this.skillRs;
      const disabled = linkedSignal(() => 2 * row + col < this.innateCount());

      const elem = linkedSignal<{ demonT: Demon, skillIs: SkillLookup }, string>({
        source: () => ({ demonT: this.demonT(), skillIs: skillIs() }),
        computation: ({ demonT, skillIs }, prev) =>
          !prev || demonT !== prev.source.demonT || !skillIs[prev.value] ? '-' : prev.value
      });

      const skill = linkedSignal<{ elem: string, skillIs: SkillLookup }, Skill>({
        source: () => ({ elem: elem(), skillIs: skillIs() }),
        computation: ({ elem, skillIs }, prev) =>
          !prev || !skillIs[elem].includes(prev.value) ? skillIs[elem][0] : prev.value
      });

      const demon = linkedSignal(() => this.learnedBy()[skill().name][0]);

      return { disabled, elem, skill, demon };
    })
  );

  ingredLs = this.allIngreds[0];
  ingredRs = this.allIngreds[1];

  createSkillLookup(demon: Demon): SkillLookup {
    const excludeElems: string[] = [];
    const { inheritElems } = this.recipeConfig();

    for (let i = 0; i < inheritElems.length; i++) {
      if (!(demon.inherits & this.demonT().inherits & (1 << i))) {
        excludeElems.push(inheritElems[inheritElems.length - i - 1]);
      }
    }

    const elems = this.recipeConfig().skillElems.filter(e => !excludeElems.includes(e));
    const learnedSkills = Object.keys(demon.skills)
      .filter(s => demon.skills[s] < 99)
      .map(s => this.compendium().getSkill(s))
      .filter(s => elems.includes(s.element) && s.rank < 50);

    return elems.reduce((acc, e) =>
      { acc[e] = this.elemTyped()[e]; return acc; },
      { '-': [BLANK_SKILL].concat(learnedSkills) }
    );
  }

  fullRecipe = computed(() => {
    console.log('wat')
    const { demonT, demonL, demonR, ingredLs: inputLs, ingredRs: inputRs } = this.recipeInputModel()
    const [ingredLs, ingredRs] = [inputLs, inputRs].map(inputIs => inputIs
      .filter(i => !i.disabled && i.demon.name !== '-')
      .reduce<{ [skill: string]: string }>((acc, i) => { acc[i.skill.name] = i.demon.name; return acc; }, {})
    );

    const lrConfig = { result: demonT.name, targetL: demonL.name, targetR: demonR.name, ingredLs, ingredRs };
    return createLeftRightRecipe(lrConfig, this.compendium(), this.squareChart(), this.recipeConfig());
  });

  fullRecipeSkillRef = computed(() => {
    const skillRef: { [demon: string]: string[] } = {};

    for (const [skill, demon] of Object.entries(this.fullRecipe().skills)) {
      if (!skillRef[demon]) { skillRef[demon] = []; }
      const slvl = this.compendium().getDemon(demon).skills[skill];
      skillRef[demon].push(`${skill} ${this.skillLevelPipe.transform(slvl, this.lang())}`.trim());
    }

    return skillRef;
  });

  recipeLeft = computed(() => this.decodeRecipechain(this.fullRecipe().chain1, this.fullRecipeSkillRef()));
  recipeRight = computed(() => this.decodeRecipechain(this.fullRecipe().chain2, this.fullRecipeSkillRef()));

  resultSkills = computed(() => {
    const resultSkills = []

    for (const [skill, slvl] of Object.entries(this.compendium().getDemon(this.fullRecipe().result).skills)
      .filter(s => s[1] < 2000)
      .sort((a, b) => a[1] - b[1])
    ) {
      resultSkills.push(`${skill} ${this.skillLevelPipe.transform(slvl, this.lang())}`.trim());
    }

    return resultSkills;
  });

  recipeResult = computed(() => {
    const recipeResult = [];

    for (const result of this.fullRecipe().stepR) {
      recipeResult.push(this.fullRecipeSkillRef()[result] ? `${result} [${this.fullRecipeSkillRef()[result].join(', ')}]` : result);
    }

    return recipeResult;
  });

  fusionPrereq = computed(() => this.compendium().getDemon(this.fullRecipe().result).prereq || '');

  private decodeRecipechain(chain: string[], skillRef: { [demon: string]: string[] }): string[] {
    const steps = [];

    for (let i = 0; i < chain.length - 2; i += 2) {
      const skills1 = skillRef[chain[i]] ? '[' + skillRef[chain[i]].join(', ') + '] ' : '';
      const skills2 = skillRef[chain[i + 1]] ? '[' + skillRef[chain[i + 1]].join(', ') + '] ' : '';
      steps.push(`${chain[i]} ${skills1}x ${chain[i + 1]} ${skills2}= ${chain[i + 2]}`);
    }

    return steps;
  }
}
