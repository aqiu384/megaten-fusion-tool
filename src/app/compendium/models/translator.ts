import Translations from '../data/translations.json';

export function translateComp(dict: string[], lang: string): string {
  const i = Translations.Languages.Languages.indexOf(lang);
  return dict[-1 < i && i < dict.length ? i : 0];
}

export function translateCompSet(dict: { [word: string]: string[] }, lang: string): { [word: string]: string } {
  return Object.entries(dict).reduce((acc, [k, v]) => { acc[k] = translateComp(v, lang) || k; return acc; }, {});
}
