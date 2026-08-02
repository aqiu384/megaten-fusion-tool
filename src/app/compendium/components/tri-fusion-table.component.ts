import { Component, computed, inject } from '@angular/core';
import { FUSION_TRIO_SERVICE } from '../constants';
import { NameTrio, DemonTrio } from '../models';
import { toDemonTrioResult } from '../models/conversions';
import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionTrioTableComponent } from './fusion-trio-table.component';

@Component({
  selector: 'app-triple-fusion-table',
  imports: [FusionTrioTableComponent],
  template: `
    @let compendium = compendium$();
    @let chart = chart$();
    @let currentDemon = currentDemon$();
    @let fusionTrios = fusionTrios$();
    <app-fusion-trio-table
      [title]="'Result = Lvl ' + compendium.getDemon(currentDemon).currLvl + ' ' + currentDemon +  ' x Ingredient 2 x Ingredient 3'"
      [raceOrder]="chart.normalChart.raceOrder"
      [leftHeader]="'Result'"
      [rowData]="fusionTrios"
      [inGameCurrencySymbol]="compendium.inGameCurrencySymbol">
    </app-fusion-trio-table>
  `
})
export class TripleFusionTableComponent {
  fusionTrioService = inject(FUSION_TRIO_SERVICE);
  currentDemonService = inject(CurrentDemonService);
  pairCalculator = this.fusionTrioService.fusionCalculator;
  calculator = this.fusionTrioService.triFusionCalculator;
  sortDemonTrio = (a: DemonTrio, b: DemonTrio) => a.price - b.price;

  compendium$ = this.fusionTrioService.compendium$;
  chart$ = this.fusionTrioService.squareChart$;
  currentDemon$ = this.currentDemonService.currentDemon;

  toDemonTrio$ = computed(() => (names: NameTrio) =>
    toDemonTrioResult(names, this.compendium$())
  );
  fusionTrios$ = computed(() => {
    const names = this.calculator.getFusions(this.currentDemon$(), this.compendium$(), this.chart$());
    const demons = names.map(this.toDemonTrio$());
    const fusions: { [name: string]: DemonTrio[] } = {};

    for (const trio of demons) {
      if (!fusions[trio.d3.name]) {
        fusions[trio.d3.name] = [];
      }

      fusions[trio.d3.name].push(trio);
    }

    for (const recipes of Object.values(fusions)) {
      recipes.sort(this.sortDemonTrio);
    }

    return Object.entries(fusions).map(recipe => ({
      demon: this.compendium$().getDemon(recipe[0]),
      minPrice: recipe[1][0].price,
      fusions: recipe[1]
    }));
  });
}
