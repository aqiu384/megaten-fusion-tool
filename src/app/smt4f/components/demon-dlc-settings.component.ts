import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { DemonDlcSettingsContainerComponent as DDSCC } from '../../compendium/containers/demon-dlc-settings.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-demon-dlc-settings-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-dlc-settings
      [langEn]="langEn"
      [dlcDemons]="dlcDemons"
      [appTitle]="appTitle"
      [dlcTitle]="langEn ? 'Included DLC Demons' : 'DLC'"
      (toggledName)="toggleName($event)">
    </app-demon-dlc-settings>
  `
})
export class DemonDlcSettingsContainerComponent extends DDSCC {
  appTitle: string;
  langEn = true;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) {
    super(changeDetector, fusionDataService);
    this.appTitle = fusionDataService.appName;
    this.langEn = fusionDataService.compConfig.lang !== 'ja';
  }
}
