export declare class Draggable {
    constructor({ press, drag, release, mouseOnly }: {
        press?: () => void;
        drag?: () => void;
        release?: () => void;
        mouseOnly?: boolean;
    });
    static canSupportPointerEvent(): Boolean;
    private _canUsePointers;
    private _bind;
    private _unbind;
    get document(): any;
    bindTo(_element: any): void;
    update({ press, drag, release, mouseOnly }: {
        press?: () => void;
        drag?: () => void;
        release?: () => void;
        mouseOnly?: boolean;
    }): void;
    destroy(): void;
    private _pressHandler;
    private _dragHandler;
    private _releaseHandler;
    private _mouseOnly;
    private _ignoreMouse;
    private _touchstart;
    private _touchmove;
    private _touchend;
    private _restoremouse;
    private _mousedown;
    private _mousemove;
    private _mouseup;
    private _pointerdown;
    private _pointermove;
    private _pointerup;
    private _element;
}
