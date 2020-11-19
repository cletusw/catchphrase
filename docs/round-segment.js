import {
  Hook,
  hook,
  useEffect,
  useState,
} from 'haunted';

import { db } from './db.js';
import {
  LAST_ROUND_SEGMENT,
  getRoundOverallEndTime,
  getRoundSegmentEndTime,
} from './game.js';
import { useServerTimeOffset } from './server-time-offset.js';

export const useRoundSegment = hook(class extends Hook {
  constructor(id, state) {
    super(id, state);
  }

  update(gameState) {
    const [roundSegmentTimerId, setRoundSegmentTimerId] = useState(0);
    const serverTimeOffset = useServerTimeOffset(db, 0);
    const [roundSegment, setRoundSegment] = useState(null);

    const estimatedServerTimeMs = Date.now() + serverTimeOffset;
    const roundDone = estimatedServerTimeMs >= getRoundOverallEndTime(gameState);

    // If you change this function, make sure to update the useEffect hook watch array below
    function gameTimers() {
      if (roundSegment == null) {
        // Even if it should be higher, the upcoming computed setTimeouts will just be < 0 and
        // immediately trigger
        setRoundSegment(-1);
      }

      if (roundSegment != null && !roundSegmentTimerId) {
        let roundSegmentTimerMs = getRoundSegmentEndTime(roundSegment, gameState) -
          estimatedServerTimeMs;
        if (roundSegment === LAST_ROUND_SEGMENT) {
          // console.log('last', roundSegmentTimerMs);
          setRoundSegmentTimerId(setTimeout(() => {
            setRoundSegment(null);
          }, roundSegmentTimerMs));
        }
        else {
          // console.log('not last', roundSegmentTimerMs);
          setRoundSegmentTimerId(setTimeout(() => {
            setRoundSegmentTimerId(0);
            setRoundSegment((roundSegment) => roundSegment + 1);
          }, roundSegmentTimerMs));
        }
      }
    }

    useEffect(() => {
      if (gameState.state === 'started' && !roundDone) {
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

    return roundSegment;
  }
});
