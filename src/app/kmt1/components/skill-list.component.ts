import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SkillListContainerComponent as SLCC } from '../../compendium/containers/skill-list.component';
import { FusionDataService } from '../fusion-data.service';
import { CompendiumConfig } from '../models';

@Component({
  selector: 'app-skill-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-smt-skill-list
      [elemOrder]="compConfig.elemOrder"
      [hasRank]="false"
      [hasTarget]="true"
      [rowData]="skills | async">
    </app-smt-skill-list>
  `
})
export class SkillListContainerComponent extends SLCC {
  compConfig: CompendiumConfig;

  constructor(
    title: Title,
    changeDetectorRef: ChangeDetectorRef,
    fusionDataService: FusionDataService
  ) {
    super(title, changeDetectorRef, fusionDataService);
    this.appName = `List of Skills - ${fusionDataService.appName}`;

    this.compConfig = fusionDataService.compConfig;
    this.defaultSortFun = (a, b) => (
      this.compConfig.elemOrder[a.element] -
      this.compConfig.elemOrder[b.element]
    ) * 10000 + a.rank - b.rank;
  }
}
