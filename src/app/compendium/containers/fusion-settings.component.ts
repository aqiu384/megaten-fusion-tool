import { Directive, inject } from '@angular/core';
import { FUSION_DATA_SERVICE } from '../constants';

@Directive()
export class FusionSettingsContainerComponent {
  fusionDataService = inject(FUSION_DATA_SERVICE);
  fusionSettings$ = this.fusionDataService.fusionSettings$;

  toggleAll(enable: boolean) {
    const toggles = {};

    for (const cat of this.fusionSettings$().displayHeaders) {
      for (const setting of cat.settings) {
        toggles[setting.name] = enable
      }
    }

    this.fusionDataService.updateFusionSettings(toggles);
  }

  toggleName(name: string) {
    const toggles = {};
    toggles[name] = !this.fusionSettings$().isEnabled(name);
    this.fusionDataService.updateFusionSettings(toggles);
  }
}
