import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { RecipeGeneratorConfig, SquareChart } from '../../compendium/models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';
import { translateComp } from '../../compendium/models/translator';
import Translations from  '../../compendium/data/translations.json';

@Component({
  selector: 'app-recipe-generator-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-recipe-generator
      [maxSkills]="maxSkills"
      [compendium]="compendium"
      [squareChart]="squareChart"
      [recipeConfig]="recipeConfig"
      [lang]="lang">
    </app-recipe-generator>
  `
})
export class RecipeGeneratorContainerComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  squareChart: SquareChart;
  recipeConfig: RecipeGeneratorConfig;
  appName: string;
  subscriptions: Subscription[] = [];
  maxSkills = 8;
  lang = 'en';

  constructor(private fusionDataService: FusionDataService, private title: Title) {
    const compConfig = this.fusionDataService.compConfig;
    this.lang = compConfig.lang;
    this.appName = translateComp(Translations.RecipeGeneratorComponent.AppTitle, this.lang) + fusionDataService.appName;
    this.maxSkills = compConfig.maxSkillSlots;
    this.recipeConfig = {
      fissionCalculator: this.fusionDataService.fissionCalculator,
      fusionCalculator: this.fusionDataService.fusionCalculator,
      races: compConfig.races,
      skillElems: compConfig.skillElems,
      inheritElems: compConfig.affinityElems,
      displayElems: {},
      restrictInherits: compConfig.appCssClasses.includes('sh2') || compConfig.appCssClasses.includes('smt3'),
      triExclusiveRaces: [],
      triFissionCalculator: null,
      triFusionCalculator: null,
      defaultDemon: compConfig.defaultRecipeDemon
    };
  }

  ngOnInit()    { this.title.setTitle(this.appName); this.subscribeAll(); }
  ngOnDestroy() { this.unsubscribeAll(); }

  subscribeAll() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(comp => {
        this.compendium = comp;
      }));

    this.subscriptions.push(
      this.fusionDataService.fusionChart.subscribe(chart => {
        this.squareChart = { normalChart: chart, tripleChart: chart };
      }));
  }

  unsubscribeAll() {
    for (const subscription of this.subscriptions) { subscription.unsubscribe(); }
  }
}
