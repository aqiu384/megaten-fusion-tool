import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-krch-compendium',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-compendium [ngClass]="'krch'" [hasSettings]="false"></app-demon-compendium>
  `,
  styleUrls: [ './compendium.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent { }
