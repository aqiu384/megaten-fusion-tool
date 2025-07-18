import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SkillListContainerComponent as SLCC } from '../../compendium/containers/skill-list.component';
import { FusionDataService } from '../fusion-data.service';
import { CompendiumConfig } from '../models';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

@Component({
  selector: 'app-skill-list-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-smt-skill-list
      [lang]="compConfig.lang"
      [elemOrder]="compConfig.elemOrder"
      [inheritOrder]="compConfig.hasNonelemInheritance ? compConfig.elemOrder : null"
      [hasTarget]="true"
      [hasRank]="compConfig.hasSkillRanks"
      [transferTitle]="transferTitle"
      [rowData]="skills | async">
    </app-smt-skill-list>
  `
})
export class SkillListContainerComponent extends SLCC {
  compConfig: CompendiumConfig;
  transferTitle: string;

  constructor(
    title: Title,
    changeDetectorRef: ChangeDetectorRef,
    fusionDataService: FusionDataService
  ) {
    super(title, changeDetectorRef, fusionDataService);
    this.compConfig = fusionDataService.compConfig;
    this.appName = translateComp(Translations.SkillListComponent.AppTitle, this.compConfig.lang) + fusionDataService.appName;
    const appCssClasses = this.compConfig.appCssClasses;
    this.transferTitle = appCssClasses.includes('smtsj') ? 'D-Source' : appCssClasses.includes('rrch') ? 'Skill Book' : '';
    this.defaultSortFun = (a, b) => (
      this.compConfig.elemOrder[a.element] -
      this.compConfig.elemOrder[b.element]
    ) * 10000 + a.rank - b.rank;
  }
}
