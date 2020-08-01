import {
  component,
  html,
  useEffect,
  useState,
} from 'https://cdn.pika.dev/haunted@^4.7.0';

import './sortable-list.js';

function PlayerList() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    setPlayers([
      { displayName: 'Bob' },
      { displayName: 'Alice' },
      { displayName: 'Darla' },
    ]);
  }, []);

  function handleSort(event) {
    console.log('sorting...', event.fromIndex);
  }

  return html`
    ${styles}
    <ol
        is="catchphrase-sortable-list"
        @sort=${handleSort}>
      ${players.map((player) => html`
        <li>${player.displayName}</li>
      `)}
    </ol>
  `;
}

const styles = html`
  <style>
    ol {
      list-style-type: none;
      padding: 0;
    }
    li {
      background: hsl(200, 100%, 80%);
      cursor: grab;
      margin: 4px;
      padding: 8px;
      user-select: none;
    }
    ol.dragging,
    ol.dragging li {
      cursor: grabbing;
    }
    .sortable-ghost {
      opacity: 0.2;
    }
    .sortable-drag {
      opacity: 0.9 !important;
    }
  </style>
`;

customElements.define('catchphrase-player-list', component(PlayerList));
