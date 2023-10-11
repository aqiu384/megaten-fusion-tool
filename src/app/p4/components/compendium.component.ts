import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-p4-compendium',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-compendium
      [ngClass]="appCssClasses"
      [hasSettings]="false"
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

    if (fusionDataService.compConfig.hasManualInheritance) {
      this.otherLinks.push({ title: 'Recipe Generator', link: 'recipes' });
    }
  }
}
