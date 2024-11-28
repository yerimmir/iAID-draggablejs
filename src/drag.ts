const proxy = (a: (arg0: any) => any, b: (arg0: any) => any) => (e: any) => b(a(e));
// bind(이벤트 영역, "이벤트", 이벤트함수)
const bind = (el: { addEventListener: (arg0: any, arg1: any) => any; }, event: any, callback: any) =>
    el.addEventListener && el.addEventListener(event, callback);
// unbind(이벤트 영역, "이벤트", 이벤트함수)
const unbind = (el: { removeEventListener: (arg0: any, arg1: any) => any; }, event: any, callback: any) =>
    el && el.removeEventListener && el.removeEventListener(event, callback);
const noop = () => { /* empty */ };
const preventDefault = (e: { preventDefault: () => any; }) => e.preventDefault();
const touchRegExp = /touch/;
const mouseAndPointerRegExp = /mouse|pointer/;
const IGNORE_MOUSE_TIMEOUT = 2000;
class InvalidArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
function normalizeEvent(e: MouseEvent | PointerEvent | TouchEvent) {
    console.log(touchRegExp.test(e.type));
    // 터치이벤트 여부 확인 후 return
    // if (touchRegExp.test(e.type) && e instanceof TouchEvent) {
    if (touchRegExp.test(e.type)) {
        const touchEvent = e as TouchEvent
        return {
            pageX: touchEvent.changedTouches[0].pageX,
            pageY: touchEvent.changedTouches[0].pageY,
            clientX: touchEvent.changedTouches[0].clientX,
            clientY: touchEvent.changedTouches[0].clientY,
            type: e.type,
            originalEvent: touchEvent,
            isTouch: true
        }
    } else if (mouseAndPointerRegExp.test(e.type)) {
        const mouseOrPointerEvent = e as MouseEvent | PointerEvent
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
        }
    } else {
        throw new InvalidArgumentError("Not allowed event")
    }
}
export class Draggable {
    constructor({ press = noop, drag = noop, release = noop, mouseOnly = true }) {
        this._pressHandler = proxy(normalizeEvent, press);
        this._dragHandler = proxy(normalizeEvent, drag);
        this._releaseHandler = proxy(normalizeEvent, release);
        this._ignoreMouse = false;
        this._mouseOnly = mouseOnly;

        // touch event는 무조건 눌러야 move가 가능하므로, 누르기, move 인식이 mouse와는 달라서 바로 적용해줘도 기계가 알아서 인식
        this._touchstart = (e) => { if (e.touches.length === 1) { this._pressHandler(e) } };
        this._touchmove = (e) => { if (e.touches.length === 1) { this._dragHandler(e) } };
        this._touchend = (e) => {
            if (e.touches.length === 0 && e.changedTouches.length === 1) {
                this._releaseHandler();
                this._ignoreMouse = true;
                setTimeout(this._restoremouse, IGNORE_MOUSE_TIMEOUT);

            };
        }
        this._restoremouse = () => { this._ignoreMouse = false }
        // mouse는 move가 누르지 않아도 일어나기 때문에 눌러서 드래그하는 이벤트는 따로 처리해주어야 함(touch와 코드 구성이 다른 이유)
        this._mousedown = (e) => {
            const { which } = e
            if ((which && which > 1) || this._ignoreMouse === true) {
                return;
            };
            bind(this.document, "mousemove", this._mousemove);
            bind(this.document, "mouseup", this._mouseup);
            this._pressHandler(e);
        };
        this._mousemove = (e) => this._dragHandler(e);
        this._mouseup = (e) => {
            unbind(this.document, "mousemove", this._mousemove);
            unbind(this.document, "mouseup", this._mouseup);
            this._releaseHandler(e);
        };
        this._pointerdown = (e) => {
            if (e.isPrimary && e.button === 0) { // isPrimary : 이벤트를 생성한 포인터 장치가 기본 PointerEvent인지 여부(return true/false)
                bind(this.document, "pointermove", this._pointermove);
                bind(this.document, "pointerup", this._pointerup);
                bind(this.document, "pointercancel", this._pointerup);
                bind(this.document, "contextmenu", preventDefault);

                this._pressHandler(e);
            };
        };
        this._pointermove = (e) => {
            if (e.isPrimary) {
                this._dragHandler(e);
            };
        };
        this._pointerup = (e) => {
            if (e.isPrimary) {
                unbind(this.document, "pointermove", this._pointermove);
                unbind(this.document, "pointerup", this._pointerup);
                unbind(this.document, "pointercancel", this._pointerup);
                unbind(this.document, "contextmenu", preventDefault);

                this._releaseHandler(e);
            }
        };
    }


    // window.PointerEvent가 true면 true 출력
    static canSupportPointerEvent(): Boolean {
        return (typeof window?.PointerEvent !== 'undefined') ? true : false;
    }
    // mouseOnly가 false면 Poiinterevent인지 확인
    private _canUsePointers(): Boolean {


        //if (!this._mouseOnly)
        //    return Draggable.canSupportPointerEvent();

        return !this._mouseOnly && Draggable.canSupportPointerEvent()
    }
    // 리스너 전체 바인딩
    private _bind(): void {
        const element = this._element;

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

    }
    // 리스너 전체 해제
    private _unbind(): void {
        const element = this._element;

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
    }
    // 영역 받아오기, this._element가 없으면 전체 영역(document 문서)이 return
    get document(): any {
        return this._element ? this._element.ownerDocument : document;
    }
    // DOMElement를 파라미터로 받아서, 이벤트 리스너가 적용될 영역 = DOMElement가 되도록하는 함수
    bindTo(_element): void {
        if (_element == this._element) {
            return;
        }

        if (this._element) {
            this._unbind();
        }
        this._element = _element;
        this._bind();
    }
    // event 발생 시 사용하는 함수 변경 (ex. 이벤트 발생시 사용하던 press 함수를 다른 함수로 변경)
    update({ press = noop, drag = noop, release = noop, mouseOnly = false }): void {
        this._pressHandler = proxy(normalizeEvent, press);
        this._dragHandler = proxy(normalizeEvent, drag);
        this._releaseHandler = proxy(normalizeEvent, release);
        this._mouseOnly = mouseOnly;
    }
    // event 발생 시 사용하는 함수를 없애고 싶을 때
    destroy() {
        this._unbind();
        this._element = null;
    }
    private _pressHandler: any;
    private _dragHandler: any;
    private _releaseHandler: any;
    private _mouseOnly: Boolean;
    private _ignoreMouse: any;
    private _touchstart: any;
    private _touchmove: any;
    private _touchend: any;
    private _restoremouse: any;
    private _mousedown: any;
    private _mousemove: any;
    private _mouseup: any;
    private _pointerdown: any;
    private _pointermove: any;
    private _pointerup: any;
    private _element: any; // 드래그 이벤트를 listening(확인하는) 할 DOM element...?
}