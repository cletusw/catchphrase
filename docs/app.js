import {
  component,
  html,
  useEffect,
  useState,
} from 'https://cdn.pika.dev/haunted@^4.7.0';
import {useMachine} from 'https://cdn.pika.dev/haunted-robot@^0.2.1';

import {
  createGame,
} from './game.js';
import './join.js';
import './player-list.js';

function App() {
  const [error, setError] = useState('');
  const [gameId, setGameId] = useState('');

  useEffect(() => {
    createGame().then(setGameId, setError);
  }, []);

  function errorView() {
    return html`
      <div>
        ${error}
      </div>
    `;
  }

  function noDataView() {
    return html`
      <div>
        Loading...
      </div>
    `;
  }

  function gameReadyView() {
    return html`
      <div>
        Your game id is: <span>${gameId}</span>
      </div>
    `;
  }

  function body() {
    if (error) {
      return errorView();
    }
    if (!gameId) {
      // TODO show nothing until 250ms in case data comes back quickly
      return noDataView();
    }
    return gameReadyView();
  }

  return html`
    <h1>Catchphrase</h1>
    <h2>Host a game</h2>
    ${body()}
    <catchphrase-join></catchphrase-join>
    <catchphrase-player-list></catchphrase-player-list>
  `;

  // TODO: Make sure to .lowercase when looking to join via gameid
}

customElements.define('catchphrase-app', component(App));
