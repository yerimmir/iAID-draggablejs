import { Draggable } from '../../src/draggable';
import * as utils from './utils';
import { assert } from 'chai';
import sinon from 'sinon';

describe('Test Util function aciton test - Mouse control', function () {
    let el;
    let anotherEl;
    let draggable;
    let handler;
    let dragHandler;
    let releaseHandler;
    beforeEach(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
    });
    afterEach(() => {
        draggable && draggable.destroy();
        document.body.removeChild(el);
    });
    describe('Press', () => {
        beforeEach(() => {
            handler = sinon.spy(); // spy 만들기
            draggable = new Draggable({
                press: handler // press event 발생 시 handler 호출 (spy가 event를 parameter로 받아서 실행)
            });
            draggable.bindTo(el);
        });
        it('executes press with coordinates on mousedown', () => {
            utils.mousedown(el, 20, 10, 0);
            const args = handler.lastCall.args[0]; // hanlder가 마지막으로 호출됐을 때의 args의 0번째 
            assert.equal(args.pageX, 20);
            assert.equal(args.pageY, 10);
        });
        it('isTouch is false for mouse events', () => {
            utils.mousedown(el, 20, 10, 0);
            const args = handler.lastCall.args[0];
            assert.isFalse(args.isTouch);
        });
        it('executes press with key modifiers on mousedown', () => {
            utils.mousedown(el, 100, 200, 0);
            const args = handler.lastCall.args[0];
            assert.isFalse(args.shiftKey);
            assert.isFalse(args.ctrlKey);
            assert.isFalse(args.altKey);
        });
        it('executes press with originalEvent on mousedown', () => {
            utils.mousedown(el, 100, 200, 0);
            const args = handler.lastCall.args[0];
            assert.isTrue(args.originalEvent instanceof MouseEvent);
        });
        it("press doesn't executed from right mousedown", () => {
            utils.mousedown(el, 100, 200, 2); // 2 : Secondary button pressed, usally the right button
            assert.isFalse(handler.called); // spy.called : true if the spy was called at least once
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
                release: handler
            });
            draggable.bindTo(el);
        });
        it("Drag is worked normally out of target element", () => {
            utils.mousedown(el, 100, 200, 0);
            utils.mousemove(anotherEl, 10, 10, 0);
            utils.mouseup(anotherEl, 10, 10, 0);
            assert.isTrue(handler.called);
        });
        it("Drag is worked normally in target element", () => {
            // mouseup 했을 때 
            utils.mousedown(el, 100, 200, 0);
            utils.mousemove(el, 10, 10, 0);
            utils.mouseup(el, 10, 10, 0);
            assert.isTrue(handler.called);
        });
        it("Drag is worked normally in target element", () => {
            // mousedrag한 상태에서 좌표 값 출력
            utils.mousedown(el, 100, 200, 0);
            utils.mousemove(el, 20, 20, 0);
            const args = dragHandler.lastCall.args[0]; // hanlder가 마지막으로 호출됐을 때의 args의 0번째 
            assert.equal(args.pageX, 20);
            assert.equal(args.pageY, 20);
            assert.equal(args.clientX, 20);
            assert.equal(args.clientY, 20);
        });
        it("Function destrory works nomally", () => {
            draggable.destroy();
            utils.mousedown(el, 100, 200, 0);
            utils.mousemove(el, 20, 20, 0);
            assert.isFalse(handler.called);
        });
        it("executes mousemove except mousedown", () =>{
            utils.mousemove(el, 20, 20, 0);
            assert.isFalse(handler.called);
        })
        it('executes press with key modifiers on mousedown', () => {
            utils.mousedown(el, 100, 200, 0);
            utils.mousemove(el, 20, 20, 0);
            const args = dragHandler.lastCall.args[0];
            assert.isFalse(args.shiftKey);
            assert.isFalse(args.ctrlKey);
            assert.isFalse(args.altKey);
        });
        it("execute drag on right button of mouse", () => {
            utils.mousedown(el, 100, 200, 2);
            utils.mousemove(el, 10, 20, 2);
            assert.isFalse(handler.called);
        })
        it("When mouse value is true, other event doesn't called ", () => {
            utils.touchstart(el, 100, 200);
            assert.isFalse(handler.called);
        })
    })
    describe('Release', () => {
        beforeEach(() => {
            handler = sinon.spy(); // spy 만들기
            dragHandler = sinon.spy();
            releaseHandler = sinon.spy(()=>{});
            draggable = new Draggable({
                press: handler, // press event 발생 시 handler 호출 (spy가 event를 parameter로 받아서 실행)
                drag: dragHandler,
                release: releaseHandler
            });
            draggable.bindTo(el);
        });
        it("executes release with coordinates on mouseup", () => {
            utils.mousedown(el, 100, 200, 0);
            utils.mouseup(el, 100, 200, 0);
            assert.isTrue(releaseHandler.called);
        })
    })
})