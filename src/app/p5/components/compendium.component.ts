import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-p5-compendium',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-compendium
      [ngClass]="'p5'"
      [mainList]="'persona'"
      [otherLinks]="otherLinks">
    </app-demon-compendium>
  `,
  styleUrls: [ './compendium.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  otherLinks = [
    { title: 'Shadow List', link: 'shadows' },
    { title: 'Recipe Generator', link: 'recipes' }
  ];
}
