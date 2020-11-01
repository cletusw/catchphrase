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
} from './game.js';
import {
  getMediumWord,
} from './word-generator.js';

const PRE_START_COUNTDOWN_SECONDS = 4;
const ROUND_SEGMENTS = 3;

const games = db.ref('games');

function GameView() {
  const {
    gameId,
    gameState,
    setGameState,
  } = useContext(GameContext);
  const [timerId, setTimerId] = useState(0);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  const [roundSegment, setRoundSegment] = useState(-1);

  useEffect(() => {
    const offsetRef = db.ref('.info/serverTimeOffset');
    offsetRef.on('value', function (snapshot) {
      setServerTimeOffset(snapshot.val());
    });
  }, []);

  useEffect(() => {
    if (gameState.state === 'started' && !timerId) {
      const estimatedServerTimeMs = Date.now() + serverTimeOffset;
      let roundSegmentTimerEndTimeMs =
        gameState.preStartCountdownStartTime +
        PRE_START_COUNTDOWN_SECONDS * 1000;
      for (let i = -1; i < roundSegment; i++) {
        roundSegmentTimerEndTimeMs += gameState.roundSegmentDurationSeconds * 1000;
      }
      if (roundSegment + 1 === ROUND_SEGMENTS) {
        // console.log('last', roundSegmentTimerEndTimeMs - estimatedServerTimeMs);
        setTimerId(setTimeout(() => {
          games
            .child(gameId)
            .update({
              state: 'joining',
            });
          setTimerId(0);
        }, roundSegmentTimerEndTimeMs - estimatedServerTimeMs));
      }
      else {
        // console.log('not last', roundSegmentTimerEndTimeMs - estimatedServerTimeMs);
        setTimerId(setTimeout(() => {
          setTimerId(0);
          setRoundSegment((roundSegment) => roundSegment + 1);
        }, roundSegmentTimerEndTimeMs - estimatedServerTimeMs));
      }
    }

    return function stopEffect() {
      if (timerId) {
        clearTimeout(timerId);
        setTimerId(0);
      }
    };
  }, [gameState, serverTimeOffset, roundSegment])

  useEffect(() => {
    if (!gameId) {
      return;
    }

    const gameRef = games
      .child(gameId);

    const callback = gameRef.on('value', (snapshot) => {
      const gameState = snapshot.val();
      // console.log('updating local game state', gameState);
      setGameState(gameState);
    });

    return function stopEffect() {
      gameRef.off('value', callback);
    };
  }, [gameId]);

  function startGame() {
    if (!gameId) {
      throw new Error('Game ID missing');
    }

    games
      .child(gameId)
      .update({
        state: 'started',
        preStartCountdownStartTime: firebase.database.ServerValue.TIMESTAMP,
        // TODO: Make random & different each segment
        roundSegmentDurationSeconds: 3,
        currentPlayerId: _.minBy(
          Object.keys(gameState.players),
          (key) => gameState.players[key].order),
        currentWordUnboundedIndex: 0,
        wordListShuffleSeed: _.random(0, Number.MAX_SAFE_INTEGER),
      });
  }

  function endGame() {
    games
      .child(gameId)
      .update({
        state: 'joining',
        preStartCountdownStartTime: null,
        roundSegmentDurationSeconds: null,
        currentPlayerId: null,
        currentWordUnboundedIndex: null,
        wordListShuffleSeed: null,
      });

    if (timerId) {
      clearTimeout(timerId);
      setTimerId(0);
    }
  }

  function nextPlayer() {
    const orderedPlayers = _
      .chain(gameState.players)
      .map((value, key) => ({
        id: key,
        name: value.name,
        order: value.order,
      }))
      .sortBy((player) => player.order)
      .value();
    const currentPlayerIndex =
      orderedPlayers.findIndex((player) => player.id === gameState.currentPlayerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % orderedPlayers.length;
    games
      .child(gameId)
      .update({
        currentPlayerId: orderedPlayers[nextPlayerIndex].id,
      });
    nextWord();
  }

  function nextWord() {
    games
      .child(gameId)
      .update({
        currentWordUnboundedIndex: gameState.currentWordUnboundedIndex + 1
      });
  }

  function joiningView() {
    return html`
      <button @click=${startGame}>
        Start game
      </button>
    `;
  }

  function startedView() {
    return html`
      <div>
        ${getMediumWord(gameState.currentWordUnboundedIndex, gameState.wordListShuffleSeed)}
      </div>
      <button @click=${nextPlayer}>
        Got it
      </button>
      <button @click=${nextWord}>
        Skip
      </button>
      <button @click=${endGame}>
        End game
      </button>
    `;
  }

  function body() {
    if (!gameId) {
      return '';
    }

    switch (gameState.state) {
      case undefined:
        return '';
      case 'joining':
        return joiningView();
      case 'started':
        return startedView();
      default:
        throw new Error('Invalid game state');
    }
  }

  return html`
    ${styles}
    ${body()}
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
  </style>
`;

customElements.define('catchphrase-game-view', component(GameView));
