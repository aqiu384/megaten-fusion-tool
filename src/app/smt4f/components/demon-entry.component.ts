import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { CompendiumConfig, Demon, Skill } from '../models';
import { Compendium } from '../models/compendium';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';
import Translations from '../../compendium/data/translations.json';

@Component({
  selector: 'app-demon-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="demon">
      <app-demon-stats
        [lang]="compConfig.lang"
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [price]="demon.price"
        [statHeaders]="compConfig.baseStats"
        [stats]="demon.stats">
      </app-demon-stats>
      <app-demon-resists
        [lang]="compConfig.lang"
        [resistHeaders]="compConfig.resistElems"
        [resists]="demon.resists"
        [ailmentHeaders]="compConfig.ailmentElems"
        [ailments]="demon.ailments">
      </app-demon-resists>
      <app-demon-inherits *ngIf="demon.affinities"
        [lang]="compConfig.lang"
        [hasLvls]="true"
        [inheritHeaders]="compConfig.affinityElems"
        [inherits]="demon.affinities">
      </app-demon-inherits>
      <table class="entry-table">
        <thead>
          <tr><th colSpan="7" class="title">{{ skillMsgs.LearnedSkills | translateComp:lang }}</th></tr>
          <tr>
            <th>{{ skillMsgs.Elem | translateComp:lang }}</th>
            <th>{{ skillMsgs.Name | translateComp:lang }}</th>
            <th>{{ skillMsgs.Cost | translateComp:lang }}</th>
            <th>{{ skillMsgs.Effect | translateComp:lang }}</th>
            <th>{{ skillMsgs.Target| translateComp:lang }}</th>
            <th>{{ skillMsgs.Rank | translateComp:lang }}</th>
            <th>Lvl</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of skillLvls" [ngClass]="{ unique: data.skill.rank > 90 }">
            <td><div class="element-icon {{ data.skill.element }}">{{ data.skill.element }}</div></td>
            <td>{{ data.skill.name }} {{ data.lvl > 0 ? '+' + data.lvl : data.lvl || '' }}</td>
            <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost | skillCostToString }}</td>
            <td>{{ data.skill.effect }} {{ data.upgrade === 0 ? '' : '(' + (data.upgrade > 0 ? '+' : '') + data.upgrade + '%)' }}</td>
            <td>{{ data.skill.target || 'Self' }}</td>
            <td [style.color]="data.skill.rank !== 99 ? null: 'transparent'">{{ data.skill.rank }}</td>
            <td>{{ data.skill.level | skillLevelToString }}</td>
          </tr>
          <tr *ngIf="!skillLvls.length">
            <td colSpan="7">{{ skillMsgs.NoLearnedSkills | translateComp:lang }}</td>
          <tr>
        </tbody>
      </table>
      <app-fusion-entry-table *ngIf="demon.evolvesFrom"
        [title]="statMsgs.EvolvesFrom | translateComp:lang"
        [lang]="compConfig.lang"
        [baseUrl]="'..'"
        [rowData]="[demon.evolvesFrom]">
      </app-fusion-entry-table>
      <app-fusion-entry-table *ngIf="demon.evolvesTo"
        [title]="statMsgs.EvolvesTo | translateComp:lang"
        [lang]="compConfig.lang"
        [baseUrl]="'..'"
        [rowData]="[demon.evolvesTo]">
      </app-fusion-entry-table>
      <app-smt-fusions [lang]="compConfig.lang" [excludedDlc]="demon.fusion === 'excluded'">
      </app-smt-fusions>
    </ng-container>
    <app-demon-missing *ngIf="!demon" [name]="name">
    </app-demon-missing>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
