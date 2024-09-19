import i18n from "i18next";
import React from "react";
import { initReactI18next } from "react-i18next";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("query-string", () => {
  return {
    stringify: () => {},
  };
});

// FIXME: temp fix for https://github.com/vercel/next.js/issues/43769
import { createContext } from "react";
jest.mock("next/dist/shared/lib/router-context.shared-runtime.js", () => ({
  RouterContext: createContext(true),
}));

jest.mock("moment", () => {
  // Here we are able to mock chain builder pattern
  const mMoment = {
    format: jest.fn(() => "12/07/1998"),
    startOf: jest.fn().mockReturnThis(),
    isValid: jest.fn().mockReturnValue(true),
    diff: jest.fn().mockReturnValue(-5),
    locale: jest.fn(),
    calendar: jest.fn(),
    fromNow: jest.fn(),
  };
  // Here we are able to mock the constructor and to modify instance methods
  const fn = jest.fn((newMoment) => {
    mMoment.format = jest.fn(() => newMoment);
    return mMoment;
  });
  fn.locale = jest.fn();
  fn.defineLocale = jest.fn();

  return fn;
});

jest.mock("sweetalert2", () => ({
  __esModule: true, // this property makes it work
  default: { fire: jest.fn().mockResolvedValue("test") },
}));

// Mock translation
export const t = (key, params) => {
  if (key === "key.with.params") {
    return `key.with.params.${params.param}`;
  }

  return key;
};
i18n.use(initReactI18next).init({
  lng: "fr",
  fallbackLng: "fr",
  ns: ["common"],
  defaultNS: "common",
  resources: {
    fr: {
      common: {},
    },
  },
});
jest.mock("next-i18next", () => ({
  useTranslation: () => {
    return {
      t,
      i18n: {
        language: "fr",
        changeLanguage: jest.fn().mockImplementation((lang) => {}),
      },
    };
  },
  withTranslation: () => (Component) => {
    const WrappedComponent = (props) => <Component {...props} t={t} />;
    WrappedComponent.displayName = `withTranslation(${Component.displayName || Component.name})`;
    return WrappedComponent;
  },
}));

// Mock the IntersectionObserver, see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
export class IntersectionObserver {
  root = null;
  rootMargin = "";
  thresholds = [];

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return [];
  }

  unobserve() {
    return null;
  }
}
window.IntersectionObserver = IntersectionObserver;
global.IntersectionObserver = IntersectionObserver;
