import { Component, inject } from '@angular/core';
import { SmtSkillListComponent } from '../../compendium/components/smt-skill-list.component';
import { SkillListContainerComponent as SLCC } from '../../compendium/containers/skill-list.component';
import { FusionDataService } from '../fusion-data.service';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

@Component({
  imports: [SmtSkillListComponent],
  template: `
    <app-smt-skill-list
      [lang]="compConfig.lang"
      [elemOrder]="elemOrder"
      [hasRank]="compConfig.hasSkillRanks"
      [hasTarget]="true"
      [isPersona]="true"
      [transferTitle]="compConfig.hasSkillCards ? 'Skill Card' : ''"
      [rowData]="skills$()">
    </app-smt-skill-list>
  `
})
export class SkillListContainerComponent extends SLCC {
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  elemOrder = this.compConfig.elemOrder;
  appName = translateComp(Translations.SkillListComponent.AppTitle, this.compConfig.lang) + this.fusionDataService.appName;
}
