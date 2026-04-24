import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0/index.js?module';
import { live }                  from 'https://unpkg.com/lit@2.0.0/directives/live.js?module';
import { styleMap }              from 'https://unpkg.com/lit@2.0.0/directives/style-map.js?module';
import { unsafeHTML }            from 'https://unpkg.com/lit@2.0.0/directives/unsafe-html.js?module';

// ─── Version ──────────────────────────────────────────────────────────────────
const CARD_VERSION = '0.0.9';

// ─── MDI icon paths ───────────────────────────────────────────────────────────
const mdiDragHorizontalVariant = 'M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z';

// ─── Version History ──────────────────────────────────────────────────────────
// v0.0.9: Diagnostics: fire show-dialog on window instead of this; remove
//         lovelace guard; add console.log to trace _pickCard execution
// v0.0.3: Use loadCardHelpers().createCardElement() for correct scoped
//         registry child card creation
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

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_CELL = {
  width:            '1fr',
  background_color: '',
  border_width:     0,
  border_style:     'solid',
  border_color:     '',
  border_radius:    0,
  padding_top:      0,
  padding_bottom:   0,
  padding_left:     0,
  padding_right:    0,
  card:             {},
};

const DEFAULT_ROW = {
  gap:              8,
  background_color: '',
  border_width:     0,
  border_style:     'solid',
  border_color:     '',
  border_radius:    0,
  padding_top:      0,
  padding_bottom:   0,
  padding_left:     0,
  padding_right:    0,
  cells:            [],
};

const DEFAULT_CONFIG = {
  background_color: '',
  border_width:     1,
  border_style:     'solid',
  border_color:     '',
  border_radius:    12,
  padding_top:      8,
  padding_bottom:   8,
  padding_left:     8,
  padding_right:    8,
  box_shadow:       '',
  rows:             [],
};

// ─── Numeric keys ─────────────────────────────────────────────────────────────
const NUMERIC_CONFIG_KEYS = new Set([
  'border_width', 'border_radius',
  'padding_top', 'padding_bottom', 'padding_left', 'padding_right',
]);

const NUMERIC_ROW_KEYS = new Set([
  'gap', 'border_width', 'border_radius',
  'padding_top', 'padding_bottom', 'padding_left', 'padding_right',
]);

const NUMERIC_CELL_KEYS = new Set([
  'border_width', 'border_radius',
  'padding_top', 'padding_bottom', 'padding_left', 'padding_right',
]);

// ─── cgParseNumber ────────────────────────────────────────────────────────────
function cgParseNumber(raw) {
  const v = String(raw).replace(',', '.');
  if (v === '-' || v === '-0' || v.endsWith('.')) return null;
  if (v.includes('.') && v.endsWith('0'))         return null;
  if (v === '')                                    return undefined;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

// ─── cgTextField ──────────────────────────────────────────────────────────────
function cgTextField(label, value, onChange, opts = {}) {
  return html`
    <div class="text-field">
      <label>${unsafeHTML(label)}</label>
      <chrono-cg-textfield
        .value=${String(value ?? '')}
        type=${opts.type ?? 'text'}
        step=${opts.step ?? ''}
        min=${opts.min ?? ''}
        max=${opts.max ?? ''}
        @input=${onChange}
      ></chrono-cg-textfield>
    </div>
  `;
}

// ─── cgColorPicker ────────────────────────────────────────────────────────────
function cgColorPicker(label, value, onChange) {
  const swatchValue = value || '#000000';
  return html`
    <div class="text-field">
      <label>${unsafeHTML(label)}</label>
      <div class="color-picker-row">
        <input type="color" .value=${swatchValue} @input=${onChange}
          @change=${(e) => { if (e.target.value !== '#000000') onChange(e); }}>
        <chrono-cg-textfield
          .value=${String(value ?? '')}
          @input=${onChange}
        ></chrono-cg-textfield>
      </div>
    </div>
  `;
}

// ─── cgSelectField ────────────────────────────────────────────────────────────
function cgSelectField(label, value, options, onChange) {
  return html`
    <div class="text-field">
      <label>${unsafeHTML(label)}</label>
      <chrono-cg-select
        .value=${value ?? ''}
        .options=${options}
        @change=${onChange}
      ></chrono-cg-select>
    </div>
  `;
}

// ─── CgTextfield component ────────────────────────────────────────────────────
class CgTextfield extends LitElement {
  static properties = {
    value:       { type: String },
    type:        { type: String },
    step:        { type: String },
    min:         { type: String },
    max:         { type: String },
    placeholder: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      height: 56px;
      padding: 0 12px;
      background: var(--input-fill-color, rgba(0,0,0,0.06));
      border: none;
      border-bottom: 1px solid var(--secondary-text-color, #888);
      border-radius: 4px 4px 0 0;
      color: var(--primary-text-color);
      font-size: 16px;
      font-family: inherit;
      outline: none;
      transition: border-bottom-color 0.2s;
    }
    input:focus {
      border-bottom: 2px solid var(--primary-color);
    }
  `;

  render() {
    return html`
      <input
        .value=${live(this.value ?? '')}
        type=${this.type ?? 'text'}
        step=${this.step ?? ''}
        min=${this.min ?? ''}
        max=${this.max ?? ''}
        placeholder=${this.placeholder ?? ''}
        @input=${e => {
          this.value = e.target.value;
          this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }}
      >
    `;
  }
}
customElements.define('chrono-cg-textfield', CgTextfield);

// ─── CgButtonToggleGroup component ────────────────────────────────────────────
class CgButtonToggleGroup extends LitElement {
  static properties = {
    value:   { type: String },
    options: { type: Array },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }
    button {
      min-width: 70px;
      height: 36px;
      padding: 0 12px;
      border: none;
      border-left: 1px solid var(--ha-color-border-neutral-quiet, #444);
      cursor: pointer;
      font-size: 14px;
      font-family: inherit;
      color: var(--primary-text-color);
      background: var(--ha-color-fill-primary-normal-resting, #002e3e);
      transition: background 0.15s;
    }
    button:first-child {
      border-left: none;
      border-radius: 9999px 0 0 9999px;
    }
    button:last-child {
      border-radius: 0 9999px 9999px 0;
    }
    button.only {
      border-radius: 9999px;
    }
    button.active {
      background: var(--ha-color-fill-primary-loud-resting, #009ac7);
    }
    button:not(.active):hover {
      background: var(--ha-color-fill-primary-quiet-hover, #004156);
    }
  `;

  render() {
    const opts = this.options ?? [];
    return html`${opts.map((opt, i) => {
      const isOnly   = opts.length === 1;
      const isActive = opt.value === this.value;
      const cls      = [isActive ? 'active' : '', isOnly ? 'only' : ''].filter(Boolean).join(' ');
      return html`<button class="${cls}" @click=${() => this._select(opt.value)}>${opt.label}</button>`;
    })}`;
  }

  _select(value) {
    this.value = value;
    this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }));
  }
}
customElements.define('chrono-cg-button-toggle-group', CgButtonToggleGroup);

// ─── CgSelect component ───────────────────────────────────────────────────────
class CgSelect extends LitElement {
  static properties = {
    value:   { type: String },
    options: { type: Array },
    _open:   { state: true },
    _cursor: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      position: relative;
    }
    .combobox {
      display: flex;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      height: 56px;
      background: var(--input-fill-color, rgba(0,0,0,0.06));
      border: none;
      border-bottom: 1px solid var(--secondary-text-color, #888);
      border-radius: 4px 4px 0 0;
      transition: border-bottom-color 0.2s;
    }
    .combobox:focus-within,
    .combobox-open {
      border-bottom: 2px solid var(--primary-color);
    }
    .combobox-input {
      flex: 1;
      height: 100%;
      padding: 0 8px 0 12px;
      background: transparent;
      border: none;
      color: var(--primary-text-color);
      font-size: 16px;
      font-family: inherit;
      outline: none;
      min-width: 0;
      box-sizing: border-box;
    }
    .combobox-chevron {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 100%;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-size: 12px;
      flex-shrink: 0;
      user-select: none;
    }
    .combobox-chevron:hover {
      color: var(--primary-text-color);
    }
    .combobox-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 9999;
      background: var(--card-background-color, #1c1c1c);
      border: 1px solid var(--divider-color, #444);
      border-radius: 0 0 4px 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      max-height: 240px;
      overflow-y: auto;
      margin-top: 1px;
    }
    .combobox-option {
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      color: var(--primary-text-color);
      cursor: pointer;
      transition: background 0.1s;
    }
    .combobox-option:hover {
      background: var(--secondary-background-color, rgba(255,255,255,0.08));
    }
    .combobox-option-selected {
      color: var(--primary-color);
    }
    .combobox-option-cursor {
      background: var(--secondary-background-color, rgba(255,255,255,0.08));
    }
  `;

  constructor() {
    super();
    this.value           = '';
    this.options         = [];
    this._open           = false;
    this._cursor         = -1;
    this._onOutsideClick = this._onOutsideClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onOutsideClick);
  }

  _onOutsideClick(e) {
    if (!this.shadowRoot.contains(e.composedPath()[0]) && e.composedPath()[0] !== this) {
      this._open   = false;
      this._cursor = -1;
    }
  }

  _select(value) {
    this.value   = value;
    this._open   = false;
    this._cursor = -1;
    this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }));
  }

  _handleKeyDown(e) {
    const opts = this.options ?? [];
    if (!this._open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        this._open   = true;
        this._cursor = 0;
        e.preventDefault();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      this._cursor = Math.min(this._cursor + 1, opts.length - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      this._cursor = Math.max(this._cursor - 1, 0);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (this._cursor >= 0 && this._cursor < opts.length) {
        this._select(opts[this._cursor].value);
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      this._open   = false;
      this._cursor = -1;
      e.preventDefault();
    }
  }

  render() {
    const opts = this.options ?? [];
    return html`
      <div class="combobox ${this._open ? 'combobox-open' : ''}">
        <input
          class="combobox-input"
          .value=${live(this.value ?? '')}
          @input=${e => {
            this.dispatchEvent(new CustomEvent('change', {
              detail:   { value: e.target.value },
              bubbles:  true,
              composed: true,
            }));
          }}
          @blur=${() => { this._open = false; this._cursor = -1; }}
          @keydown=${this._handleKeyDown}
        >
        <div
          class="combobox-chevron"
          @click=${() => { this._open = !this._open; this._cursor = -1; this.shadowRoot.querySelector('.combobox-input').focus(); }}
          aria-hidden="true"
        >${this._open ? '▴' : '▾'}</div>
      </div>
      ${this._open ? html`
        <div class="combobox-dropdown">
          ${opts.map((opt, i) => html`
            <div
              class="combobox-option
                     ${opt.value === this.value ? 'combobox-option-selected' : ''}
                     ${i === this._cursor       ? 'combobox-option-cursor'   : ''}"
              @mousedown=${(e) => { e.preventDefault(); this._select(opt.value); }}
            >${opt.label}</div>
          `)}
        </div>
      ` : ''}
    `;
  }
}
customElements.define('chrono-cg-select', CgSelect);

// ─── Editor ───────────────────────────────────────────────────────────────────
class ChronoGridCardEditor extends LitElement {
  static properties = {
    hass:     { attribute: false },
    lovelace: { attribute: false },
    _config:  { state: true },
  };

  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  // ── Config dispatch helper ─────────────────────────────────────────────────
  _dispatchConfig() {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail:   { config: this._config },
      bubbles:  true,
      composed: true,
    }));
  }

  // ── Wrapper-level property changed ─────────────────────────────────────────
  _valueChanged(key, e) {
    if (!this._config) return;
    const raw = e.target.value ?? e.detail?.value;
    let value;
    if (NUMERIC_CONFIG_KEYS.has(key)) {
      const parsed = cgParseNumber(raw);
      if (parsed === null)      return;
      if (parsed === undefined) value = DEFAULT_CONFIG[key];
      else                      value = parsed;
    } else {
      value = raw;
    }
    this._config = { ...this._config, [key]: value };
    this._dispatchConfig();
  }

  // ── Row-level property changed ─────────────────────────────────────────────
  _rowChanged(ri, key, e) {
    if (!this._config) return;
    const raw = e.target.value ?? e.detail?.value;
    let value;
    if (NUMERIC_ROW_KEYS.has(key)) {
      const parsed = cgParseNumber(raw);
      if (parsed === null)      return;
      if (parsed === undefined) value = DEFAULT_ROW[key];
      else                      value = parsed;
    } else {
      value = raw;
    }
    const rows = this._config.rows.map((r, i) => i === ri ? { ...r, [key]: value } : r);
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  // ── Cell-level property changed ────────────────────────────────────────────
  _cellChanged(ri, ci, key, e) {
    if (!this._config) return;
    const raw = e.target.value ?? e.detail?.value;
    let value;
    if (NUMERIC_CELL_KEYS.has(key)) {
      const parsed = cgParseNumber(raw);
      if (parsed === null)      return;
      if (parsed === undefined) value = DEFAULT_CELL[key];
      else                      value = parsed;
    } else {
      value = raw;
    }
    const rows = this._config.rows.map((r, i) => {
      if (i !== ri) return r;
      const cells = r.cells.map((c, j) => j === ci ? { ...c, [key]: value } : c);
      return { ...r, cells };
    });
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  // ── Card editor element cache (keyed by "ri-ci") ──────────────────────────
  _cardEditorElements = new Map();

  // ── Open HA card picker dialog with saveCard callback ─────────────────────
  _pickCard(ri, ci) {
    if (!this._config) return;
    console.log('chrono-grid-card: _pickCard called', ri, ci, 'lovelace:', this.lovelace);
    const lovelace = this.lovelace ?? { config: { views: [] } };
    window.dispatchEvent(new CustomEvent('show-dialog', {
      bubbles:  true,
      composed: true,
      detail: {
        dialogTag:    'hui-dialog-create-card',
        dialogParams: {
          lovelaceConfig: lovelace,
          saveConfig:     () => {},
          path:           [0],
          saveCard: (cardConfig) => {
            console.log('chrono-grid-card: card picked', cardConfig);
            const rows = this._config.rows.map((r, i) => {
              if (i !== ri) return r;
              const cells = r.cells.map((c, j) => j === ci ? { ...c, card: cardConfig } : c);
              return { ...r, cells };
            });
            this._config = { ...this._config, rows };
            this._cardEditorElements.delete(`${ri}-${ci}`);
            this._dispatchConfig();
          },
        },
      },
    }));
  }

  // ── Card config changed inside imperatively mounted hui-card-element-editor ─
  _cardConfigChanged(ri, ci, e) {
    e.stopPropagation();
    if (!this._config) return;
    const card = e.detail.config;
    const rows = this._config.rows.map((r, i) => {
      if (i !== ri) return r;
      const cells = r.cells.map((c, j) => j === ci ? { ...c, card } : c);
      return { ...r, cells };
    });
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  // ── Clear card config (back to pick card button) ───────────────────────────
  _clearCard(ri, ci) {
    if (!this._config) return;
    this._cardEditorElements.delete(`${ri}-${ci}`);
    const rows = this._config.rows.map((r, i) => {
      if (i !== ri) return r;
      const cells = r.cells.map((c, j) => j === ci ? { ...c, card: {} } : c);
      return { ...r, cells };
    });
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  // ── updated: imperatively mount hui-card-element-editor into each cell ─────
  updated() {
    const rows = this._config?.rows ?? [];
    rows.forEach((row, ri) => {
      (row.cells ?? []).forEach((cell, ci) => {
        if (!cell.card || Object.keys(cell.card).length === 0) return;
        const key       = `${ri}-${ci}`;
        const container = this.shadowRoot.querySelector(`.card-editor-mount[data-row="${ri}"][data-cell="${ci}"]`);
        if (!container) return;

        let el = this._cardEditorElements.get(key);
        if (!el) {
          el = document.createElement('hui-card-element-editor');
          el.addEventListener('config-changed', e => this._cardConfigChanged(ri, ci, e));
          this._cardEditorElements.set(key, el);
        }

        el.hass     = this.hass;
        el.lovelace = this.lovelace;
        el.value    = cell.card;

        if (!container.contains(el)) {
          container.innerHTML = '';
          container.appendChild(el);
        }
      });
    });
  }

  // ── Row management ─────────────────────────────────────────────────────────
  _addRow() {
    const rows = [...(this._config.rows ?? []), {
      ...DEFAULT_ROW,
      cells: [{ ...DEFAULT_CELL }],
    }];
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  _removeRow(ri) {
    const rows = this._config.rows.filter((_, i) => i !== ri);
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  _duplicateRow(ri) {
    const row  = JSON.parse(JSON.stringify(this._config.rows[ri]));
    const rows = [...this._config.rows];
    rows.splice(ri + 1, 0, row);
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  _rowMoved(e) {
    e.stopPropagation();
    const { oldIndex, newIndex } = e.detail;
    const rows = [...this._config.rows];
    rows.splice(newIndex, 0, rows.splice(oldIndex, 1)[0]);
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  // ── Cell management ────────────────────────────────────────────────────────
  _addCell(ri) {
    const rows = this._config.rows.map((r, i) => {
      if (i !== ri) return r;
      return { ...r, cells: [...r.cells, { ...DEFAULT_CELL }] };
    });
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  _removeCell(ri, ci) {
    const rows = this._config.rows.map((r, i) => {
      if (i !== ri) return r;
      return { ...r, cells: r.cells.filter((_, j) => j !== ci) };
    });
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  _cellMoved(ri, e) {
    e.stopPropagation();
    const { oldIndex, newIndex } = e.detail;
    const rows = this._config.rows.map((r, i) => {
      if (i !== ri) return r;
      const cells = [...r.cells];
      cells.splice(newIndex, 0, cells.splice(oldIndex, 1)[0]);
      return { ...r, cells };
    });
    this._config = { ...this._config, rows };
    this._dispatchConfig();
  }

  // ── Option arrays ──────────────────────────────────────────────────────────
  _borderStyleOptions = [
    { label: 'Solid',  value: 'solid'  },
    { label: 'Dashed', value: 'dashed' },
    { label: 'Dotted', value: 'dotted' },
    { label: 'Double', value: 'double' },
    { label: 'None',   value: 'none'   },
  ];

  static styles = css`

    /* ── Expansion panel spacing ───────────────────────────────────────────── */

    ha-expansion-panel {
      margin-top: 8px;
    }

    /* ── Wrapper grid rows ─────────────────────────────────────────────────── */

    .wrapper-bg-padding {
      display: grid;
      grid-template-columns: 11fr 4fr 4fr 4fr 4fr;
      gap: 8px;
      align-items: end;
      margin-bottom: 8px;
    }

    .wrapper-border {
      display: grid;
      grid-template-columns: 12fr 5fr 5fr 8fr;
      gap: 8px;
      align-items: end;
      margin-bottom: 8px;
    }

    /* ── Row grid rows ─────────────────────────────────────────────────────── */

    .row-gap-color {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 8px;
      align-items: end;
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .row-border {
      display: grid;
      grid-template-columns: 12fr 5fr 5fr 8fr;
      gap: 8px;
      align-items: end;
      margin-bottom: 8px;
    }

    .row-padding {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      align-items: end;
      margin-bottom: 8px;
    }

    /* ── Cell grid rows ────────────────────────────────────────────────────── */

    .cell-width {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      align-items: end;
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .cell-bg-color {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      align-items: end;
      margin-bottom: 8px;
    }

    .cell-border {
      display: grid;
      grid-template-columns: 12fr 5fr 5fr 8fr;
      gap: 8px;
      align-items: end;
      margin-bottom: 8px;
    }

    .cell-padding {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      align-items: end;
      margin-bottom: 8px;
    }

    /* ── Text fields ───────────────────────────────────────────────────────── */

    .text-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .text-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      white-space: pre-line;
    }

    /* ── Color picker row ──────────────────────────────────────────────────── */

    .color-picker-row {
      display: flex;
      align-items: stretch;
      gap: 6px;
    }

    .color-picker-row input[type="color"] {
      width: 40px;
      min-width: 40px;
      height: 56px;
      padding: 4px;
      border: none;
      border-bottom: 1px solid var(--secondary-text-color, #888);
      border-radius: 4px 4px 0 0;
      background: var(--input-fill-color, rgba(0,0,0,0.06));
      cursor: pointer;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .color-picker-row chrono-cg-textfield {
      flex: 1;
    }

    /* ── Drag handle ───────────────────────────────────────────────────────── */

    .handle {
      cursor: grab;
      padding: 0 4px;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
    }

    .handle > * {
      pointer-events: none;
    }

    /* ── Cells list (indented to show nesting) ─────────────────────────────── */

    .cells-list {
      margin-left: 12px;
    }

    /* ── Add button ────────────────────────────────────────────────────────── */

    .add-btn-row {
      display: flex;
      justify-content: center;
      margin-top: 12px;
      margin-bottom: 4px;
    }

    .add-btn {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: 0.0892857em;
      text-transform: uppercase;
      height: 36px;
      padding: 0 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .add-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }

    /* ── Remove button ─────────────────────────────────────────────────────── */

    .remove-btn {
      background: none;
      border: none;
      color: var(--error-color, #f44336);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: 0.0892857em;
      text-transform: uppercase;
      height: 36px;
      padding: 0 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .remove-btn:hover {
      background: rgba(244, 67, 54, 0.08);
    }

    /* ── Duplicate button ──────────────────────────────────────────────────── */

    .duplicate-btn {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: 0.0892857em;
      text-transform: uppercase;
      height: 36px;
      padding: 0 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .duplicate-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }

    /* ── Row action buttons (duplicate + remove) ───────────────────────────── */

    .row-action-btns {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 8px;
      margin-bottom: 4px;
    }

    /* ── Card editor section ───────────────────────────────────────────────── */

    .cell-card-editor {
      margin-top: 8px;
    }

    .cell-card-editor hui-card-element-editor {
      display: block;
    }

    .pick-card-row {
      display: flex;
      justify-content: center;
      margin-top: 8px;
      margin-bottom: 4px;
    }

    .change-card-row {
      display: flex;
      justify-content: center;
      margin-top: 4px;
      margin-bottom: 4px;
    }

    .change-card-btn {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      letter-spacing: 0.0892857em;
      text-transform: uppercase;
      height: 36px;
      padding: 0 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .change-card-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }

  `;

  render() {
    if (!this._config) return html``;

    const c    = this._config;
    const rows = c.rows ?? [];

    return html`

      <!-- ── Appearance section ───────────────────────────────────────────── -->

      <ha-expansion-panel header="Appearance" outlined .expanded=${true}>

        <!-- Row 1: Background color + Padding -->
        <div class="wrapper-bg-padding">
          ${cgColorPicker('Background color\n<i>leave empty for default</i>', c.background_color, e => this._valueChanged('background_color', e))}
          ${cgTextField('Padding\ntop (px)',    c.padding_top,    e => this._valueChanged('padding_top',    e), { type: 'number', step: '1', min: '0' })}
          ${cgTextField('Padding\nbottom (px)', c.padding_bottom, e => this._valueChanged('padding_bottom', e), { type: 'number', step: '1', min: '0' })}
          ${cgTextField('Padding\nleft (px)',   c.padding_left,   e => this._valueChanged('padding_left',   e), { type: 'number', step: '1', min: '0' })}
          ${cgTextField('Padding\nright (px)',  c.padding_right,  e => this._valueChanged('padding_right',  e), { type: 'number', step: '1', min: '0' })}
        </div>

        <!-- Row 2: Border -->
        <div class="wrapper-border">
          ${cgColorPicker('Border color', c.border_color, e => this._valueChanged('border_color', e))}
          ${cgTextField('Width (px)',  c.border_width,  e => this._valueChanged('border_width',  e), { type: 'number', step: '1', min: '0' })}
          ${cgTextField('Radius (px)', c.border_radius, e => this._valueChanged('border_radius', e), { type: 'number', step: '1', min: '0' })}
          ${cgSelectField('Style', c.border_style, this._borderStyleOptions, e => this._valueChanged('border_style', e))}
        </div>

      </ha-expansion-panel>

      <!-- ── Rows section ─────────────────────────────────────────────────── -->

      <ha-sortable handle-selector=".handle" @item-moved=${this._rowMoved}>
        <div class="rows-list">
          ${rows.map((row, ri) => html`
            <ha-expansion-panel outlined header="Row ${ri + 1}">

              <div class="handle" slot="leading-icon">
                <ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon>
              </div>

              <!-- Row: gap + background color -->
              <div class="row-gap-color">
                ${cgTextField('Gap (px)', row.gap, e => this._rowChanged(ri, 'gap', e), { type: 'number', step: '1', min: '0' })}
                ${cgColorPicker('Background color', row.background_color, e => this._rowChanged(ri, 'background_color', e))}
              </div>

              <!-- Row: border -->
              <div class="row-border">
                ${cgColorPicker('Border color', row.border_color, e => this._rowChanged(ri, 'border_color', e))}
                ${cgTextField('Width (px)',  row.border_width,  e => this._rowChanged(ri, 'border_width',  e), { type: 'number', step: '1', min: '0' })}
                ${cgTextField('Radius (px)', row.border_radius, e => this._rowChanged(ri, 'border_radius', e), { type: 'number', step: '1', min: '0' })}
                ${cgSelectField('Style', row.border_style, this._borderStyleOptions, e => this._rowChanged(ri, 'border_style', e))}
              </div>

              <!-- Row: padding -->
              <div class="row-padding">
                ${cgTextField('Padding\ntop (px)',    row.padding_top,    e => this._rowChanged(ri, 'padding_top',    e), { type: 'number', step: '1', min: '0' })}
                ${cgTextField('Padding\nbottom (px)', row.padding_bottom, e => this._rowChanged(ri, 'padding_bottom', e), { type: 'number', step: '1', min: '0' })}
                ${cgTextField('Padding\nleft (px)',   row.padding_left,   e => this._rowChanged(ri, 'padding_left',   e), { type: 'number', step: '1', min: '0' })}
                ${cgTextField('Padding\nright (px)',  row.padding_right,  e => this._rowChanged(ri, 'padding_right',  e), { type: 'number', step: '1', min: '0' })}
              </div>

              <!-- Cells -->
              <ha-sortable handle-selector=".handle" @item-moved=${(e) => this._cellMoved(ri, e)}>
                <div class="cells-list">
                  ${(row.cells ?? []).map((cell, ci) => html`
                    <ha-expansion-panel outlined header="Cell ${ci + 1} — ${cell.width || '1fr'}">

                      <div class="handle" slot="leading-icon">
                        <ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon>
                      </div>

                      <!-- Cell: width -->
                      <div class="cell-width">
                        ${cgTextField('Width (CSS units: 1fr, 2fr, 50%, 200px…)', cell.width, e => this._cellChanged(ri, ci, 'width', e))}
                      </div>

                      <!-- Cell: background color -->
                      <div class="cell-bg-color">
                        ${cgColorPicker('Background color', cell.background_color, e => this._cellChanged(ri, ci, 'background_color', e))}
                      </div>

                      <!-- Cell: border -->
                      <div class="cell-border">
                        ${cgColorPicker('Border color', cell.border_color, e => this._cellChanged(ri, ci, 'border_color', e))}
                        ${cgTextField('Width (px)',  cell.border_width,  e => this._cellChanged(ri, ci, 'border_width',  e), { type: 'number', step: '1', min: '0' })}
                        ${cgTextField('Radius (px)', cell.border_radius, e => this._cellChanged(ri, ci, 'border_radius', e), { type: 'number', step: '1', min: '0' })}
                        ${cgSelectField('Style', cell.border_style, this._borderStyleOptions, e => this._cellChanged(ri, ci, 'border_style', e))}
                      </div>

                      <!-- Cell: padding -->
                      <div class="cell-padding">
                        ${cgTextField('Padding\ntop (px)',    cell.padding_top,    e => this._cellChanged(ri, ci, 'padding_top',    e), { type: 'number', step: '1', min: '0' })}
                        ${cgTextField('Padding\nbottom (px)', cell.padding_bottom, e => this._cellChanged(ri, ci, 'padding_bottom', e), { type: 'number', step: '1', min: '0' })}
                        ${cgTextField('Padding\nleft (px)',   cell.padding_left,   e => this._cellChanged(ri, ci, 'padding_left',   e), { type: 'number', step: '1', min: '0' })}
                        ${cgTextField('Padding\nright (px)',  cell.padding_right,  e => this._cellChanged(ri, ci, 'padding_right',  e), { type: 'number', step: '1', min: '0' })}
                      </div>

                      <!-- Cell: card picker or card editor -->
                      <div class="cell-card-editor">
                        ${cell.card && Object.keys(cell.card).length > 0 ? html`
                          <div
                            class="card-editor-mount"
                            data-row=${ri}
                            data-cell=${ci}
                          ></div>
                          <div class="change-card-row">
                            <button class="change-card-btn" @click=${() => this._clearCard(ri, ci)}>Change card type</button>
                          </div>
                        ` : html`
                          <div class="pick-card-row">
                            <button class="add-btn" @click=${() => this._pickCard(ri, ci)}>+ Pick card</button>
                          </div>
                        `}
                      </div>

                      <!-- Remove cell button -->
                      <div class="add-btn-row">
                        <button class="remove-btn" @click=${() => this._removeCell(ri, ci)}>Remove cell</button>
                      </div>

                    </ha-expansion-panel>
                  `)}
                </div>
              </ha-sortable>

              <!-- Add cell button -->
              <div class="add-btn-row">
                <button class="add-btn" @click=${() => this._addCell(ri)}>+ Add cell</button>
              </div>

              <!-- Row actions: duplicate + remove -->
              <div class="row-action-btns">
                <button class="duplicate-btn" @click=${() => this._duplicateRow(ri)}>Duplicate row</button>
                <button class="remove-btn"    @click=${() => this._removeRow(ri)}>Remove row</button>
              </div>

            </ha-expansion-panel>
          `)}
        </div>
      </ha-sortable>

      <!-- ── Add row button ───────────────────────────────────────────────── -->

      <div class="add-btn-row">
        <button class="add-btn" @click=${this._addRow}>+ Add row</button>
      </div>

    `;
  }
}
customElements.define('chrono-grid-card-editor', ChronoGridCardEditor);

// ─── Card ─────────────────────────────────────────────────────────────────────
class ChronoGridCard extends LitElement {
  static properties = {
    _config: { attribute: false },
  };

  static getCardSize() {
    return 3;
  }

  static getConfigElement() {
    return document.createElement('chrono-grid-card-editor');
  }

  static getStubConfig() {
    return {
      ...DEFAULT_CONFIG,
      rows: [
        {
          ...DEFAULT_ROW,
          cells: [{ ...DEFAULT_CELL }],
        },
      ],
    };
  }

  constructor() {
    super();
    this._config       = null;
    this._hass         = null;
    this._helpers      = null;
    this._cardElements = [];
  }

  // ── connectedCallback: load HA card helpers, then build child elements ─────
  async connectedCallback() {
    super.connectedCallback();
    if (!this._helpers) {
      this._helpers = await window.loadCardHelpers();
    }
    if (this._config) {
      this._rebuildCardElements();
      this.requestUpdate();
    }
  }

  // ── hass setter: store and propagate to all child card elements ───────────
  set hass(hass) {
    this._hass = hass;
    this._cardElements.forEach(el => {
      if (el) el.hass = hass;
    });
  }

  get hass() {
    return this._hass;
  }

  // ── setConfig: store config and rebuild if helpers are ready ──────────────
  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    if (this._helpers) {
      this._rebuildCardElements();
      this.requestUpdate();
    }
  }

  // ── _rebuildCardElements: create one card element per cell ────────────────
  _rebuildCardElements() {
    if (!this._helpers) return;
    const rows = this._config.rows ?? [];
    this._cardElements = [];

    rows.forEach(row => {
      (row.cells ?? []).forEach(cell => {
        if (cell.card && Object.keys(cell.card).length > 0) {
          const el = this._helpers.createCardElement(cell.card);
          if (this._hass) {
            el.hass = this._hass;
          }
          this._cardElements.push(el);
        } else {
          this._cardElements.push(null);
        }
      });
    });
  }

  // ── updated: imperatively mount each card element into its cell div ────────
  updated() {
    let idx        = 0;
    const rows     = this._config?.rows ?? [];

    rows.forEach((row, ri) => {
      (row.cells ?? []).forEach((cell, ci) => {
        const container = this.shadowRoot.querySelector(
          `.grid-cell[data-row="${ri}"][data-cell="${ci}"]`
        );

        if (container) {
          const el = this._cardElements[idx];
          if (el) {
            if (!container.contains(el)) {
              container.innerHTML = '';
              container.appendChild(el);
            }
          } else {
            container.innerHTML = '';
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
    if (!this._config) return html``;

    const c    = this._config;
    const rows = c.rows ?? [];

    // ── Style helpers: only render a property when the value is not empty ──
    // Any real value (including 0) is valid. Only undefined or '' means omit.
    const px  = (v) => (v !== undefined && v !== '') ? `${v}px` : undefined;
    const val = (v) => (v !== undefined && v !== '') ? v         : undefined;
    const pad = (t, r, b, l) =>
      (t !== undefined && t !== '' &&
       r !== undefined && r !== '' &&
       b !== undefined && b !== '' &&
       l !== undefined && l !== '')
        ? `${t}px ${r}px ${b}px ${l}px`
        : undefined;

    const wrapperStyles = {
      'background-color': val(c.background_color),
      'border-width':     px(c.border_width),
      'border-style':     val(c.border_style),
      'border-color':     val(c.border_color),
      'border-radius':    px(c.border_radius),
      'padding':          pad(c.padding_top, c.padding_right, c.padding_bottom, c.padding_left),
      'box-shadow':       val(c.box_shadow),
    };

    return html`
      <div class="grid-wrapper" style=${styleMap(wrapperStyles)}>
        ${rows.map((row, ri) => {
          const columns = (row.cells ?? []).map(cell => cell.width || '1fr').join(' ');

          const rowStyles = {
            'grid-template-columns': columns || '1fr',
            'gap':                   px(row.gap),
            'background-color':      val(row.background_color),
            'border-width':          px(row.border_width),
            'border-style':          val(row.border_style),
            'border-color':          val(row.border_color),
            'border-radius':         px(row.border_radius),
            'padding':               pad(row.padding_top, row.padding_right, row.padding_bottom, row.padding_left),
          };

          return html`
            <div class="grid-row" style=${styleMap(rowStyles)}>
              ${(row.cells ?? []).map((cell, ci) => {
                const cellStyles = {
                  'background-color': val(cell.background_color),
                  'border-width':     px(cell.border_width),
                  'border-style':     val(cell.border_style),
                  'border-color':     val(cell.border_color),
                  'border-radius':    px(cell.border_radius),
                  'padding':          pad(cell.padding_top, cell.padding_right, cell.padding_bottom, cell.padding_left),
                };

                return html`
                  <div
                    class="grid-cell"
                    data-row=${ri}
                    data-cell=${ci}
                    style=${styleMap(cellStyles)}
                  ></div>
                `;
              })}
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
