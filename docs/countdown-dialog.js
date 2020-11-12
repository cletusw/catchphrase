import {
  html,
  render,
} from 'haunted';
import dialogPolyfill from 'dialog-polyfill';

export class CountdownCanceled { }

export async function preStartCountdown(milliseconds) {
  await new Promise((resolve, reject) => {
    let timerId = 0;
    let currentCount = Math.ceil(milliseconds / 1000.0);
    const updateCountdown = showCountdownDialog(currentCount, () => {
      clearTimeout(timerId);
      timerId = 0;
      return reject(new CountdownCanceled());
    });
    const timerTick = () => {
      currentCount--;
      updateCountdown(currentCount);
      if (currentCount === 0) {
        return resolve();
      }
      timerId = setTimeout(timerTick, 1000); // TODO: Compute actual value
    };
    timerId = setTimeout(timerTick, milliseconds % 1000);
  });
}

function showCountdownDialog(initialValue, cancelCallback) {
  let dialogElement = document.createElement('dialog');
  const dialogContent = (currentCount) => html`
    ${styles}
    <form method="dialog">
      <div class="current-count">${currentCount}</div>
      <button @click=${handleCancelClick}>Cancel</button>
    </form>
  `;
  render(dialogContent(initialValue), dialogElement);
  document.body.appendChild(dialogElement);
  dialogPolyfill.registerDialog(dialogElement);
  dialogElement.addEventListener('close', handleClose);
  dialogElement.showModal();

  function handleCancelClick() {
    cancelCallback();
  }

  function handleClose() {
    dialogElement.remove();
    dialogElement = null;
  }

  return function updateValue(currentValue) {
    if (currentValue === 0) {
      handleClose();
      return;
    }
    if (!dialogElement) {
      throw new Error('Countdown dialog already closed');
    }

    render(dialogContent(currentValue), dialogElement);
  };
}

const styles = html`
  <style>
    .current-count {
      font-size: 4rem;
      text-align: center;
    }
    button {
      margin-top: 0.5rem;
    }
  </style>
`;
