import {
  component,
  html,
  useContext,
} from 'haunted';

import {
  GameContext,
} from './game.js';

function Link() {
  const { gameId } = useContext(GameContext);

  // TODO: Use a router instead of relying on this components dependency on GameContext & its implicit relationship with the URL
  const urlWithoutProtocol = location.href.replace(/(^\w+:|^)\/\//, '');

  function handleCopyButtonClick() {
    navigator.clipboard.writeText(urlWithoutProtocol).then(() => {
      // TODO: Use a toast instead
      console.log('Copied link to clipboard');
    }, () => {
      // TODO: Use a toast instead
      console.log('Unable to copy link to clipboard');
    });
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
        <a href="${urlWithoutProtocol}">${urlWithoutProtocol}</a>
        <button
            class="copy-button"
            @click=${handleCopyButtonClick}>
          Copy
        </button>
      </div>`;
  }

  function body() {
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
    .copy-button {
      margin-left: 4px;
    }
  </style>
`;

customElements.define('catchphrase-link', component(Link));
