import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-p4-compendium',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-compendium
      [ngClass]="appCssClasses"
      [mainList]="'persona'"
      [hasSettings]="false"
      [otherLinks]="[{ title: 'Demon List', link: 'demons' }]">
    </app-demon-compendium>
  `,
  styleUrls: [ './compendium.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  otherLinks: { title: string, link: string }[];
  appCssClasses: string[];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
  }
}
