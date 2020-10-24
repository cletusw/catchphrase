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
  const { game } = useContext(GameContext);
  const [error, setError] = useState('');
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!game.id) {
      return;
    }

    const playersRef = db.ref('games')
      .child(game.id)
      .child('players')
      .orderByChild('order');

    const callback = playersRef.on(
      'value',
      (snapshot) => {
        const orderedPlayers = [];
        snapshot.forEach((child) => {
          const player = child.val();
          orderedPlayers.push({
            id: child.ref.key,
            name: player.name,
            order: player.order,
          });
        });
        // console.log('values updated on the server')
        // console.table(orderedPlayers);
        setPlayers(orderedPlayers);
      },
      setError,
    );

    return function stopEffect() {
      playersRef.off('value', callback);
    };
  }, [game]);

  useEffect(() => {
    if (!game.id) {
      return;
    }

    handleAddLocalPlayerButtonClick();
  }, [game]);

  function handleAddLocalPlayerButtonClick() {
    showPlayerRenameDialog({
      name: generateNickname(),
      setName: (name) => {
        const playerRef = addNewPlayerToGame({
          name,
          gameId: game.id,
        });
      },
    });
  }

  function handleSort(event) {
    if (!game.id) {
      throw new Error('Game ID missing');
    }

    const desiredIdOrder = event.target.sortable.toArray();
    const orderedUpdatePaths = desiredIdOrder.map((id) => `${id}/order`);
    const existingOrderValues = players.map((player) => player.order);
    const updates = _.zipObject(orderedUpdatePaths, existingOrderValues);

    db.ref('games')
      .child(game.id)
      .child('players')
      .update(updates);
  }

  function removePlayer(event) {
    const playerIdToRemove = event.target.closest('[data-id]').dataset.id;
    db.ref('games')
      .child(game.id)
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
      ${repeat(players, (player) => player.id, (player) => html`
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
