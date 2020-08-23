import {
  component,
  html,
  useContext,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';

import {
  GameContext,
} from './game.js';

function Link() {
  const { game } = useContext(GameContext);

  function noDataView() {
    return html`
      <div>
        Loading...
      </div>
    `;
  }

  function gameReadyView() {
    const urlWithoutProtocol = location.href.replace(/(^\w+:|^)\/\//, '');

    return html`
      <div>Share this link:</div>
      <div>
        <a href="${urlWithoutProtocol}">${urlWithoutProtocol}</a>&nbsp;<button>Copy</button>
      </div>`;
  }

  function body() {
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
