import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser'

import { SmtDemonListComponent } from '../../compendium/components/smt-demon-list.component';
import { DemonListContainerComponent as DLCC } from '../../compendium/containers/demon-list.component';
import { FusionDataService } from '../fusion-data.service';
import { CompendiumConfig } from '../models';

@Component({
  selector: 'app-demon-list-container',
  imports: [CommonModule, SmtDemonListComponent],
  template: `
    <app-smt-demon-list
      [raceOrder]="compConfig.raceOrder"
      [statHeaders]="compConfig.baseStats"
      [resistHeaders]="compConfig.resistElems"
      [inheritOrder]="compConfig.inheritSkills ? compConfig.elemOrder : null"
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
    this.appName = `List of Demons - ${fusionDataService.appName}`;

    this.compConfig = fusionDataService.compConfig;
    this.defaultSortFun = (d1, d2) => (
      this.compConfig.raceOrder[d1.race] -
      this.compConfig.raceOrder[d2.race]
    ) * 200 + d2.lvl - d1.lvl;
  }
}
