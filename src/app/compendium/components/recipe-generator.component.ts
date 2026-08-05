import { Component, input, computed, effect, linkedSignal, ViewEncapsulation } from '@angular/core';
import { applyEach, disabled, form, FormField } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { SkillLevelToShortStringPipeLocale, TranslateCompPipe } from '../pipes';
import { Compendium, SquareChart, RecipeGeneratorConfig } from '../../compendium/models';
import { createLeftRightCombos, createLeftRightRecipe } from '../models/recipe-generator';
import Translations from '../data/translations.json';
import {
  DemonLookup, SkillLookup, SkillPickModel, BLANK_DEMON,
  makeSkillPickList, SkillLookupMaker, RecipeSkillPickerComponent
} from './recipe-skill-picker.component';

function decodeRecipechain(chain: string[], skillRef: { [demon: string]: string[] }): string[] {
  const steps = [];

  for (let i = 0; i < chain.length - 2; i += 2) {
    const skills1 = skillRef[chain[i]] ? '[' + skillRef[chain[i]].join(', ') + '] ' : '';
    const skills2 = skillRef[chain[i + 1]] ? '[' + skillRef[chain[i + 1]].join(', ') + '] ' : '';
    steps.push(`${chain[i]} ${skills1}x ${chain[i + 1]} ${skills2}= ${chain[i + 2]}`);
  }

  return steps;
}

@Component({
  selector: 'td[app-recipe-inherit-elems]',
  imports: [CommonModule],
  template: `
    @for (elem of inheritElems(); track elem) {
      @if (skillLookup()[elem]) {
        <div [ngClass]="['element-icon', elem]">{{ elem }}</div>
      }
    }
  `
})
export class RecipeInheritElemsComponent {
  inheritElems = input.required<string[]>();
  skillLookup = input.required<SkillLookup>();
}

@Component({
  selector: 'app-recipe-generator',
  imports: [CommonModule, FormField, TranslateCompPipe, RecipeSkillPickerComponent, RecipeInheritElemsComponent],
  template: `
    @let lang = lang$();
    @let recipeConfig = recipeConfig$();
    @let fullRecipe = fullRecipe$();
    <form>
      <ng-template #skillPickerHeader>
        <th style="width: 10%;">{{ msgs.Elem | translateComp:lang }}</th>
        <th style="width: 15%;">{{ msgs.Skill | translateComp:lang }}</th>
        <th style="width: 20%;">{{ msgs.Ingredient | translateComp:lang }}</th>
      </ng-template>

      <h2>{{ msgs.RecipeGenerator | translateComp:lang }}</h2>
      <table class="entry-table" style="width: 40%;">
        <tr><th colspan="3" class="title">{{ msgs.Target | translateComp:lang }}</th></tr>
        <tr><th colspan="3">{{ msgs.Target | translateComp:lang }}</th></tr>
        <tr>
          <td>
            <select [formField]="form.demonT" (change)="initWithInnate()">
              @for (demon of demonTs$(); track demon.name) {
                <option [value]="demon.name">{{ demon.name }}</option>
              }
            </select>
          </td>
        </tr>
        <tr>
          <td app-recipe-inherit-elems [inheritElems]="recipeConfig.inheritElems" [skillLookup]="skillTs$()"></td>
        </tr>
      </table>
      <table class="entry-table" style="width: 70%;">
        <tr><th colspan="7" class="title">{{ msgs.IncludeIngredients | translateComp:lang }}</th></tr>
        <tr>
          <th colspan="3">{{ msgs.LeftChain | translateComp:lang }}</th>
          <th></th>
          <th colspan="3">{{ msgs.RightChain | translateComp:lang }}</th>
        </tr>
        <tr>
          <td colspan="3">
            <select [formField]="form.demonL">
              @for (demon of demonLs$(); track demon.name) {
                <option [value]="demon.name">{{ demon.name }} ({{ demonRs$()[demon.name].length }})</option>
              }
            </select>
          </td>
          <td></td>
          <td colspan="3">
            <select [formField]="form.demonR">
              @for (demon of demonRs$()[demonL$().name]; track demon.name) {
                <option [value]="demon.name">{{ demon.name }}</option>
              }
            </select>
          </td>
        </tr>
        <tr>
          <td colspan="3" app-recipe-inherit-elems [inheritElems]="recipeConfig.inheritElems" [skillLookup]="skillLs$()"></td>
          <td></td>
          <td colspan="3" app-recipe-inherit-elems [inheritElems]="recipeConfig.inheritElems" [skillLookup]="skillRs$()"></td>
        </tr>
        <tr>
          <ng-container *ngTemplateOutlet="skillPickerHeader"></ng-container>
          <th style="width: 5%;"></th>
          <ng-container *ngTemplateOutlet="skillPickerHeader"></ng-container>
        </tr>
        <ng-container>
          @for (_ of form.ingredLs; track $index) {
            <tr>
              @let leftSkill = form.ingredLs[$index];
              @let rightSkill = form.ingredRs[$index];
              <app-recipe-skill-picker
                [skillPickForm]="leftSkill"
                [skillLookupMaker]="skillLookupMaker$()"
                [skillIs]="!leftSkill.disabled().value() ? skillLs$() : skillTs$()">
              </app-recipe-skill-picker>
              <td></td>
              <app-recipe-skill-picker
                [skillPickForm]="rightSkill"
                [skillLookupMaker]="skillLookupMaker$()"
                [skillIs]="!rightSkill.disabled().value() ? skillRs$() : skillTs$()">
              </app-recipe-skill-picker>
            </tr>
          }
        </ng-container>
      </table>

      @if (fullRecipe) {
        <table class="entry-table">
          <tr><th colspan="2" class="title">{{ msgs.FusionRecipe | translateComp:lang }}</th></tr>
          <tr>
            <th>{{ msgs.LeftChain | translateComp:lang }}</th>
            <th>{{ msgs.RightChain | translateComp:lang }}</th>
          </tr>
          <tr>
            @if (recipeLeft$().length) {
              <td style="width: 50%"><ul>
                @for (step of recipeLeft$(); track $index) { <li>{{ step }}</li> }
              </ul></td>
            }
            @if (!recipeLeft$().length) {
              <td style="width: 50%" style="padding: 1em; text-align: center;">{{ msgs.NoRecipesFound | translateComp:lang }}</td>
            }
            @if (recipeRight$().length) {
              <td style="width: 50%"><ul>
                @for (step of recipeRight$(); track $index) { <li>{{ step }}</li> }
              </ul></td>
            }
            @if (!recipeRight$().length) {
              <td style="width: 50%" style="padding: 1em; text-align: center;">{{ msgs.NoRecipesFound | translateComp:lang }}</td>
            }
          </tr>
          @if (fusionPrereq$()) {
            <tr><td colspan="2" style="padding: 1em; text-align: center;">
              {{ msgs.SpecialFusionCondition | translateComp:lang }}: {{ fusionPrereq$() }}
            </td></tr>
          }
          <tr><td colspan="2" style="padding: 1em; text-align: center;">
            @if (fullRecipe.stepR.length) {
              {{ recipeResult$().join(' x ') }} = {{ fullRecipe.result }}<br>
              [{{ resultSkills$().join(', ') }}]
            }
            @if (!fullRecipe.stepR.length) {
              {{ msgs.NoRecipesFound | translateComp:lang }}
            }
          </td></tr>
        </table>
      }
    </form>
  `,
  styles: [`
    ul { padding: 0 1em; list-style: none; }
    select { min-height: 25px; width: 100%; }
    td[app-recipe-inherit-elems] { text-align: center; }
    div.element-icon { display: inline-block; }
  `],
  encapsulation: ViewEncapsulation.None
})
export class RecipeGeneratorComponent {
  compendium$ = input.required<Compendium>({ alias: 'compendium' });
  squareChart$ = input.required<SquareChart>({ alias: 'squareChart' });
  recipeConfig$ = input.required<RecipeGeneratorConfig>({ alias: 'recipeConfig' });
  maxSkills$ = input(8, { alias: 'maxSkills' });
  lang$ = input('en', { alias: 'lang' });

  msgs = Translations.RecipeGeneratorComponent;
  skillLevelPipe = new SkillLevelToShortStringPipeLocale();

  recipeInputModel$ = linkedSignal(() => ({
    demonT: BLANK_DEMON.name,
    demonL: BLANK_DEMON.name,
    demonR: BLANK_DEMON.name,
    ingredLs: makeSkillPickList(this.maxSkills$() / 2),
    ingredRs: makeSkillPickList(this.maxSkills$() / 2)
  }));

  form = form(this.recipeInputModel$, schemaPath => {
    applyEach(schemaPath.ingredLs, itemPath => {
      disabled(itemPath, { when: ({ valueOf }) => valueOf(itemPath.disabled)})
    });
    applyEach(schemaPath.ingredRs, itemPath => {
      disabled(itemPath, { when: ({ valueOf }) => valueOf(itemPath.disabled)})
    });
  });

  constructor() {
    effect(() => this.form.demonT().value.update(demonT =>
      this.demonTs$().find(d => d.name === demonT) ? demonT : this.demonTs$()[0].name
    ));
    effect(() => this.form.demonL().value.update(demonL =>
      this.demonLs$().find(d => d.name === demonL) ? demonL : this.demonLs$()[0].name
    ));
    effect(() => this.form.demonR().value.update(demonR =>
      this.demonRs$()[this.demonL$().name]?.find(d => d.name === demonR) ?
        demonR : this.demonRs$()[this.demonL$().name]?.[0].name ||
          Object.values(this.demonRs$())[0][0].name
    ));
    setTimeout(() => this.initWithInnate());
  }

  initWithInnate(){
    const ingredIs: SkillPickModel[][] = [[], []];

    for (let i = 0; i < this.recipeInputModel$().ingredLs.length; i++) {
      for (let j = 0; j < 2; j++) {
        const skill = this.innateSkills$()[2 * i + j];
        ingredIs[j].push({
          disabled: skill.name !== '-' && this.recipeConfig$().restrictInherits,
          elem: '-',
          skill: skill.name,
          demon: skill.name !== '-' ? this.demonT$().name : '-'
        });
      }
    }

    this.recipeInputModel$.update(model => ({
      ...model,
      ingredLs: ingredIs[0],
      ingredRs: ingredIs[1]
    }));
  }

  demonT$ = computed(() => this.compendium$().getDemon(this.form.demonT().value()) ?? BLANK_DEMON);
  demonL$ = computed(() => this.compendium$().getDemon(this.form.demonL().value()) ?? BLANK_DEMON);
  demonR$ = computed(() => this.compendium$().getDemon(this.form.demonR().value()) ?? BLANK_DEMON);
  skillLookupMaker$ = computed(() => new SkillLookupMaker(
    this.compendium$(), this.recipeConfig$().inheritElems, this.recipeConfig$().skillElems, false
  ));

  skillTs$ = computed(() => this.skillLookupMaker$().getInheritSkills(this.demonT$(), this.demonT$()));
  skillLs$ = computed(() => this.skillLookupMaker$().getInheritSkills(this.demonT$(), this.demonL$()));
  skillRs$ = computed(() => this.skillLookupMaker$().getInheritSkills(this.demonT$(), this.demonR$()));
  innateSkills$ = computed(() => this.skillLookupMaker$().getInnateSkills(this.demonT$()));

  demonTs$ = computed(() => {
    const demonTs = this.compendium$().allDemons.filter(
      d => d.fusion !== 'party' && !d.isEnemy &&
      (d.fusion === 'normal' || d.fusion === 'special')
    );
    demonTs.sort((a, b) => a.name.localeCompare(b.name));
    return demonTs;
  });

  demonRs$ = computed(() => {
    const demonRs: DemonLookup = {};
    const combos = createLeftRightCombos(this.demonT$().name, this.compendium$(), this.squareChart$(), this.recipeConfig$());

    for (const [nameL, nameRs] of Object.entries(combos)) {
      demonRs[nameL] = nameRs.map(nameR => this.compendium$().getDemon(nameR));
      demonRs[nameL].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (Object.keys(demonRs).length === 0) { demonRs['-'] = [BLANK_DEMON]; }
    return demonRs;
  });

  demonLs$ = computed(() => {
    const demonLs = Object.keys(this.demonRs$()).map(nameL => this.compendium$().getDemon(nameL) || BLANK_DEMON);
    demonLs.sort((a, b) => this.demonRs$()[b.name].length - this.demonRs$()[a.name].length);
    return demonLs;
  });

  fullRecipe$ = computed(() => {
    const { demonT, demonL, demonR, ingredLs: inputLs, ingredRs: inputRs } = this.recipeInputModel$()
    const [ingredLs, ingredRs] = [inputLs, inputRs].map(inputIs => inputIs
      .filter(i => !i.disabled && i.demon !== '-' && i.demon !== demonT)
      .reduce<{ [skill: string]: string }>((acc, i) => { acc[i.skill] = i.demon; return acc; }, {})
    );

    const lrConfig = { result: demonT, targetL: demonL, targetR: demonR, ingredLs, ingredRs };
    return createLeftRightRecipe(lrConfig, this.compendium$(), this.squareChart$(), this.recipeConfig$());
  });

  fullRecipeSkillRef$ = computed(() => {
    const skillRef: { [demon: string]: string[] } = {};

    for (const [skill, demon] of Object.entries(this.fullRecipe$().skills)) {
      if (!skillRef[demon]) { skillRef[demon] = []; }
      const slvl = this.compendium$().getDemon(demon).skills[skill];
      skillRef[demon].push(`${skill} ${this.skillLevelPipe.transform(slvl, this.lang$())}`.trim());
    }

    return skillRef;
  });

  recipeLeft$ = computed(() => decodeRecipechain(this.fullRecipe$().chain1, this.fullRecipeSkillRef$()));
  recipeRight$ = computed(() => decodeRecipechain(this.fullRecipe$().chain2, this.fullRecipeSkillRef$()));

  resultSkills$ = computed(() => {
    const resultSkills = []

    for (const [skill, slvl] of Object.entries(this.compendium$().getDemon(this.fullRecipe$().result).skills)
      .filter(s => s[1] < 2000)
      .sort((a, b) => a[1] - b[1])
    ) {
      resultSkills.push(`${skill} ${this.skillLevelPipe.transform(slvl, this.lang$())}`.trim());
    }

    return resultSkills;
  });

  recipeResult$ = computed(() => {
    const recipeResult = [];

    for (const result of this.fullRecipe$().stepR) {
      recipeResult.push(this.fullRecipeSkillRef$()[result] ? `${result} [${this.fullRecipeSkillRef$()[result].join(', ')}]` : result);
    }

    return recipeResult;
  });

  fusionPrereq$ = computed(() => this.compendium$().getDemon(this.fullRecipe$().result).prereq || '');
}
