import {
  component,
  html,
  useContext,
  useEffect,
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
  getRoundOverallEndTime,
  startGame,
  startNextRound,
} from './game.js';
import { isLocalPlayer } from './player.js';
import {
  useRoundSegment,
} from './round-segment.js';
import { useServerTimeOffset } from './server-time-offset.js';

const MINIMUM_PLAYERS_REQUIRED = 2; // TODO: 4 after implementing teams

const games = db.ref('games');

let inCountdown = false;

function GameButtons() {
  const {
    gameId,
    gameState,
  } = useContext(GameContext);

  const roundSegment = useRoundSegment(gameState);
  const serverTimeOffset = useServerTimeOffset(db, 0);
  const estimatedServerTimeMs = Date.now() + serverTimeOffset;
  const roundDone = estimatedServerTimeMs >= getRoundOverallEndTime(gameState);
  useEffect(async () => {
    // TODO: Fix showing after refresh when it should be hidden already
    if (roundSegment === -1 && !inCountdown) {
      inCountdown = true;
      const desiredCountdownEndTime =
        gameState.preStartCountdownStartTime + PRE_START_COUNTDOWN_SECONDS * 1000;
      try {
        // TODO: Shows NaN if cancelled for some reason
        // TODO: Not showing after End game then Start game
        await preStartCountdown(desiredCountdownEndTime - estimatedServerTimeMs);
      } catch (error) {
        if (!(error instanceof CountdownCanceled)) {
          throw error;
        }
        // TODO: Go to between rounds if game's already in progress
        endGame(gameId, gameState);
      } finally {
        inCountdown = false;
      }
    }
  }, [gameState, serverTimeOffset, roundSegment])

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

  function endRound() {
    games
      .child(gameId)
      .update({
        preStartCountdownStartTime: 0,
      });
  }

  function joiningView() {
    const minimumPlayersRequirementMet =
      gameState.players &&
      Object.keys(gameState.players).length >= MINIMUM_PLAYERS_REQUIRED;
    return html`
      <div class="container">
        <button
            ?disabled=${!minimumPlayersRequirementMet}
            @click=${() => startGame(gameId, gameState)}>
          Start game
        </button>
        <div ?hidden=${minimumPlayersRequirementMet}>
          ${MINIMUM_PLAYERS_REQUIRED}+ players required
        </div>
      </div>
    `;
  }

  function startedView() {
    return html`
      <div class="container">
        <button @click=${nextPlayer}>
          Got it
        </button>
        <div class="secondary-buttons">
          <button @click=${endRound}>
            Pause
          </button>
          <button @click=${nextWord}>
            Skip
          </button>
        </div>
      </div>
    `;
  }

  function betweenRoundsView() {
    return html`
      <div class="container">
        <button @click=${() => startNextRound(gameId)}>
          Start next round
        </button>
        <button @click=${() => endGame(gameId, gameState)}>
          End game
        </button>
      </div>
    `;
  }

  function body() {
    if (!gameId) {
      return '';
    }

    const currentPlayerIsLocal = isLocalPlayer(gameState.currentPlayerId);
    switch (gameState.state) {
      case undefined:
        return '';
      case 'joining':
        return joiningView();
      case 'started':
        if (roundSegment === -1 || !currentPlayerIsLocal) {
          return '';
        }
        if (roundDone) {
          // TODO: Wait 1 second before showing to avoid accidental clicks on "start new round"
          return betweenRoundsView();
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
    .container {
      display: grid;
      grid-template-rows: 48px 48px;
      gap: 64px;
      text-align: center;
      width: 100%;
    }
    .secondary-buttons {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      gap: 2rem;
    }
  </style>
`;

customElements.define('catchphrase-game-buttons', component(GameButtons));
