import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { RecipeGeneratorConfig, SquareChart } from '../../compendium/models';
import { Compendium } from '../models/compendium';
import { FusionDataService } from '../fusion-data.service';
import { PageTranslationUtil } from 'src/app/page-translations/page-translation-util';
import PAGE_TRANSLATION_JSON from '../../page-translations/data/translations.json';

@Component({
  selector: 'app-recipe-generator-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-recipe-generator
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
  titleString: string;

  constructor(private fusionDataService: FusionDataService, private title: Title, private router: Router) {
    const compConfig = this.fusionDataService.compConfig;
    this.maxSkills = compConfig.hasDemonResists ? 8 : 2;
    this.recipeConfig = {
      fissionCalculator: this.fusionDataService.fissionCalculator,
      fusionCalculator: this.fusionDataService.fusionCalculator,
      races: compConfig.races,
      skillElems: compConfig.skillElems,
      inheritElems: compConfig.inheritElems,
      restrictInherits: true,
      triExclusiveRaces: compConfig.hasTripleFusion ? ['Fool', 'Tower', 'Moon', 'Sun', 'Judgement'] : [],
      triFissionCalculator: this.fusionDataService.triFissionCalculator,
      triFusionCalculator: this.fusionDataService.triFusionCalculator,
      defaultDemon: compConfig.defaultDemon
    };
    this.lang = PageTranslationUtil.getLanguage(router.url);
    this.titleString = PAGE_TRANSLATION_JSON['recipe-generator'][this.lang];
  }

  ngOnInit() { this.setTitle(); this.subscribeAll(); }
  ngOnDestroy() { this.unsubscribeAll(); }

  setTitle() {
    this.title.setTitle(`${this.titleString} - ${this.fusionDataService.appName}`);
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
