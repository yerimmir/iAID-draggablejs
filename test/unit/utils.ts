/*테스트 시에 사용할 DOMElement 생성 */
export function addElement(): HTMLElement {
    // create a new div element
    const addDiv: HTMLElement = document.createElement('div');
    // give it some content
    const addContent: Text = document.createTextNode("Hello everyone");
    // add the text node to the newly created div
    addDiv.appendChild(addContent);
    // set the id
    addDiv.id = "addDiv";
    // add a style to div
    addDiv.style.margin = "60px 50px";
    // addd the newly created element and its content into the DOM
    // const currentDiv = document.getElementById("mocha");
    // document.body.after(addDiv);

    return addDiv;
}

/* test case mouse */
const aMouseEvent = (type, x, y, button) =>
    new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        button: button
    });

/* test case pointer */
const aPointerEvent = (type, x, y, isPrimary = true, button = 0) =>
    new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        button: button,
        pointerId: 1,
        isPrimary: isPrimary,
        clientX: x,
        clientY: y,
        view: window
    });

/* test case touch */
const aTouch = (el, x, y, id) =>
    new Touch({
        identifier: id,
        target: el,
        pageX: x,
        pageY: y,
        clientX: x,
        clientY: y
    });

const aTouchEvent = (type, touches) =>
    new TouchEvent(type, {
        touches: (type === "touchend" ? [] : touches),
        changedTouches: touches
    });

/* event 실행 */
export function mousedown(element, x, y, button) {
    element.dispatchEvent(aMouseEvent("mousedown", x, y, button));
}

export function mouseup(element, x, y, button) {
    element.dispatchEvent(aMouseEvent("mouseup", x, y, button));
}

export function mousemove(element, x, y, button) {
    element.dispatchEvent(aMouseEvent("mousemove", x, y, button));
}

export function pointerdown(element, x, y, primary, button) {
    element.dispatchEvent(aPointerEvent("pointerdown", x, y, primary, button));
}

export function pointerup(element, x, y, primary, button) {
    element.dispatchEvent(aPointerEvent("pointerup", x, y, primary, button));
}

export function pointermove(element, x, y, primary, button) {
    element.dispatchEvent(aPointerEvent("pointermove", x, y, primary, button));
}

export function touchstart(element, x, y) {
    element.dispatchEvent(aTouchEvent("touchstart", [aTouch(element, x, y, 100)]));
}

export function touchend(element, x, y) {
    element.dispatchEvent(aTouchEvent("touchend", [aTouch(element, x, y, 100)]));
}

export function touchmove(element, x, y) {
    element.dispatchEvent(aTouchEvent("touchmove", [aTouch(element, x, y, 100)]));
}

type MouseEventCallback = (event: MouseEvent) => void
type PointerEventCallback = (event: PointerEvent) => void
type TouchEventCallback = (event: TouchEvent) => void


/* DOMElement에서 mousedown event 일어났을 때 mousedown eventhandler 연결해주는 함수 작성 */
export function mouseDownHandler(element: HTMLElement, handlerFunc: MouseEventCallback): void {
    // handlerFunc = (event) => {return event.type}
    // const type = handlerFunc(event);
    // console.log(type) 
    // function mouseDown() { console.log(`${type} is occured`) };
    element.addEventListener("mousedown", handlerFunc);
}

/* DOMElement에서 mouseup event 일어났을 때 mouseup eventhandler 연결해주는 함수 작성 */
export function mouseUpHandler(element: HTMLElement, handlerFunc: MouseEventCallback): void {
    element.addEventListener("mouseup", handlerFunc);
}

/* DOMElement에서 mousemove event 일어났을 때 mousemove eventhandler 연결해주는 함수 작성 */
export function mouseMoveHandler(element: HTMLElement, handlerFunc: MouseEventCallback): void {
    element.addEventListener("mousemove", handlerFunc);
}

export function pointerDownHandler(element: HTMLElement, handlerFunc: PointerEventCallback): void {
    element.addEventListener("pointerdown", handlerFunc);
}

export function pointerUpHandler(element: HTMLElement, handlerFunc: PointerEventCallback): void {
    element.addEventListener("pointerup", handlerFunc);
}

export function pointerMoveHandler(element: HTMLElement, handlerFunc: PointerEventCallback): void {
    element.addEventListener("pointermove", handlerFunc);
}

export function touchStartHandler(element: HTMLElement, handlerFunc: TouchEventCallback): void {
    element.addEventListener("touchstart", handlerFunc);
}

export function touchEndHandler(element: HTMLElement, handlerFunc: TouchEventCallback): void {
    element.addEventListener("touchend", handlerFunc);
}

export function touchMoveHandler(element: HTMLElement, handlerFunc: TouchEventCallback): void {
    element.addEventListener("touchmove", handlerFunc);
}
