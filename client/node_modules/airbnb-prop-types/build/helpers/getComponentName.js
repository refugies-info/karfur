Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = getComponentName;

var _functionPrototype = require('function.prototype.name');

var _functionPrototype2 = _interopRequireDefault(_functionPrototype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getComponentName(Component) {
  if (typeof Component === 'string') {
    return Component;
  }
  if (typeof Component === 'function') {
    return Component.displayName || (0, _functionPrototype2['default'])(Component);
  }
  return null;
}
//# sourceMappingURL=getComponentName.js.map