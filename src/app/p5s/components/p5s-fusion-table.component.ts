import { Component, computed } from '@angular/core';
import { TripleFusionTableComponent } from '../../compendium/components/tri-fusion-table.component';
import { getLowerIngredients, getHigherIngredients } from '../models/conversions';
import { MultiFusionTrio } from '../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  template: `
    @let compendium = compendium$();
    @let currentDemon = currentDemon$();
    @let multiFusionTrios = multiFusionTrios$();
    <table class="list-table">
      <tr><th colspan=8 class="title">Result = Min Lvl {{ currentDemon }} x Ingredient 2 x Ingredient 3</th></tr>
      <tr>
        <th rowspan=2>Price</th>
        <th rowspan=2>Min Lvl</th>
        <th colspan=2>Result</th>
        <th colspan=2>Ingredient 2</th>
        <th colspan=2>Ingredient 3</th>
      </tr>
      <tr>
        <th>Names</th><th>Lvl</th>
        <th>Names</th><th>Lvl</th>
        <th>Names</th><th>Lvl</th>
      </tr>
      @for (row of multiFusionTrios; track $index) {
        <tr>
          <td>{{ compendium.inGameCurrencySymbol + (row.price | number:'1.0-0') }}</td>
          <td>{{ row.lvl0 }}</td>
          <td>
            <ul class="comma-list">
              @for (name of row.names1; track $index) {
                <li><a routerLink="../../{{ name }}">{{ name }} </a></li>
              }
            </ul>
          </td>
          <td>{{ row.lvl1 }}</td>
          <td>
            <ul class="comma-list">
              @for (name of row.names2; track $index) {
                <li><a routerLink="../../{{ name }}">{{ name }} </a></li>
              }
            </ul>
          </td>
          <td>{{ row.lvl2 }}</td>
          <td>
            <ul class="comma-list">
              @for (name of row.names3; track $index) {
                <li><a routerLink="../../{{ name }}">{{ name }} </a></li>
              }
            </ul>
          </td>
          <td>{{ row.lvl3 }}</td>
        </tr>
      }
      @if (!multiFusionTrios.length) {
        <tr>
          <td colspan="8">No fusions found!</td>
        </tr>
      }
    </table>
  `
})
export class P5SFusionTableComponent extends TripleFusionTableComponent {
  multiFusionTrios$ = computed(() => {
    const currentDemon = this.currentDemon$();
    const compendium = this.compendium$();
    const chart = this.chart$();

    const fusions: MultiFusionTrio[] = [];
    const pairs = this.pairCalculator.getFusions(currentDemon, compendium, chart.normalChart);
    const higherIngreds = getHigherIngredients(currentDemon, compendium);

    for (const pair of pairs) {
      const lvl1 = compendium.getDemon(pair.name1).lvl;
      const { lvl: lvl2, price: price2, } = compendium.getDemon(pair.name2);

      fusions.push({
        lvl0: compendium.getDemon(currentDemon).lvl,
        names1: [pair.name2],
        lvl1: lvl2,
        names2: [pair.name1],
        lvl2: lvl1,
        names3: [],
        lvl3: 0,
        price: price2
      });
    }

    for (let ind1 = 0; ind1 < higherIngreds.length; ind1++) {
      for (const trio of this.calculator.getFusions(higherIngreds[ind1], compendium, chart)) {
        const lvlR = compendium.getDemon(trio.name1).lvl;
        const { lvl: lvl2, price: price2, } = compendium.getDemon(trio.name2);
        const names2 = getLowerIngredients(trio.name2, compendium);
        const names3 = getLowerIngredients(trio.name3, compendium);
        const lvl3 = names3.length ? compendium.getDemon(names3[names3.length - 1]).lvl : 0;
        const price3 = names3.length ? compendium.getDemon(names3[names3.length - 1]).price : 0;

        if (lvl3 > 0 && ind1 > 1) {
          continue;
        }

        fusions.push({
          lvl0: compendium.getDemon(higherIngreds[ind1]).lvl,
          names1: [trio.name1],
          lvl1: lvlR,
          names2: names2.slice(-2),
          lvl2: lvl2,
          names3: names3.slice(-2),
          lvl3,
          price: price2 + price3
        });
      }
    }

    return fusions;
  });
}
