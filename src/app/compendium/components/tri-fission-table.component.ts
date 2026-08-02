import { Component, computed, inject } from '@angular/core';
import { FUSION_TRIO_SERVICE } from '../constants';
import { NameTrio, DemonTrio } from '../models';
import { toDemonTrio } from '../models/conversions';

import { CurrentDemonService } from '../../compendium/current-demon.service';
import { FusionTrioTableComponent } from './fusion-trio-table.component';

@Component({
  selector: 'app-triple-fission-table',
  imports: [FusionTrioTableComponent],
  template: `
    <app-fusion-trio-table
      [title]="'Ingredient 1 x Ingredient 2 x Ingredient 3 = ' + currentDemon$()"
      [raceOrder]="chart$().normalChart.raceOrder"
      [rowData]="fissionTrios$()"
      [inGameCurrencySymbol]="compendium$().inGameCurrencySymbol">
    </app-fusion-trio-table>
  `
})
export class TripleFissionTableComponent {
  fusionTrioService = inject(FUSION_TRIO_SERVICE);
  currentDemonService = inject(CurrentDemonService);
  pairCalculator = this.fusionTrioService.fissionCalculator;
  calculator = this.fusionTrioService.triFissionCalculator;
  sortDemonTrio = (a: DemonTrio, b: DemonTrio) => a.price - b.price;

  compendium$ = this.fusionTrioService.compendium$;
  chart$ = this.fusionTrioService.squareChart$;
  currentDemon$ = this.currentDemonService.currentDemon;

  toDemonTrio$ = computed(() => (names: NameTrio) =>
    toDemonTrio(names, this.compendium$())
  );
  fissionTrios$ = computed(() => {
    const names = this.calculator.getFusions(this.currentDemon$(), this.compendium$(), this.chart$());
    const demons = names.map(this.toDemonTrio$());
    const fissions: { [name: string]: DemonTrio[] } = {};

    for (const trio of demons) {
      for (const name of [trio.d1.name, trio.d2.name, trio.d3.name]) {
        if (!fissions[name]) {
          fissions[name] = [];
        }

        fissions[name].push(trio);
      }
    }

    for (const recipes of Object.values(fissions)) {
      recipes.sort(this.sortDemonTrio);
    }

    return Object.entries(fissions).map(recipe => ({
      demon: this.compendium$().getDemon(recipe[0]),
      minPrice: recipe[1][0].price,
      fusions: recipe[1]
    }));
  });
}
