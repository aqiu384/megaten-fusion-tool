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
      [rowData]="skills$()">
    </app-smt-skill-list>
  `
})
export class SkillListContainerComponent extends SLCC {
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  appName = `List of Skills - ${this.fusionDataService.appName}`;
  elemOrder = this.compConfig.elemOrder;
}
