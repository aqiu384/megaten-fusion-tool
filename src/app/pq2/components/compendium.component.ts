import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-pq2-compendium',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-compendium
      [ngClass]="appCssClasses"
      [mainList]="'persona'"
      [otherLinks]="otherLinks">
    </app-demon-compendium>
  `,
  styleUrls: [ './compendium.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  appCssClasses: string[];
  otherLinks: { title: string, link: string }[] = [
    { title: 'Shadow List', link: 'shadows' },
    { title: 'QR Code Generator', link: 'qrcodes' }
  ];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;

    if (!fusionDataService.compConfig.hasTripleFusion) {
      this.otherLinks = [{ title: 'Recipe Generator', link: 'recipes' }]
    }
  }
}
