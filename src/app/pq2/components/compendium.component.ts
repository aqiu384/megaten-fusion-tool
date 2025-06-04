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
    const compComponent = Translations.CompendiumComponent;
    this.otherLinks = [];

    if (compConfig.hasEnemies) {
      this.otherLinks.push({ title: translateComp(compComponent.ShadowList, compConfig.lang), link: 'shadows' });
    }

    if (!compConfig.hasQrcodes && compConfig.hasManualInheritance) {
      this.otherLinks.push({ title: translateComp(compComponent.RecipGenerator, compConfig.lang), link: 'recipes' });
    }

    if (compConfig.hasQrcodes) {
      this.otherLinks.push({ title: 'QR Code Generator', link: 'qrcodes', });
    }
  }
}
