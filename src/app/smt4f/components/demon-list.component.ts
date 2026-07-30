import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { SmtDemonListComponent } from '../../compendium/components/smt-demon-list.component';
import { DemonListContainerComponent as DLCC } from '../../compendium/containers/demon-list.component';
import { FusionDataService } from '../fusion-data.service';
import { CompendiumConfig } from '../models';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

@Component({
  selector: 'app-demon-list-container',
  imports: [CommonModule, SmtDemonListComponent],
  template: `
    <app-smt-demon-list
      [lang]="compConfig.lang"
      [raceOrder]="compConfig.raceOrder"
      [statHeaders]="compConfig.baseStats"
      [resistHeaders]="compConfig.resistElems"
      [affinityHeaders]="compConfig.hasNonelemInheritance ? null : compConfig.affinityElems"
      [rowData]="demons | async">
    </app-smt-demon-list>
  `
})
export class DemonListContainerComponent extends DLCC {
  compConfig: CompendiumConfig;

  constructor(
    title: Title,
    changeDetectorRef: ChangeDetectorRef,
    fusionDataService: FusionDataService
  ) {
    super(title, changeDetectorRef, fusionDataService);

    this.compConfig = fusionDataService.compConfig;
    this.appName = translateComp(Translations.DemonListComponent.AppTitle, this.compConfig.lang) + fusionDataService.appName;

    this.defaultSortFun = (d1, d2) => (
      this.compConfig.raceOrder[d1.race] -
      this.compConfig.raceOrder[d2.race]
    ) * 200 + d2.lvl - d1.lvl;
  }
}
