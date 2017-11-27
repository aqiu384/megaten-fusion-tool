import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SkillListContainerComponent as SLCC } from '../../compendium/containers/skill-list.component';
import { ElementOrder, APP_TITLE } from '../constants';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-skill-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-smt-skill-list
      [elemOrder]="elemOrder"
      [hasRank]="false"
      [hasTarget]="true"
      [hasFuse]="true"
      [rowData]="skills | async">
    </app-smt-skill-list>
  `
})
export class SkillListContainerComponent extends SLCC {
  appName = `List of Skills - ${APP_TITLE}`;
  elemOrder = ElementOrder;
  defaultSortFun = (a, b) => (ElementOrder[a.element] - ElementOrder[b.element]) * 10000 + a.rank - b.rank;

  constructor(
    title: Title,
    changeDetectorRef: ChangeDetectorRef,
    fusionDataService: FusionDataService
  ) { super(title, changeDetectorRef, fusionDataService); }
}
