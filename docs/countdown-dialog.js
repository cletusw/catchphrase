import {
  html,
  render,
} from 'haunted';
import dialogPolyfill from 'dialog-polyfill';

export class CountdownCanceled { }

export async function preStartCountdown() {
  let cancelCountdown = false;
  const updateCountdown = showCountdownDialog(3, () => {
    cancelCountdown = true;
  });
  for await (let currentCount of countdown(3)) {
    // TODO: Find some way to interrupt instead of waiting up to a full second
    if (cancelCountdown) {
      throw new CountdownCanceled();
    }
    updateCountdown(currentCount);
  }
  if (cancelCountdown) {
    throw new CountdownCanceled();
  }
  updateCountdown(0);
}

async function* countdown(seconds) {
  for (let i = seconds; i > 0; i--) {
    yield i;
    await wait(1000);
  }
}

async function wait(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
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
      margin-top: 8px;
    }
  </style>
`;
