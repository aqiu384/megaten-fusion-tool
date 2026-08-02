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
      [statHeaders]="statHeaders"
      [resistHeaders]="compConfig.resistElems"
      [inheritOrder]="compConfig.elemOrder"
      [affinityHeaders]="showEnemies ? [] : compConfig.affinityUsers"
      [rowData]="demons$()">
    </app-smt-demon-list>
  `
})
export class DemonListContainerComponent extends DLCC {
  route = inject(ActivatedRoute);
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  raceOrder = this.compConfig.raceOrder;
  showAllies = !this.route.snapshot.data.showEnemies;
  showEnemies = !this.showAllies;
  appName = `List of ${!this.showEnemies ? 'Personas' : 'Demons'} - ${this.fusionDataService.appName}`;
  statHeaders = !this.showEnemies ? this.compConfig.baseStats : this.compConfig.enemyStats;
}
