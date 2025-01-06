"use strict";

var jsxRuntime = require("react/jsx-runtime");

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
    }
  return target;
};

// src/lib/classname.ts
var cls = (...classNames) => classNames.filter((className) => !!className).join(" ");
function DemoComponent(_a) {
  var _b = _a,
    { children, className } = _b,
    other = __objRest(_b, ["children", "className"]);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "button",
    __spreadProps(
      __spreadValues(
        {
          className: cls(" bg-slate-500 hover:bg-slate-600 p-4 font-bold flex gap-11", className),
          type: "button",
        },
        other,
      ),
      {
        children: [/* @__PURE__ */ jsxRuntime.jsx("span", { children: "huhu" }), children],
      },
    ),
  );
}
DemoComponent.displayName = "DemoComponent";

exports.DemoComponent = DemoComponent;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
