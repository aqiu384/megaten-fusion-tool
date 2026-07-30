import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Demon, CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';

import { CommonModule } from '@angular/common';
import { DemonStatsComponent } from '../../compendium/components/demon-stats.component';
import { DemonResistsComponent } from '../../compendium/components/demon-resists.component';
import { DemonSkillsComponent } from '../../compendium/components/demon-skills.component';
import { SmtFusionsComponent } from '../../compendium/components/smt-fusions.component';
import { DemonMissingComponent } from '../../compendium/components/demon-missing.component';

@Component({
  selector: 'app-demon-entry',
  imports: [
    CommonModule,
    DemonStatsComponent, DemonResistsComponent, DemonSkillsComponent,
    SmtFusionsComponent, DemonMissingComponent
  ],
  template: `
    @if (demon) {
      <app-demon-stats
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [statHeaders]="compConfig.baseStats"
        [stats]="demon.stats"
        [inherits]="demon.inherits"
        [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
      </app-demon-stats>
      @if (compConfig.baseAtks.length) {
        <app-demon-stats
          [title]="'Attacks'"
          [statHeaders]="compConfig.baseAtks"
          [stats]="demon.atks">
        </app-demon-stats>
      }
      <app-demon-resists
        [resistHeaders]="compConfig.resistElems"
        [resists]="demon.resists">
      </app-demon-resists>
      <app-demon-skills
        [title]="'Innate Skills'"
        [hasTarget]="true"
        [hasLvl]="false"
        [elemOrder]="compConfig.elemOrder"
        [compendium]="compendium"
        [skillLevels]="demon.skills">
      </app-demon-skills>
      <app-smt-fusions
        [hasTripleFusion]="false">
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
  @Input() showPrice: boolean;
  @Input() compendium: Compendium;
  @Input() compConfig: CompendiumConfig;
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
