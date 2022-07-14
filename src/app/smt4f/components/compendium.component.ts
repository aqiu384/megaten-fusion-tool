import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';

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
  langEn: boolean;
  includeRecipes: boolean;
  otherLinks: { title: string, link: string }[];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
    this.langEn = fusionDataService.compConfig.lang !== 'ja';
    this.includeRecipes = !this.appCssClasses.includes('sh2');
    this.otherLinks = this.langEn && this.includeRecipes ? [{ title: 'Recipe Generator', link: 'recipes' }] : [];
  }
}
