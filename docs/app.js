import {
  component,
  html,
} from 'https://cdn.pika.dev/haunted@^4.7.0';
import {useMachine} from 'https://cdn.pika.dev/haunted-robot@^0.2.1';

import './create.js';
import './join.js';
import './player-list.js';

function App() {
  return html`
    ${styles}
    <h1>Catchphrase</h1>
    <catchphrase-create></catchphrase-create>
    <catchphrase-join></catchphrase-join>
    <catchphrase-player-list></catchphrase-player-list>
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
      padding: 16px;
    }
    h1 {
      margin-top: 8px;
    }
  </style>
`;

customElements.define('catchphrase-app', component(App));
