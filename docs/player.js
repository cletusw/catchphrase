import {
  ServerValue,
} from 'firebase/database';

import { db } from './db.js';

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
    order: ServerValue.TIMESTAMP,
  });
  // TODO: Persist to localStorage so we know which players we are
  return playerRef;
}

export function generateNickname() {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `Anonymous ${animal}`;
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
