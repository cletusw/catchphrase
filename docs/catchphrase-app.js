import {
  html,
  component,
  useState,
} from 'https://unpkg.com/haunted?module';

function CatchphraseApp() {
  const [count, setCount] = useState(0);

  return html`
    <h1>Catchphrase</h1>
    <div id="count">${count}</div>
    <button type="button" @click=${() => setCount(count + 1)}>
      Increment
    </button>
  `;
}

customElements.define('catchphrase-app', component(CatchphraseApp));
