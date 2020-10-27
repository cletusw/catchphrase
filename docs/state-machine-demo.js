import {
  component,
  html,
} from 'haunted';
import {
  useMachine,
} from 'haunted-robot';
import {
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

const machine = createMachine({
  joining: state(
    transition('start', 'starting'),
  ),
  starting: invoke(
    preStartCountdown,
    transition('done', 'started'),
    transition('error', 'joining', reduce((ctx, ev) => {
      if (ev.error instanceof CountdownCanceled) {
        return;
      }
      throw ev.error;
    })),
  ),
  started: state(
  //   transition('toggle', 'off'),
  // ),
  // stealing: state(
  //   transition('toggle', 'off'),
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
