import {
  component,
  html,
  useContext,
  useEffect,
} from 'haunted';

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
      });
  }

  function endGame() {
    games
      .child(gameId)
      .update({
        state: 'joining',
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
