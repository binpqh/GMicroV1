import 'i18next';
import { resources, defaultNS } from '../i18n/i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    // kế thừa (thêm vào types)
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['vi'];
  }
}
