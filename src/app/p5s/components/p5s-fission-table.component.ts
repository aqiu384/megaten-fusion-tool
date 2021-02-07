import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TripleFissionTableComponent } from '../../compendium/components/tri-fission-table.component';
import { getLowerIngredients } from '../models/conversions';
import { MultiFusionTrio } from '../models';

@Component({
  selector: 'app-p5s-fission-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table *ngIf="compendium.getDemon(currentDemon).prereq as prereq">
      <tr><th class="title">Special Fusion Condition</th></tr>
      <tr><td>{{ prereq }}</td></tr>
    </table>
    <ng-container *ngIf="compendium.splitSpecialFusion(currentDemon) as rows">
      <table *ngIf="rows.length">
        <tr><th colspan=4 class="title">Special Fusion Ingredients for {{ currentDemon }}</th></tr>
        <tr><th>Price</th><th>Race</th><th>Lvl</th><th>Name</th></tr>
        <tr *ngFor="let row of rows">
          <td>{{ row.price }}</td>
          <td>{{ row.race1 }}</td>
          <td>{{ row.lvl1 }}</td>
          <td><a routerLink="../../{{ row.name1 }}">{{ row.name1 }}</a></td>
        </tr>
      </table>
    </ng-container>
    <table>
      <tr><th colspan=7 class="title">Normal Reverse Fusions</th></tr>
      <tr><th colspan=7>Ingredient 1 x Ingredient 2 x Ingredient 3 = {{ currentDemon }}</th></tr>
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
      <tr *ngFor="let row of multiFissionTrios">
        <td>{{ row.price }}</td>
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
      <tr *ngIf="!multiFissionTrios.length">
        <td colspan="7">No fusions found!</td>
      </tr>
    </table>
  `
})
export class P5SFissionTableComponent extends TripleFissionTableComponent {
  multiFissionTrios: MultiFusionTrio[] = [];

  getFissions() {
    const fissions: MultiFusionTrio[] = [];
    const pairs = this.pairCalculator.getFusions(this.currentDemon, this.compendium, this.chart.normalChart);
    const trios = this.calculator.getFusions(this.currentDemon, this.compendium, this.chart);

    for (const pair of pairs) {
      const { lvl: lvl1, price: price1, } = this.compendium.getDemon(pair.name1);
      const { lvl: lvl2, price: price2, } = this.compendium.getDemon(pair.name2);

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
      const { lvl: lvl1, price: price1, } = this.compendium.getDemon(trio.name1);
      const { lvl: lvl2, price: price2, } = this.compendium.getDemon(trio.name2);
      const names3 = getLowerIngredients(trio.name3, this.compendium);
      const lvl3 = names3.length ? this.compendium.getDemon(names3[names3.length - 1]).lvl : 0;
      const price3 = names3.length ? this.compendium.getDemon(names3[names3.length - 1]).price : 0;

      fissions.push({
        lvl0: 0,
        names1: getLowerIngredients(trio.name1, this.compendium),
        lvl1: lvl1,
        names2: getLowerIngredients(trio.name2, this.compendium),
        lvl2: lvl2,
        names3,
        lvl3,
        price: price1 + price2 + price3
      });
    }

    this.multiFissionTrios = fissions;
  }
}
