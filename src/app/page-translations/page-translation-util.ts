import PAGE_TRANSLATIONS_JSON from './data/translations.json'

export class PageTranslationUtil {
    // Get current page's language string from the given URL. Default to English.
    static getLanguage(url: string): string {
        if (url.includes('/zh-cn/')) {
            return 'zh-cn';
        } else if (url.includes('/ja/')) {
            return 'ja';
        } else {
            return 'en';
        }
    }
}