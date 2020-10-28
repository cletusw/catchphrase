import {
  component,
  html,
} from 'haunted';
import {
  useMachine,
} from 'haunted-robot';
import {
  action,
  createMachine,
  invoke,
  reduce,
  state,
  transition,
} from 'robot3';

import {
  CountdownCanceled,
  preStartCountdown,
} from "./countdown-dialog.js";

async function wait(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function cooldownTimer() {
  await wait(2000);
}

function startGameTimer() {
  console.log('startGameTimer');
}

function cancelGameTimer() {
  console.log('cancelGameTimer');
}

function nextPlayer() {
  console.log('nextPlayer');
}

function newWord() {
  console.log('newWord');
}

function pointToOppositeTeam() {
  console.log('pointToOppositeTeam');
}

const machine = createMachine({
  joining: state(
    transition('start', 'starting'),
  ),
  starting: invoke(
    preStartCountdown,
    transition('done', 'started', action(startGameTimer)),
    transition('error', 'joining', reduce((ctx, ev) => {
      if (ev.error instanceof CountdownCanceled) {
        return;
      }
      throw ev.error;
    })),
  ),
  started: state(
    transition('got it', 'started', action(nextPlayer)),
    transition('skip', 'started', action(newWord)),
    transition('game timer', 'cooldown', action(pointToOppositeTeam)),
    transition('pause', 'awaitingNextRound', action(cancelGameTimer)),
  ),
  cooldown: invoke(
    cooldownTimer,
    transition('done', 'stealing'),
  ),
  stealing: state(
    transition('got it', 'awaitingNextRound', action(pointToOppositeTeam)),
    transition('start', 'starting'),
  ),
  awaitingNextRound: state(
    transition('start', 'starting'),
  ),
});

function StateMachineDemo() {
  const [current, send] = useMachine(machine);
  const state = current.name;

  return html`
    ${styles}
    <div>State: ${state}</div>
    <button @click=${() => send('start')}>
      Start
    </button>
    <button @click=${() => send('got it')}>
      Got it
    </button>
    <button @click=${() => send('skip')}>
      Skip
    </button>
    <button @click=${() => send('pause')}>
      Pause
    </button>
  `;
}

const styles = html`
  <style>
    :host {
      display: block;
    }
  </style>
`;

customElements.define('catchphrase-state-machine-demo', component(StateMachineDemo));
