import {
  component,
  html,
  useContext,
  useEffect,
} from 'haunted';
import _ from 'lodash';

import { db } from './db.js';
import {
  GameContext,
} from './game.js';

const games = db.ref('games');

function GameView() {
  const {
    gameId,
    gameState,
    setGameState,
  } = useContext(GameContext);

  useEffect(() => {
    if (!gameId) {
      return;
    }

    const gameRef = games
      .child(gameId);

    const callback = gameRef.on('value', (snapshot) => {
      const gameState = snapshot.val();
      console.log('updating local game state', gameState);
      setGameState(gameState);
    });

    return function stopEffect() {
      gameRef.off('value', callback);
    };
  }, [gameId]);

  function startGame() {
    if (!gameId) {
      throw new Error('Game ID missing');
    }

    games
      .child(gameId)
      .update({
        state: 'started',
        preStartCountdownStartTime: firebase.database.ServerValue.TIMESTAMP,
        // TODO: Make random & segmented
        roundDurationSeconds: 6,
        currentPlayerId: _.minBy(
          Object.keys(gameState.players),
          (key) => gameState.players[key].order),
      });
  }

  function endGame() {
    games
      .child(gameId)
      .update({
        state: 'joining',
        preStartCountdownStartTime: null,
        roundDurationSeconds: null,
        currentPlayerId: null,
      });
  }

  function nextPlayer() {
    const orderedPlayers = _
      .chain(gameState.players)
      .map((value, key) => ({
        id: key,
        name: value.name,
        order: value.order,
      }))
      .sortBy((player) => player.order)
      .value();
    const currentPlayerIndex =
        orderedPlayers.findIndex((player) => player.id === gameState.currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % orderedPlayers.length;
    games
      .child(gameId)
      .update({
        currentPlayerId: orderedPlayers[nextPlayerIndex].id,
      });
  }

  function joiningView() {
    return html`
      <button @click=${startGame}>
        Start game
      </button>
    `;
  }

  function startedView() {
    return html`
      <div>Started!</div>
      <button @click=${nextPlayer}>
        Got it
      </button>
      <button @click=${endGame}>
        End game
      </button>
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
    ${body()}
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
  </style>
`;

customElements.define('catchphrase-game-view', component(GameView));
