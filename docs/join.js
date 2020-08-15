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
  function redirectToJoin(event) {
    event.preventDefault();

    const joinGameIdInput = event.target.elements.joinGameId;
    const potentialGameId = joinGameIdInput.value;
    if (!validateGameId(potentialGameId)) {
      joinGameIdInput.setCustomValidity('Invalid Game ID');
      joinGameIdInput.reportValidity();
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

  function resetValidity(event) {
    event.target.setCustomValidity('');
  }

  return html`
    ${styles}
    <form @submit="${redirectToJoin}">
      <input
          type="text"
          aria-label="Game ID"
          placeholder="Game ID"
          name="joinGameId"
          size="11"
          maxlength="11"
          required
          @input="${resetValidity}"
          value="abc-def-ghi"><!-- TODO: remove -->
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
