import Translations from '../data/translations.json';

export function translateComp(dict: string[], lang: string): string {
  const i = Translations.Languages.Languages.indexOf(lang);
  return dict[-1 < i && i < dict.length ? i : 0];
}
