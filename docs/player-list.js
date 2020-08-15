import {
  component,
  html,
  useEffect,
  useState,
} from 'https://cdn.pika.dev/haunted@^4.7.0';

import './sortable-list.js';

import { db } from './firebase.js';

function PlayerList() {
  const [error, setError] = useState('');
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const playersRef = db.ref('players');
    const callback = playersRef.on(
      'value',
      (snapshot) => {
        console.log('players', snapshot.val().filter(Boolean));
        // TODO: This has no effect if you reorder then update the server ???
        setPlayers(snapshot.val().filter(Boolean));
      },
      setError,
    );
    return function stopEffect() {
      playersRef.off('value', callback);
    };
  }, []);

  function handleSort(event) {
    console.log('sorting...', event.fromIndex);
  }

  return html`
    ${styles}
    ${error}
    <ol
        is="catchphrase-sortable-list"
        @sort=${handleSort}>
      ${players.map((player) => html`
        <li>${player.name}</li>
      `)}
    </ol>
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
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
