import {
  component,
  html,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';
import {
  nothing,
} from 'https://cdn.skypack.dev/lit-html@^1.2.1';
import { useRoutes } from 'https://cdn.skypack.dev/haunted-router@^0.2.0';

import './header.js';
import './create.js';
import './player-list.js';

const BASE_URL_PATH = '/catchphrase';

function App() {
  const routeResult = useRoutes({
    [`${BASE_URL_PATH}/:gameId`]: ({ gameId }) => html`joining game ${gameId}`,
    [`${BASE_URL_PATH}*`]: () => html`main view`,
  }, nothing /* fallback */);

  return html`
    ${styles}
    ${routeResult}
    <catchphrase-header></catchphrase-header>
    <catchphrase-create></catchphrase-create>
    <catchphrase-player-list></catchphrase-player-list>
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
      padding: 16px;
    }
  </style>
`;

customElements.define('catchphrase-app', component(App));
