import { InjectionToken } from '@angular/core';
import { CompendiumConfig, FusionDataService } from './models';

export const COMPENDIUM_CONFIG = new InjectionToken<CompendiumConfig>('compendium.config');
export const FUSION_DATA_SERVICE = new InjectionToken<FusionDataService>('fusion.data.service');

export const FusionTypes = {
  Normal: 'normal',
  Special: 'special',
  Recruit: 'recruit',
  Accident: 'accident',
  Password: 'password',
  NotOwned: 'notowned',
};
