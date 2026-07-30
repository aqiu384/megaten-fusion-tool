import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FusionDataService } from '../fusion-data.service';
import { FUSION_DATA_SERVICE } from '../../compendium/constants';
import { CompendiumComponent as BaseCompendiumComponent } from '../../compendium/components/compendium.component';

@Component({
  selector: 'app-p4-compendium',
  imports: [CommonModule, BaseCompendiumComponent],
  providers: [FusionDataService, { provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
  template: `
    <app-demon-compendium
      [ngClass]="appCssClasses"
      [mainList]="'persona'"
      [hasSettings]="false"
      [otherLinks]="[{ title: 'Demon List', link: 'demons' }]">
    </app-demon-compendium>
  `,
  styleUrls: ['./compendium.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  otherLinks: { title: string, link: string }[];
  appCssClasses: string[];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
  }
}
