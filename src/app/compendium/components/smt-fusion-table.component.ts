import { Component, computed, inject } from '@angular/core';
import { FUSION_DATA_SERVICE } from '../constants';
import { NamePair } from '../models';
import { toFusionPairResult } from '../models/conversions';
import { CurrentDemonService } from '../current-demon.service';
import { FusionPairTableComponent } from './fusion-pair-table.component';
import { TranslateCompPipe } from '../pipes';
import Translations from '../data/translations.json';

@Component({
  selector: 'app-smt-fusion-table',
  imports: [FusionPairTableComponent, TranslateCompPipe],
  templateUrl: './smt-fusion-table.component.html'
})
export class SmtFusionTableComponent {
  fusionDataService = inject(FUSION_DATA_SERVICE);
  currentDemonService = inject(CurrentDemonService);
  calculator = this.fusionDataService.fusionCalculator;
  lang = this.fusionDataService.lang;
  hasFusionToPersonas = false;
  msgs = Translations.SmtFusionTableComponent;

  compendium$ = this.fusionDataService.compendium$;
  fusionChart$ = this.fusionDataService.fusionChart$;
  currentDemon$ = this.currentDemonService.currentDemon;

  toFusionPair$ = computed(() => (_: string) =>
    (names: NamePair) => toFusionPairResult(names, this.compendium$())
  );
  fusionPairs$ = computed(() => this.calculator
    .getFusions(this.currentDemon$(), this.compendium$(), this.fusionChart$())
    .map(this.toFusionPair$()(this.currentDemon$()))
  );
}
