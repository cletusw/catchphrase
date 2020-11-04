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
} from './game.js';
import { isLocalPlayer } from './player.js';
import {
  getMediumWord,
} from './word-generator.js';

const PRE_START_COUNTDOWN_SECONDS = 3;
const ROUND_SEGMENTS = 3;
const MINIMUM_PLAYERS_REQUIRED = 2; // TODO: 4 after implementing teams

const games = db.ref('games');

function GameView() {
  const {
    gameId,
    gameState,
    setGameState,
  } = useContext(GameContext);
  const [roundSegmentTimerId, setRoundSegmentTimerId] = useState(0);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  const [roundSegment, setRoundSegment] = useState(null);

  useEffect(() => {
    const offsetRef = db.ref('.info/serverTimeOffset');
    offsetRef.on('value', function (snapshot) {
      setServerTimeOffset(snapshot.val());
    });
  }, []);

  async function gameTimers() {
    // If you change this function, make sure to update the useEffect hook watch array below
    if (roundSegment == null) {
      setRoundSegment(-1);
      try {
        // TODO: Actually compute PRE_START_COUNTDOWN_SECONDS (e.g. in case of page refresh)
        await preStartCountdown(PRE_START_COUNTDOWN_SECONDS);
        setRoundSegment(0);
      } catch (error) {
        if (!(error instanceof CountdownCanceled)) {
          throw error;
        }
        endGame();
      }
    }
    else if (roundSegment >= 0 && !roundSegmentTimerId) {
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
          endGame();
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
      gameTimers(); // Note: This is asynchronous
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
  }, [gameState, serverTimeOffset, roundSegment])

  useEffect(() => {
    if (!gameId) {
      return;
    }

    const gameRef = games
      .child(gameId);

    const callback = gameRef.on('value', (snapshot) => {
      const gameState = snapshot.val();

      if (!gameState) {
        gameRef.set({
          state: 'joining',
        });
        return;
      }

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
        roundSegmentDurationSeconds: 4,
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
      .set({
        players: gameState.players,
        state: 'joining',
      });
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
    const minimumPlayersRequirementMet =
      gameState.players &&
      Object.keys(gameState.players).length >= MINIMUM_PLAYERS_REQUIRED;
    return html`
      <button
          ?disabled=${!minimumPlayersRequirementMet}
          @click=${startGame}>
        Start game
      </button>
      ${minimumPlayersRequirementMet ? '' : html`
        <span>${MINIMUM_PLAYERS_REQUIRED}+ players required</span>
      `}
    `;
  }

  function startedView() {
    const currentPlayerIsLocal = isLocalPlayer(gameState.currentPlayerId);
    return html`
      <div class="timer round-segment-${roundSegment}"></div>
      <div class="main${currentPlayerIsLocal ? ' current-player-is-local' : ''}">
        <div class="the-word">
          ${currentPlayerIsLocal ?
              getMediumWord(gameState.currentWordUnboundedIndex, gameState.wordListShuffleSeed) :
              ''}
        </div>
        <div class="buttons">
          <button @click=${nextPlayer}>
            Got it
          </button>
          <button @click=${nextWord}>
            Skip
          </button>
          <button @click=${endGame}>
            End game
          </button>
        </div>
      </div>
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
        if (roundSegment < 0) {
          return '';
        }
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
    .the-word {
      font-size: 2rem;
      padding: 3rem 1rem;
      text-align: center;
    }
    .main:not(.current-player-is-local) {
      display: none;
    }
  </style>
`;

customElements.define('catchphrase-game-view', component(GameView));
