import { Component, inject } from '@angular/core';
import { DemonListContainerComponent as DLCC } from '../../compendium/containers/demon-list.component';
import { FusionDataService } from '../fusion-data.service';
import { SmtDemonListComponent } from '../../compendium/components/smt-demon-list.component';

@Component({
  imports: [SmtDemonListComponent],
  template: `
    <app-smt-demon-list
      [raceOrder]="raceOrder"
      [statHeaders]="compConfig.baseStats"
      [resistHeaders]="compConfig.resistElems"
      [rowData]="demons$()">
    </app-smt-demon-list>
  `
})
export class DemonListContainerComponent extends DLCC {
  fusionDataService = inject(FusionDataService);
  appName = `List of Demons - ${this.fusionDataService.appName}`;
  compConfig = this.fusionDataService.compConfig;
  raceOrder = this.compConfig.raceOrder;
}
