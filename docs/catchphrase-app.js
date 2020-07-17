import {
  component,
  html,
  useEffect,
  useState,
} from 'https://cdn.pika.dev/haunted@^4.7.0';
import {useMachine} from 'https://cdn.pika.dev/haunted-robot@^0.2.1';

import {
  createGame,
  validateGameId,
} from './game.js';

function CatchphraseApp() {
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

  function redirectToJoin(event) {
    event.preventDefault();

    const potentialGameId = event.target.elements.joinGameId.value;
    if (!validateGameId(potentialGameId)) {
      setError(`Invalid game ID: ${potentialGameId}`);
      return;
    }

    console.log('TODO: actually join');
    history.pushState(
      null /* state */,
      '' /* title */,
      potentialGameId /* url */,
    );
  }

  return html`
    <h1>Catchphrase</h1>
    <h2>Host a game</h2>
    ${body()}
    <h2>Join a game</h2>
    <form @submit="${redirectToJoin}">
      <label>
        Enter game id:
        <input
            type="text"
            name="joinGameId"
            value="abc-def-ghi"><!-- TODO: remove -->
      </label>
      <button type="submit">Join</button>
    </form>
  `;

  // TODO: Make sure to .lowercase when looking to join via gameid
}

customElements.define('catchphrase-app', component(CatchphraseApp));
