import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';

// ─── Version ──────────────────────────────────────────────────────────────────
const CARD_VERSION = '0.0.2';

// ─── Version History ──────────────────────────────────────────────────────────
// v0.0.2: Fix child card rendering: use hui-element .config property instead
//         of .setConfig() which is not available at createElement time
// v0.0.1: Phase 1 skeleton — hardcoded stub config, hui-element grid rendering,
//         hass propagation to child cards

// ─── Console log ──────────────────────────────────────────────────────────────
console.info(
  `%c CHRONO-%cGRID%c-CARD %c v${CARD_VERSION} `,
  'background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 0 2px 4px; border-radius: 3px 0 0 3px;',
  'background-color: #101010; color: #4676d3; font-weight: bold; padding: 2px 0;',
  'background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 4px 2px 0;',
  'background-color: #1E1E1E; color: #FFFFFF; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;'
);

// ─── Stub config (Phase 1 only — replaced by real config in Phase 2) ──────────
// Row 1: two cells (1fr + 2fr). Row 2: one full-width cell.
// Uses markdown cards so no entity references are needed.
const STUB_CONFIG = {
  rows: [
    {
      gap:   8,
      cells: [
        {
          width: '1fr',
          card:  { type: 'markdown', content: '**Cell 1.1** — width: 1fr' },
        },
        {
          width: '2fr',
          card:  { type: 'markdown', content: '**Cell 1.2** — width: 2fr' },
        },
      ],
    },
    {
      gap:   8,
      cells: [
        {
          width: '1fr',
          card:  { type: 'markdown', content: '**Cell 2.1** — full width (1fr)' },
        },
      ],
    },
  ],
};

// ─── Card ─────────────────────────────────────────────────────────────────────
class ChronoGridCard extends LitElement {
  static properties = {
    _config: { attribute: false },
  };

  static getCardSize() {
    return 3;
  }

  static getStubConfig() {
    return { ...STUB_CONFIG };
  }

  constructor() {
    super();
    this._config       = null;
    this._hass         = null;
    this._cardElements = [];
  }

  // ── hass setter: store and propagate to all child hui-elements ────────────
  set hass(hass) {
    this._hass = hass;
    this._cardElements.forEach(el => {
      if (el) el.hass = hass;
    });
  }

  get hass() {
    return this._hass;
  }

  // ── setConfig: store config and rebuild child element cache ───────────────
  setConfig(config) {
    this._config = config;
    this._rebuildCardElements();
    this.requestUpdate();
  }

  // ── _rebuildCardElements: create one hui-element per cell ─────────────────
  _rebuildCardElements() {
    const rows = (this._config ?? STUB_CONFIG).rows ?? [];
    this._cardElements = [];

    rows.forEach(row => {
      (row.cells ?? []).forEach(cell => {
        const el = document.createElement('hui-element');

        if (cell.card && Object.keys(cell.card).length > 0) {
          el.config = cell.card;
        }

        if (this._hass) {
          el.hass = this._hass;
        }

        this._cardElements.push(el);
      });
    });
  }

  // ── updated: imperatively mount each hui-element into its cell div ────────
  updated() {
    let idx        = 0;
    const rows     = (this._config ?? STUB_CONFIG).rows ?? [];

    rows.forEach((row, ri) => {
      (row.cells ?? []).forEach((cell, ci) => {
        const container = this.shadowRoot.querySelector(
          `.grid-cell[data-row="${ri}"][data-cell="${ci}"]`
        );

        if (container && this._cardElements[idx]) {
          if (!container.contains(this._cardElements[idx])) {
            container.innerHTML = '';
            container.appendChild(this._cardElements[idx]);
          }
        }

        idx++;
      });
    });
  }

  static styles = css`
    :host {
      display: block;
    }

    .grid-wrapper {
      display:          flex;
      flex-direction:   column;
      gap:              8px;
      padding:          8px;
      box-sizing:       border-box;
      background-color: var(--ha-card-background, var(--card-background-color, white));
      border-radius:    var(--ha-card-border-radius, var(--ha-border-radius-lg));
      border-width:     var(--ha-card-border-width, 1px);
      border-style:     solid;
      border-color:     var(--ha-card-border-color, var(--divider-color, #e0e0e0));
      box-shadow:       var(--ha-card-box-shadow, none);
    }

    .grid-row {
      display: grid;
    }

    .grid-cell {
      min-width:  0;
      box-sizing: border-box;
    }
  `;

  render() {
    const config = this._config ?? STUB_CONFIG;
    const rows   = config.rows ?? [];

    return html`
      <div class="grid-wrapper">
        ${rows.map((row, ri) => {
          const columns = (row.cells ?? []).map(c => c.width || '1fr').join(' ');
          const gap     = row.gap ?? 8;

          return html`
            <div
              class="grid-row"
              style="grid-template-columns: ${columns}; gap: ${gap}px;"
            >
              ${(row.cells ?? []).map((cell, ci) => html`
                <div
                  class="grid-cell"
                  data-row=${ri}
                  data-cell=${ci}
                ></div>
              `)}
            </div>
          `;
        })}
      </div>
    `;
  }
}
customElements.define('chrono-grid-card', ChronoGridCard);

// ─── Card registration ────────────────────────────────────────────────────────
window.customCards = window.customCards || [];
window.customCards.push({
  type:        'chrono-grid-card',
  name:        'Chrono Grid Card',
  description: 'A fully configurable grid wrapper card. Arrange any Home Assistant cards in rows and columns with full styling control.',
  preview:     false,
});
