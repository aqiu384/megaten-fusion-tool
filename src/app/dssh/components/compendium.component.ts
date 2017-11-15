import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-krao-compendium',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-compendium [ngClass]="'dssh'"></app-demon-compendium>
  `,
  styleUrls: [ './compendium.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent { }
