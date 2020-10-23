import {
  html,
  render,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';
import dialogPolyfill from 'https://cdn.skypack.dev/dialog-polyfill@^v0.5.3';

export function showPlayerRenameDialog({ name, setName }) {
  let dialogElement = document.createElement('dialog');
  const dialogContent = html`
    ${styles}
    <form method="dialog">
      <label>
        Player name:
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
    .buttons {
      margin-top: 8px;
    }
  </style>
`;
