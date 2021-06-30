import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { CompendiumConfig, Demon, Skill } from '../models';
import { Compendium } from '../models/compendium';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-demon-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="demon">
      <app-demon-stats
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [price]="demon.price"
        [statHeaders]="compConfig.baseStats"
        [stats]="demon.stats">
      </app-demon-stats>
      <app-demon-resists
        [resistHeaders]="compConfig.resistElems"
        [resists]="demon.resists"
        [ailmentHeaders]="compConfig.ailmentElems"
        [ailments]="demon.ailments">
      </app-demon-resists>
      <app-demon-inherits *ngIf="demon.affinities"
        [hasLvls]="true"
        [inheritHeaders]="compConfig.affinityElems"
        [inherits]="demon.affinities">
      </app-demon-inherits>
      <table class="entry-table">
        <thead>
          <tr><th colSpan="7" class="title">Learned Skills</th></tr>
          <tr>
            <th>Elem</th>
            <th>Name</th>
            <th>Cost</th>
            <th>Effect</th>
            <th>Target</th>
            <th>Rank</th>
            <th>Level</th>
        </thead>
        <tbody>
          <tr *ngFor="let data of skillLvls">
            <td><div class="element-icon {{ data.skill.element }}">{{ data.skill.element }}</div></td>
            <td>{{ data.skill.name + (data.lvl ? ' +' + data.lvl : '') }}</td>
            <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost | skillCostToString }}</td>
            <td>{{ data.skill.effect + (data.upgrade ? ' (+' + data.upgrade + '%)' : '') }}</td>
            <td>{{ data.skill.target }}</td>
            <td [style.color]="data.skill.rank !== 99 ? null: 'transparent'">{{ data.skill.rank }}</td>
            <td>{{ data.skill.level | skillLevelToString }}</td>
          </tr>
          <tr *ngIf="!skillLvls.length">
            <td colSpan="7">No Learned Skills Found</td>
          <tr>
        </tbody>
      </table>
      <app-fusion-entry-table *ngIf="demon.evolvesFrom"
        [title]="'Evolves From'"
        [baseUrl]="'..'"
        [rowData]="[demon.evolvesFrom]">
      </app-fusion-entry-table>
      <app-fusion-entry-table *ngIf="demon.evolvesTo"
        [title]="'Evolves To'"
        [baseUrl]="'..'"
        [rowData]="[demon.evolvesTo]">
      </app-fusion-entry-table>
      <app-smt-fusions></app-smt-fusions>
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

  skillLvls: { skill: Skill; cost: number; lvl: number, upgrade: number; }[] = [];

  ngOnChanges() {
    if (!this.demon) {
      return;
    }

    this.skillLvls = [];

    for (const sname of Object.keys(this.demon.skills)) {
      const skill = this.compendium.getSkill(sname);
      let alvl = 0;
      let acost = skill.cost;
      let aupgrade = 0;

      if (this.demon.affinities) {
        const rawCost = skill.cost - 1000;
        const elemIndex = this.compConfig.affinityElems.indexOf(skill.element);
        alvl = elemIndex > -1 ? this.demon.affinities[elemIndex] : 0;
        
        if (alvl > 0) {
          aupgrade = this.compConfig.affinityBonuses.upgrades[elemIndex][alvl - 1];
          acost = skill.cost - Math.round(rawCost * this.compConfig.affinityBonuses.costs[elemIndex][alvl - 1] / 100);
        }
      }

      this.skillLvls.push({
        skill,
        cost: acost,
        lvl: alvl,
        upgrade: aupgrade
      });
    }

    for (const skill of this.skillLvls) {
      skill.skill.level = this.demon.skills[skill.skill.name];
    }

    this.skillLvls.sort((a, b) =>
      (a.skill.level - b.skill.level) * 20 +
      this.compConfig.elemOrder[a.skill.element] - this.compConfig.elemOrder[b.skill.element]
    );
  }
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

