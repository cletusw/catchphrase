import {
  component,
  html,
} from 'https://cdn.pika.dev/haunted@^4.7.0';
import {useMachine} from 'https://cdn.pika.dev/haunted-robot@^0.2.1';

import './header.js';
import './create.js';
import './player-list.js';

function App() {
  return html`
    ${styles}
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
