import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AppRoutes } from './app-routing.module';
import { CompendiumTranslator } from './compendium/models/compendium-translator';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(AppRoutes, withComponentInputBinding()),
    CompendiumTranslator
  ]
};
