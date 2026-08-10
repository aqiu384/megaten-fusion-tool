import { Component, computed, effect, inject, input, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Demon, CompendiumConfig } from '../models';
import { Compendium } from '../models/compendium';
import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionDataService } from '../fusion-data.service';
import { DemonStatsComponent } from '../../compendium/components/demon-stats.component';
import { DemonResistsComponent } from '../../compendium/components/demon-resists.component';
import { DemonSkillsComponent } from '../../compendium/components/demon-skills.component';
import { SmtFusionsComponent } from '../../compendium/components/smt-fusions.component';
import { DemonMissingComponent } from '../../compendium/components/demon-missing.component';

@Component({
    selector: 'app-demon-entry',
    imports: [
      DemonStatsComponent, DemonResistsComponent, DemonSkillsComponent,
      SmtFusionsComponent, DemonMissingComponent
    ],
      template: `
    @if (demon) {
      <app-demon-stats
        [title]="'Lvl ' + demon.lvl + ' ' + demon.race + ' ' + demon.name"
        [statHeaders]="compConfig.baseStats"
        [fusionHeaders]="['Drop']"
        [stats]="demon.stats"
        [price]="showPrice ? demon.price : 0"
        [inherits]="demon.inherits"
        [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
        <td>{{ demon.drop }}</td>
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
        [hasTripleFusion]="!compConfig.appCssClasses.includes('mjn1')">
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
  imports: [DemonEntryComponent],
  template: `
    <app-demon-entry
      [name]="demonName$()"
      [demon]="demon$()"
      [showPrice]="showPrice"
      [compConfig]="compConfig"
      [compendium]="compendium$()">
    </app-demon-entry>
  `
})
export class DemonEntryContainerComponent {
  title = inject(Title);
  fusionDataService = inject(FusionDataService);
  currentDemonService = inject(CurrentDemonService);
  compConfig = this.fusionDataService.compConfig;
  showPrice = this.compConfig.appCssClasses.includes('dsum') ||
    this.compConfig.appCssClasses.includes('dssh');

  demonName$ = input.required<string>({ alias: 'demonName' });
  compendium$ = this.fusionDataService.compendium$;
  demon$ = computed(() => this.compendium$().getDemon(this.demonName$()) || null);

  constructor() {
    effect(() => this.title.setTitle(`${this.demonName$()} - ${this.fusionDataService.appName}`));
    effect(() => this.currentDemonService.nextCurrentDemon(this.demonName$()));
  }
}
