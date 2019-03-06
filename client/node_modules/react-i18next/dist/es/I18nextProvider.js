import React from 'react';
import { I18nContext, usedI18nextProvider } from './context';
export function I18nextProvider(_ref) {
  var i18n = _ref.i18n,
      children = _ref.children;
  usedI18nextProvider(true);
  return React.createElement(I18nContext.Provider, {
    value: {
      i18n: i18n
    }
  }, children);
}