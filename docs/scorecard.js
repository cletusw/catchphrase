import {
  component,
  html,
  useContext,
} from 'haunted';

import { db } from './db.js';
import {
  GameContext,
} from './game.js';
import { isLocalPlayer } from './player.js';

function Scorecard() {
  const {
    gameId,
    gameState,
  } = useContext(GameContext);

  const started = gameState.state === 'started';
  const currentPlayerIsLocal = isLocalPlayer(gameState.currentPlayerId);

  if (started &&
      (gameState.team1Score == null || gameState.team2Score == null)) {
    throw new Error('GameState invalid: missing team scores')
  }

  function setTeam1Score(newScore) {
    if (newScore == null || newScore < 0) {
      throw new Error('Attempted to set invalid score');
    }
    db.ref('games')
      .child(gameId)
      .update({
        team1Score: newScore,
      });
  }

  function setTeam2Score(newScore) {
    if (newScore == null || newScore < 0) {
      throw new Error('Attempted to set invalid score');
    }
    db.ref('games')
      .child(gameId)
      .update({
        team2Score: newScore,
      });
  }

  return html`
    ${styles}
    <div
        class="container${currentPlayerIsLocal ? ' current-player-is-local' : ''}"
        ?hidden=${!started}>
      <button
          class="inc team-one"
          @click=${() => setTeam1Score(gameState.team1Score + 1)}>+</button>
      <button
          class="dec team-one"
          ?disabled=${gameState.team1Score <= 0}
          @click=${() => setTeam1Score(gameState.team1Score - 1)}>–</button>
      <div class="name team-one">
        Team 1
      </div>
      <div class="score team-one">
        ${gameState.team1Score}
      </div>
      <div
          aria-hidden="true"
          class="divider">
        —
      </div>
      <div class="name team-two">
        Team 2
      </div>
      <div class="score team-two">
        ${gameState.team2Score}
      </div>
      <button
          class="inc team-two"
          @click=${() => setTeam2Score(gameState.team2Score + 1)}>+</button>
      <button
          class="dec team-two"
          ?disabled=${gameState.team2Score <= 0}
          @click=${() => setTeam2Score(gameState.team2Score - 1)}>–</button>
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
    .container:not(.current-player-is-local) .inc,
    .container:not(.current-player-is-local) .dec {
      display: none;
    }
    .inc.team-one {
      grid-area: one-inc;
    }
    .inc.team-two {
      grid-area: two-inc;
    }
    .dec.team-one {
      grid-area: one-dec;
    }
    .dec.team-two {
      grid-area: two-dec;
    }
    .name {
      font-size: 0.75rem;
    }
    .name.team-one {
      grid-area: one-name;
    }
    .name.team-two {
      grid-area: two-name;
    }
    .score {
      font-size: 1.75rem;
      line-height: 1;
    }
    .score.team-one {
      grid-area: one-score;
    }
    .score.team-two {
      grid-area: two-score;
    }
    .divider {
      grid-area: divider;
    }
  </style>
`;

customElements.define('catchphrase-scorecard', component(Scorecard));
