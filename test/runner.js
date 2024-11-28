mocha.ui('tdd');
mocha.setup('bdd');
// Chai 라이브러리, 어썰션 사용
var assert = chai.assert,
  DCMViewJSContainer = document.getElementById('dcmviewjs-container'),
  origAssertEqual = assert.equal,
  origAssert = assert,
  origNotEqual = assert.notEqual,
  origDeepEqual = assert.deepEqual,
  assertionCount = 0,
  assertions = document.createElement('em');

window.requestAnimFrame = (function(callback) {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 30);
    }
  );
})();

// Assertion 발생시 페이지 헤더에 Assertion 개수 반영
// 하도록 기존 Assertion 함수 변경
function init() {
  // assert extenders so that we can count assertions
  assert = function() {
    origAssert.apply(this, arguments);
    assertions.innerHTML = ++assertionCount;
  };
  assert.equal = function() {
    origAssertEqual.apply(this, arguments);
    assertions.innerHTML = ++assertionCount;
  };
  assert.notEqual = function() {
    origNotEqual.apply(this, arguments);
    assertions.innerHTML = ++assertionCount;
  };

  assert.deepEqual = function() {
    origDeepEqual.apply(this, arguments);
    assertions.innerHTML = ++assertionCount;
  };

  window.onload = function() {
    var mochaStats = document.getElementById('mocha-stats');

    if (mochaStats) {
      var li = document.createElement('li');
      var anchor = document.createElement('a');

      anchor.href = '#';
      anchor.innerHTML = 'assertions:';
      assertions.innerHTML = 0;

      li.appendChild(anchor);
      li.appendChild(assertions);
      mochaStats.appendChild(li);
    }
  };

  //addStats();
}

DCMViewJS.enableTrace = true;
DCMViewJS.showWarnings = true;

function createCanvas() {
  var canvas = document.createElement('canvas');
  var ratio = DCMViewJS.pixelRatio || window.devicePixelRatio;
  canvas.width = 578 * ratio;
  canvas.height = 200 * ratio;
  canvas.getContext('2d').scale(ratio, ratio);
  canvas.ratio = ratio;
  return canvas;
}
function get(element, content) {
  element = document.createElement(element);
  if (element && content) {
    element.innerHTML = content;
  }
  return element;
}
function compareCanvases(canvas1, canvas2, tol) {
  // don't test in PhantomJS as it use old chrome engine
  // it it has opacity + shadow bug
  var equal = imagediff.equal(canvas1, canvas2, tol);
  if (!equal) {
    var div = get('div'),
      b = get('div', '<div>Expected:</div>'),
      c = get('div', '<div>Diff:</div>'),
      diff = imagediff.diff(canvas1, canvas2),
      diffCanvas = get('canvas'),
      context;

    diffCanvas.height = diff.height;
    diffCanvas.width = diff.width;

    div.style.overflow = 'hidden';
    b.style.float = 'left';
    c.style.float = 'left';

    canvas2.style.position = '';
    canvas2.style.display = '';

    context = diffCanvas.getContext('2d');
    context.putImageData(diff, 0, 0);

    b.appendChild(canvas2);
    c.appendChild(diffCanvas);

    var base64 = diffCanvas.toDataURL();
    console.error('Diff image:');
    console.error(base64);

    div.appendChild(b);
    div.appendChild(c);
    DCMViewJSContainer.appendChild(div);
  }
  assert.equal(
    equal,
    true,
    'Result from DCMViewJS is different with canvas result'
  );
}
function compareLayerAndCanvas(layer, canvas, tol) {
  compareCanvases(layer.getCanvas()._canvas, canvas, tol);
}
function cloneAndCompareLayer(layer, tol) {
  var layer2 = layer.clone();
  layer.getStage().add(layer2);
  layer2.hide();
  compareLayers(layer, layer2, tol);
}
function compareLayers(layer1, layer2, tol) {
  compareLayerAndCanvas(layer1, layer2.getCanvas()._canvas, tol);
}

function addStage(attrs) {
  var container = document.createElement('div');
  //console.log(DCMViewJS.Utils.Mixin.assign);
  let { assign } = DCMViewJS.Utils.Mixin;
  const props = assign(
    {
      container: container,
      width: 578,
      height: 200
    },
    attrs
  );

  var stage = new DCMViewJS.Stage(props);

  DCMViewJSContainer.appendChild(container);

  return stage;
}

function addContainer() {
  var container = document.createElement('div');

  DCMViewJSContainer.appendChild(container);

  return container;
}

function showCanvas(canvas) {
  canvas.style.position = 'relative';

  DCMViewJSContainer.appendChild(canvas);
}

function showHit(layer) {
  var canvas = layer.hitCanvas._canvas;
  canvas.style.position = 'relative';

  DCMViewJSContainer.appendChild(canvas);
}

DCMViewJS.Stage.prototype.simulateMouseMove = function(pos) {
  var top = this.content.getBoundingClientRect().top;

  var evt = {
    clientX: pos.x,
    clientY: pos.y + top,
    button: pos.button || 0
  };

  this._mousemove(evt);
  DCMViewJS.DD._drag(evt);
};

DCMViewJS.Stage.prototype.simulateMouseDown = function(pos) {
  var top = this.content.getBoundingClientRect().top;

  this._mousedown({
    clientX: pos.x,
    clientY: pos.y + top,
    button: pos.button || 0
  });
};

DCMViewJS.Stage.prototype.simulateMouseUp = function(pos) {
  var top = this.content.getBoundingClientRect().top;

  var evt = {
    clientX: pos.x,
    clientY: pos.y + top,
    button: pos.button || 0
  };

  DCMViewJS.DD._endDragBefore(evt);
  this._mouseup(evt);
  DCMViewJS.DD._endDragAfter(evt);
};

DCMViewJS.Stage.prototype.simulateTouchStart = function(pos, changed) {
  var top = this.content.getBoundingClientRect().top;

  var touches;
  var changedTouches;
  if (Array.isArray(pos)) {
    touches = pos.map(function(touch) {
      return {
        identifier: touch.id,
        clientX: touch.x,
        clientY: touch.y + top
      };
    });
    changedTouches = (changed || pos).map(function(touch) {
      return {
        identifier: touch.id,
        clientX: touch.x,
        clientY: touch.y + top
      };
    });
  } else {
    changedTouches = touches = [
      {
        clientX: pos.x,
        clientY: pos.y + top,
        id: 0
      }
    ];
  }
  var evt = {
    touches: touches,
    changedTouches: changedTouches
  };

  this._touchstart(evt);
};

DCMViewJS.Stage.prototype.simulateTouchMove = function(pos, changed) {
  var top = this.content.getBoundingClientRect().top;

  var touches;
  var changedTouches;
  if (Array.isArray(pos)) {
    touches = pos.map(function(touch) {
      return {
        identifier: touch.id,
        clientX: touch.x,
        clientY: touch.y + top
      };
    });
    changedTouches = (changed || pos).map(function(touch) {
      return {
        identifier: touch.id,
        clientX: touch.x,
        clientY: touch.y + top
      };
    });
  } else {
    changedTouches = touches = [
      {
        clientX: pos.x,
        clientY: pos.y + top,
        id: 0
      }
    ];
  }
  var evt = {
    touches: touches,
    changedTouches: changedTouches
  };

  this._touchmove(evt);
  DCMViewJS.DD._drag(evt);
};

DCMViewJS.Stage.prototype.simulateTouchEnd = function(pos, changed) {
  var top = this.content.getBoundingClientRect().top;

  var touches;
  var changedTouches;
  if (Array.isArray(pos)) {
    touches = pos.map(function(touch) {
      return {
        identifier: touch.id,
        clientX: touch.x,
        clientY: touch.y + top
      };
    });
    changedTouches = (changed || pos).map(function(touch) {
      return {
        identifier: touch.id,
        clientX: touch.x,
        clientY: touch.y + top
      };
    });
  } else {
    changedTouches = touches = [
      {
        clientX: pos.x,
        clientY: pos.y + top,
        id: 0
      }
    ];
  }
  var evt = {
    touches: touches,
    changedTouches: changedTouches
  };

  DCMViewJS.DD._endDragBefore(evt);
  this._touchend(evt);
  DCMViewJS.DD._endDragAfter(evt);
};

DCMViewJS.Stage.prototype.simulatePointerDown = function(pos) {
  var top = this.content.getBoundingClientRect().top;

  this._mousedown({
    clientX: pos.x,
    clientY: pos.y + top,
    button: pos.button || 0,
    pointerId: pos.pointerId || 1
  });
};

DCMViewJS.Stage.prototype.simulatePointerMove = function(pos) {
  var top = this.content.getBoundingClientRect().top;

  var evt = {
    clientX: pos.x,
    clientY: pos.y + top,
    button: pos.button || 0,
    pointerId: pos.pointerId || 1
  };

  this._mousemove(evt);
  DCMViewJS.DD._drag(evt);
};

DCMViewJS.Stage.prototype.simulatePointerUp = function(pos) {
  var top = this.content.getBoundingClientRect().top;

  var evt = {
    clientX: pos.x,
    clientY: pos.y + top,
    button: pos.button || 0,
    pointerId: pos.pointerId || 1
  };

  DCMViewJS.DD._endDragBefore(evt);
  this._mouseup(evt);
  DCMViewJS.DD._endDragAfter(evt);
};
