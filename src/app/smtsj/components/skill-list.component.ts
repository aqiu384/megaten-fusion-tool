import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SkillListContainerComponent as SLCC } from '../../compendium/containers/skill-list.component';
import { SkillElementOrder as ElementOrder, InheritElementOrder } from '../models/constants';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-skill-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-smt-skill-list
      [elemOrder]="elemOrder"
      [inheritOrder]="inheritOrder"
      [hasDsource]="true"
      [rowData]="skills | async">
    </app-smt-skill-list>
  `
})
export class SkillListContainerComponent extends SLCC {
  elemOrder = ElementOrder;
  inheritOrder = InheritElementOrder;
  defaultSortFun = (a, b) => (ElementOrder[a.element] - ElementOrder[b.element]) * 10000 + a.rank - b.rank;

  constructor(
    title: Title,
    changeDetectorRef: ChangeDetectorRef,
    fusionDataService: FusionDataService
  ) {
    super(title, changeDetectorRef, fusionDataService);
    this.appName = `List of Skills - ${fusionDataService.appName}`;
  }
}
