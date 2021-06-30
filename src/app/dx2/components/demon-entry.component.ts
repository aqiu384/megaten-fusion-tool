import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { BaseStats, ResistanceElements } from '../constants';
import { Demon, Skill } from '../models';
import { Compendium } from '../models/compendium';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-demon-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="demon">
      <h2>Grade {{ demon.lvl }} {{ demon.race }} {{ demon.name }}</h2>
      <table class="entry-table">
        <thead>
          <tr>
            <th [attr.colSpan]="statHeaders.length + 1" class="title">Stats</th>
          </tr>
          <tr>
            <th *ngFor="let stat of statHeaders">{{ stat }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td *ngFor="let stat of demon.stats">{{ stat }}</td>
            <td *ngFor="let stat of demonAtks">{{ stat }}</td>
            <td>{{ aiTypes[demon.ai] }}</td>
          </tr>
        </tbody>
      </table>
      <app-demon-resists
        [resistHeaders]="resistanceHeaders"
        [resists]="demon.resists">
      </app-demon-resists>
      <table *ngIf="demonPanels.length" class="entry-table">
        <thead>
          <tr><th colspan="3" class="title">Panels</th></tr>
          <tr><th>Level</th><th>Step</th><th>Bonus</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let panel of demonPanels">
            <td>{{ panel.level }}</td>
            <td>{{ panel.step }}</td>
            <td>{{ panel.bonus }}</td>
          </tr>
        </tbody>
      </table>
      <table class="entry-table">
        <thead>
          <tr><th colSpan="7" class="title">Available Skills</th></tr>
          <tr><th>Available</th><th>Elem</th><th>Name</th><th>Costs</th><th>Rank</th><th>Effect</th><th>Upgrades</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of skillLvls">
            <td [ngClass]="['lvl' + data.source]">{{ lvlCodes[data.source] }}</td>
            <td><div class="element-icon {{ data.skill.element }}">{{ data.skill.element }}</div></td>
            <td>{{ data.skill.name }}</td>
            <td [style.color]="data.cost ? null: 'transparent'">{{ data.cost | skillCostToString }}</td>
            <td [style.color]="data.skill.rank !== 99 ? null: 'transparent'">{{ data.skill.rank }}</td>
            <td>{{ data.skill.effect }}</td>
            <td>
              <ul>
                <li *ngFor="let u of data.upgrades">{{ u }}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <app-smt-fusions>
      </app-smt-fusions>
    </ng-container>
    <app-demon-missing *ngIf="!demon" [name]="name">
    </app-demon-missing>
  `,
  styles: [`ul { padding: 0; list-style: none; }`]
})
export class DemonEntryComponent implements OnChanges {
  @Input() name: string;
  @Input() demon: Demon;
  @Input() compendium: Compendium;

  skillLvls: { skill: Skill; cost: number; source: number; upgrades: string[]; }[] = [];
  demonPanels: { level: number, step: string; bonus: string }[] = [];
  demonAtks = [0, 0, 0, 0];

  aiTypes = { atk: 'Attack', sup: 'Support', rec: 'Recovery' };
  statHeaders = BaseStats.concat(['Patk', 'Matk', 'Pdef', 'Mdef', 'AI']);
  resistanceHeaders = ResistanceElements;
  lvlCodes = {
    3367: 'Arch Com', 3365: 'Arch Ara', 3380: 'Arch Pro', 3389: 'Arch Psy', 3369: 'Arch Ele',
    0: 'Innate', 3965: 'Gach Ara', 3980: 'Gach Pro', 3989: 'Gach Psy', 3969: 'Gach Ele'
  }

  ngOnChanges() {
    if (!this.demon) {
      return;
    }

    const rawPanels = this.compendium.getDemonPanels(this.demon.name);
    const stats = this.demon.stats;
    this.demonPanels = [];
    this.skillLvls = [];
    this.demonAtks = [
      // Math.floor(stats[4] * 4.7 + 50 * 7.4),
      Math.floor(stats[2] * 2.1 + 50 * 5.6 + 50),
      Math.floor(stats[3] * 2.1 + 50 * 5.6 + 50),
      Math.floor(stats[4] * 1.1 + stats[2] * 0.5 + 50 * 5.6 + 50),
      Math.floor(stats[4] * 1.1 + stats[3] * 0.5 + 50 * 5.6 + 50)
    ];

    for (let i = 0; i < rawPanels.length; i+= 2) {
      this.demonPanels.push({ level: i / 2 + 1, step: rawPanels[i], bonus: rawPanels[i + 1] });
    }

    for (const slvl of this.demon.baseSkills) {
      const skill = this.compendium.getSkill(slvl.skill);
      this.skillLvls.push({
        skill,
        cost: skill.cost > 0 && 3300 < slvl.source && slvl.source < 3900 ? skill.cost - 1 : skill.cost,
        source: slvl.source,
        upgrades: this.compendium.getSkillUpgrade(slvl.skill).map((u, i) => `Lvl ${i + 2}: ${u}`)
      });
    }
  }
}

@Component({
  selector: 'app-demon-entry-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-entry
      [name]="name"
      [demon]="demon"
      [compendium]="compendium">
    </app-demon-entry>
  `
})
export class DemonEntryContainerComponent {
  protected subscriptions: Subscription[] = [];
  name: string;
  demon: Demon;
  compendium: Compendium;
  appName = 'Test App';

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private currentDemonService: CurrentDemonService,
    private fusionDataService: FusionDataService
  ) {
    this.appName = fusionDataService.appName;
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
