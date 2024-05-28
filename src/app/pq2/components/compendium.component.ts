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
  styleUrls: ['./compendium.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  appCssClasses: string[];
  otherLinks: { title: string, link: string }[];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
    const compConfig = fusionDataService.compConfig;
    this.otherLinks = [compConfig.hasQrcodes ? 
      { title: 'QR Code Generator', link: 'qrcodes', } :
      { title: 'Recipe Generator', link: 'recipes' }
    ];

    if (compConfig.hasEnemies) {
      this.otherLinks.unshift({ title: 'Shadow List', link: 'shadows' });
    }
  }
}
