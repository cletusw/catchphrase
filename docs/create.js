import {
  component,
  html,
  useEffect,
  useState,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';

import {
  createGame,
  extractGameIdFromUrl,
} from './game.js';

function Create() {
  const [error, setError] = useState('');
  const [gameId, setGameId] = useState(extractGameIdFromUrl(location.href));

  // TODO: Store gameId in context so I can useContext everywhere?
  useEffect(() => {
    // createGame().then((gameId) => {
    //   setGameId(gameId);
    //   history.replaceState(null, null, gameId);
    //   console.log('TODO: actually join', gameId);
    // }, setError);
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
      <div>Share this link:</div>
      <div>
        <a href="${location.href}">${location.href}</a>&nbsp;<button>Copy</button>
      </div>`;
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
    ${styles}
    ${body()}
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
  </style>
`;

customElements.define('catchphrase-create', component(Create));
