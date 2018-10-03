"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Autocomplete =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Autocomplete, _React$Component);

  function Autocomplete() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Autocomplete);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Autocomplete)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      id: _this.props.value,
      localValue: getInitialLocalValue(_this.props),
      showAutocomplete: false
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleChange", function (e) {
      _this.setState({
        localValue: e.target.value
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "selectItem", function (item) {
      return function (e) {
        // cancel scheduled blur event (if any)
        _this.clearTimeout();

        if (_this.props.value !== item.value) {
          // commit change to parent
          _this.props.onChange(item.value);
        } else {
          // if next value is the same as current value
          // then no need to commit change. Just update
          // the local value.
          _this.setState({
            localValue: getInitialLocalValue(_this.props)
          });
        }
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleBlur", function () {
      // When a suggestion item is chosen via a click,
      // it will trigger a blur event beforehand. Since this blur handler,
      // also triggers an update / reset, the click handler itself will
      // not bet triggered!
      //
      // To fix this, we can instead schedule the blur callback
      // in some short milliseconds (in this case, 100ms).
      //
      // IF within that timespan we detect a click, then we should
      // cancel the scheduled blur callback, and run the click
      // callback instead.
      _this.timeoutID = setTimeout(function () {
        var result = search(_this.state.localValue, _this.props.data);

        if (result.length > 0 && result[0].value !== _this.props.value) {
          _this.props.onChange(result[0].value);
        } else {
          _this.setState({
            localValue: getInitialLocalValue(_this.props)
          });
        }
      }, 100);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleFocus", function () {
      // only show autocomplete when user focuses on the input
      _this.setState({
        showAutocomplete: true
      });
    });

    return _this;
  }

  _createClass(Autocomplete, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var suggestionList;

      if (this.state.showAutocomplete) {
        suggestionList = search(this.state.localValue, this.props.data);
      } else {
        suggestionList = [];
      }

      if (typeof this.props.children === 'function') {
        return this.props.children({
          inputProps: {
            value: this.state.localValue,
            onChange: this.handleChange,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur
          },
          suggestionList: suggestionList,
          selectItem: this.selectItem
        });
      }

      return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("input", {
        value: this.state.localValue,
        onChange: this.handleChange,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      }), _react.default.createElement("ul", null, suggestionList.map(function (s) {
        return _react.default.createElement("li", {
          onClick: _this2.selectItem(s),
          key: s.value
        }, s.label);
      })));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearTimeout();
    }
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this.timeoutID) {
        clearTimeout(this.timeoutID);
      }
    }) // For encapsulation, gDSFP makes sense. Rather
    // than instructing users to provide a unique `key` prop,
    // using gDSFP here will simplify the overall component API,
    // thus improves usability.

  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var prevId = state.id;
      var nextId = props.value;

      if (nextId !== prevId) {
        // props change --> reset state
        return {
          id: nextId,
          localValue: getInitialLocalValue(props),
          showAutocomplete: false
        };
      } // proceed state changes


      return null;
    }
  }]);

  return Autocomplete;
}(_react.default.Component);

var _default = Autocomplete; /////////////
// HELPERS //
/////////////

exports.default = _default;

function search(keyword, data) {
  return data.filter(function (d) {
    var regex = new RegExp(keyword, 'i');
    return regex.test(d.label) || regex.test(String(d.value));
  });
}

function getInitialLocalValue(_ref) {
  var defaultValue = _ref.defaultValue,
      value = _ref.value,
      data = _ref.data;
  var targetValue = value || defaultValue;

  if (targetValue) {
    var target = data.find(function (d) {
      return d.value === targetValue;
    });

    if (target) {
      return target.label;
    }
  }

  return '';
}