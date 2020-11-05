import {
  component,
  html,
  useContext,
  useEffect,
  useState,
} from 'haunted';
import _ from 'lodash';

import {
  CountdownCanceled,
  preStartCountdown,
} from "./countdown-dialog.js";
import { db } from './db.js';
import {
  GameContext,
  endGame,
} from './game.js';

const PRE_START_COUNTDOWN_SECONDS = 3;
const STATIC_ROUND_SEGMENT_DURATIONS_SECONDS = [
  14,
  15,
  17,
  // random 7-9 for final segment
];

function computeRoundSegment(gameState) {
  return 0;
}

function GameTimer() {
  const {
    gameId,
    gameState,
  } = useContext(GameContext);
  const [roundSegmentTimerId, setRoundSegmentTimerId] = useState(0);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);

  const roundSegment = computeRoundSegment(gameState);

  useEffect(() => {
    const offsetRef = db.ref('.info/serverTimeOffset');
    offsetRef.on('value', function (snapshot) {
      setServerTimeOffset(snapshot.val());
    });
  }, []);

  async function gameTimers() {
    // If you change this function, make sure to update the useEffect hook watch array below
    if (roundSegment == null) {
      try {
        // TODO: Actually compute PRE_START_COUNTDOWN_SECONDS (e.g. in case of page refresh)
        await preStartCountdown(PRE_START_COUNTDOWN_SECONDS);
      } catch (error) {
        if (!(error instanceof CountdownCanceled)) {
          throw error;
        }
        endGame(gameId, gameState);
      }
    }
    else if (roundSegment >= 0 && !roundSegmentTimerId) {
      if (roundSegment > STATIC_ROUND_SEGMENT_DURATIONS_SECONDS.length) {
        throw new Error('Invalid roundSegment');
      }

      const estimatedServerTimeMs = Date.now() + serverTimeOffset;
      let roundSegmentTimerEndTimeMs =
        gameState.preStartCountdownStartTime +
        PRE_START_COUNTDOWN_SECONDS * 1000;
      for (let i = 0; i < roundSegment; i++) {
        roundSegmentTimerEndTimeMs += STATIC_ROUND_SEGMENT_DURATIONS_SECONDS[i] * 1000;
      }

      if (roundSegment === STATIC_ROUND_SEGMENT_DURATIONS_SECONDS.length) {
        // console.log('last', roundSegmentTimerEndTimeMs - estimatedServerTimeMs);
        setRoundSegmentTimerId(setTimeout(() => {
          // TODO: between rounds instead of ending game
          endGame(gameId, gameState);
        }, roundSegmentTimerEndTimeMs - estimatedServerTimeMs));
      }
      else {
        // TODO: Remove this branch
        // console.log('not last', roundSegmentTimerEndTimeMs - estimatedServerTimeMs);
        setRoundSegmentTimerId(setTimeout(() => {
          setRoundSegmentTimerId(0);
        }, roundSegmentTimerEndTimeMs - estimatedServerTimeMs));
      }
    }
  }

  useEffect(() => {
    if (gameState.state === 'started') {
      gameTimers(); // Note: This is asynchronous
    }

    return function stopEffect() {
      if (roundSegmentTimerId) {
        clearTimeout(roundSegmentTimerId);
        setRoundSegmentTimerId(0);
      }
    };
  }, [gameState, serverTimeOffset, roundSegment]);

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
      width: 24px;
      height: 24px;
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
