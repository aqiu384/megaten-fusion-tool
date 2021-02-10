import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TripleFusionTableComponent } from '../../compendium/components/tri-fusion-table.component';
import { getLowerIngredients, getHigherIngredients } from '../models/conversions';
import { MultiFusionTrio } from '../models';

@Component({
  selector: 'app-p5s-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      <tr><th colspan=8 class="title">Normal Forward Fusions</th></tr>
      <tr><th colspan=8>Result = Min Lvl {{ currentDemon }} x Ingredient 2 x Ingredient 3</th></tr>
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
      <tr *ngFor="let row of multiFusionTrios">
        <td>{{ row.price }}</td>
        <td>{{ row.lvl0 }}</td>
        <td>
          <ul class="comma-list">
            <li *ngFor="let name of row.names1"><a routerLink="../../{{ name }}">{{ name }} </a></li>
          </ul>
        </td>
        <td>{{ row.lvl1 }}</td>
        <td>
          <ul class="comma-list">
            <li *ngFor="let name of row.names2"><a routerLink="../../{{ name }}">{{ name }} </a></li>
          </ul>
        </td>
        <td>{{ row.lvl2 }}</td>
        <td>
          <ul class="comma-list">
            <li *ngFor="let name of row.names3"><a routerLink="../../{{ name }}">{{ name }} </a></li>
          </ul>
        </td>
        <td>{{ row.lvl3 }}</td>
      </tr>
      <tr *ngIf="!multiFusionTrios.length">
        <td colspan="8">No fusions found!</td>
      </tr>
    </table>
  `
})
export class P5SFusionTableComponent extends TripleFusionTableComponent {
  multiFusionTrios: MultiFusionTrio[] = [];

  getFusions() {
    const fusions: MultiFusionTrio[] = [];
    const pairs = this.pairCalculator.getFusions(this.currentDemon, this.compendium, this.chart.normalChart);

    for (const pair of pairs) {
      const lvl1 = this.compendium.getDemon(pair.name1).lvl;
      const { lvl: lvl2, price: price2, } = this.compendium.getDemon(pair.name2);

      fusions.push({
        lvl0: this.compendium.getDemon(this.currentDemon).lvl,
        names1: [pair.name2],
        lvl1: lvl2,
        names2: [pair.name1],
        lvl2: lvl1,
        names3: [],
        lvl3: 0,
        price: price2
      });
    }

    for (const name1 of getHigherIngredients(this.currentDemon, this.compendium)) {
      for (const trio of this.calculator.getFusions(name1, this.compendium, this.chart)) {
        const lvlR = this.compendium.getDemon(trio.name1).lvl;
        const { lvl: lvl2, price: price2, } = this.compendium.getDemon(trio.name2);
        const names3 = getLowerIngredients(trio.name3, this.compendium);
        const lvl3 = names3.length ? this.compendium.getDemon(names3[names3.length - 1]).lvl : 0;
        const price3 = names3.length ? this.compendium.getDemon(names3[names3.length - 1]).price : 0;

        fusions.push({
          lvl0: this.compendium.getDemon(name1).lvl,
          names1: [trio.name1],
          lvl1: lvlR,
          names2: getLowerIngredients(trio.name2, this.compendium),
          lvl2: lvl2,
          names3,
          lvl3,
          price: price2 + price3
        });
      }
    }

    this.multiFusionTrios = fusions;
  }
}
