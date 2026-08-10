import { Component, computed, inject } from '@angular/core';
import { FUSION_DATA_SERVICE } from '../constants';
import { NamePair, FusionPair } from '../models';
import { toFusionEntry, toFusionPair } from '../models/conversions';
import { CurrentDemonService } from '../current-demon.service';
import { FusionEntryTableComponent } from './fusion-entry-table.component';
import { FusionPairTableComponent } from './fusion-pair-table.component';
import { TranslateCompPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-smt-fission-table',
  imports: [FusionEntryTableComponent, FusionPairTableComponent, TranslateCompPipe],
  templateUrl: './smt-fission-table.component.html'
})
export class SmtFissionTableComponent {
  fusionDataService = inject(FUSION_DATA_SERVICE);
  currentDemonService = inject(CurrentDemonService);
  calculator = this.fusionDataService.fissionCalculator;
  lang = this.fusionDataService.lang;
  hasFissionFromDemons = false;
  msgs = Translations.SmtFissionTableComponent;

  compendium$ = this.fusionDataService.compendium$;
  fusionChart$ = this.fusionDataService.fusionChart$;
  currentDemon$ = this.currentDemonService.currentDemon;

  toFusionEntry$ = computed(() => (_: string) =>
    (name: string) => toFusionEntry(name, this.compendium$())
  );
  toFusionPair$ = computed(() => (_: string) =>
    (names: NamePair) => toFusionPair(names, this.compendium$())
  );
  fusionPrereq$ = computed(() => this.compendium$()
    .getDemon(this.currentDemon$()).prereq
  );
  fusionEntries$ = computed(() => this.compendium$()
    .getSpecialNameEntries(this.currentDemon$())
    .map(this.toFusionEntry$()(this.currentDemon$()))
  );
  fusionPairs$ = computed(() => this.calculator
    .getFusions(this.currentDemon$(), this.compendium$(), this.fusionChart$())
    .map(this.toFusionPair$()(this.currentDemon$()))
  );
  getNotes$ = computed<(pair: FusionPair) => string>(() => {
    const _ = this.currentDemon$(); return null;
  });
}
