import { FusionDataService as IFusionDataService, Compendium, FusionChart, FusionCalculator } from '../models';
import { FusionSettings } from '../models/fusion-settings';
import { Signal, WritableSignal, signal } from '@angular/core';

export abstract class ConfigurableFusionDataService<TCompendium extends Compendium, TFusionChart extends FusionChart> implements IFusionDataService {
  abstract fissionCalculator: FusionCalculator;
  abstract fusionCalculator: FusionCalculator;
  abstract lang: string;
  
  private _compendium: TCompendium;
  private _compendium$: WritableSignal<TCompendium>;
  compendium$: Signal<TCompendium>;

  private _fusionChart: TFusionChart;
  private _fusionChart$: WritableSignal<TFusionChart>;
  fusionChart$: Signal<TFusionChart>;

  private _fusionSettings: FusionSettings;
  private _fusionSettings$: WritableSignal<FusionSettings>;
  fusionSettings$: Signal<FusionSettings>;

  constructor(comp: TCompendium, chart: TFusionChart, fusionSettings: FusionSettings, private settingsKey: string, private settingsVersion: number) {
    this._compendium = comp;
    this._compendium$ = signal(this._compendium);
    this.compendium$ = this._compendium$.asReadonly();

    this._fusionChart = chart;
    this._fusionChart$ = signal(this._fusionChart);
    this.fusionChart$ = this._fusionChart$.asReadonly();

    this._fusionSettings = fusionSettings;
    this._fusionSettings$ = signal(this._fusionSettings);
    this.fusionSettings$ = this._fusionSettings$.asReadonly();

    const settings = JSON.parse(localStorage.getItem(this.settingsKey));

    if (settings && settings.version && settings.version >= this.settingsVersion) {
      this.updateFusionSettings(settings.settings);
    }

    window.addEventListener('storage', this.onStorageUpdated.bind(this));
  }

  private updateToggledSettings(settings: { [setting: string]: boolean }) {
    this._fusionSettings.updateSaveFile(settings);
    this._compendium.updateFusionSettings(this._fusionSettings.demonToggles);
    this._compendium$.set(this._compendium);
    this._fusionSettings$.set(this._fusionSettings);
  }

  private onStorageUpdated(e: StorageEvent) {
    if (e.key === this.settingsKey) {
      this.updateToggledSettings(JSON.parse(e.newValue).settings);
    }
  }

  updateFusionSettings(settings: { [setting: string]: boolean }) {
    this.updateToggledSettings(settings);
    localStorage.setItem(this.settingsKey, JSON.stringify({
      version: this.settingsVersion,
      settings: this._fusionSettings.saveFile
    }));
  }
}
