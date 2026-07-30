import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { DemonStatsComponent } from '../../compendium/components/demon-stats.component';
import { DemonResistsComponent } from '../../compendium/components/demon-resists.component';
import { DemonInheritsComponent } from '../../compendium/components/demon-inherits.component';
import { DemonSkillsComponent } from '../../compendium/components/demon-skills.component';
import { SmtFusionsComponent } from '../../compendium/components/smt-fusions.component';
import { DemonMissingComponent } from '../../compendium/components/demon-missing.component';
import { CurrentDemonService } from '../../compendium/current-demon.service';

import { Demon, CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';
import { EnemyEntryComponent } from './enemy-entry.component';

@Component({
  selector: 'app-demon-entry',
  imports: [
    DemonStatsComponent, DemonResistsComponent, DemonInheritsComponent,
    DemonSkillsComponent, SmtFusionsComponent, DemonMissingComponent
  ],
  template: `
    @if (demon) {
      <app-demon-stats
        [lang]="lang"
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [price]="demon.price"
        [statHeaders]="compConfig.baseStats"
        [stats]="demon.stats"
        [growths]="demon.growths"
        [inherits]="compConfig.inheritElems.length ? demon.inherits : 0"
        [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
      </app-demon-stats>
      @if (compConfig.hasDemonResists) {
        <app-demon-resists
          [lang]="lang"
          [resistHeaders]="compConfig.resistElems"
          [resists]="demon.resists">
        </app-demon-resists>
      }
      @if (compConfig.inheritElems.length) {
        <app-demon-inherits
          [hasChance]="!compConfig.hasManualInheritance"
          [inheritHeaders]="compConfig.inheritElems"
          [inherits]="demon.affinities">
        </app-demon-inherits>
      }
      <app-demon-skills
        [lang]="lang"
        [hasRank]="compConfig.hasSkillRanks"
        [hasTarget]="true"
        [elemOrder]="compConfig.elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <app-smt-fusions
        [lang]="lang"
        [hasTripleFusion]="compConfig.hasTripleFusion"
        [excludedDlc]="demon.fusion === 'excluded'">
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
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;
  @Input() lang = 'en';
}

@Component({
  selector: 'app-demon-entry-container',
  imports: [DemonEntryComponent, EnemyEntryComponent],
  template: `
    @if (!demon || !demon.isEnemy) {
      <app-demon-entry
        [lang]="compConfig.lang"
        [name]="name"
        [demon]="demon"
        [compConfig]="compConfig"
        [compendium]="compendium">
      </app-demon-entry>
    }
    @if (demon && demon.isEnemy) {
      <app-enemy-entry
        [lang]="compConfig.lang"
        [name]="name"
        [demon]="demon"
        [compConfig]="compConfig"
        [compendium]="compendium">
      </app-enemy-entry>
    }
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
