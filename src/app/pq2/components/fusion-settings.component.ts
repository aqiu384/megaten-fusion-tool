import { Component, inject } from '@angular/core';
import { FusionSettingsComponent } from '../../compendium/components/fusion-settings.component';
import { FusionSettingsContainerComponent as FSCC } from '../../compendium/containers/fusion-settings.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  imports: [FusionSettingsComponent],
  template: `
    <app-fusion-settings
      [lang]="fusionDataService.compConfig.lang"
      [appTitle]="fusionDataService.appName"
      [fusionSettings]="fusionSettings$()"
      [showEnableAll]="true"
      (toggledAll)="toggleAll($event)"
      (toggledName)="toggleName($event)">
    </app-fusion-settings>
  `
})
export class FusionSettingsContainerComponent extends FSCC {
  fusionDataService = inject(FusionDataService);
}
