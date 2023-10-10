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
  otherLinks: { title: string, link: string }[];
  appCssClasses: string[];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
    this.otherLinks = [{ title: 'Shadow List', link: 'shadows' }];
    this.otherLinks.push(fusionDataService.compConfig.hasTripleFusion ? 
      { title: 'QR Code Generator', link: 'qrcodes' } :
      { title: 'Recipe Generator', link: 'recipes' }
    );
  }
}
