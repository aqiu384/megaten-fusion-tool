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
      [otherLinks]="[{ title: 'Shadow List', link: 'shadows' }]">
    </app-demon-compendium>
  `,
  styleUrls: [ './compendium.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  appCssClasses = ['smtnes', 'smt1'];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
  }
}
