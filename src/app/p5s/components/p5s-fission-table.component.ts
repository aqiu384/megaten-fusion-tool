import { Component, computed } from '@angular/core';
import { TripleFissionTableComponent } from '../../compendium/components/tri-fission-table.component';
import { getLowerIngredients } from '../models/conversions';
import { MultiFusionTrio } from '../models';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule],
  template: `
    @let compendium = compendium$();
    @let currentDemon = currentDemon$();
    @let multiFissionTrios = multiFissionTrios$();
    <table class="list-table">
      <tr><th colspan=7 class="title">Ingredient 1 x Ingredient 2 x Ingredient 3 = {{ currentDemon }}</th></tr>
      <tr>
        <th rowspan=2>Price</th>
        <th colspan=2>Ingredient 1</th>
        <th colspan=2>Ingredient 2</th>
        <th colspan=2>Ingredient 3</th>
      </tr>
      <tr>
        <th>Names</th><th>Lvl</th>
        <th>Names</th><th>Lvl</th>
        <th>Names</th><th>Lvl</th>
      </tr>
      @for (row of multiFissionTrios; track $index) {
        <tr>
          <td>{{ compendium.inGameCurrencySymbol + (row.price | number:'1.0-0') }}</td>
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
      @if (!multiFissionTrios.length) {
        <tr>
          <td colspan="7">No fusions found!</td>
        </tr>
      }
    </table>
  `
})
export class P5SFissionTableComponent extends TripleFissionTableComponent {
  multiFissionTrios$ = computed(() => {
    const currentDemon = this.currentDemon$();
    const compendium = this.compendium$();
    const chart = this.chart$();

    const fissions: MultiFusionTrio[] = [];
    const pairs = this.pairCalculator.getFusions(currentDemon, compendium, chart.normalChart);
    const trios = this.calculator.getFusions(currentDemon, compendium, chart);

    for (const pair of pairs) {
      const { lvl: lvl1, price: price1, } = compendium.getDemon(pair.name1);
      const { lvl: lvl2, price: price2, } = compendium.getDemon(pair.name2);

      fissions.push({
        lvl0: 0,
        names1: [pair.name1],
        lvl1,
        names2: [pair.name2],
        lvl2,
        names3: [],
        lvl3: 0,
        price: price1 + price2
      });
    }

    for (const trio of trios) {
      const names1 = getLowerIngredients(trio.name1, compendium);
      const names2 = getLowerIngredients(trio.name2, compendium);
      const names3 = getLowerIngredients(trio.name3, compendium);
      const { lvl: lvl1, price: price1, } = compendium.getDemon(trio.name1);
      const { lvl: lvl2, price: price2, } = compendium.getDemon(trio.name2);
      const lvl3 = names3.length ? compendium.getDemon(names3[names3.length - 1]).lvl : 0;
      const price3 = names3.length ? compendium.getDemon(names3[names3.length - 1]).price : 0;

      fissions.push({
        lvl0: 0,
        names1: lvl3 ? names1.slice(-2) : names1,
        lvl1: lvl1,
        names2: lvl3 ? names2.slice(-2) : names2,
        lvl2: lvl2,
        names3: names3.slice(-2),
        lvl3,
        price: price1 + price2 + price3
      });
    }

    return fissions;
  });
}
