import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { DemonDlcSettingsContainerComponent as DDSCC } from '../../compendium/containers/demon-dlc-settings.component';
import { FusionDataService } from '../fusion-data.service';

@Component({
  selector: 'app-demon-dlc-settings-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-demon-dlc-settings
      [dlcDemons]="dlcDemons"
      [appTitle]="'Devil Surivor 2: Record Breaker'"
      [dlcTitle]="'Included DLC Demons'"
      (toggledName)="toggleName($event)">
    </app-demon-dlc-settings>
  `
})
export class DemonDlcSettingsContainerComponent extends DDSCC {
  constructor(
    private changeDetector: ChangeDetectorRef,
    private fusionDataService: FusionDataService
  ) {
    super(changeDetector, fusionDataService);
  }
}
