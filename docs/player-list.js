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
  isLocalPlayer,
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

  // TODO: Implement renaming
  function joiningView() {
    return html`
      <button
          class="add-local-player-button"
          @click=${handleAddLocalPlayerButtonClick}>
        Add local player
      </button>
      <ol
          is="catchphrase-sortable-list"
          @sort=${handleSort}>
        ${repeat(orderedPlayers, (player) => player.id, (player) => html`
          <li
              class="${isLocalPlayer(player.id) ? 'local-player' : ''}"
              data-id="${player.id}">
            <span class="name">${player.name}</span>
            <button @click=${removePlayer}>×</button>
          </li>
        `)}
      </ol>
    `;
  }

  function startedView() {
    const currentPlayerIndex =
        orderedPlayers.findIndex((player) => player.id === gameState.currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % orderedPlayers.length;
    const currentPlayer = orderedPlayers[currentPlayerIndex];
    const nextPlayer = orderedPlayers[nextPlayerIndex];
    return html`
      <div class="current-player${isLocalPlayer(currentPlayer.id) ? ' local-player' : ''}">
        <span class="name">${currentPlayer.name}</span>
      </div>
      <div class="next-player${isLocalPlayer(currentPlayer.id) ? ' local-player' : ''}"">
        <span class="name">${nextPlayer.name}</span>
      </div>
    `;
  }

  function body() {
    if (!gameId) {
      return '';
    }

    switch (gameState.state) {
      case undefined:
        return '';
      case 'joining':
        return joiningView();
      case 'started':
        return startedView();
      default:
        throw new Error('Invalid game state');
    }
  }

  return html`
    ${styles}
    ${error}
    ${body()}
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
      display: flex;
      padding: 8px;
      user-select: none;
    }
    [is="catchphrase-sortable-list"] li {
      cursor: grab;
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
    .local-player .name::after {
      content: '(local)';
      font-size: 0.7rem;
      margin-left: 0.5rem;
      vertical-align: middle;
    }
    .current-player,
    .next-player {
      padding: 0 0 0 1.33333rem;
      position: relative;
    }
    .current-player::before {
      content: '⇨';
      left: 0;
      position: absolute;
    }
    .next-player {
      margin-top: 4px;
      opacity: 0.6;
    }
  </style>
`;

customElements.define('catchphrase-player-list', component(PlayerList));
