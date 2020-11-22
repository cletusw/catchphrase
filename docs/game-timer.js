import {
  component,
  html,
  useContext,
} from 'haunted';

import {
  GameContext,
} from './game.js';
import {
  useRoundSegment,
} from './round-segment.js';

function GameTimer() {
  const {
    gameState,
  } = useContext(GameContext);
  const roundSegment = useRoundSegment(gameState);

  // TODO: Add sound?
  return html`
    ${styles}
    ${roundSegment >= 0 ? html`
      <div class="timer round-segment-${roundSegment}"></div>
    ` : ''}
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
    @keyframes toggle-opacity {
      0% {
        opacity: 0;
      }
      35% {
        opacity: 0;
      }
      35.001% {
        opacity: 1;
      }
    }
    .timer {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
    }
    .timer.round-segment-0 {
      animation: toggle-opacity 0.6s infinite;
      background-color: hsl(120 100% 48%);
    }
    .timer.round-segment-1 {
      animation: toggle-opacity 0.4s infinite;
      background-color: hsl(60 100% 48%);
    }
    .timer.round-segment-2 {
      animation: toggle-opacity 0.2s infinite;
      background-color: hsl(0 100% 48%);
    }
  </style>
`;

customElements.define('catchphrase-game-timer', component(GameTimer));
