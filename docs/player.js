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

export function getLocalPlayerIds() {
  let players = [];

  if (localStorage.getItem('localPlayers')) {
    try {
      players = JSON.parse(localStorage.getItem('localPlayers'));
    } catch(e) {
      localStorage.removeItem('localPlayers');
    }

    if (!Array.isArray(players)) {
      localStorage.removeItem('localPlayers');
      players = [];
    }
  }

  return players;
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
