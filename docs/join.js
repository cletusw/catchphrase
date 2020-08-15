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

    // TODO: Make sure to .lowercase when looking to join via gameid
    console.log('TODO: actually join');
    history.pushState(
      null /* state */,
      '' /* title */,
      potentialGameId /* url */,
    );
  }

  return html`
    ${styles}
    <h2>Join a game</h2>
    <form @submit="${redirectToJoin}">
      <input
          type="text"
          aria-label="Game ID"
          placeholder="Game ID"
          name="joinGameId"
          value="abc-def-ghi"><!-- TODO: remove -->
      ${error}
      <button type="submit">Join</button>
    </form>
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
  </style>
`;

customElements.define('catchphrase-join', component(Join));
