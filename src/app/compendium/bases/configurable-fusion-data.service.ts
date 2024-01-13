import { FusionDataService as IFusionDataService, Compendium, FusionChart, FusionCalculator } from '../models';
import { FusionSettings } from '../models/fusion-settings';
import { Observable, BehaviorSubject } from 'rxjs';

export abstract class ConfigurableFusionDataService<TCompendium extends Compendium, TFusionChart extends FusionChart> implements IFusionDataService {
  abstract fissionCalculator: FusionCalculator;
  abstract fusionCalculator: FusionCalculator;
  
  private _compendium: TCompendium;
  private _compendium$: BehaviorSubject<TCompendium>;
  compendium: Observable<TCompendium>;

  private _fusionChart: TFusionChart;
  private _fusionChart$: BehaviorSubject<TFusionChart>;
  fusionChart: Observable<TFusionChart>;

  private _fusionSettings: FusionSettings;
  private _fusionSettings$: BehaviorSubject<FusionSettings>;
  fusionSettings: Observable<FusionSettings>;

  constructor(comp: TCompendium, chart: TFusionChart, fusionSettings: FusionSettings, private settingsKey: string, private settingsVersion: number) {
    this._compendium = comp;
    this._compendium$ = new BehaviorSubject(this._compendium);
    this.compendium = this._compendium$.asObservable();

    this._fusionChart = chart;
    this._fusionChart$ = new BehaviorSubject(this._fusionChart);
    this.fusionChart = this._fusionChart$.asObservable();

    this._fusionSettings = fusionSettings;
    this._fusionSettings$ = new BehaviorSubject(this._fusionSettings);
    this.fusionSettings = this._fusionSettings$.asObservable();

    const settings = JSON.parse(localStorage.getItem(this.settingsKey));

    if (settings && settings.version && settings.version >= this.settingsVersion) {
      this.updateFusionSettings(settings.settings);
    }

    window.addEventListener('storage', this.onStorageUpdated.bind(this));
  }

  private updateToggledSettings(settings: { [setting: string]: boolean }) {
    this._fusionSettings.updateSaveFile(settings);
    this._compendium.updateFusionSettings(this._fusionSettings.demonToggles);
    this._compendium$.next(this._compendium);
    this._fusionSettings$.next(this._fusionSettings);
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
