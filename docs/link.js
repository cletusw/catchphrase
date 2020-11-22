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

  function handleShareButtonClick() {
    navigator.share({
      title: 'Join my Catch Phrase game!',
      url: urlWithoutProtocol,
    });
  }

  function noDataView() {
    return html`
      <div>
        Loading...
      </div>
    `;
  }

  function copyButton() {
    return html`
      <button
          aria-label="Copy join game link"
          @click=${handleCopyButtonClick}>
        Copy join game link
      </button>
    `;
  }

  function shareButton() {
    return html`
      <button
          aria-label="Share join game link"
          @click=${handleShareButtonClick}>
        Share join game link
      </button>
    `;
  }

  function body() {
    if (!gameId) {
      // TODO show nothing until 250ms in case data comes back quickly
      return noDataView();
    }
    return html`
      <div class="container">
        <a href="${urlWithoutProtocol}">${urlWithoutProtocol}</a>
        ${navigator.share ? shareButton() : copyButton()}
      </div>
    `;
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
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
  </style>
`;

customElements.define('catchphrase-link', component(Link));
