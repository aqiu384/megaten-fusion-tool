import { Directive, computed, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FUSION_DATA_SERVICE, makeDefaultDemonSort } from '../constants';
import { Demon } from '../models';

@Directive()
export abstract class DemonListContainerComponent {
  title = inject(Title);
  fusionDataService = inject(FUSION_DATA_SERVICE);
  abstract raceOrder: { [race: string]: number };
  abstract appName: string;
  initListLen = 50;
  showAllies = true;
  showEnemies = false;

  demons$ = signal<Demon[]>([]);
  allDemons$ = computed(() => {
    let demons = this.fusionDataService.compendium$().allDemons;

    if (!this.showAllies) {
      demons = demons.filter(d => d.isEnemy);
    } if (!this.showEnemies) {
      demons = demons.filter(d => !d.isEnemy);
    }

    demons.sort(makeDefaultDemonSort(this.raceOrder));
    return demons;
  });

  constructor() {
    effect(() => {
      this.title.setTitle(this.appName);
      this.demons$.set(this.allDemons$().slice(0, this.initListLen));
      setTimeout(() => this.demons$.set(this.allDemons$()));
    });
  }
}
