import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompendiumComponent as BaseCompendiumComponent } from '../../compendium/components/compendium.component';

@Component({
  imports: [CommonModule, BaseCompendiumComponent],
  template: `
    <app-demon-compendium
      [ngClass]="'p5s'"
      [hasSettings]="false"
      [mainList]="'persona'">
    </app-demon-compendium>
  `,
  styleUrls: ['./compendium.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent { }
