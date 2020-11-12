import {
  createContext,
} from 'haunted';
import _ from 'lodash';

import { db } from './db.js';

const games = db.ref('games');

export const GameContext = createContext({
  gameId: '',
  setGameId: () => { },
  gameState: {
    state: '',
    players: [],
    // TODO: Need to specify everything here?
  },
  setGameState: () => { },
});

export const PRE_START_COUNTDOWN_SECONDS = 3;

const GAMEID_LENGTH = 9;
// Lots of letters removed for decreased ambiguity
const GAMEID_ALPHABET = '23456789abcdefghijkmnopqrstuvwxyz';
const MAX_ATTEMPTS = 3;

const GAME_ID_REGEX = new RegExp(
  `[${GAMEID_ALPHABET}]{3}-[${GAMEID_ALPHABET}]{3}-[${GAMEID_ALPHABET}]{3}`);

// Case insensitive -- make sure to toLowerCase before using
const GAME_ID_URL_REGEX = new RegExp('/(' + GAME_ID_REGEX.source + ')$', 'i');

export function extractGameIdFromUrl(url) {
  return GAME_ID_URL_REGEX.exec(url)?.[1]?.toLowerCase() ?? '';
}

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function createGameId() {
  // Groups of 3 characters separated by hyphens for easier reading
  const gameId = randomString(GAMEID_LENGTH, GAMEID_ALPHABET).match(/.{1,3}/g).join('-');
  validateGameId(gameId);
  return gameId;
}

export function validateGameId(potentialGameId) {
  return GAME_ID_REGEX.test(potentialGameId);
}

async function getUniqueGameId(games) {
  for (let i = MAX_ATTEMPTS; i > 0; i--) {
    const potentialGameId = createGameId();
    const potentialGame = games.child(potentialGameId)
    const potentialGameSnapshot = await potentialGame.child('state').once('value');
    if (!potentialGameSnapshot.exists()) {
      return potentialGameId;
    }
  }
  throw new Error('Unable to create a game. Please try again later.');
}

export async function createGame() {
  const gameId = await getUniqueGameId(games);
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  games.child(gameId).set({
    state: 'joining',
  });

  return gameId;
}

export function endGame(gameId, gameState) {
  if (!gameId) {
    throw new Error('Game ID missing');
  }
  if (!gameState) {
    throw new Error('Game state missing');
  }

  games
    .child(gameId)
    .set({
      players: gameState.players,
      state: 'joining',
    });
}

export function startGame(gameId, gameState) {
  if (!gameId) {
    throw new Error('Game ID missing');
  }
  if (!gameState) {
    throw new Error('Game state missing');
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
      team1Score: 0,
      team2Score: 0,
    });
}
