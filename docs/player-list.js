import {
  component,
  html,
  useContext,
  useEffect,
  useState,
} from 'haunted';
import {
  repeat,
} from 'lit-html/directives/repeat.js'
import _ from 'lodash';

import {
  GameContext,
} from './game.js';
import {
  addNewPlayerToGame,
  generateNickname,
} from './player.js';
import {
  showPlayerRenameDialog,
} from './player-rename-dialog.js';
import { db } from './db.js';

import './sortable-list.js';

function PlayerList() {
  const { gameId, gameState } = useContext(GameContext);
  const [error, setError] = useState('');

  const orderedPlayers = _
    .chain(gameState.players)
    .map((value, key) => ({
      id: key,
      name: value.name,
      order: value.order,
    }))
    .sortBy((player) => player.order)
    .value();

  useEffect(() => {
    if (!gameId) {
      return;
    }

    // handleAddLocalPlayerButtonClick();
  }, [gameId]);

  function handleAddLocalPlayerButtonClick() {
    showPlayerRenameDialog({
      name: generateNickname(),
      setName: (name) => {
        const playerRef = addNewPlayerToGame({
          name,
          gameId,
        });
      },
    });
  }

  function handleSort(event) {
    if (!gameId) {
      throw new Error('Game ID missing');
    }

    const desiredIdOrder = event.target.sortable.toArray();
    const orderedUpdatePaths = desiredIdOrder.map((id) => `${id}/order`);
    const existingOrderValues = orderedPlayers.map((player) => player.order);
    const updates = _.zipObject(orderedUpdatePaths, existingOrderValues);
    // console.table(updates);

    db.ref('games')
      .child(gameId)
      .child('players')
      .update(updates);
  }

  function removePlayer(event) {
    const playerIdToRemove = event.target.closest('[data-id]').dataset.id;
    db.ref('games')
      .child(gameId)
      .child('players')
      .child(playerIdToRemove)
      .remove();
  }

  return html`
    ${styles}
    ${error}
    <button
        class="add-local-player-button"
        @click=${handleAddLocalPlayerButtonClick}>
      Add local player
    </button>
    <ol
        is="catchphrase-sortable-list"
        @sort=${handleSort}>
      ${repeat(orderedPlayers, (player) => player.id, (player) => html`
        <li data-id="${player.id}">
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
