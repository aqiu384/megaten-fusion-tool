import { Component, inject, effect, linkedSignal, input, computed, ViewEncapsulation } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Title } from '@angular/platform-browser';
import { Demon, Skill, DecodedDemon, CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';
import { decodeDemon, encodeDemon } from '../models/password-generator';
import { DemonPasswordComponent } from './demon-password-component';
import { TranslateCompPipe } from '../../compendium/pipes';
import Translations from '../../compendium/data/translations.json';
import {
  makeSkillPickList, SkillLookupMaker, RecipeSkillPickerComponent
} from '../../compendium/components/recipe-skill-picker.component';

const UNKNOWN_DEMON: Demon = {
  name: '???', race: '-', align: '', code: 0,
  lvl: 1, currLvl: 1, skills: {}, skillCards: {},
  price: 0, stats: [1, 1, 1, 1, 1, 1, 1], growths:[1, 1], resists: [], ailments: [],
  inherits: 0, affinities: [], fusion: 'normal', prereq: '', searchTags: '-'
};
const BLANK_SKILL: Skill = {
  name: '-', code: 0, element: '-', rank: 0,
  effect: '-', target: '-', cost: 0, learnedBy: [], transfer: [], level: 0
};

const SKILL_RANK_COSTS = [
  0, 112, 155, 222, 347, 564, 952, 1666, 3020, 5663,
  10972, 21943, 43886, 87772, 175543
]

const PASSWORD_ENCODINGS = [
  "$234567890ABCDEFGH%JKLMNOPQRSTUVWXYZabcdefghijk#mnopqrstuvwxyz-+",
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz?&",
  "しんいくみBやるYけひKFとHむAちにZきWよLをのたれNえSふわJそりすCめPへQGRDこMTまつせかはEUてさなあもゆおうろ",
  "しんいくみＢやるＹけひＫＦとＨむＡちにＺきＷよＬをのたれＮえＳふわＪそりすＣめＰへＱＧＲＤこＭＴまつせかはＥＵてさなあもゆおうろ"
];

@Component({
  selector: 'app-password-generator',
  imports: [FormField, RecipeSkillPickerComponent, DemonPasswordComponent, TranslateCompPipe],
  template: `
    @let lang = compConfig$().lang;
    @let stats = compConfig$().baseStats;
    <form>
      <app-demon-password
        [encoding]="encoding$()"
        [inverseEncoding]="inverseEncoding$()"
        [encodeBytes]="encodedDemon$()"
        (decodedBytes)="initWithDecodedDemon(decodeDemon($event))">
      </app-demon-password>
      <table class="entry-table">
        <tr>
          <th [attr.colspan]="5 + stats.length" class="title">{{ demonMsgs.Demon | translateComp:lang }}</th>
        <tr>
        <tr>
          <th style="width: 5em;">Price</th>
          <th>Mask Byte</th>
          <th style="width: 5em;">{{ demonMsgs.Race | translateComp:lang }}</th>
          <th style="width: 2.5em;">Lvl</th>
          <th>{{ demonMsgs.Demon | translateComp:lang }}</th>
          @for (stat of stats; track $index) {
            <th style="width: 2.5em;">{{ stat }}</th>
          }
        </tr>
        <tr>
          <td>{{ currPrice$() }}</td>
          <td>
            <select [formField]="form.maskByte">
              @for (_ of count256; track $index) {
                <option [value]="$index">{{ $index }}</option>
              }
            </select>
          </td>
          <td>{{ demon$().race }}</td>
          <td>
            <select [formField]="form.lvl">
              @for (_ of count99; track $index) {
                <option [value]="$index + 1">{{ $index + 1 }}</option>
              }
            </select>
          </td>
          <td>
            <select [formField]="form.demon" (change)="initWithInnate()">
              @for (demon of demons$(); track demon.name) {
                <option [value]="demon.name">{{ demon.name }}</option>
              }
            </select>
          </td>
          <td>{{ currHP$() }}</td>
          <td>{{ currMP$() }}</td>
          @for (stat of form.stats; track $index){
            <td>
              <select [formField]="stat">
                @for (_ of count99; track $index) {
                  <option [value]="$index + 1">{{ $index + 1 }}</option>
                }
              </select>
            </td>
          }
        <tr>
      </table>
      <table class="entry-table">
        <tr>
          <th colspan="5" class="title">Skills</th>
        </tr>
        <tr>
          <th style="width: 5em;">{{ skillMsgs.Elem | translateComp:lang}}</th>
          <th style="width: 7.5em;">{{ skillMsgs.Skill | translateComp:lang }}</th>
          <th style="width: 5em;">{{ skillMsgs.Cost | translateComp:lang }}</th>
          <th style="width: 30em;">{{ skillMsgs.Effect | translateComp:lang }}</th>
          <th style="width: 5em;">{{ skillMsgs.Target | translateComp:lang }}</th>
        </tr>
        @for (skillPicker of form.skills; track $index) {
          <tr>
            <app-recipe-skill-picker
              [skillPickForm]="skillPicker"
              [skillLookupMaker]="skillLookupMaker$()"
              [skillIs]="skillIs$()"
              [showDemonPicker]="false">
            </app-recipe-skill-picker>
          </tr>
        }
      </table>
    </form>
  `,
  styles: [`
    td select { width: 100%; }
  `],
  encapsulation: ViewEncapsulation.None
})
export class PasswordGeneratorComponent {
  compendium$ = input.required<Compendium>({ alias: 'compendium' });
  compConfig$ = input.required<CompendiumConfig>({ alias: 'compConfig' });
  demonMsgs = Translations.DemonListComponent;
  skillMsgs = Translations.SkillListComponent;
  count256 = Array(256);
  count99 = Array(99);
  decodeDemon = decodeDemon;

  formModel$ = linkedSignal(() => ({
    maskByte: '0',
    demon: '-',
    lvl: '1',
    stats: Array<string>(5).fill('1'),
    skills: makeSkillPickList(6),
  }));

  decodedDemon$ = computed<DecodedDemon>(() => {
    const form = this.formModel$();
    const comp = this.compendium$();
    return {
      demonCode: comp.getDemon(form.demon)?.code ?? 0,
      lvl: parseInt(form.lvl),
      exp: 0,
      stats: form.stats.map(s => parseInt(s)),
      baseStats: form.stats.map(s => parseInt(s)),
      skillCodes: form.skills.map(s => comp.getSkill(s.skill)?.code ?? 0),
      maskByte: parseInt(form.maskByte)
    };
  });

  form = form(this.formModel$);

  constructor() {
    effect(() => this.form.demon().value.update(demon =>
      this.demons$().find(d => d.name === demon) ? demon : this.demons$()[0].name
    ));
    setTimeout(() => this.initWithInnate());
  }

  initWithInnate(){
    const demon = this.demon$();
    const innates = this.skillLookupMaker$().getInnateSkills(demon);
    this.initWithDecodedDemon({
      demonCode: demon.code,
      lvl: Math.floor(demon.lvl),
      exp: 0,
      stats: demon.stats.slice(2),
      baseStats: demon.stats.slice(2),
      skillCodes: innates.slice(0, 6).map(s => this.compendium$().getSkill(s.name)?.code ?? 0),
      maskByte: 0
    });
  }

  initWithDecodedDemon(decoded: DecodedDemon) {
    const demon = this.demonCodes$()[decoded.demonCode];
    const innates = this.skillLookupMaker$().getInnateSkills(demon).map(s => s.name);
    const skills = decoded.skillCodes.map(c => this.skillCodes$()[c]);
    this.formModel$.update(() => ({
      maskByte: decoded.maskByte.toString(),
      demon: demon.name,
      lvl: decoded.lvl.toString(),
      stats: decoded.stats.map(s => s.toString()),
      skills: skills.map(s => ({
        disabled: false,
        elem: innates.includes(s.name) ? '-' : s.element,
        skill: s.name,
        demon: innates.includes(s.name) ? demon.name : '-'
      }))
    }));
  }

  demons$ = computed(() => {
    const demons = this.compendium$().allDemons.filter(d => d.code > 0);
    demons.sort((a, b) => a.name.localeCompare(b.name));
    return demons.concat([UNKNOWN_DEMON]);
  });

  skillLookupMaker$ = computed(() => new SkillLookupMaker(this.compendium$(), [], this.compConfig$().skillElems, false));
  demon$ = computed(() => this.compendium$().getDemon(this.form.demon().value()) ?? UNKNOWN_DEMON);
  skillIs$ = computed(() => this.skillLookupMaker$().getInheritSkills(this.demon$(), this.demon$()));
  encodedDemon$ = computed(() => encodeDemon(this.decodedDemon$()));

  encoding$ = computed(() => PASSWORD_ENCODINGS[
    this.compConfig$().lang !== 'en' ? 3 :
    this.compConfig$().appCssClasses.includes('smtdsj') ? 1 : 0
  ]);
  inverseEncoding$ = computed(() => {
    const inverseEncoding: { [letter: string]: number; } = {};
    for (const encode of PASSWORD_ENCODINGS.concat(this.encoding$())) {
      encode.split('').reduce((acc, c, i) => { acc[c] = i; return acc; }, inverseEncoding);
    }
    return inverseEncoding;
  });
  demonCodes$ = computed(() => {
    const codes = Array<Demon>(512).fill(UNKNOWN_DEMON);
    this.demons$().reduce((acc, d) => { acc[d.code] = d; return acc; }, codes);
    return codes;
  });
  skillCodes$ = computed(() => {
    const codes = Array<Skill>(512).fill(BLANK_SKILL);
    this.compendium$().allSkills.filter(s => s.code > 0).reduce((acc, s) => { acc[s.code] = s; return acc; }, codes);
    return codes;
  });
  currHP$ = computed(() =>
    6 * this.decodedDemon$().lvl +
    Math.floor(3 * this.demon$().growths[1] * this.decodedDemon$().stats[2]) +
    (this.demon$().name === 'Knocker' ? 30 : 25)
  );
  currMP$ = computed(() =>
    3 * this.decodedDemon$().lvl +
    Math.floor(2 * this.demon$().growths[1] * this.decodedDemon$().stats[1]) +
    (this.demon$().name === 'Knocker' ? 14 : 13)
  );
  currPrice$ = computed(() => {
    const demon = this.demon$();
    const skills = this.decodedDemon$().skillCodes.map(c => this.skillCodes$()[c])
      .filter(s => demon.skills.hasOwnProperty(s.name) && 0 < s.rank && s.rank < 15);
    const maxRank = Math.max(...skills.map(s => s.rank), 0);
    const statsPrice = demon.growths[0] * Math.pow(this.decodedDemon$().stats.reduce((acc, s) => acc + s, 0), 3);
    const overflowPrice = statsPrice % Math.pow(2, 32);
    return Math.floor(0.75 * (Math.floor(overflowPrice / 1000) + SKILL_RANK_COSTS[maxRank] + 1300));
  });
}

@Component({
  imports: [PasswordGeneratorComponent],
  template: `
    <app-password-generator
      [compendium]="compendium$()"
      [compConfig]="compConfig">
    </app-password-generator>
  `
})
export class PasswordGeneratorContainerComponent {
  title = inject(Title);
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  compendium$ = this.fusionDataService.compendium$;

  constructor() {
    this.title.setTitle(`Password Generator - ${this.fusionDataService.appName}`);
  }
}
