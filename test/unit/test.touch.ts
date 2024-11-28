import { Draggable } from '../../src/draggable';
import * as utils from './utils';
import { assert } from 'chai';
import sinon from 'sinon';

describe('Test Util function aciton test - Touch control', function () {
    let el;
    let anotherEl;
    let

        draggable;
    let handler;
    let dragHandler;
    let releaseHandler;
    beforeEach(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        Draggable.canSupportPointerEvent = () => false;
    });
    afterEach(() => {
        draggable && draggable.destroy();
        document.body.removeChild(el);
        let canSupportPointerFn = Draggable.canSupportPointerEvent;
        Draggable.canSupportPointerEvent = canSupportPointerFn;
    });
    describe('Press', () => {
        beforeEach(() => {
            handler = sinon.spy(); // spy 만들기
            draggable = new Draggable({
                press: handler, // press event 발생 시 handler 호출 (spy가 event를 parameter로 받아서 실행)
                mouseOnly: false
            });
            draggable.bindTo(el);
        });
        it('executes press with coordinates on touchstart', () => {
            utils.touchstart(el, 100, 200);
            const args = handler.lastCall.args[0];
            assert.equal(args.pageX, 100);
            assert.equal(args.pageY, 200);
        });
        it('isTouch is true for touch events', () => {
            utils.touchstart(el, 100, 200);
            const args = handler.lastCall.args[0];
            assert.isTrue(args.isTouch);
        });
        it('executes press with key modifiers on touchstart', () => {
            utils.touchstart(el, 100, 200);
            const args = handler.lastCall.args[0];
            assert.isFalse(args.shiftKey);
            assert.isFalse(args.ctrlKey);
            assert.isFalse(args.altKey);
        });
        it('executes press with originalEvent on touchstart', () => {
            utils.touchstart(el, 100, 200);
            const args = handler.lastCall.args[0];
            assert.isTrue(args.originalEvent instanceof TouchEvent);
        });
    })
    describe('Drag', () => {
        beforeEach(() => {
            anotherEl = document.createElement('div');
            handler = sinon.spy(); // spy 만들기
            dragHandler = sinon.spy();
            draggable = new Draggable({
                press: handler, // press event 발생 시 handler 호출 (spy가 event를 parameter로 받아서 실행)
                drag: dragHandler,
                release: handler,
                mouseOnly: false
            });
            draggable.bindTo(el);
        });
        it("Drag is worked normally out of target element", () => {
            utils.touchstart(el, 100, 200);
            utils.touchmove(anotherEl, 10, 10);
            utils.touchend(anotherEl, 10, 10);
            assert.isTrue(handler.called);
        });
        it("Drag is worked normally in target element", () => {
            // touchend 했을 때 
            utils.touchstart(el, 100, 200);
            utils.touchmove(el, 10, 10);
            utils.touchend(el, 10, 10);
            assert.isTrue(handler.called);
        });
        it("Drag is worked normally in target element", () => {
            // mousedrag한 상태에서 좌표 값 출력
            utils.touchstart(el, 100, 200);
            utils.touchmove(el, 20, 20);
            const args = dragHandler.lastCall.args[0]; // hanlder가 마지막으로 호출됐을 때의 args의 0번째 
            assert.equal(args.pageX, 20);
            assert.equal(args.pageY, 20);
            assert.equal(args.clientX, 20);
            assert.equal(args.clientY, 20);
        });
        it("Function destrory works nomally", () => {
            draggable.destroy();
            utils.touchstart(el, 100, 200);
            utils.touchmove(el, 20, 20);
            assert.isFalse(handler.called);
        });
        it('executes press with key modifiers on touchstart', () => {
            utils.touchstart(el, 100, 200);
            utils.touchmove(el, 20, 20);
            const args = dragHandler.lastCall.args[0];
            assert.isFalse(args.shiftKey);
            assert.isFalse(args.ctrlKey);
            assert.isFalse(args.altKey);
        });
    })
    describe('Release', () => {
        beforeEach(() => {
            handler = sinon.spy(); // spy 만들기
            dragHandler = sinon.spy();
            releaseHandler = sinon.spy();
            draggable = new Draggable({
                press: handler, // press event 발생 시 handler 호출 (spy가 event를 parameter로 받아서 실행)
                drag: dragHandler,
                release: releaseHandler,
                mouseOnly: false
            });
            draggable.bindTo(el);
        });
        it("executes release with coordinates on touchend", () => {
            utils.touchstart(el, 100, 200);
            utils.touchend(el, 100, 200);
            assert.isTrue(releaseHandler.called);
        })
    })
})