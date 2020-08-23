import {
  component,
  html,
  useContext,
  useState,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';

import {
  GameContext,
} from './game.js';
import './join.js';

function Header() {
  const { setGame } = useContext(GameContext);
  const [isJoining, setIsJoining] = useState(false);

  function newGameClicked() {
    // TODO: Refactor history stuff to separate file instead of using a magical string here & magical relative URLs elsewhere
    history.pushState(null, null, '/catchphrase/' /* url */);
    setGame({});
  }

  return html`
    ${styles}
    <header class=${isJoining ? 'is-joining' : ''}>
      <button
          class="back-button"
          aria-label="Back"
          @click=${() => setIsJoining(false)}>
        ⇦
      </button>
      <h1>Catch Phrase</h1>
      <button
          class="new-game-button"
          aria-label="New game"
          @click=${newGameClicked}>
        <span class="long-text">New game</span>
        <span class="short-text">New</span>
      </button>
      <button
          class="join-game-button"
          aria-label="Join game"
          @click=${() => setIsJoining(true)}>
        <span class="long-text">Join game</span>
        <span class="short-text">Join</span>
      </button>
      <catchphrase-join @joined=${() => setIsJoining(false)}></catchphrase-join>
    </header>
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 48px;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 0;
      margin-right: auto;
    }
    .long-text {
      display: none;
    }
    .back-button {
      margin-right: auto;
    }
    .back-button,
    catchphrase-join,
    .is-joining h1,
    .is-joining .new-game-button,
    .is-joining .join-game-button {
      display: none;
    }
    .is-joining .back-button,
    .is-joining catchphrase-join {
      display: unset;
    }
    @media (min-width: 576px) {
      .long-text {
        display: unset;
      }
      .short-text {
        display: none;
      }
    }
    @media (min-width: 768px) {
      .join-game-button {
        display: none;
      }
      catchphrase-join {
        display: unset;
      }
    }
  </style>
`;

customElements.define('catchphrase-header', component(Header));
