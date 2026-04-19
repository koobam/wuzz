import type common from '@locales/en/common.json';
import type home from '@locales/en/home.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      home: typeof home;
    };
  }
}