import {
  html,
  render,
} from 'https://cdn.skypack.dev/haunted@^4.7.0';
import dialogPolyfill from 'https://cdn.skypack.dev/dialog-polyfill@^v0.5.3';

// Not using <form method="dialog"> because it doesn't respect `required` on Enter keypress
const dialogContent = ({ name, handleSubmit, handleCancelClick, handleAcceptClick }) => html`
  <form @submit=${handleSubmit}>
    <input
        type="text"
        name="playerName"
        placeholder="Player name"
        required
        value=${name}>
    <button @click=${handleCancelClick}>Cancel</button>
    <button @click=${handleAcceptClick}>Accept</button>
  </form>`;

export function showPlayerRenameDialog({ name = '', }) {
  const dialog = document.createElement('dialog');
  render(dialogContent({
    name,
    handleSubmit,
    handleCancelClick,
    handleAcceptClick,
  }), dialog);
  document.body.appendChild(dialog);
  dialogPolyfill.registerDialog(dialog);
  function handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
    }
  }
  function handleAcceptClick(event) {
  }
  function handleCancelClick(event) {
    dialog.querySelector('form').noValidate = true;
    dialog.close('');
  }
  dialog.addEventListener('submit', (event) => {
    dialog.returnValue = event.target.elements.playerName.value;
  });
  dialog.addEventListener('close', (event) => {
    console.log('close', event.returnValue, `"${dialog.returnValue}"`);
  });
  // dialog.addEventListener('cancel', (event) => {
  //   console.log('cancel', event.returnValue, dialog.returnValue);
  // });
  dialog.showModal();
  dialog.querySelector('input[name="playerName"]').select();
}
