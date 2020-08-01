import {
  Sortable,
} from 'https://cdn.skypack.dev/sortablejs@^1.10.2/modular/sortable.esm.js';

class SortableList extends HTMLOListElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.sortable = Sortable.create(this, {
      // Otherwise dragging item opacity is capped by the browser at too low a value
      forceFallback: true,
      animation: 150,
      onStart: () => {
        document.body.classList.toggle('dragging', true);
        this.classList.toggle('dragging', true);
      },
      onEnd: () => {
        this.classList.toggle('dragging', false);
        document.body.classList.toggle('dragging', false);
      },
    });
  }

  disconnectedCallback() {
    this.sortable.destroy();
  }
}

customElements.define('catchphrase-sortable-list', SortableList, {
  extends: 'ol',
});
