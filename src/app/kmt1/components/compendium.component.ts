import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FusionDataService } from '../fusion-data.service';
import { FUSION_DATA_SERVICE } from '../../compendium/constants';
import { CompendiumComponent as BaseCompendiumComponent } from '../../compendium/components/compendium.component';

@Component({
  selector: 'app-kmt1-compendium',
  imports: [CommonModule, BaseCompendiumComponent],
  providers: [FusionDataService, { provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
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
  appCssClasses = ['kmt', 'kmt1'];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
  }
}
