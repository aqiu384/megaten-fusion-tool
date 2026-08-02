import { Component, inject } from '@angular/core';
import { SmtSkillListComponent } from '../../compendium/components/smt-skill-list.component';
import { SkillListContainerComponent as SLCC } from '../../compendium/containers/skill-list.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  imports: [SmtSkillListComponent],
  template: `
    <app-smt-skill-list
      [elemOrder]="elemOrder"
      [hasRank]="false"
      [hasTarget]="true"
      [isPersona]="true"
      [transferTitle]="'Inherit From'"
      [rowData]="skills$()">
    </app-smt-skill-list>
  `
})
export class SkillListContainerComponent extends SLCC {
  fusionDataService = inject(FusionDataService);
  appName = `List of Skills - ${this.fusionDataService.appName}`;
  compConfig = this.fusionDataService.compConfig;
  elemOrder = this.compConfig.elemOrder;
}
