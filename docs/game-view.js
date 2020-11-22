import {
  component,
  html,
  useContext,
} from 'haunted';
import _ from 'lodash';

import { db } from './db.js';
import {
  GameContext,
  getRoundOverallEndTime,
} from './game.js';
import { isLocalPlayer } from './player.js';
import {
  useRoundSegment,
} from './round-segment.js';
import { useServerTimeOffset } from './server-time-offset.js';
import {
  getMediumWord,
} from './word-generator.js';

import './game-timer.js';

function GameView() {
  const {
    gameId,
    gameState,
  } = useContext(GameContext);

  const roundSegment = useRoundSegment(gameState);
  const serverTimeOffset = useServerTimeOffset(db, 0);
  const estimatedServerTimeMs = Date.now() + serverTimeOffset;
  const roundDone = estimatedServerTimeMs >= getRoundOverallEndTime(gameState);

  // TODO: Hide the word for 0.5 seconds if the next player is also local??
  function startedView() {
    const currentPlayerIsLocal = isLocalPlayer(gameState.currentPlayerId);
    return html`
      <catchphrase-game-timer class="game-timer"></catchphrase-game-timer>
      <div class="the-word${currentPlayerIsLocal ? ' current-player-is-local' : ''}">
        ${currentPlayerIsLocal ? getMediumWord(gameState.currentWordUnboundedIndex, gameState.wordListShuffleSeed) : ''}
      </div>
    `;
  }

  function body() {
    if (!gameId || gameState.state !== 'started' || roundSegment < 0 || roundDone ) {
      return '';
    }

    return startedView();
  }

  return html`
    ${styles}
    ${body()}
  `;
}

const styles = html`
  <style>
    :host {
      display: grid;
      place-items: center;
      position: relative;
    }
    .game-timer {
      position: absolute;
      top: 0;
      right: 0;
    }
    .the-word {
      font-size: 3rem;
      text-align: center;
    }
    .the-word:not(.current-player-is-local) {
      display: none;
    }
  </style>
`;

customElements.define('catchphrase-game-view', component(GameView));
