import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-smt1-compendium',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-compendium
      [ngClass]="appCssClasses"
      [hasSettings]="false">
    </app-demon-compendium>
  `,
  styleUrls: [ './compendium.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  appCssClasses: string[];

  constructor(fusionDataService: FusionDataService) {
    this.appCssClasses = fusionDataService.compConfig.appCssClasses;
  }
}
