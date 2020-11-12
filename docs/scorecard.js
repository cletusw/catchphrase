import {
  component,
  html,
  useContext,
} from 'haunted';

import {
  GameContext,
} from './game.js';

function Scorecard() {
  const { gameState } = useContext(GameContext);

  const started = gameState.state === 'started';

  if (started &&
      (gameState.team1Score == null || gameState.team2Score == null)) {
    throw new Error('GameState invalid: missing team scores')
  }

  return html`
    ${styles}
    <div
        class="container">
      <div class="card">
        <div class="text">
          Team 1
        </div>
        <div class="score">
          ${gameState.team1Score}
        </div>
      </div>
      <div aria-hidden="true">
        --
      </div>
      <div class="card">
        <div class="text">
          Team 1
        </div>
        <div class="score">
          ${gameState.team2Score}
        </div>
      </div>
    </div>
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
    [hidden][hidden] {
      /* Otherwise overriden by explicit display property */
      display: none !important;
    }
    .container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3rem;
    }
    .text {
      font-size: 0.75rem;
    }
    .score {
      font-size: 1.75rem;
      text-align: center;
    }
  </style>
`;

customElements.define('catchphrase-scorecard', component(Scorecard));
