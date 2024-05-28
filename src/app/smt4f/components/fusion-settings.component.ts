import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FusionSettingsContainerComponent as FSCC } from '../../compendium/containers/fusion-settings.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-fusion-settings-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-fusion-settings
      [lang]="lang"
      [appTitle]="appTitle"
      [fusionSettings]="fusionSettings"
      (toggledName)="toggleName($event)">
    </app-fusion-settings>
  `
})
export class FusionSettingsContainerComponent extends FSCC {
  appTitle: string;
  lang: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) {
    super(changeDetector, fusionDataService);
    this.appTitle = fusionDataService.appName;
    this.lang = fusionDataService.compConfig.lang;
  }
}
