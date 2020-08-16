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

  function addHyphens(event) {
    if (event.key === '-') {
      event.preventDefault();
      return;
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return;
    }

    const inputElement = event.target;

    // Have to wait a tick or the added hyphen won't show right away
    setTimeout(() => {
      if (inputElement.value.length === 3) {
          inputElement.value += '-';
      }
      if (inputElement.value.length === 7) {
          inputElement.value += '-';
      }
    });
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
          @keydown="${addHyphens}"
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
