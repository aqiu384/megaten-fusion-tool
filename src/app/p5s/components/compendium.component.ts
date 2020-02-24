import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-p4-compendium',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-compendium
      [ngClass]="'p5'"
      [hasSettings]="false"
      [mainList]="'persona'">
    </app-demon-compendium>
  `,
  styleUrls: [ '../../p5/components/compendium.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent { }
