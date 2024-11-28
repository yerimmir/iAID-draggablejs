# DraggableJS
드래그 시퀀스 처리를 위한 웹 기반 크로스 플랫폼 라이브러리

## 목차
* [설치 방법](#설치-방법)
* [사용법](#사용법)
* [특징](#특징)
* [지원 브라우저](#지원-브라우저)

## 개요
Draggablejs는 Mouse/Pointer/Touch 입력에 대한 Drag sequence를 지원

## 설치 방법
- 라이브러리는 NPMJS iAID 계정에 등록된 Repository에 게시
``` bash
npm install --save '@iaid-o/draggablejs';
```

## 사용법
- Draggable class 생성자 인수로, Drag에 대한 press, drag, release 이벤트 핸들러 object 입력        
    ``` javascript
    // Draggable을 이용한 특정 div 바인딩
    import { Draggable } from '@iaid-o/draggablejs';

    let elementDiv = document.createElement('div');
    document.body.appendChild(el);

    let draggable = new Draggable(
        press: function (e) {
            console.log("pressed", e.pageX, e.pageY);
        },
        drag: function (e) {
            console.log("drag", e.pageX, e.pageY);
        },
        release: function (e) {
            console.log("release", e.pageX, e.pageY);
        }
    );
    draggable.bindTo(elementDiv);
    ``` 
- Draggable은 다른 DOM Element로 binding 가능 
        (이전 DOM Element에 binding된 Evnet Hanlder는 자동으로 binding 해제)
    ``` javascript
    // bindTo를 이용한 Draggable 대상 element 변경
    let anotherDiv = document.createElement('div');
    document.body.appendChild(el);

    draggable.bindTo(anotherDiv);
    ```
 - Draggable은 현재 binding된 DOM Element에 대한 참조를 유지하므로, 대상 DOM Element 제거 시 destroy() 메소드 호출을 통한 DOM Element 참조 해제 필요 
    ``` javascript
    // destory를 활용한 bind 해제
    draggable.destory();
    ```

## 특징
- Mouse, Pointer, Touch event 지원
- Multi pointer 입력 시, Primary pointer만 드래그 지원

## 지원 브라우저
- Goggle Chrome
- Firefox
- Safari(iOS)
- IE / Edge