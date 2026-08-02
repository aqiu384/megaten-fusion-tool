import { Component, computed, effect, inject, input, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
  imports: [DemonEntryComponent, EnemyEntryComponent],
  template: `
    @let name = demonName$();
    @let compendium = compendium$();
    @let demon = demon$();
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
  title = inject(Title);
  fusionDataService = inject(FusionDataService);
  currentDemonService = inject(CurrentDemonService);
  compConfig = this.fusionDataService.compConfig;

  demonName$ = input.required<string>({ alias: 'demonName' });
  compendium$ = this.fusionDataService.compendium$;
  demon$ = computed(() => this.compendium$().getDemon(this.demonName$()) || null);

  constructor() {
    effect(() => this.title.setTitle(`${this.demonName$()} - ${this.fusionDataService.appName}`));
    effect(() => this.currentDemonService.nextCurrentDemon(this.demonName$()));
  }
}
