import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmtDemonListComponent } from '../../compendium/components/smt-demon-list.component';
import { DemonListContainerComponent as DLCC } from '../../compendium/containers/demon-list.component';
import { FusionDataService } from '../fusion-data.service';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

@Component({
  imports: [SmtDemonListComponent],
  template: `
    <app-smt-demon-list
      [lang]="compConfig.lang"
      [isPersona]="!showEnemies"
      [isEnemy]="showEnemies"
      [hasCurrLvl]="!showEnemies && compConfig.hasTripleFusion"
      [raceOrder]="raceOrder"
      [statHeaders]="statHeaders"
      [resistHeaders]="resistHeaders"
      [inheritOrder]="inheritOrder"
      [rowData]="demons$()">
    </app-smt-demon-list>
  `
})
export class DemonListContainerComponent extends DLCC {
  route = inject(ActivatedRoute);
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  raceOrder = this.compConfig.raceOrder;
  showAllies = !this.route.snapshot.data.showShadows;
  showEnemies = !this.showAllies;

  statHeaders = !this.showEnemies ? this.compConfig.baseStats : this.compConfig.enemyStats;
  resistHeaders = this.showEnemies || this.compConfig.hasDemonResists ? this.compConfig.resistElems : [];
  inheritOrder = !this.showEnemies && this.compConfig.inheritElems.length > 0 ? this.compConfig.elemOrder : null;
  appName = translateComp(!this.showEnemies ?
    Translations.DemonListComponent.AppPersonas : Translations.DemonListComponent.AppShadows,
    this.compConfig.lang) + this.fusionDataService.appName;
}
