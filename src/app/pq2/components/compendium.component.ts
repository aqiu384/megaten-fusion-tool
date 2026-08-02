import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompendiumComponent as BaseCompendiumComponent } from '../../compendium/components/compendium.component';
import { CompendiumConfig } from '../models';
import { FusionDataService } from '../fusion-data.service';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

function makeOtherLinks(compConfig: CompendiumConfig): { title: string, link: string }[] {
  const compComponent = Translations.CompendiumComponent;
  const otherLinks: { title: string, link: string }[] = [];

  if (compConfig.hasEnemies) {
    otherLinks.push({ title: translateComp(compComponent.ShadowList, compConfig.lang), link: 'shadows' });
  }

  if (!compConfig.hasQrcodes && compConfig.hasManualInheritance) {
    otherLinks.push({ title: translateComp(compComponent.RecipGenerator, compConfig.lang), link: 'recipes' });
  }

  if (compConfig.hasQrcodes) {
    otherLinks.push({ title: 'QR Code Generator', link: 'qrcodes', });
  }

  return otherLinks;
}

@Component({
  imports: [CommonModule, BaseCompendiumComponent],
  template: `
    <app-demon-compendium
      [ngClass]="fusionDataService.compConfig.appCssClasses"
      [mainList]="'persona'"
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
