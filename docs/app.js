import {
  component,
  html,
  useEffect,
  useState,
} from 'haunted';

import {
  GameContext,
  createGame,
  extractGameIdFromUrl,
} from './game.js';
import './game-timer.js';
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
      <catchphrase-header></catchphrase-header>
      ${errorView()}
      <catchphrase-link class="link"></catchphrase-link>
      <catchphrase-scorecard class="scorecard"></catchphrase-scorecard>
      <div class="game-header">
        <catchphrase-player-list class="player-list"></catchphrase-player-list>
        <catchphrase-game-timer class="game-timer"></catchphrase-game-timer>
      </div>
      <catchphrase-game-view class="game-view"></catchphrase-game-view>
    </catchphrase-game-provider>
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
      padding: 1rem;
    }
    .alert-error {
      background-color: hsl(50 100% 90%);
      border: 1px solid hsl(50 100% 85%);
      border-radius: .25rem;
      padding: .75rem 1.25rem;
    }
    .alert-error,
    .link,
    .scorecard,
    .player-list,
    .game-timer,
    .game-view {
      margin-top: 1rem;
    }
    .wrapper:not(.state-joining) .link {
      display: none;
    }
    .game-header {
      display: flex;
    }
    .player-list {
      flex: 1;
    }
    .wrapper:not(.state-started) .game-timer {
      display: none;
    }
  </style>
`;

customElements.define('catchphrase-app', component(App));
