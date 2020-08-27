import {
  component,
  html,
  useContext,
  useEffect,
  useState,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';
import _ from 'https://cdn.skypack.dev/lodash@^v4.17.20';

import './sortable-list.js';

import {
  GameContext,
  addNewPlayerToGameIfNecessary,
} from './game.js';
import { db } from './firebase.js';

function PlayerList({
  localPlayers,
  setLocalPlayers,
}) {
  const { game } = useContext(GameContext);
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

  function handleNameInput(event) {
    const inputIndex = Array.from(event.currentTarget.children)
      .indexOf(event.target);
    const trimmedValue = event.target.value.trim();
    // Don't allow persisting an empty name and ignore leading/trailing whitespace
    // (input value itself will be synchronized during blur handler)
    if (trimmedValue && trimmedValue !== localPlayers[inputIndex].name) {
      localPlayers[inputIndex].ref.set(trimmedValue);
      setLocalPlayers(Object.assign([], localPlayers, {
        [inputIndex]: {
          ...localPlayers[inputIndex],
          name: trimmedValue,
        },
      }));
    }
  }

  function handleNameBlur(event) {
    if (!event.target.value.trim()) {
      // Replace last non-empty value
      const inputIndex = Array.from(event.currentTarget.children)
        .indexOf(event.target);
      event.target.value = localPlayers[inputIndex];
    }
    else if (event.target.value !== event.target.value.trim()) {
      event.target.value = event.target.value.trim();
    }
  }

  function addLocalPlayer() {
    addNewPlayerToGameIfNecessary(game.id, localPlayers, setLocalPlayers);
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
        <input type="text" .value=${localPlayer.name}>
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
