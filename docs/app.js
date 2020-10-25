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
import './game-view.js';
import './header.js';
import './link.js';
import './player-list.js';
import './state-machine-demo.js';

customElements.define('catchphrase-game-provider', GameContext.Provider);

function App() {
  const [error, setError] = useState('');
  const [game, setGame] = useState({
    id: extractGameIdFromUrl(location.href),
  });
  const gameContext = {
    game,
    setGame,
  };

  // Handle back button events
  useEffect(() => {
    const popstateHandler = (event) => {
      setGame({
        id: extractGameIdFromUrl(location.href),
      });
    };

    window.addEventListener('popstate', popstateHandler);
    return () => {
      window.removeEventListener('popstate', popstateHandler);
    };
  }, []);

  useEffect(() => {
    // TODO: Also check if we have a game ID but it isn't in the DB (got deleted)
    if (!game.id) {
      createGame().then((gameId) => {
        history.replaceState(null, null, gameId);
        setGame({
          id: gameId,
        });
      }, setError);
    }
  }, [game]);

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
    <catchphrase-game-provider .value=${gameContext}>
      <catchphrase-header></catchphrase-header>
      ${errorView()}
      <catchphrase-link class="link"></catchphrase-link>
      <catchphrase-player-list class="player-list"></catchphrase-player-list>
      <catchphrase-game-view class="game-view"></catchphrase-game-view>
      <catchphrase-state-machine-demo></catchphrase-state-machine-demo>
    </catchphrase-game-provider>
  `;
}

// TODO: Convert all px to rem
const styles = html`
  <style>
    :host {
      display: block;
      padding: 16px;
    }
    .alert-error {
      background-color: hsl(50 100% 90%);
      border: 1px solid hsl(50 100% 85%);
      border-radius: .25rem;
      padding: .75rem 1.25rem;
    }
    .alert-error,
    .link,
    .player-list,
    .game-view {
      margin-top: 1rem;
    }
  </style>
`;

customElements.define('catchphrase-app', component(App));
