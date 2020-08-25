import {
  component,
  html,
  useCallback,
  useEffect,
  useState,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';
import _ from 'https://cdn.skypack.dev/lodash@^v4.17.20';

import './sortable-list.js';

import { db } from './firebase.js';
import { generateNickname } from './player.js';

function PlayerList() {
  const [error, setError] = useState('');
  const [players, setPlayers] = useState([]);
  const [localPlayers, setLocalPlayers] = useState([generateNickname()]);

  useEffect(() => console.log(localPlayers), [localPlayers]);

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

  function handleNameInput(event) {
    // Don't allow persisting an empty name (input value itself will be restored by blur handler)
    if (event.target.value) {
      const inputValues = Array.from(event.currentTarget.children)
        .map((nameInput) => nameInput.value.trim());
      setLocalPlayers(inputValues);
    }
  }

  function handleNameBlur(event) {
    if (!event.target.value) {
      // Replace last non-empty value
      const inputIndex = Array.from(event.currentTarget.children)
        .indexOf(event.target);
      event.target.value = localPlayers[inputIndex];
    }
  }

  function addLocalPlayer() {
    setLocalPlayers(localPlayers.concat(generateNickname()));
  }

  return html`
    ${styles}
    ${error}
    <!-- TODO: Use repeat() w/ unique key so player names don't get mixed up -->
    <div
        class="local-players"
        @input=${handleNameInput}
        @focusout=${handleNameBlur}>
      ${localPlayers.map((localPlayer) => html`
        <input type="text" .value=${localPlayer}>
      `)}
    </div>
    <button
        class="add-local-player-button"
        @click=${addLocalPlayer}>
      Add local player
    </button>
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
    .local-players {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    input {
      padding: 8px;
    }
    .add-local-player-button {
      margin-top: 8px;
    }
    ol {
      display: flex;
      flex-direction: column;
      gap: 8px;
      list-style-type: none;
      margin-top: 1rem;
      margin-bottom: 0;
      padding: 0;
    }
    li {
      background: hsl(200, 100%, 80%);
      cursor: grab;
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
