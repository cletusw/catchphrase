import {
  component,
  html,
  useEffect,
  useState,
} from 'haunted';

import { db } from './db.js';
import {
  GameContext,
  createGame,
  extractGameIdFromUrl,
} from './game.js';

import './game-buttons.js';
import './game-view.js';
import './header.js';
import './link.js';
import './player-list.js';
import './scorecard.js';

customElements.define('catchphrase-game-provider', GameContext.Provider);

function App() {
  const [error, setError] = useState('');
  const [gameId, setGameId] = useState(
    extractGameIdFromUrl(location.href));
  const [gameState, setGameState] = useState({});
  const gameContext = {
    gameId,
    setGameId,
    gameState,
    setGameState,
  };

  if (!gameState) {
    throw new Error('Invalid gameState');
  }

  // Handle back button events
  useEffect(() => {
    const popstateHandler = (event) => {
      setGameId(extractGameIdFromUrl(location.href));
    };

    window.addEventListener('popstate', popstateHandler);
    return () => {
      window.removeEventListener('popstate', popstateHandler);
    };
  }, []);

  useEffect(() => {
    // TODO: Also check if we have a game ID but it isn't in the DB (got deleted)
    if (!gameId) {
      createGame().then((gameId) => {
        history.replaceState(null, null, gameId);
        setGameId(gameId);
      }, setError);
    }
  }, [gameId]);

  useEffect(() => {
    if (!gameId) {
      return;
    }

    const gameRef = db.ref('games').child(gameId);

    const callback = gameRef.on('value', (snapshot) => {
      const gameState = snapshot.val();

      if (!gameState) {
        gameRef.set({
          state: 'joining',
        });
        return;
      }

      // console.log('updating local game state', gameState);
      setGameState(gameState);
    });

    return function stopEffect() {
      gameRef.off('value', callback);
    };
  }, [gameId]);

  function errorView() {
    // TODO: Use a toast instead
    return error ? html`
      <div class="alert-error">
        ${error}
      </div>
    ` : '';
  }

  return html`
    ${styles}
    <catchphrase-game-provider
        class="wrapper state-${gameState.state}"
        .value=${gameContext}>
      <catchphrase-header class="header"></catchphrase-header>
      ${errorView()}
      <catchphrase-link class="link"></catchphrase-link>
      <catchphrase-scorecard class="scorecard"></catchphrase-scorecard>
      <catchphrase-player-list class="player-list"></catchphrase-player-list>
      <catchphrase-game-view class="game-view"></catchphrase-game-view>
      <catchphrase-game-buttons class="game-buttons"></catchphrase-game-buttons>
    </catchphrase-game-provider>
  `;
}

const styles = html`
  <style>
    :host {
      box-sizing: border-box;
      display: block;
      padding: 1rem;
    }
    .wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      place-items: center;
    }
    .header {
      align-self: stretch;
    }
    .alert-error {
      background-color: hsl(50 100% 90%);
      border: 1px solid hsl(50 100% 85%);
      border-radius: .25rem;
      padding: .75rem 1.25rem;
    }
    .wrapper:not(.state-joining) .link {
      display: none;
    }
    .wrapper:not(.state-started) .scorecard {
      display: none;
    }
    .wrapper:not(.state-started) .player-list {
      width: 100%;
      max-width: 400px;
    }
    .game-view {
      align-self: stretch;
      flex: 1;
    }
  </style>
`;

customElements.define('catchphrase-app', component(App));
