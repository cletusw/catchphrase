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
  PRE_START_COUNTDOWN_SECONDS,
  endGame,
  startGame,
} from './game.js';
import { isLocalPlayer } from './player.js';
import { useServerTimeOffset } from './server-time-offset.js';
import {
  getMediumWord,
} from './word-generator.js';

const MINIMUM_PLAYERS_REQUIRED = 2; // TODO: 4 after implementing teams

const games = db.ref('games');

function GameView() {
  const {
    gameId,
    gameState,
    setGameState,
  } = useContext(GameContext);
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

  const serverTimeOffset = useServerTimeOffset(db, 0);
  const [showingCountdown, setShowingCountdown] = useState(false);
  useEffect(async () => {
    const estimatedServerTimeMs = Date.now() + serverTimeOffset;
    const desiredCountdownEndTime =
      gameState.preStartCountdownStartTime + PRE_START_COUNTDOWN_SECONDS * 1000;
    if (gameState.state !== 'started' || estimatedServerTimeMs >= desiredCountdownEndTime) {
      setShowingCountdown(false);
    }
    else if (!showingCountdown) {
      setShowingCountdown(true);
      try {
        await preStartCountdown(desiredCountdownEndTime - estimatedServerTimeMs);
      } catch (error) {
        if (!(error instanceof CountdownCanceled)) {
          throw error;
        }
        endGame(gameId, gameState);
      } finally {
        setShowingCountdown(false);
      }
    }
  }, [gameState, serverTimeOffset, showingCountdown])

  function startCurrentGame() {
    startGame(gameId, gameState);
  }

  function endCurrentGame() {
    endGame(gameId, gameState);
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
          @click=${startCurrentGame}>
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
      <div class="main${currentPlayerIsLocal ? ' current-player-is-local' : ''}">
        <div class="the-word">
          ${currentPlayerIsLocal ? getMediumWord(gameState.currentWordUnboundedIndex, gameState.wordListShuffleSeed) : ''}
        </div>
        <div class="buttons">
          <button @click=${nextPlayer}>
            Got it
          </button>
          <button @click=${nextWord}>
            Skip
          </button>
          <button @click=${endCurrentGame}>
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
        if (showingCountdown) {
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
