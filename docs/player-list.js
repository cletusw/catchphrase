import {
  component,
  html,
  useContext,
  useEffect,
  useState,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';
// import _ from 'https://cdn.skypack.dev/lodash@^v4.17.20';

import {
  GameContext,
} from './game.js';
import {
  addNewPlayerToGame,
} from './player.js';
import {
  showPlayerRenameDialog,
} from './player-rename-dialog.js';
import { db } from './firebase.js';

import './sortable-list.js';

function PlayerList() {
  const { game } = useContext(GameContext);
  const [error, setError] = useState('');
  const [players, setPlayers] = useState([]);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    if (game.id) {
      const playersRef = db.ref('games')
          .child(game.id)
          .child('players')
          // TODO: Order by some child `order` value I create
          .orderByValue();
      const callback = playersRef.on(
        'value',
        (snapshot) => {
          const orderedPlayers = [];
          snapshot.forEach((child) => {
            orderedPlayers.push({
              ref: child.ref,
              name: child.val(),
            });
          })
          setPlayers(orderedPlayers);
        },
        setError,
      );
      return function stopEffect() {
        playersRef.off('value', callback);
      };
    }
  }, [game]);

  useEffect(() => {
    // TODO: validate?
    if (game.id) {
      // TODO: Open new local player dialog
    }
  }, [game]);

  function handleSort(event) {
    console.log('sorting...', event.fromIndex);
  }

  function handleNewPlayerNameInput(event) {
    const trimmedValue = event.target.value.trim();
    // Don't allow persisting an empty name and ignore leading/trailing whitespace
    // (input value itself will be synchronized during blur handler)
    if (trimmedValue && trimmedValue !== newPlayerName) {
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

  function removePlayer(event) {
    console.log('TODO: remove player');
  }

  function handleAddLocalPlayerButtonClick() {
    // const playerRef = addNewPlayerToGame(game.id);

    // setIsAddingPlayer(true);

    showPlayerRenameDialog({ name: 'abc' });
  };

  function handleSubmit(event) {
    event.preventDefault();

    const newPlayerNameInput = event.target.elements.newPlayerName;
  }

  // @input=${handleNameInput}
  // @focusout=${handleNameBlur}>
  return html`
    ${styles}
    ${error}
    <button
        class="add-local-player-button"
        @click=${handleAddLocalPlayerButtonClick}>
      Add local player
    </button>
    <form
        class="add-local-player-name-form${isAddingPlayer ? ' is-adding-player' : ''}"
        @submit=${handleSubmit}>
      <input
          type="text"
          name="newPlayerName"
          required
          .value=${newPlayerName}
          @input=${handleNewPlayerNameInput}>
      <button type="submit">Join</button>
    </form>
    <ol
        is="catchphrase-sortable-list"
        @sort=${handleSort}>
      ${players.map((player) => html`
        <li>
          <span class="name">${player.name}</span>
          <button @click=${removePlayer}>×</button>
        </li>
      `)}
    </ol>
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
    input {
      padding: 8px;
    }
    .add-local-player-button {
      margin-top: 8px;
    }
    .add-local-player-name-form {
      display: none;
      gap: 8px;
    }
    .add-local-player-name-form.is-adding-player {
      display: flex;
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
      display: flex;
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
    .name {
      flex: 1;
    }
  </style>
`;

customElements.define('catchphrase-player-list', component(PlayerList));
