import {
  component,
  html,
} from 'haunted';
import {
  useMachine,
} from 'haunted-robot';
import {
  createMachine,
  state,
  transition,
} from 'robot3';

const machine = createMachine({
  off: state(
    transition('toggle', 'on')
  ),
  on: state(
    transition('toggle', 'off')
  ),
});

function StateMachineDemo() {
  const [current, send] = useMachine(machine);

  return html`
    ${styles}
    <div>State: ${current.name}</div>
    <button @click=${() => send('toggle')}>
      Toggle
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
