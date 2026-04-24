import{LitElement,html,css}from"https://unpkg.com/lit@2.0.0/index.js?module";import{live}from"https://unpkg.com/lit@2.0.0/directives/live.js?module";import{styleMap}from"https://unpkg.com/lit@2.0.0/directives/style-map.js?module";import{unsafeHTML}from"https://unpkg.com/lit@2.0.0/directives/unsafe-html.js?module";const CARD_VERSION="0.0.4",mdiDragHorizontalVariant="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z";console.info("%c CHRONO-%cGRID%c-CARD %c v0.0.4 ","background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 0 2px 4px; border-radius: 3px 0 0 3px;","background-color: #101010; color: #4676d3; font-weight: bold; padding: 2px 0;","background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 4px 2px 0;","background-color: #1E1E1E; color: #FFFFFF; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;");const DEFAULT_CELL={width:"1fr",background_color:"",border_width:0,border_style:"solid",border_color:"",border_radius:0,padding_top:0,padding_bottom:0,padding_left:0,padding_right:0,card:{}},DEFAULT_ROW={gap:8,background_color:"",border_width:0,border_style:"solid",border_color:"",border_radius:0,padding_top:0,padding_bottom:0,padding_left:0,padding_right:0,cells:[]},DEFAULT_CONFIG={background_color:"",border_width:1,border_style:"solid",border_color:"",border_radius:12,padding_top:8,padding_bottom:8,padding_left:8,padding_right:8,box_shadow:"",rows:[]},NUMERIC_CONFIG_KEYS=new Set(["border_width","border_radius","padding_top","padding_bottom","padding_left","padding_right"]),NUMERIC_ROW_KEYS=new Set(["gap","border_width","border_radius","padding_top","padding_bottom","padding_left","padding_right"]),NUMERIC_CELL_KEYS=new Set(["border_width","border_radius","padding_top","padding_bottom","padding_left","padding_right"]);function cgParseNumber(o){const e=String(o).replace(",",".");if("-"===e||"-0"===e||e.endsWith("."))return null;if(e.includes(".")&&e.endsWith("0"))return null;if(""===e)return;const t=parseFloat(e);return isNaN(t)?null:t}function cgTextField(o,e,t,r={}){return html`
    <div class="text-field">
      <label>${unsafeHTML(o)}</label>
      <chrono-cg-textfield
        .value=${String(e??"")}
        type=${r.type??"text"}
        step=${r.step??""}
        min=${r.min??""}
        max=${r.max??""}
        @input=${t}
      ></chrono-cg-textfield>
    </div>
  `}function cgColorPicker(o,e,t){const r=e||"#000000";return html`
    <div class="text-field">
      <label>${unsafeHTML(o)}</label>
      <div class="color-picker-row">
        <input type="color" .value=${r} @input=${t}
          @change=${o=>{"#000000"!==o.target.value&&t(o)}}>
        <chrono-cg-textfield
          .value=${String(e??"")}
          @input=${t}
        ></chrono-cg-textfield>
      </div>
    </div>
  `}function cgSelectField(o,e,t,r){return html`
    <div class="text-field">
      <label>${unsafeHTML(o)}</label>
      <chrono-cg-select
        .value=${e??""}
        .options=${t}
        @change=${r}
      ></chrono-cg-select>
    </div>
  `}class CgTextfield extends LitElement{static properties={value:{type:String},type:{type:String},step:{type:String},min:{type:String},max:{type:String},placeholder:{type:String}};static styles=css`
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
  `;render(){return html`
      <input
        .value=${live(this.value??"")}
        type=${this.type??"text"}
        step=${this.step??""}
        min=${this.min??""}
        max=${this.max??""}
        placeholder=${this.placeholder??""}
        @input=${o=>{this.value=o.target.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}}
      >
    `}}customElements.define("chrono-cg-textfield",CgTextfield);class CgButtonToggleGroup extends LitElement{static properties={value:{type:String},options:{type:Array}};static styles=css`
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
  `;render(){const o=this.options??[];return html`${o.map((e,t)=>{const r=1===o.length,i=[e.value===this.value?"active":"",r?"only":""].filter(Boolean).join(" ");return html`<button class="${i}" @click=${()=>this._select(e.value)}>${e.label}</button>`})}`}_select(o){this.value=o,this.dispatchEvent(new CustomEvent("change",{detail:{value:o},bubbles:!0,composed:!0}))}}customElements.define("chrono-cg-button-toggle-group",CgButtonToggleGroup);class CgSelect extends LitElement{static properties={value:{type:String},options:{type:Array},_open:{state:!0},_cursor:{state:!0}};static styles=css`
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
  `;constructor(){super(),this.value="",this.options=[],this._open=!1,this._cursor=-1,this._onOutsideClick=this._onOutsideClick.bind(this)}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this._onOutsideClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onOutsideClick)}_onOutsideClick(o){this.shadowRoot.contains(o.composedPath()[0])||o.composedPath()[0]===this||(this._open=!1,this._cursor=-1)}_select(o){this.value=o,this._open=!1,this._cursor=-1,this.dispatchEvent(new CustomEvent("change",{detail:{value:o},bubbles:!0,composed:!0}))}_handleKeyDown(o){const e=this.options??[];this._open?"ArrowDown"===o.key?(this._cursor=Math.min(this._cursor+1,e.length-1),o.preventDefault()):"ArrowUp"===o.key?(this._cursor=Math.max(this._cursor-1,0),o.preventDefault()):"Enter"===o.key?(this._cursor>=0&&this._cursor<e.length&&this._select(e[this._cursor].value),o.preventDefault()):"Escape"===o.key&&(this._open=!1,this._cursor=-1,o.preventDefault()):"ArrowDown"!==o.key&&"ArrowUp"!==o.key||(this._open=!0,this._cursor=0,o.preventDefault())}render(){const o=this.options??[];return html`
      <div class="combobox ${this._open?"combobox-open":""}">
        <input
          class="combobox-input"
          .value=${live(this.value??"")}
          @input=${o=>{this.dispatchEvent(new CustomEvent("change",{detail:{value:o.target.value},bubbles:!0,composed:!0}))}}
          @blur=${()=>{this._open=!1,this._cursor=-1}}
          @keydown=${this._handleKeyDown}
        >
        <div
          class="combobox-chevron"
          @click=${()=>{this._open=!this._open,this._cursor=-1,this.shadowRoot.querySelector(".combobox-input").focus()}}
          aria-hidden="true"
        >${this._open?"▴":"▾"}</div>
      </div>
      ${this._open?html`
        <div class="combobox-dropdown">
          ${o.map((o,e)=>html`
            <div
              class="combobox-option
                     ${o.value===this.value?"combobox-option-selected":""}
                     ${e===this._cursor?"combobox-option-cursor":""}"
              @mousedown=${e=>{e.preventDefault(),this._select(o.value)}}
            >${o.label}</div>
          `)}
        </div>
      `:""}
    `}}customElements.define("chrono-cg-select",CgSelect);class ChronoGridCardEditor extends LitElement{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(o){this._config={...DEFAULT_CONFIG,...o}}_dispatchConfig(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_valueChanged(o,e){if(!this._config)return;const t=e.target.value??e.detail?.value;let r;if(NUMERIC_CONFIG_KEYS.has(o)){const e=cgParseNumber(t);if(null===e)return;r=void 0===e?DEFAULT_CONFIG[o]:e}else r=t;this._config={...this._config,[o]:r},this._dispatchConfig()}_rowChanged(o,e,t){if(!this._config)return;const r=t.target.value??t.detail?.value;let i;if(NUMERIC_ROW_KEYS.has(e)){const o=cgParseNumber(r);if(null===o)return;i=void 0===o?DEFAULT_ROW[e]:o}else i=r;const d=this._config.rows.map((t,r)=>r===o?{...t,[e]:i}:t);this._config={...this._config,rows:d},this._dispatchConfig()}_cellChanged(o,e,t,r){if(!this._config)return;const i=r.target.value??r.detail?.value;let d;if(NUMERIC_CELL_KEYS.has(t)){const o=cgParseNumber(i);if(null===o)return;d=void 0===o?DEFAULT_CELL[t]:o}else d=i;const n=this._config.rows.map((r,i)=>{if(i!==o)return r;const n=r.cells.map((o,r)=>r===e?{...o,[t]:d}:o);return{...r,cells:n}});this._config={...this._config,rows:n},this._dispatchConfig()}_cardJsonChanged(o,e,t){if(this._config)try{const r=JSON.parse(t.target.value),i=this._config.rows.map((t,i)=>{if(i!==o)return t;const d=t.cells.map((o,t)=>t===e?{...o,card:r}:o);return{...t,cells:d}});this._config={...this._config,rows:i},this._dispatchConfig()}catch(o){}}_addRow(){const o=[...this._config.rows??[],{...DEFAULT_ROW,cells:[{...DEFAULT_CELL}]}];this._config={...this._config,rows:o},this._dispatchConfig()}_removeRow(o){const e=this._config.rows.filter((e,t)=>t!==o);this._config={...this._config,rows:e},this._dispatchConfig()}_duplicateRow(o){const e=JSON.parse(JSON.stringify(this._config.rows[o])),t=[...this._config.rows];t.splice(o+1,0,e),this._config={...this._config,rows:t},this._dispatchConfig()}_rowMoved(o){o.stopPropagation();const{oldIndex:e,newIndex:t}=o.detail,r=[...this._config.rows];r.splice(t,0,r.splice(e,1)[0]),this._config={...this._config,rows:r},this._dispatchConfig()}_addCell(o){const e=this._config.rows.map((e,t)=>t!==o?e:{...e,cells:[...e.cells,{...DEFAULT_CELL}]});this._config={...this._config,rows:e},this._dispatchConfig()}_removeCell(o,e){const t=this._config.rows.map((t,r)=>r!==o?t:{...t,cells:t.cells.filter((o,t)=>t!==e)});this._config={...this._config,rows:t},this._dispatchConfig()}_cellMoved(o,e){e.stopPropagation();const{oldIndex:t,newIndex:r}=e.detail,i=this._config.rows.map((e,i)=>{if(i!==o)return e;const d=[...e.cells];return d.splice(r,0,d.splice(t,1)[0]),{...e,cells:d}});this._config={...this._config,rows:i},this._dispatchConfig()}_borderStyleOptions=[{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"Double",value:"double"},{label:"None",value:"none"}];static styles=css`

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

    /* ── Temporary: card JSON textarea ─────────────────────────────────────── */

    .cell-card-json {
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .cell-card-json label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }

    .cell-card-json textarea {
      /* TEMPORARY — replaced by native card picker in Phase 3 */
      width: 100%;
      box-sizing: border-box;
      min-height: 80px;
      padding: 8px;
      background: var(--input-fill-color, rgba(0,0,0,0.06));
      border: none;
      border-bottom: 1px solid var(--secondary-text-color, #888);
      border-radius: 4px 4px 0 0;
      color: var(--primary-text-color);
      font-family: monospace;
      font-size: 13px;
      resize: vertical;
      outline: none;
    }

  `;render(){if(!this._config)return html``;const o=this._config,e=o.rows??[];return html`

      <!-- ── Appearance section ───────────────────────────────────────────── -->

      <ha-expansion-panel header="Appearance" outlined .expanded=${!0}>

        <!-- Row 1: Background color + Padding -->
        <div class="wrapper-bg-padding">
          ${cgColorPicker("Background color\n<i>leave empty for default</i>",o.background_color,o=>this._valueChanged("background_color",o))}
          ${cgTextField("Padding\ntop (px)",o.padding_top,o=>this._valueChanged("padding_top",o),{type:"number",step:"1",min:"0"})}
          ${cgTextField("Padding\nbottom (px)",o.padding_bottom,o=>this._valueChanged("padding_bottom",o),{type:"number",step:"1",min:"0"})}
          ${cgTextField("Padding\nleft (px)",o.padding_left,o=>this._valueChanged("padding_left",o),{type:"number",step:"1",min:"0"})}
          ${cgTextField("Padding\nright (px)",o.padding_right,o=>this._valueChanged("padding_right",o),{type:"number",step:"1",min:"0"})}
        </div>

        <!-- Row 2: Border -->
        <div class="wrapper-border">
          ${cgColorPicker("Border color",o.border_color,o=>this._valueChanged("border_color",o))}
          ${cgTextField("Width (px)",o.border_width,o=>this._valueChanged("border_width",o),{type:"number",step:"1",min:"0"})}
          ${cgTextField("Radius (px)",o.border_radius,o=>this._valueChanged("border_radius",o),{type:"number",step:"1",min:"0"})}
          ${cgSelectField("Style",o.border_style,this._borderStyleOptions,o=>this._valueChanged("border_style",o))}
        </div>

      </ha-expansion-panel>

      <!-- ── Rows section ─────────────────────────────────────────────────── -->

      <ha-sortable handle-selector=".handle" @item-moved=${this._rowMoved}>
        <div class="rows-list">
          ${e.map((o,e)=>html`
            <ha-expansion-panel outlined header="Row ${e+1}">

              <div class="handle" slot="leading-icon">
                <ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon>
              </div>

              <!-- Row: gap + background color -->
              <div class="row-gap-color">
                ${cgTextField("Gap (px)",o.gap,o=>this._rowChanged(e,"gap",o),{type:"number",step:"1",min:"0"})}
                ${cgColorPicker("Background color",o.background_color,o=>this._rowChanged(e,"background_color",o))}
              </div>

              <!-- Row: border -->
              <div class="row-border">
                ${cgColorPicker("Border color",o.border_color,o=>this._rowChanged(e,"border_color",o))}
                ${cgTextField("Width (px)",o.border_width,o=>this._rowChanged(e,"border_width",o),{type:"number",step:"1",min:"0"})}
                ${cgTextField("Radius (px)",o.border_radius,o=>this._rowChanged(e,"border_radius",o),{type:"number",step:"1",min:"0"})}
                ${cgSelectField("Style",o.border_style,this._borderStyleOptions,o=>this._rowChanged(e,"border_style",o))}
              </div>

              <!-- Row: padding -->
              <div class="row-padding">
                ${cgTextField("Padding\ntop (px)",o.padding_top,o=>this._rowChanged(e,"padding_top",o),{type:"number",step:"1",min:"0"})}
                ${cgTextField("Padding\nbottom (px)",o.padding_bottom,o=>this._rowChanged(e,"padding_bottom",o),{type:"number",step:"1",min:"0"})}
                ${cgTextField("Padding\nleft (px)",o.padding_left,o=>this._rowChanged(e,"padding_left",o),{type:"number",step:"1",min:"0"})}
                ${cgTextField("Padding\nright (px)",o.padding_right,o=>this._rowChanged(e,"padding_right",o),{type:"number",step:"1",min:"0"})}
              </div>

              <!-- Cells -->
              <ha-sortable handle-selector=".handle" @item-moved=${o=>this._cellMoved(e,o)}>
                <div class="cells-list">
                  ${(o.cells??[]).map((o,t)=>html`
                    <ha-expansion-panel outlined header="Cell ${t+1} — ${o.width||"1fr"}">

                      <div class="handle" slot="leading-icon">
                        <ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon>
                      </div>

                      <!-- Cell: width -->
                      <div class="cell-width">
                        ${cgTextField("Width (CSS units: 1fr, 2fr, 50%, 200px…)",o.width,o=>this._cellChanged(e,t,"width",o))}
                      </div>

                      <!-- Cell: background color -->
                      <div class="cell-bg-color">
                        ${cgColorPicker("Background color",o.background_color,o=>this._cellChanged(e,t,"background_color",o))}
                      </div>

                      <!-- Cell: border -->
                      <div class="cell-border">
                        ${cgColorPicker("Border color",o.border_color,o=>this._cellChanged(e,t,"border_color",o))}
                        ${cgTextField("Width (px)",o.border_width,o=>this._cellChanged(e,t,"border_width",o),{type:"number",step:"1",min:"0"})}
                        ${cgTextField("Radius (px)",o.border_radius,o=>this._cellChanged(e,t,"border_radius",o),{type:"number",step:"1",min:"0"})}
                        ${cgSelectField("Style",o.border_style,this._borderStyleOptions,o=>this._cellChanged(e,t,"border_style",o))}
                      </div>

                      <!-- Cell: padding -->
                      <div class="cell-padding">
                        ${cgTextField("Padding\ntop (px)",o.padding_top,o=>this._cellChanged(e,t,"padding_top",o),{type:"number",step:"1",min:"0"})}
                        ${cgTextField("Padding\nbottom (px)",o.padding_bottom,o=>this._cellChanged(e,t,"padding_bottom",o),{type:"number",step:"1",min:"0"})}
                        ${cgTextField("Padding\nleft (px)",o.padding_left,o=>this._cellChanged(e,t,"padding_left",o),{type:"number",step:"1",min:"0"})}
                        ${cgTextField("Padding\nright (px)",o.padding_right,o=>this._cellChanged(e,t,"padding_right",o),{type:"number",step:"1",min:"0"})}
                      </div>

                      <!-- Cell: temporary card JSON — REMOVED IN PHASE 3 -->
                      <div class="cell-card-json">
                        <label>Card config (temporary — JSON, replaced by card picker in Phase 3)</label>
                        <textarea
                          .value=${JSON.stringify(o.card??{},null,2)}
                          @change=${o=>this._cardJsonChanged(e,t,o)}
                        ></textarea>
                      </div>

                      <!-- Remove cell button -->
                      <div class="add-btn-row">
                        <button class="remove-btn" @click=${()=>this._removeCell(e,t)}>Remove cell</button>
                      </div>

                    </ha-expansion-panel>
                  `)}
                </div>
              </ha-sortable>

              <!-- Add cell button -->
              <div class="add-btn-row">
                <button class="add-btn" @click=${()=>this._addCell(e)}>+ Add cell</button>
              </div>

              <!-- Row actions: duplicate + remove -->
              <div class="row-action-btns">
                <button class="duplicate-btn" @click=${()=>this._duplicateRow(e)}>Duplicate row</button>
                <button class="remove-btn"    @click=${()=>this._removeRow(e)}>Remove row</button>
              </div>

            </ha-expansion-panel>
          `)}
        </div>
      </ha-sortable>

      <!-- ── Add row button ───────────────────────────────────────────────── -->

      <div class="add-btn-row">
        <button class="add-btn" @click=${this._addRow}>+ Add row</button>
      </div>

    `}}customElements.define("chrono-grid-card-editor",ChronoGridCardEditor);class ChronoGridCard extends LitElement{static properties={_config:{attribute:!1}};static getCardSize(){return 3}static getConfigElement(){return document.createElement("chrono-grid-card-editor")}static getStubConfig(){return{...DEFAULT_CONFIG,rows:[{...DEFAULT_ROW,cells:[{...DEFAULT_CELL}]}]}}constructor(){super(),this._config=null,this._hass=null,this._helpers=null,this._cardElements=[]}async connectedCallback(){super.connectedCallback(),this._helpers||(this._helpers=await window.loadCardHelpers()),this._config&&(this._rebuildCardElements(),this.requestUpdate())}set hass(o){this._hass=o,this._cardElements.forEach(e=>{e&&(e.hass=o)})}get hass(){return this._hass}setConfig(o){this._config={...DEFAULT_CONFIG,...o},this._helpers&&(this._rebuildCardElements(),this.requestUpdate())}_rebuildCardElements(){if(!this._helpers)return;const o=this._config.rows??[];this._cardElements=[],o.forEach(o=>{(o.cells??[]).forEach(o=>{if(o.card&&Object.keys(o.card).length>0){const e=this._helpers.createCardElement(o.card);this._hass&&(e.hass=this._hass),this._cardElements.push(e)}else this._cardElements.push(null)})})}updated(){let o=0;(this._config?.rows??[]).forEach((e,t)=>{(e.cells??[]).forEach((e,r)=>{const i=this.shadowRoot.querySelector(`.grid-cell[data-row="${t}"][data-cell="${r}"]`);if(i){const e=this._cardElements[o];e?i.contains(e)||(i.innerHTML="",i.appendChild(e)):i.innerHTML=""}o++})})}static styles=css`
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
  `;render(){if(!this._config)return html``;const o=this._config,e=o.rows??[],t={"background-color":o.background_color||void 0,"border-width":void 0!==o.border_width?`${o.border_width}px`:void 0,"border-style":o.border_style||void 0,"border-color":o.border_color||void 0,"border-radius":void 0!==o.border_radius?`${o.border_radius}px`:void 0,padding:`${o.padding_top??8}px ${o.padding_right??8}px ${o.padding_bottom??8}px ${o.padding_left??8}px`,"box-shadow":o.box_shadow||void 0};return html`
      <div class="grid-wrapper" style=${styleMap(t)}>
        ${e.map((o,e)=>{const t={"grid-template-columns":(o.cells??[]).map(o=>o.width||"1fr").join(" ")||"1fr",gap:`${o.gap??8}px`,"background-color":o.background_color||void 0,"border-width":o.border_width?`${o.border_width}px`:void 0,"border-style":o.border_style||void 0,"border-color":o.border_color||void 0,"border-radius":o.border_radius?`${o.border_radius}px`:void 0,padding:o.padding_top||o.padding_bottom||o.padding_left||o.padding_right?`${o.padding_top??0}px ${o.padding_right??0}px ${o.padding_bottom??0}px ${o.padding_left??0}px`:void 0};return html`
            <div class="grid-row" style=${styleMap(t)}>
              ${(o.cells??[]).map((o,t)=>{const r={"background-color":o.background_color||void 0,"border-width":o.border_width?`${o.border_width}px`:void 0,"border-style":o.border_style||void 0,"border-color":o.border_color||void 0,"border-radius":o.border_radius?`${o.border_radius}px`:void 0,padding:o.padding_top||o.padding_bottom||o.padding_left||o.padding_right?`${o.padding_top??0}px ${o.padding_right??0}px ${o.padding_bottom??0}px ${o.padding_left??0}px`:void 0};return html`
                  <div
                    class="grid-cell"
                    data-row=${e}
                    data-cell=${t}
                    style=${styleMap(r)}
                  ></div>
                `})}
            </div>
          `})}
      </div>
    `}}customElements.define("chrono-grid-card",ChronoGridCard),window.customCards=window.customCards||[],window.customCards.push({type:"chrono-grid-card",name:"Chrono Grid Card",description:"A fully configurable grid wrapper card. Arrange any Home Assistant cards in rows and columns with full styling control.",preview:!1});