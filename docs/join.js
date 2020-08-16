import {
  component,
  html,
  useEffect,
  useState,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';

import {
  extractGameIdFromUrl,
  validateGameId,
} from './game.js';

function Join() {
  useEffect(() => {
    const popstateHandler = (event) => {
      const potentialGameId = extractGameIdFromUrl(location.href);
      if (potentialGameId) {
        console.log('TODO: actually join', potentialGameId);
      }
    };

    window.addEventListener('popstate', popstateHandler);
    return () => {
      window.removeEventListener('popstate', popstateHandler);
    };
  }, []);

  function redirectToJoin(event) {
    event.preventDefault();

    const joinGameIdInput = event.target.elements.joinGameId;
    const potentialGameId = joinGameIdInput.value.toLowerCase();
    if (!validateGameId(potentialGameId)) {
      joinGameIdInput.setCustomValidity('Invalid Game ID');
      joinGameIdInput.reportValidity();
      return;
    }

    console.log('TODO: actually join', potentialGameId);
    history.pushState(null, null, potentialGameId /* url */);
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
