import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

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
      { title: translateComp(
        Translations.CompendiumComponent.RecipGenerator,
        fusionDataService.compConfig.lang
      ), link: 'recipes' }
    ];

    if (compConfig.hasEnemies) {
      this.otherLinks.unshift({ title: translateComp(
        Translations.CompendiumComponent.ShadowList,
        fusionDataService.compConfig.lang
      ), link: 'shadows' });
    }
  }
}
