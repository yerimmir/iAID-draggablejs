import { Draggable } from '../../src/draggable'
import * as utils from './utils';
import { assert } from 'chai';
import sinon from "sinon"

const press = () => {
  console.log('press event is occured');
};

const drag = () => {
  console.log('drag event is occured');
}

const release = () => {
  console.log('release event is occured');
}

const canSupportPointerFn = Draggable.canSupportPointerEvent;

const mouseOnly = true;
let draggable = new Draggable({});

function eventNotificationHandler(e: MouseEvent | TouchEvent | PointerEvent) {
  console.log(`event ${e.type} is occured`);
  draggable.update({ press, drag, release, mouseOnly });
  draggable.bindTo(addDiv);
  draggable.destroy();
}

const addDiv = utils.addElement();
const el = document.createElement("div");
el.id = "el";
// const handler = jasmine.createSpy("onPress"); // jasmine.createSpy() : 테스트하기 곤란한 컴포넌트를 대체해 테스트, 내부적으로 기록을 남기는 추가기능, 특정 메소드가 호출되었는지 등의 상황을 감시
var handler = sinon.spy();

// el 태그 초기화
describe("Mouse test", () => {
  beforeEach(() => { // beforeEach() : 모든 테스트는 자신이 실행되기 전에 이 작업을 수행 
    document.body.appendChild(el);
    Draggable.canSupportPointerEvent = () => false; // pointer event가 아님을 표시
  });
  afterEach(() => { // afterEach() : 개별 테스트 케이스가 실행된 이후 처리하는 메소드
    draggable && draggable.destroy();
    document.body.removeChild(el);
    Draggable.canSupportPointerEvent = canSupportPointerFn;
  });
  describe("Press", () => { // describe(테스트 스위트명, specs) : 테스트 스위트(관련된 테스트들을 모은 것)와 specs 함수 내부에 테스트 코드 작성
    beforeEach(() => {
      draggable = new Draggable({
        // press: handler
        press: (e) => { console.log(`called ${e.type}`) },
        drag: (e) => { console.log(`called ${e.type}`) },
        release: (e) => { console.log(`called ${e.type}`) },
        mouseOnly: false
      });
      draggable.bindTo(el);
    });
    it('executes press with coordinates on mousedown', () => { // it(테스트 케이스명, 테스트 코드) : specs 내의 개별 테스트 코드 
      utils.mousedown(el, 100, 200, 0);
    });
    it('executes move with coordinates on mousemove', () => { // it(테스트 케이스명, 테스트 코드) : specs 내의 개별 테스트 코드 
      utils.mousemove(el, 10, 20, 0);
    });
    it('executes up with coordinates on mouseup', () => { // it(테스트 케이스명, 테스트 코드) : specs 내의 개별 테스트 코드 
      utils.mouseup(el, 10, 20, 0);
    });
  })
})

describe("Pointer test", () => {
  beforeEach(() => { // beforeEach() : 모든 테스트는 자신이 실행되기 전에 이 작업을 수행
    document.body.appendChild(el);
    Draggable.canSupportPointerEvent = () => true; // pointer event
  });
  afterEach(() => { // afterEach() : 개별 테스트 케이스가 실행된 이후 처리하는 메소드
    draggable && draggable.destroy();
    document.body.removeChild(el);
    Draggable.canSupportPointerEvent = canSupportPointerFn;
  });
  describe("Press", () => { // describe(테스트 스위트명, specs) : 테스트 스위트(관련된 테스트들을 모은 것)와 specs 함수 내부에 테스트 코드 작성
    beforeEach(() => {
      draggable = new Draggable({
        press: (e) => { console.log(`called ${e.type}`) },
        drag: (e) => { console.log(`called ${e.type}`) },
        release: (e) => { console.log(`called ${e.type}`) },
        mouseOnly: false
      });
      draggable.bindTo(el);
    });
    it('executes press with coordinates on pointerdown', () => { // it(테스트 케이스명, 테스트 코드) : specs 내의 개별 테스트 코드
      utils.pointerdown(el, 100, 200, true, 0);
    });
    it('executes press with coordinates on pointermove', () => { // it(테스트 케이스명, 테스트 코드) : specs 내의 개별 테스트 코드
      utils.pointermove(el, 10, 20, true, 0);
    });
    it('executes press with coordinates on pointerup', () => { // it(테스트 케이스명, 테스트 코드) : specs 내의 개별 테스트 코드
      utils.pointerup(el, 10, 20, true, 0);
    });
  })
})
describe("Touch test", () => {
  beforeEach(() => { // beforeEach() : 모든 테스트는 자신이 실행되기 전에 이 작업을 수행
    document.body.appendChild(el);
    Draggable.canSupportPointerEvent = () => false; // pointer event가 아님을 표시
  });
  afterEach(() => { // afterEach() : 개별 테스트 케이스가 실행된 이후 처리하는 메소드
    draggable && draggable.destroy();
    document.body.removeChild(el);
    Draggable.canSupportPointerEvent = canSupportPointerFn;
  });
  describe("Start", () => { // describe(테스트 스위트명, specs) : 테스트 스위트(관련된 테스트들을 모은 것)와 specs 함수 내부에 테스트 코드 작성
    beforeEach(() => {
      draggable = new Draggable({
        // press: handler
        press: (e) => { console.log(`called ${e.type}`) },
        drag: (e) => { console.log(`called ${e.type}`) },
        release: (e) => { console.log(`called ${e.type}`) },
        mouseOnly: false
      });
      draggable.bindTo(el);
    });
    it('executes press with coordinates on touchstart', () => { // it(테스트 케이스명, 테스트 코드) : specs 내의 개별 테스트 코드
      utils.touchstart(el, 100, 200);
    });
    it('executes press with coordinates on touchmove', () => { // it(테스트 케이스명, 테스트 코드) : specs 내의 개별 테스트 코드
      utils.touchmove(el, 10, 20);
    });
    it('executes press with coordinates on touchend', () => { // it(테스트 케이스명, 테스트 코드) : specs 내의 개별 테스트 코드
      utils.touchend(el, 10, 20);
    });
  })
})

describe('Test Util function aciton test - Mouse control', function () {
  // ======================================================
  it('mousedown test case', function () {
    utils.mouseDownHandler(addDiv, eventNotificationHandler);
    utils.mousedown(addDiv, 20, 10, 1);
  });
  it('mouseup test case', function () {
    utils.mouseUpHandler(addDiv, eventNotificationHandler);
    utils.mouseup(addDiv, 20, 10, 1);
  });
  it('mousemove test case', function () {
    utils.mouseMoveHandler(addDiv, eventNotificationHandler);
    utils.mousemove(addDiv, 20, 10, 1);
  });
});

describe('Test Util function aciton test - Pointer control', function () {
  // ======================================================
  it('pointerdown test case', function () {
    utils.pointerDownHandler(addDiv, eventNotificationHandler);
    utils.pointerdown(addDiv, 20, 10, true, 1);
  });
  it('pointerup test case', function () {
    utils.pointerUpHandler(addDiv, eventNotificationHandler);
    utils.pointerup(addDiv, 20, 10, true, 1);
  });
  it('pointermove test case', function () {
    utils.pointerMoveHandler(addDiv, eventNotificationHandler);
    utils.pointermove(addDiv, 20, 10, true, 1);
  });
});

describe('Test Util function aciton test - Touch control', function () {
  // ======================================================
  it('touchstart test case', function () {
    utils.touchStartHandler(addDiv, eventNotificationHandler);
    utils.touchstart(addDiv, 20, 10);
  });
  it('touchend test case', function () {
    utils.touchEndHandler(addDiv, eventNotificationHandler);
    utils.touchend(addDiv, 20, 10);
  });
  it('touchmove test case', function () {
    utils.touchMoveHandler(addDiv, eventNotificationHandler);
    utils.touchmove(addDiv, 20, 10);
  });
});