export type Toggles = { [name: string]: boolean };
type SettingEntry = { name: string; caption: string; enabled: boolean };
type CategoryEntry = { category: string; settings: SettingEntry[] };
export type DemonUnlock = { category: string; unlocked: boolean; conditions: { [name: string]: string } };

export class FusionSettings {
  private _displayHeaders: CategoryEntry[];
  private _demonToggles: Toggles;
  private _subappToggles: Toggles;

  constructor(demonUnlocks: DemonUnlock[], subapps: string[], private separator: string = ',') {
    this._displayHeaders = [];
    this._demonToggles = {};
    this._subappToggles = {};

    for (const { category, unlocked, conditions } of demonUnlocks) {
      const settings: SettingEntry[] = [];
      this._displayHeaders.push({ category, settings });

      for (const name of Object.keys(conditions)) {
        this._demonToggles[name] = unlocked;
        settings.push({ name, caption: name.split(separator).join(', '), enabled: unlocked });
      }
    }

    const subappSettings: SettingEntry[] = [];

    if (subapps.length > 0) {
      this._displayHeaders.push({ category: 'Subapps', settings: subappSettings });
    }

    for (const name of subapps) {
      this._subappToggles[name] = false;
      subappSettings.push({ name, caption: name, enabled: false });
    }
  }

  get displayHeaders(): CategoryEntry[] {
    for (const category of this._displayHeaders) {
      for (const setting of category.settings) {
        setting.enabled = this.saveFile[setting.name];
      }
    }
    return this._displayHeaders;
  }

  get subappToggles(): Toggles {
    return this._subappToggles;
  }

  get demonToggles(): Toggles {
    const toggles: Toggles = {};
    for (const [names, enabled] of Object.entries(this._demonToggles)) {
      for (const name of names.split(this.separator)) {
        toggles[name] = enabled;
      }
    }
    return toggles;
  }

  get saveFile(): Toggles {
    return Object.assign({}, this._demonToggles, this._subappToggles);
  }

  isEnabled(name: string) {
    return this._demonToggles[name] || this._subappToggles[name] || false;
  }

  updateSaveFile(saveFile: Toggles) {
    for (const toggleSet of [this._demonToggles, this._subappToggles]) {
      for (const [name, enabled] of Object.entries(saveFile)) {
        if (toggleSet[name] === !enabled) {
          toggleSet[name] = enabled;
        }
      }
    }
  }
}
