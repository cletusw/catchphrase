import {
  component,
  html,
  useContext,
  useEffect,
  useState,
} from 'haunted';
import _ from 'lodash';

import { db } from './db.js';
import {
  GameContext,
  PRE_START_COUNTDOWN_SECONDS,
  endGame,
} from './game.js';
import { useServerTimeOffset } from './server-time-offset.js';

const ROUND_SEGMENTS = 3;

function GameTimer() {
  const {
    gameId,
    gameState,
  } = useContext(GameContext);
  const [roundSegmentTimerId, setRoundSegmentTimerId] = useState(0);
  const serverTimeOffset = useServerTimeOffset(db, 0);
  const [roundSegment, setRoundSegment] = useState(null);

  // If you change this function, make sure to update the useEffect hook watch array below
  function gameTimers() {
    if (roundSegment == null) {
      // Even if it should be higher, the upcoming computed setTimeouts will just be < 0 and
      // immediately trigger
      setRoundSegment(-1);
    }

    if (roundSegment != null && !roundSegmentTimerId) {
      const estimatedServerTimeMs = Date.now() + serverTimeOffset;
      let roundSegmentTimerEndTimeMs =
        gameState.preStartCountdownStartTime +
        PRE_START_COUNTDOWN_SECONDS * 1000;
      for (let i = 0; i <= roundSegment; i++) {
        roundSegmentTimerEndTimeMs += gameState.roundSegmentDurationSeconds * 1000;
      }
      if (roundSegment + 1 === ROUND_SEGMENTS) {
        // console.log('last', roundSegmentTimerEndTimeMs - estimatedServerTimeMs);
        setRoundSegmentTimerId(setTimeout(() => {
          // TODO: between rounds instead of ending game
          endGame(gameId, gameState);
        }, roundSegmentTimerEndTimeMs - estimatedServerTimeMs));
      }
      else {
        // console.log('not last', roundSegmentTimerEndTimeMs - estimatedServerTimeMs);
        setRoundSegmentTimerId(setTimeout(() => {
          setRoundSegmentTimerId(0);
          setRoundSegment((roundSegment) => roundSegment + 1);
        }, roundSegmentTimerEndTimeMs - estimatedServerTimeMs));
      }
    }
  }

  useEffect(() => {
    if (gameState.state === 'started') {
      gameTimers();
    }
    else if (roundSegment) {
      setRoundSegment(null);
    }

    return function stopEffect() {
      if (roundSegmentTimerId) {
        clearTimeout(roundSegmentTimerId);
        setRoundSegmentTimerId(0);
      }
    };
  }, [gameState, serverTimeOffset, roundSegment, roundSegmentTimerId]);

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
