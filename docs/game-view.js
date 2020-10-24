import {
  component,
  html,
  useContext,
} from 'haunted';

import { db } from './db.js';
import {
  GameContext,
} from './game.js';

function GameView() {
  const { game } = useContext(GameContext);

  function startGame() {
    if (!game.id) {
      throw new Error('Game ID missing');
    }

    db.ref('games')
      .child(game.id)
      .update({
        state: 'started',
      });
  }

  function joiningView() {
    return html`
      <button @click=${startGame}>
        Start game
      </button>
    `;
  }

  function startedView() {
    return html`
      <div>Started!</div>
    `;
  }

  function body() {
    if (!game.id) {
      return '';
    }

    // TODO: Implement game.state
    switch (game.state) {
      case undefined:
        return '';
      case 'joining':
        return joiningView();
      case 'started':
        return startedView();
      default:
        throw new Error('Invalid game state');
    }
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

customElements.define('catchphrase-game-view', component(GameView));
