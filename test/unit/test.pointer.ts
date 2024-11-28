import { Draggable } from '../../src/draggable';
import * as utils from './utils';
import { assert } from 'chai';
import sinon from 'sinon';

const canSupportPointerFn = Draggable.canSupportPointerEvent;

describe('Test Util function aciton test - Pointer control', function () {
    let el;
    let anotherEl;
    let draggable;
    let handler;
    let dragHandler;
    let releaseHandler;
    beforeEach(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
        Draggable.canSupportPointerEvent = () => true;
    });
    afterEach(() => {
        draggable && draggable.destroy();
        document.body.removeChild(el);
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
        it('executes press with coordinates on pointerdown', () => {
            utils.pointerdown(el, 100, 200, true, 0);
            const args = handler.lastCall.args[0];
            assert.equal(args.pageX, 100);
            assert.equal(args.pageY, 200);
        });
        it('isTouch is false for pointer events', () => {
            utils.pointerdown(el, 100, 200, true, 0);
            const args = handler.lastCall.args[0];
            assert.isFalse(args.isTouch);
        });
        it('executes press with key modifiers on pointerdown', () => {
            utils.pointerdown(el, 100, 200, true, 0);
            const args = handler.lastCall.args[0];
            assert.isFalse(args.shiftKey);
            assert.isFalse(args.ctrlKey);
            assert.isFalse(args.altKey);
        });
        it('executes press with originalEvent on pointerdown', () => {
            utils.pointerdown(el, 100, 200, true, 0);
            const args = handler.lastCall.args[0];
            assert.isTrue(args.originalEvent instanceof PointerEvent);
        });
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
                utils.pointerdown(el, 100, 200, true, 0);
                utils.pointermove(anotherEl, 10, 10, true, 0);
                utils.pointerup(anotherEl, 10, 10, true, 0);
                assert.isTrue(handler.called);
            });
            it("Drag is worked normally in target element", () => {
                // pointerup 했을 때 
                utils.pointerdown(el, 100, 200, true, 0);
                utils.pointermove(el, 10, 10, true, 0);
                utils.pointerup(el, 10, 10, true, 0);
                assert.isTrue(handler.called);
            });
            it("Drag is worked normally in target element", () => {
                // drag한 상태에서 좌표 값 출력
                utils.pointerdown(el, 100, 200, true, 0);
                utils.pointermove(el, 20, 20, true, 0);
                const args = dragHandler.lastCall.args[0]; // hanlder가 마지막으로 호출됐을 때의 args의 0번째 
                assert.equal(args.pageX, 20);
                assert.equal(args.pageY, 20);
                assert.equal(args.clientX, 20);
                assert.equal(args.clientY, 20);
            });
            it("Function destrory works nomally", () => {
                draggable.destroy();
                utils.pointerdown(el, 100, 200, true, 0);
                utils.pointermove(el, 10, 10, true, 0);
                assert.isFalse(handler.called);
            });
            it("executes pointermove except pointerdown", () =>{
                utils.pointermove(el, 10, 10, true, 0);
                assert.isFalse(handler.called);
            })
            it('executes press with key modifiers on pointerdown', () => {
                utils.pointerdown(el, 100, 200, true, 0);
                utils.pointermove(el, 10, 10, true, 0);
                const args = dragHandler.lastCall.args[0];
                assert.isFalse(args.shiftKey);
                assert.isFalse(args.ctrlKey);
                assert.isFalse(args.altKey);
            });
            it("drag doesn't work when use multi pointers", () => {
                utils.pointerdown(el, 100, 200, true, 0); // 기본 포인터로 down 이벤트
                utils.pointerdown(el, 102, 202, false, 0); // 기본 포인터 아닐 때 down 이벤트
                assert.isFalse(handler.calledTwice);
                assert.isTrue(handler.calledOnce);
            });
        });
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
            it("executes release with coordinates on pointerup", () => {
                utils.pointerdown(el, 100, 200, true, 0);
                utils.pointerup(el, 100, 200, true, 0);
                assert.isTrue(releaseHandler.called);
            })
        })
    })
})