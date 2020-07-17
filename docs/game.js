import {db} from './firebase.js';

const GAMEID_LENGTH = 9;
// Lots of letters removed for decreased ambiguity
const GAMEID_ALPHABET = '23456789abcdefghijklmnopqrstuvwxyz';
const MAX_ATTEMPTS = 3;

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
  return /\w{3}-\w{3}-\w{3}/.test(potentialGameId);
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

export async function createGame(setGameId) {
  const games = db.ref('games');

  const gameId = await getUniqueGameId(games);
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  games.child(gameId).set({
    state: 'joining',
    members: [],
  });

  return gameId;
}
