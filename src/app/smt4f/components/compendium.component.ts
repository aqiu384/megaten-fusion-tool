import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompendiumComponent as BaseCompendiumComponent } from '../../compendium/components/compendium.component';
import { CompendiumConfig } from '../models';
import { FusionDataService } from '../fusion-data.service';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

function makeOtherLinks(compConfig: CompendiumConfig): { title: string, link: string }[] {
  return compConfig.maxSkillSlots === 0 ? [] : compConfig.appCssClasses.includes('smtsj') ?
    [{ title: 'Passwords', link: 'passwords' }] :
    [{ title: translateComp(Translations.CompendiumComponent.RecipGenerator, compConfig.lang), link: 'recipes' }];
}

@Component({
  selector: 'app-smt4f-compendium',
  imports: [CommonModule, BaseCompendiumComponent],
  template: `
    <app-demon-compendium
      [ngClass]="fusionDataService.compConfig.appCssClasses"
      [otherLinks]="otherLinks">
    </app-demon-compendium>
  `,
  styleUrls: ['./compendium.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CompendiumComponent {
  fusionDataService = inject(FusionDataService);
  otherLinks = makeOtherLinks(this.fusionDataService.compConfig);
}
