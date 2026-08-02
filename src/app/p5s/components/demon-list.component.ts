import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemonListContainerComponent as DLCC } from '../../compendium/containers/demon-list.component';
import { FusionDataService } from '../fusion-data.service';
import { SmtDemonListComponent } from '../../compendium/components/smt-demon-list.component';

@Component({
  imports: [SmtDemonListComponent],
  template: `
    <app-smt-demon-list
      [isEnemy]="showEnemies"
      [raceOrder]="raceOrder"
      [statHeaders]="compConfig.baseStats"
      [resistHeaders]="compConfig.resistElems"
      [inheritOrder]="compConfig.elemOrder"
      [rowData]="demons$()">
    </app-smt-demon-list>
  `
})
export class DemonListContainerComponent extends DLCC {
  route = inject(ActivatedRoute);
  fusionDataService = inject(FusionDataService);
  appName = `List of Personas - ${this.fusionDataService.appName}`;
  compConfig = this.fusionDataService.compConfig;
  raceOrder = this.compConfig.raceOrder;
  showAllies = !this.route.snapshot.data.showShadows;
  showEnemies = !this.showAllies;
}
