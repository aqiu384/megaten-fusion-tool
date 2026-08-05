import { Component, ViewEncapsulation, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Title } from '@angular/platform-browser';

import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';
import { encodeDemon } from '../models/password-generator';
import { TranslateCompPipe } from '../../compendium/pipes';
import { DecodedDemon, CompendiumConfig } from '../models';
import { QrcodeComponent } from './qrcode-component';
import Translations from '../../compendium/data/translations.json';

import {
  makeSkillPickList, SkillLookupMaker, RecipeSkillPickerComponent
} from '../../compendium/components/recipe-skill-picker.component';

@Component({
  selector: 'app-password-generator',
  imports: [FormField, RecipeSkillPickerComponent, QrcodeComponent, TranslateCompPipe],
  template: `
    @let lang = compConfig$().lang;
    <form>
      <h2>QR Code Generator</h2>
      <table class="entry-table">
        <tr><th colspan="2" class="title">QR Code</th></tr>
        <tr>
          <td><app-qrcode [byteArray]="decodedBytes$()"></app-qrcode></td>
        </tr>
      </table>
      <table class="entry-table">
        <tr>
          <th colspan="6" class="title">{{ demonMsgs.Demon | translateComp:lang }}</th>
        <tr>
        <tr>
          <th style="width: 5em;">Price</th>
          <th style="width: 5em;">{{ demonMsgs.Race | translateComp:lang }}</th>
          <th style="width: 2.5em;">Lvl</th>
          <th>{{ demonMsgs.Demon | translateComp: lang }}</th>
          <th>HP</th>
          <th>MP</th>
        </tr>
        <tr>
          <td>{{ currPrice$() }}</td>
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
          <td>
            <select [formField]="form.hp">
              @for (_ of count299; track $index) {
                <option [value]="$index + 1">{{ $index + 1 }}</option>
              }
            </select>
          </td>
          <td>
            <select [formField]="form.mp">
              @for (_ of count99; track $index) {
                <option [value]="$index + 1">{{ $index + 1 }}</option>
              }
            </select>
          </td>
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
  count299 = Array(299);
  count99 = Array(99);

  formModel$ = linkedSignal(() => ({
    demon: '-',
    lvl: '1',
    hp: '1',
    mp: '1',
    skills: makeSkillPickList(6)
  }));

  decodedDemon$ = computed<DecodedDemon>(() => {
    const form = this.formModel$();
    return {
      isEnglish: this.compConfig$().lang === 'en',
      demonCode: this.demon$().code,
      lvl: parseInt(form.lvl),
      exp: -1,
      hp: parseInt(form.hp),
      mp: parseInt(form.mp),
      skillCodes: form.skills.map(s => this.compendium$().getSkill(s.skill)?.code ?? 0),
    }
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
    this.formModel$.update(() => ({
      demon: demon.name,
      lvl: Math.floor(demon.lvl).toString(),
      hp: Math.floor(demon.stats[0]).toString(),
      mp: Math.floor(demon.stats[1]).toString(),
      skills: innates.slice(0, 6).map(s => ({
        disabled: false,
        elem: '-',
        skill: s.name,
        demon: demon.name
      }))
    }));
  }

  demons$ = computed(() => {
    const demons = this.compendium$().allDemons.filter(d => d.code > 0);
    demons.sort((a, b) => a.name.localeCompare(b.name));
    return demons;
  });

  skillLookupMaker$ = computed(() => new SkillLookupMaker(this.compendium$(), [], this.compConfig$().skillElems, true));
  demon$ = computed(() => this.compendium$().getDemon(this.form.demon().value()));
  skillIs$ = computed(() => this.skillLookupMaker$().getInheritSkills(this.demon$(), this.demon$()));
  currPrice$ = computed(() => this.compConfig$().computePrice(this.demon$(), this.decodedDemon$()));
  decodedBytes$ = computed(() => encodeDemon(this.decodedDemon$(), this.compConfig$().appCssClasses.includes('pq2')));
}

@Component({
  imports: [PasswordGeneratorComponent],
  template: `
    <app-password-generator
      [compendium]="fusionDataService.compendium$()"
      [compConfig]="fusionDataService.compConfig">
    </app-password-generator>
  `
})
export class PasswordGeneratorContainerComponent {
  title = inject(Title);
  fusionDataService = inject(FusionDataService);

  constructor() {
    this.title.setTitle(`QR Code Generator - ${this.fusionDataService.appName}`);
  }
}
