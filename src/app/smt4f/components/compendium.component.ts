import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

@Component({
  selector: 'app-smt4f-compendium',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-compendium
      [ngClass]="appCssClasses"
      [otherLinks]="otherLinks">
    </app-demon-compendium>
  `,
  styleUrls: [ './compendium.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  appCssClasses = ['smt4', 'smt4f'];
  otherLinks: { title: string, link: string }[];

  constructor(fusionDataService: FusionDataService) {
    const lang = fusionDataService.compConfig.lang;
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
    this.otherLinks = [this.appCssClasses.includes('smtsj') ?
      { title: 'Passwords', link: 'passwords' } :
      { title: translateComp(Translations.CompendiumComponent.RecipGenerator, lang), link: 'recipes' }
    ];
  }
}
