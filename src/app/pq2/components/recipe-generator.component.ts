import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RecipeGeneratorComponent } from '../../compendium/components/recipe-generator.component';
import { FusionDataService } from '../fusion-data.service';
import { translateComp, translateCompSet } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

@Component({
  imports: [RecipeGeneratorComponent],
  template: `
    <app-recipe-generator
      [lang]="lang"
      [maxSkills]="compConfig.maxSkillSlots"
      [compendium]="fusionDataService.compendium$()"
      [squareChart]="fusionDataService.squareChart$()"
      [recipeConfig]="recipeConfig">
    </app-recipe-generator>
  `
})
export class RecipeGeneratorContainerComponent {
  title = inject(Title);
  fusionDataService = inject(FusionDataService);
  compConfig = this.fusionDataService.compConfig;
  lang = this.compConfig.lang;
  recipeConfig = {
    fissionCalculator: this.fusionDataService.fissionCalculator,
    fusionCalculator: this.fusionDataService.fusionCalculator,
    races: this.compConfig.races,
    skillElems: this.compConfig.skillElems,
    inheritElems: this.compConfig.inheritElems,
    displayElems: translateCompSet(Translations.ElementIcon, this.lang),
    restrictInherits: true,
    triFissionCalculator: this.fusionDataService.triFissionCalculator,
    triFusionCalculator: this.fusionDataService.triFusionCalculator,
    defaultDemon: this.compConfig.defaultDemon
  };

  constructor() {
    this.title.setTitle(translateComp(Translations.RecipeGeneratorComponent.AppTitle, this.lang) + this.fusionDataService.appName);
  }
}
