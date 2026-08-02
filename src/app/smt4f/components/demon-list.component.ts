import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmtDemonListComponent } from '../../compendium/components/smt-demon-list.component';
import { DemonListContainerComponent as DLCC } from '../../compendium/containers/demon-list.component';
import { FusionDataService } from '../fusion-data.service';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

@Component({
  selector: 'app-demon-list-container',
  imports: [CommonModule, SmtDemonListComponent],
  template: `
    <app-smt-demon-list
      [lang]="compConfig.lang"
      [raceOrder]="raceOrder"
      [statHeaders]="compConfig.baseStats"
      [resistHeaders]="compConfig.resistElems"
      [affinityHeaders]="compConfig.hasNonelemInheritance ? null : compConfig.affinityElems"
      [rowData]="demons$()">
    </app-smt-demon-list>
  `
})
export class DemonListContainerComponent extends DLCC {
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  raceOrder = this.compConfig.raceOrder;
  appName = translateComp(Translations.DemonListComponent.AppTitle, this.compConfig.lang) + this.fusionDataService.appName;
}
