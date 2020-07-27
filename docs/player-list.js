import {
  component,
  html,
  useEffect,
  useState,
} from 'https://cdn.pika.dev/haunted@^4.7.0';

function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setPlayers([
      { displayName: 'Bob' },
      { displayName: 'Alice' },
      { displayName: 'Darla' },
    ]);
  }, []);

  function handleDragstart(event) {
    console.log(event);
    // event.dataTransfer.dropEffect = 'move';
  }

  function handleDragover(event) {
    console.log(event);

    // Have to preventDefault to allow drop
    event.preventDefault();
  }

  function handleDrop(event) {
    console.log(event);
  }

  return html`
    <style>
      ol {
        list-style-type: none;
        padding: 0;
      }
      li {
        cursor: grab;
      }
      /* TODO: on drag */
      li:active {
        cursor: grabbbing;
      }
      li:nth-of-type(even) {
        background: hsl(0, 100%, 80%);
      }
      li:nth-of-type(odd) {
        background: hsl(200, 100%, 80%);
      }
    </style>
    <ol
        @dragstart=${handleDragstart}
        @dragover=${handleDragover}
        @drop=${handleDrop}>
      ${players.map((player) => html`
        <li draggable="true">${player.displayName}</li>
      `)}
    </ol>
  `;
}

customElements.define('catchphrase-player-list', component(PlayerList));
