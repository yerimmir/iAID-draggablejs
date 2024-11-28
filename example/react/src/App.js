import "./App.css";
import { Draggable } from "@iaid-o/draggablejs";
import { useEffect } from "react";

const draggable = new Draggable({
  press: (e) => {
    console.log(e);
    const contentDiv = document.createElement('p');
    const content = document.createTextNode(`> state: ${e.type}   Position: (${e.pageX}, ${e.pageY})`);
    contentDiv.appendChild(content);
    document.getElementById("eventText").appendChild(contentDiv);
  },
  drag: (e) => {
    const contentDiv = document.createElement('p');
    const content = document.createTextNode(`> state: ${e.type}   Position: (${e.pageX}, ${e.pageY})`);
    contentDiv.appendChild(content);
    document.getElementById("eventText").appendChild(contentDiv);
  },
  release: (e) => {
    const contentDiv = document.createElement('p');
    const content = document.createTextNode(`> state: ${e.type}   Position: (${e.pageX}, ${e.pageY})`);
    contentDiv.appendChild(content);
    document.getElementById("eventText").appendChild(contentDiv);
  },
});

function App() {
  useEffect(() => {
    draggable.bindTo(document.getElementById("element"));
  })
  return (
    <div className="App">
      <div id="Drag">
      <div id="element">Drag Test</div>
      <div id="eventText"></div>
      </div>
    </div>
  );
}

export default App;
