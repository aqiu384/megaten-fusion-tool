import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Demon, Skill } from '../models';
import { CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';

import { DemonStatsComponent } from '../../compendium/components/demon-stats.component';
import { DemonResistsComponent } from '../../compendium/components/demon-resists.component';
import { DemonSkillsComponent } from '../../compendium/components/demon-skills.component';
import { SmtFusionsComponent } from '../../compendium/components/smt-fusions.component';
import { DemonMissingComponent } from '../../compendium/components/demon-missing.component';
import { TranslateElementLabelPipe } from '../../compendium/pipes';

@Component({
  selector: 'app-demon-entry',
  imports: [
    RouterModule,
    DemonStatsComponent, DemonResistsComponent, DemonSkillsComponent,
    SmtFusionsComponent, DemonMissingComponent,
    TranslateElementLabelPipe
  ],
  template: `
    @if (demon) {
      <app-demon-stats
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [price]="demon.price"
        [statHeaders]="compConfig.baseStats"
        [stats]="demon.stats"
        [inherits]="demon.inherits"
        [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
      </app-demon-stats>
      <app-demon-resists
        [resistHeaders]="compConfig.resistElems"
        [resists]="demon.resists">
      </app-demon-resists>
      @if (demon.area) {
        <app-demon-resists
          [title]="demon.area + ' Encounter (Merciless)'"
          [resistHeaders]="compConfig.resistElems"
          [resists]="demon.eresists">
        </app-demon-resists>
      }
      @if (comboSkills.length) {
        <table class="entry-table">
          <thead>
            <tr><th colSpan="5" class="title">Combo Skills</th></tr>
            <tr><th>Elem</th><th>Name</th><th>Effect</th><th>Target</th><th>Input</th></tr>
          </thead>
          <tbody>
            @for (data of comboSkills; track $index) {
              <tr>
                <td><div [title]="data.skill.element | translateElementLabel:lang" class="element-icon {{ data.skill.element }}">{{ data.skill.element }}</div></td>
                <td>{{ data.skill.name }}</td>
                <td>{{ data.skill.effect }}</td>
                <td>{{ data.skill.target }}</td>
                <td>{{ data.combo }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
      <app-demon-skills
        [elemOrder]="compConfig.elemOrder"
        [hasTarget]="true"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      @if (demon.prereq) {
        <table class="entry-table">
          <tr><th class="title">Special Fusion Condition</th></tr>
          <tr><td>{{ demon.prereq }}</td></tr>
        </table>
      }
      @if (compendium.splitSpecialFusion(name); as rows) {
        @if (rows.length) {
          <table class="entry-table">
            <tr><th colspan=4 class="title">Special Fusion Ingredients for {{ name }}</th></tr>
            <tr><th>Price</th><th>Race</th><th>Lvl</th><th>Name</th></tr>
            @for (row of rows; track $index) {
              <tr>
                <td>{{ row.price }}</td>
                <td>{{ row.race1 }}</td>
                <td>{{ row.lvl1 }}</td>
                <td><a routerLink="../{{ row.name1 }}">{{ row.name1 }}</a></td>
              </tr>
            }
          </table>
        }
      }
      <app-smt-fusions>
      </app-smt-fusions>
    }
    @if (!demon) {
      <app-demon-missing [name]="name">
      </app-demon-missing>
    }
  `
})
export class DemonEntryComponent implements OnChanges {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;
  @Input() lang = 'en';
  comboSkills: { skill: Skill, combo: string }[];

  ngOnChanges() {
    if (!this.demon) {
      return;
    }

    const combos = [];
    const inputs = ['□□△△', '□□□△', '□□□□□△△'];

    for (let i = 0; i < this.demon.combos.length; i++) {
      const skill = this.compendium.getSkill(this.demon.combos[i]);

      if (skill.element !== 'pas') {
        combos.push({ skill, combo: inputs[i] });
      }
    }

    this.comboSkills = combos;
  }
}

@Component({
  selector: 'app-demon-entry-container',
  imports: [DemonEntryComponent],
  template: `
    <app-demon-entry
      [name]="name"
      [demon]="demon"
      [compConfig]="compConfig"
      [compendium]="compendium">
    </app-demon-entry>
  `
})
export class DemonEntryContainerComponent {
  protected subscriptions: Subscription[] = [];
  name: string;
  demon: Demon;
  compendium: Compendium;
  compConfig: CompendiumConfig;
  appName = 'Test App';

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private currentDemonService: CurrentDemonService,
    private fusionDataService: FusionDataService
  ) {
    this.appName = fusionDataService.appName;
    this.compConfig = fusionDataService.compConfig;
  }

  ngOnInit() {
    this.subscribeAll();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  subscribeAll() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(comp => {
        this.compendium = comp;
        this.getDemonEntry();
      }));

    this.subscriptions.push(
      this.currentDemonService.currentDemon.subscribe(name => {
        this.name = name;
        this.getDemonEntry();
      }));

    this.route.params.subscribe(params => {
      this.currentDemonService.nextCurrentDemon(params['demonName']);
    });
  }

  getDemonEntry() {
    if (this.compendium && this.name) {
      this.title.setTitle(`${this.name} - ${this.appName}`);
      this.demon = this.compendium.getDemon(this.name);
    }
  }
}
