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

function GameView() {
  const {
    gameId,
    gameState,
  } = useContext(GameContext);

  const roundSegment = useRoundSegment(gameState);
  const serverTimeOffset = useServerTimeOffset(db, 0);
  const estimatedServerTimeMs = Date.now() + serverTimeOffset;
  const roundDone = estimatedServerTimeMs >= getRoundOverallEndTime(gameState);

  function startedView() {
    const currentPlayerIsLocal = isLocalPlayer(gameState.currentPlayerId);
    return html`
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
    }
    .the-word {
      font-size: 2rem;
    }
    .the-word:not(.current-player-is-local) {
      display: none;
    }
  </style>
`;

customElements.define('catchphrase-game-view', component(GameView));
