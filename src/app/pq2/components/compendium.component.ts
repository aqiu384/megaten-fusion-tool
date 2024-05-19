import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';
import { Router } from '@angular/router';

import PAGE_TRANSLATION_JSON from '../../page-translations/data/translations.json';
import { PageTranslationUtil } from 'src/app/page-translations/page-translation-util';

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

  constructor(fusionDataService: FusionDataService, private router: Router) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
    const compConfig = fusionDataService.compConfig;
    this.otherLinks = [compConfig.hasQrcodes ?
      { title: 'QR Code Generator', link: 'qrcodes', } :
      { title: PAGE_TRANSLATION_JSON["recipe-generator"][PageTranslationUtil.getLanguage(router.url)] || PAGE_TRANSLATION_JSON["recipe-generator"]["en"], link: 'recipes' }
    ];

    if (compConfig.hasEnemies) {
      this.otherLinks.unshift({ title: PAGE_TRANSLATION_JSON["shadow-list"][PageTranslationUtil.getLanguage(router.url)] || PAGE_TRANSLATION_JSON["shadow-list"]["en"], link: 'shadows' });
    }
  }
}
