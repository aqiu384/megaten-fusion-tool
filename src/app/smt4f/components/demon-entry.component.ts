import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { CompendiumConfig, Demon, Skill } from '../models';
import { Compendium } from '../models/compendium';
import { DemonStatsComponent } from '../../compendium/components/demon-stats.component';
import { DemonResistsComponent } from '../../compendium/components/demon-resists.component';
import { DemonInheritsComponent } from '../../compendium/components/demon-inherits.component';
import { DemonSkillsComponent } from '../../compendium/components/demon-skills.component';
import { FusionEntryTableComponent } from '../../compendium/components/fusion-entry-table.component';
import { SmtFusionsComponent } from '../../compendium/components/smt-fusions.component';
import { DemonMissingComponent } from '../../compendium/components/demon-missing.component';
import { SkillCostToStringPipe, SkillLevelToStringPipe, TranslateCompPipe, TranslateElementLabelPipe } from '../../compendium/pipes';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';
import Translations from '../../compendium/data/translations.json';

@Component({
  selector: 'app-demon-entry',
  imports: [
    CommonModule,
    DemonStatsComponent, DemonResistsComponent, DemonInheritsComponent,
    DemonSkillsComponent, FusionEntryTableComponent, SmtFusionsComponent, DemonMissingComponent,
    TranslateCompPipe, TranslateElementLabelPipe, SkillCostToStringPipe, SkillLevelToStringPipe
  ],
  template: `
    @if (demon) {
      <app-demon-stats
        [lang]="compConfig.lang"
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [price]="compConfig.appCssClasses.includes('ds1') ? 0 : demon.price"
        [statHeaders]="compConfig.baseStats"
        [stats]="demon.stats"
        [growths]="demon.growths"
        [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
      </app-demon-stats>
      <app-demon-resists
        [lang]="compConfig.lang"
        [resistHeaders]="compConfig.resistElems"
        [resists]="demon.resists"
        [ailmentHeaders]="compConfig.ailmentElems"
        [ailments]="demon.ailments">
      </app-demon-resists>
      @if (demon.affinities && demon.affinities.length) {
        <app-demon-inherits
          [lang]="compConfig.lang"
          [hasLvls]="true"
          [inheritHeaders]="compConfig.affinityElems"
          [inherits]="demon.affinities">
        </app-demon-inherits>
      }
      <table class="entry-table">
        <thead>
          <tr><th colSpan="7" class="title">{{ skillMsgs.LearnedSkills | translateComp:lang }}</th></tr>
          <tr>
            <th>{{ skillMsgs.Elem | translateComp:lang }}</th>
            <th>{{ skillMsgs.Name | translateComp:lang }}</th>
            <th>{{ skillMsgs.Cost | translateComp:lang }}</th>
            <th>{{ skillMsgs.Effect | translateComp:lang }}</th>
            <th>{{ skillMsgs.Target| translateComp:lang }}</th>
            @if (compConfig.hasSkillRanks) {
              <th>{{ skillMsgs.Rank | translateComp:lang }}</th>
            }
            <th>Lvl</th>
          </tr>
        </thead>
        <tbody>
          @for (data of skillLvls; track $index) {
            <tr [ngClass]="{ unique: data.skill.rank > 90 }">
              <td><div [title]="data.skill.element | translateElementLabel:lang" class="element-icon {{ data.skill.element }}">{{ data.skill.element }}</div></td>
              <td>{{ data.skill.name }} {{ data.lvl > 0 ? '+' + data.lvl : data.lvl || '' }}</td>
              <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost | skillCostToString }}</td>
              <td>{{ data.skill.effect }} {{ data.upgrade === 0 ? '' : '(' + (data.upgrade > 0 ? '+' : '') + data.upgrade + '%)' }}</td>
              <td>{{ data.skill.target || 'Self' }}</td>
              @if (compConfig.hasSkillRanks) {
                <td [style.color]="data.skill.rank !== 99 ? null: 'transparent'">{{ data.skill.rank }}</td>
              }
              <td>{{ data.skill.level | skillLevelToString }}</td>
            </tr>
          }
          @if (!skillLvls.length) {
            <tr>
              <td colSpan="7">{{ skillMsgs.NoLearnedSkills | translateComp:lang }}</td>
            <tr>
          }
        </tbody>
      </table>
      @if (compConfig.appCssClasses.includes('smtsj')) {
        <app-demon-skills
          [title]="'D-Source Skills'"
          [hasRank]="true"
          [hasTarget]="true"
          [hasLvl]="false"
          [elemOrder]="compConfig.elemOrder"
          [compendium]="compendium"
          [skillLevels]="demon.skillCards">
        </app-demon-skills>
      }
      @if (demon.evolvesFrom) {
        <app-fusion-entry-table
          [title]="statMsgs.EvolvesFrom | translateComp:lang"
          [lang]="compConfig.lang"
          [baseUrl]="'..'"
          [rowData]="[demon.evolvesFrom]"
          [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
        </app-fusion-entry-table>
      }
      @if (demon.evolvesTo) {
        <app-fusion-entry-table
          [title]="statMsgs.EvolvesTo | translateComp:lang"
          [lang]="compConfig.lang"
          [baseUrl]="'..'"
          [rowData]="[demon.evolvesTo]"
          [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
        </app-fusion-entry-table>
      }
      <app-smt-fusions [lang]="compConfig.lang" [excludedDlc]="demon.fusion === 'excluded'">
      </app-smt-fusions>
    }
    @if (!demon) {
      <app-demon-missing [name]="name">
      </app-demon-missing>
    }
  `
})
export class DemonEntryComponent {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compConfig: CompendiumConfig;
  @Input() compendium: Compendium;
  @Input() lang = 'en';
  statMsgs = Translations.DemonStatsComponent;
  skillMsgs = Translations.SkillListComponent;
  skillLvls: { skill: Skill; cost: number; lvl: number, upgrade: number; }[] = [];

  ngOnChanges() {
    if (!this.demon) {
      return;
    }

    this.skillLvls = [];

    for (const sname of Object.keys(this.demon.skills)) {
      const COST_MP = 3 << 10;
      const skill = this.compendium.getSkill(sname);
      const elemIndex = this.compConfig.affinityElems.indexOf(skill.element);
      const bonuses = this.compConfig.affinityBonuses;
      const lvl = (this.demon.affinities || [])[elemIndex];

      if (lvl && bonuses.costs[elemIndex] && (skill.cost & 0xFC00) <= COST_MP) {
        this.skillLvls.push({
          skill,
          cost: (skill.cost & 0xFC00) + Math.floor((100 - bonuses.costs[elemIndex][lvl + 10]) / 100 * (skill.cost & 0x3FF)),
          lvl,
          upgrade: bonuses.upgrades[elemIndex][lvl + 10],
        })
      } else {
        this.skillLvls.push({ skill, cost: skill.cost, lvl: 0, upgrade: 0 });
      }
    }

    for (const skill of this.skillLvls) {
      skill.skill.level = this.demon.skills[skill.skill.name];
    }

    this.skillLvls.sort((a, b) =>
      (a.skill.level - b.skill.level) * 200 +
      this.compConfig.elemOrder[a.skill.element] - this.compConfig.elemOrder[b.skill.element]
    );
  }
}

@Component({
  selector: 'app-demon-entry-container',
  imports: [DemonEntryComponent],
  template: `
    <app-demon-entry
      [lang]="compConfig.lang"
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
  appName: string;

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
