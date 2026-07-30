import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FusionDataService } from '../fusion-data.service';
import { CompendiumComponent as BaseCompendiumComponent } from '../../compendium/components/compendium.component';
import { FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../../compendium/constants';

@Component({
  selector: 'app-smt1-compendium',
  imports: [CommonModule, BaseCompendiumComponent],
  providers: [
    FusionDataService,
    { provide: FUSION_DATA_SERVICE, useExisting: FusionDataService },
    { provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService }
  ],
  template: `
    <app-demon-compendium
      [ngClass]="appCssClasses"
      [hasSettings]="false">
    </app-demon-compendium>
  `,
  styleUrls: ['./compendium.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  appCssClasses = ['smtnes', 'smt1'];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
  }
}
