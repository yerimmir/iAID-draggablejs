"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Draggable = void 0;
var proxy = function (a, b) { return function (e) { return b(a(e)); }; };
var bind = function (el, event, callback) {
    return el.addEventListener && el.addEventListener(event, callback);
};
var unbind = function (el, event, callback) {
    return el && el.removeEventListener && el.removeEventListener(event, callback);
};
var noop = function () { };
var preventDefault = function (e) { return e.preventDefault(); };
var touchRegExp = /touch/;
var mouseAndPointerRegExp = /mouse|pointer/;
var IGNORE_MOUSE_TIMEOUT = 2000;
var InvalidArgumentError = (function (_super) {
    __extends(InvalidArgumentError, _super);
    function InvalidArgumentError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        return _this;
    }
    return InvalidArgumentError;
}(Error));
function normalizeEvent(e) {
    console.log(touchRegExp.test(e.type));
    if (touchRegExp.test(e.type)) {
        var touchEvent = e;
        return {
            pageX: touchEvent.changedTouches[0].pageX,
            pageY: touchEvent.changedTouches[0].pageY,
            clientX: touchEvent.changedTouches[0].clientX,
            clientY: touchEvent.changedTouches[0].clientY,
            type: e.type,
            originalEvent: touchEvent,
            isTouch: true
        };
    }
    else if (mouseAndPointerRegExp.test(e.type)) {
        var mouseOrPointerEvent = e;
        return {
            pageX: mouseOrPointerEvent.pageX,
            pageY: mouseOrPointerEvent.pageY,
            clientX: mouseOrPointerEvent.clientX,
            clientY: mouseOrPointerEvent.clientY,
            offsetX: mouseOrPointerEvent.offsetX,
            offsetY: mouseOrPointerEvent.offsetY,
            type: mouseOrPointerEvent.type,
            ctrlKey: mouseOrPointerEvent.ctrlKey,
            shiftKey: mouseOrPointerEvent.shiftKey,
            altKey: mouseOrPointerEvent.altKey,
            originalEvent: mouseOrPointerEvent,
            isTouch: false
        };
    }
    else {
        throw new InvalidArgumentError("Not allowed event");
    }
}
var Draggable = (function () {
    function Draggable(_a) {
        var _b = _a.press, press = _b === void 0 ? noop : _b, _c = _a.drag, drag = _c === void 0 ? noop : _c, _d = _a.release, release = _d === void 0 ? noop : _d, _e = _a.mouseOnly, mouseOnly = _e === void 0 ? true : _e;
        var _this = this;
        this._pressHandler = proxy(normalizeEvent, press);
        this._dragHandler = proxy(normalizeEvent, drag);
        this._releaseHandler = proxy(normalizeEvent, release);
        this._ignoreMouse = false;
        this._mouseOnly = mouseOnly;
        this._touchstart = function (e) { if (e.touches.length === 1) {
            _this._pressHandler(e);
        } };
        this._touchmove = function (e) { if (e.touches.length === 1) {
            _this._dragHandler(e);
        } };
        this._touchend = function (e) {
            if (e.touches.length === 0 && e.changedTouches.length === 1) {
                _this._releaseHandler();
                _this._ignoreMouse = true;
                setTimeout(_this._restoremouse, IGNORE_MOUSE_TIMEOUT);
            }
            ;
        };
        this._restoremouse = function () { _this._ignoreMouse = false; };
        this._mousedown = function (e) {
            var which = e.which;
            if ((which && which > 1) || _this._ignoreMouse === true) {
                return;
            }
            ;
            bind(_this.document, "mousemove", _this._mousemove);
            bind(_this.document, "mouseup", _this._mouseup);
            _this._pressHandler(e);
        };
        this._mousemove = function (e) { return _this._dragHandler(e); };
        this._mouseup = function (e) {
            unbind(_this.document, "mousemove", _this._mousemove);
            unbind(_this.document, "mouseup", _this._mouseup);
            _this._releaseHandler(e);
        };
        this._pointerdown = function (e) {
            if (e.isPrimary && e.button === 0) {
                bind(_this.document, "pointermove", _this._pointermove);
                bind(_this.document, "pointerup", _this._pointerup);
                bind(_this.document, "pointercancel", _this._pointerup);
                bind(_this.document, "contextmenu", preventDefault);
                _this._pressHandler(e);
            }
            ;
        };
        this._pointermove = function (e) {
            if (e.isPrimary) {
                _this._dragHandler(e);
            }
            ;
        };
        this._pointerup = function (e) {
            if (e.isPrimary) {
                unbind(_this.document, "pointermove", _this._pointermove);
                unbind(_this.document, "pointerup", _this._pointerup);
                unbind(_this.document, "pointercancel", _this._pointerup);
                unbind(_this.document, "contextmenu", preventDefault);
                _this._releaseHandler(e);
            }
        };
    }
    Draggable.canSupportPointerEvent = function () {
        return (typeof (window === null || window === void 0 ? void 0 : window.PointerEvent) !== 'undefined') ? true : false;
    };
    Draggable.prototype._canUsePointers = function () {
        return !this._mouseOnly && Draggable.canSupportPointerEvent();
    };
    Draggable.prototype._bind = function () {
        var element = this._element;
        if (this._canUsePointers()) {
            bind(element, "pointerdown", this._pointerdown);
            return;
        }
        bind(element, "mousedown", this._mousedown);
        if (!this._mouseOnly) {
            bind(element, "touchstart", this._touchstart);
            bind(element, "touchmove", this._touchmove);
            bind(element, "touchend", this._touchend);
        }
    };
    Draggable.prototype._unbind = function () {
        var element = this._element;
        if (this._canUsePointers()) {
            unbind(element, "pointerdown", this._pointerdown);
            unbind(this.document, "pointermove", this._pointermove);
            unbind(this.document, "pointerup", this._pointerup);
            unbind(this.document, "contextmenu", preventDefault);
            unbind(this.document, "pointercancel", this._pointerup);
            return;
        }
        unbind(element, "mousedown", this._mousedown);
        if (!this._mouseOnly) {
            unbind(element, "touchstart", this._touchstart);
            unbind(element, "touchmove", this._touchmove);
            unbind(element, "touchend", this._touchend);
        }
    };
    Object.defineProperty(Draggable.prototype, "document", {
        get: function () {
            return this._element ? this._element.ownerDocument : document;
        },
        enumerable: false,
        configurable: true
    });
    Draggable.prototype.bindTo = function (_element) {
        if (_element == this._element) {
            return;
        }
        if (this._element) {
            this._unbind();
        }
        this._element = _element;
        this._bind();
    };
    Draggable.prototype.update = function (_a) {
        var _b = _a.press, press = _b === void 0 ? noop : _b, _c = _a.drag, drag = _c === void 0 ? noop : _c, _d = _a.release, release = _d === void 0 ? noop : _d, _e = _a.mouseOnly, mouseOnly = _e === void 0 ? false : _e;
        this._pressHandler = proxy(normalizeEvent, press);
        this._dragHandler = proxy(normalizeEvent, drag);
        this._releaseHandler = proxy(normalizeEvent, release);
        this._mouseOnly = mouseOnly;
    };
    Draggable.prototype.destroy = function () {
        this._unbind();
        this._element = null;
    };
    return Draggable;
}());
exports.Draggable = Draggable;
