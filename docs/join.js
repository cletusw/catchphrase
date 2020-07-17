import {
  component,
  html,
  useEffect,
  useState,
} from 'https://cdn.pika.dev/haunted@^4.7.0';

import {
  validateGameId,
} from './game.js';

function Join() {
  const [error, setError] = useState('');

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
    <h2>Join a game</h2>
    <form @submit="${redirectToJoin}">
      <label>
        Enter game id:
        <input
            type="text"
            name="joinGameId"
            value="abc-def-ghi"><!-- TODO: remove -->
      </label>
      ${error}
      <button type="submit">Join</button>
    </form>
  `;
}

customElements.define('catchphrase-join', component(Join));
