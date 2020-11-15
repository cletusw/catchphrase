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
      <button class="inc player-one">+</button>
      <button class="dec player-one">–</button>
      <div class="name player-one">
        Team 1
      </div>
      <div class="score player-one">
        ${gameState.team1Score}
      </div>
      <div
          aria-hidden="true"
          class="divider">
        —
      </div>
      <div class="name player-two">
        Team 2
      </div>
      <div class="score player-two">
        ${gameState.team2Score}
      </div>
      <button class="inc player-two">+</button>
      <button class="dec player-two">–</button>
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
      display: grid;
      grid-template-columns: auto auto 3rem auto auto;
      grid-template-areas:
          "one-inc one-name  divider two-name  two-inc"
          "one-inc one-score divider two-score two-inc"
          "one-dec one-score divider two-score two-dec";
      justify-content: center;
      place-items: center;
      column-gap: 1rem;
      row-gap: 0.1rem;
    }
    .inc.player-one {
      grid-area: one-inc;
    }
    .inc.player-two {
      grid-area: two-inc;
    }
    .dec.player-one {
      grid-area: one-dec;
    }
    .dec.player-two {
      grid-area: two-dec;
    }
    .name {
      font-size: 0.75rem;
    }
    .name.player-one {
      grid-area: one-name;
    }
    .name.player-two {
      grid-area: two-name;
    }
    .score {
      font-size: 1.75rem;
      line-height: 1;
    }
    .score.player-one {
      grid-area: one-score;
    }
    .score.player-two {
      grid-area: two-score;
    }
    .divider {
      grid-area: divider;
    }
  </style>
`;

customElements.define('catchphrase-scorecard', component(Scorecard));
