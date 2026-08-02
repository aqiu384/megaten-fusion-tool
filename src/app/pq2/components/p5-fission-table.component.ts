import { Component, computed } from '@angular/core';
import { SmtFissionTableComponent } from '../../compendium/components/smt-fission-table.component';
import { splitWithTreasure } from '../../compendium/fusions/per-nonelem-fissions';
import { FusionEntryTableComponent } from '../../compendium/components/fusion-entry-table.component';
import { FusionPairTableComponent } from '../../compendium/components/fusion-pair-table.component';
import { TranslateCompPipe } from '../../compendium/pipes';

@Component({
  imports: [FusionEntryTableComponent, FusionPairTableComponent, TranslateCompPipe],
  templateUrl: '../../compendium/components/smt-fission-table.component.html'
})
export class P5FissionTableComponent extends SmtFissionTableComponent {
  fusionPairs$ = computed(() => {
    const currentDemon = this.currentDemon$();
    const compendium = this.compendium$();
    const fusionChart = this.fusionChart$();
    const toFusionPair = this.toFusionPair$();

    const fusionPairs = this.calculator
      .getFusions(currentDemon, compendium, fusionChart)
      .map(toFusionPair(currentDemon));

    if (fusionChart.elementDemons.length > 0) {
      for (const multiPair of splitWithTreasure(currentDemon, compendium, fusionChart)) {
        const lvl1 = (Math.floor(multiPair.lvl1) << 10) + multiPair.lvl2;
        for (const name1 of multiPair.names1) {
          const { race: race1, lvl: baseLvl } = compendium.getDemon(name1);
          for (const name2 of multiPair.names2) {
            const { race: race2, lvl: lvl2, price: price2 } = compendium.getDemon(name2);
            fusionPairs.push({ price: multiPair.price + price2 - baseLvl, race1, lvl1, name1, race2, lvl2, name2 });
          }
        }
      }
    }
    
    return fusionPairs;
  });
}
