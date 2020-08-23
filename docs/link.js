import {
  component,
  html,
  useContext,
  useState,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';

import {
  GameContext,
} from './game.js';

function Link() {
  const [error, setError] = useState('');
  const { game } = useContext(GameContext);

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
    if (!game.id) {
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

customElements.define('catchphrase-link', component(Link));
