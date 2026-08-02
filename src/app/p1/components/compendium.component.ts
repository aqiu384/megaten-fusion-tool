import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FusionDataService } from '../fusion-data.service';
import { CompendiumComponent as BaseCompendiumComponent } from '../../compendium/components/compendium.component';

@Component({
  imports: [CommonModule, BaseCompendiumComponent],
  template: `
    <app-demon-compendium
      [ngClass]="fusionDataService.compConfig.appCssClasses"
      [mainList]="'persona'"
      [hasSettings]="false"
      [otherLinks]="[{ title: 'Demon List', link: 'demons' }]">
    </app-demon-compendium>
  `,
  styleUrls: ['./compendium.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  fusionDataService = inject(FusionDataService);
}
