'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    function Store() {
        _classCallCheck(this, Store);

        this.available = false;
        try {
            if (typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
                var key = '__pushtell_react__';
                window.localStorage.setItem(key, key);
                if (window.localStorage.getItem(key) === key) {
                    window.localStorage.removeItem(key);
                    this.available = true;
                }
            }
        } catch (e) {}
    }

    _createClass(Store, [{
        key: 'getItem',
        value: function getItem(key) {
            if (this.available) {
                return window.localStorage.getItem(key);
            }
        }
    }, {
        key: 'setItem',
        value: function setItem(key, value) {
            if (this.available) {
                window.localStorage.setItem(key, value);
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            if (this.available) {
                window.localStorage.clear();
            }
        }
    }]);

    return Store;
}();

exports.default = new Store();
module.exports = exports['default'];