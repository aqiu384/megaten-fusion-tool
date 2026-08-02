import { Component, computed, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RecipeGeneratorComponent } from '../../compendium/components/recipe-generator.component';
import { SquareChart } from '../../compendium/models';
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
      [squareChart]="squareChart$()"
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
    inheritElems: this.compConfig.affinityElems,
    displayElems: translateCompSet(Translations.ElementIcon, this.lang),
    restrictInherits: this.compConfig.appCssClasses.includes('sh2') || this.compConfig.appCssClasses.includes('smt3'),
    triFissionCalculator: null,
    triFusionCalculator: null,
    defaultDemon: this.compConfig.defaultRecipeDemon
  };

  squareChart$ = computed<SquareChart>(() => ({
    normalChart: this.fusionDataService.fusionChart$(),
    tripleChart: this.fusionDataService.fusionChart$()
  }));

  constructor() {
    this.title.setTitle(translateComp(Translations.RecipeGeneratorComponent.AppTitle, this.lang) + this.fusionDataService.appName);
  }
}
