import { db } from './db.js';

// TODO: Listen to firebase player remove events so we can un-persist from localStorage & inform user

export function addNewPlayerToGame({
  name = generateNickname(),
  gameId,
}) {
  const game = db.ref('games').child(gameId);
  const playerRef = game.child('players').push();
  playerRef.set({
    name,
    // Note this causes things to render twice. Initially Firebase uses the current local timestamp
    // (and triggers a 'value' snapshot event), then on the server it gets overwritten to the
    // current server timestamp (causing another 'value' event).
    order: firebase.database.ServerValue.TIMESTAMP,
  });
  addPlayerToLocalStorage(playerRef.key);
  return playerRef;
}

export function generateNickname() {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `Anonymous ${animal}`;
}

export function isLocalPlayer(id) {
  return getLocalPlayerIds().includes(id);
}

function getLocalPlayerIds() {
  return getLocalStorageArray(
    localStorage.getItem('localPlayers'),
    clearPlayersInLocalStorage);
}

// Memoizing has no benefit even with 8 players
function getLocalStorageArray(storageItem, clearStorageItem) {
  let parsedArray = [];

  if (storageItem) {
    try {
      parsedArray = JSON.parse(storageItem);
    } catch (e) {
      clearStorageItem();
    }

    if (!Array.isArray(parsedArray)) {
      clearStorageItem();
      parsedArray = [];
    }
  }

  return parsedArray;
}

function addPlayerToLocalStorage(id) {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid player ID');
  }

  let players = getLocalPlayerIds();

  players.push(id);

  setPlayersInLocalStorage(players);
}

function setPlayersInLocalStorage(players) {
  localStorage.setItem('localPlayers', JSON.stringify(players));
}

function clearPlayersInLocalStorage() {
  localStorage.removeItem('localPlayers');
}

const ANIMALS = [
  "Alligator",
  "Ant",
  "Bear",
  "Bee",
  "Bird",
  "Camel",
  "Cat",
  "Cheetah",
  "Chicken",
  "Chimpanzee",
  "Cow",
  "Crocodile",
  "Deer",
  "Dog",
  "Dolphin",
  "Duck",
  "Eagle",
  "Elephant",
  "Fish",
  "Fly",
  "Fox",
  "Frog",
  "Giraffe",
  "Goat",
  "Goldfish",
  "Hamster",
  "Hippopotamus",
  "Horse",
  "Kangaroo",
  "Kitten",
  "Lion",
  "Lobster",
  "Monkey",
  "Octopus",
  "Owl",
  "Panda",
  "Pig",
  "Puppy",
  "Rabbit",
  "Rat",
  "Scorpion",
  "Seal",
  "Shark",
  "Sheep",
  "Snail",
  "Snake",
  "Spider",
  "Squirrel",
  "Tiger",
  "Turtle",
  "Wolf",
  "Zebra",
];
