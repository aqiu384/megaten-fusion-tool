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
      [lang]="lang"
      [maxSkills]="maxSkills"
      [compendium]="compendium"
      [squareChart]="squareChart"
      [recipeConfig]="recipeConfig">
    </app-recipe-generator>
  `
})
export class RecipeGeneratorContainerComponent implements OnInit, OnDestroy {
  compendium: Compendium;
  squareChart: SquareChart;
  recipeConfig: RecipeGeneratorConfig;
  subscriptions: Subscription[] = [];
  maxSkills: number;
  lang = 'en';

  constructor(private fusionDataService: FusionDataService, private title: Title) {
    const compConfig = this.fusionDataService.compConfig;
    const langInd = compConfig.translations.en.indexOf(compConfig.lang);
    const translateElemFun = (e: string) => langInd === -1 ? e : (compConfig.translations[e] || [])[langInd] || e;
    this.maxSkills = compConfig.hasDemonResists ? 8 : 2;
    this.lang = compConfig.lang;
    this.recipeConfig = {
      fissionCalculator: this.fusionDataService.fissionCalculator,
      fusionCalculator: this.fusionDataService.fusionCalculator,
      races: compConfig.races,
      skillElems: compConfig.skillElems,
      inheritElems: compConfig.inheritElems,
      displayElems: compConfig.skillElems.reduce((acc, e) => { acc[e] = translateElemFun(e); return acc }, {}),
      restrictInherits: true,
      triExclusiveRaces: compConfig.hasTripleFusion ? ['Fool', 'Tower', 'Moon', 'Sun', 'Judgement'] : [],
      triFissionCalculator: this.fusionDataService.triFissionCalculator,
      triFusionCalculator: this.fusionDataService.triFusionCalculator,
      defaultDemon: compConfig.defaultDemon
    };
  }

  ngOnInit()    { this.setTitle(); this.subscribeAll(); }
  ngOnDestroy() { this.unsubscribeAll(); }

  setTitle() {
    this.title.setTitle(translateComp(Translations.RecipeGeneratorComponent.AppTitle, this.lang) + this.fusionDataService.appName);
  }

  subscribeAll() {
    this.subscriptions.push(
      this.fusionDataService.compendium.subscribe(comp => {
        this.compendium = comp;
      }));

    this.subscriptions.push(
      this.fusionDataService.squareChart.subscribe(chart => {
        this.squareChart = chart;
      }));
  }

  unsubscribeAll() {
    for (const subscription of this.subscriptions) { subscription.unsubscribe(); }
  }
}
