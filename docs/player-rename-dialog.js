import {
  html,
  render,
} from 'haunted';
import dialogPolyfill from 'dialog-polyfill';

export function showPlayerRenameDialog({ name, setName }) {
  let dialogElement = document.createElement('dialog');
  const dialogContent = html`
    ${styles}
    <form method="dialog">
      <label>
        <div>Player name:</div>
        <input
            type="text"
            name="playerName"
            placeholder="Player name"
            required
            .value=${name}>
      </label>
      <div class="buttons">
        <!-- type="button" required to avoid implicit form submission -->
        <button type="button" @click=${handleCancelClick}>Cancel</button>
        <button type="submit" @click=${handleAcceptClick}>Accept</button>
      </div>
    </form>`;
  render(dialogContent, dialogElement);
  const playerNameElement = dialogElement.querySelector('input[name="playerName"]');
  document.body.appendChild(dialogElement);
  dialogPolyfill.registerDialog(dialogElement);
  dialogElement.addEventListener('close', handleClose);
  dialogElement.showModal();
  playerNameElement.select();

  function handleCancelClick(event) {
    // dialogElement.querySelector('form').noValidate = true;
    dialogElement.close('');
  }

  function handleAcceptClick(event) {
    dialogElement.returnValue = playerNameElement.value;
  }

  function handleClose(event) {
    const updatedPlayerName = dialogElement.returnValue.trim();

    dialogElement.remove();
    dialogElement = null;

    if (updatedPlayerName) {
      setName(updatedPlayerName);
    }
  }
}

const styles = html`
  <style>
    input {
      margin-top: 0.25rem;
    }
    .buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }
  </style>
`;
