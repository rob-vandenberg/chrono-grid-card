import{LitElement,html,css}from"https://unpkg.com/lit@2.0.0/index.js?module";import{live}from"https://unpkg.com/lit@2.0.0/directives/live.js?module";import{styleMap}from"https://unpkg.com/lit@2.0.0/directives/style-map.js?module";import{unsafeHTML}from"https://unpkg.com/lit@2.0.0/directives/unsafe-html.js?module";const CARD_VERSION="0.0.7",mdiDragHorizontalVariant="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z";console.info("%c CHRONO-%cGRID%c-CARD %c v0.0.7 ","background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 0 2px 4px; border-radius: 3px 0 0 3px;","background-color: #101010; color: #4676d3; font-weight: bold; padding: 2px 0;","background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 4px 2px 0;","background-color: #1E1E1E; color: #FFFFFF; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;");const DEFAULT_CELL={width:"1fr",background_color:"",border_width:0,border_style:"solid",border_color:"",border_radius:0,padding_top:0,padding_bottom:0,padding_left:0,padding_right:0,card:{}},DEFAULT_ROW={gap:8,background_color:"",border_width:0,border_style:"solid",border_color:"",border_radius:0,padding_top:0,padding_bottom:0,padding_left:0,padding_right:0,cells:[]},DEFAULT_CONFIG={background_color:"",border_width:1,border_style:"solid",border_color:"",border_radius:12,padding_top:8,padding_bottom:8,padding_left:8,padding_right:8,box_shadow:"",rows:[]},NUMERIC_CONFIG_KEYS=new Set(["border_width","border_radius","padding_top","padding_bottom","padding_left","padding_right"]),NUMERIC_ROW_KEYS=new Set(["gap","border_width","border_radius","padding_top","padding_bottom","padding_left","padding_right"]),NUMERIC_CELL_KEYS=new Set(["border_width","border_radius","padding_top","padding_bottom","padding_left","padding_right"]);function cgParseNumber(e){const o=String(e).replace(",",".");if("-"===o||"-0"===o||o.endsWith("."))return null;if(o.includes(".")&&o.endsWith("0"))return null;if(""===o)return;const t=parseFloat(o);return isNaN(t)?null:t}function cgTextField(e,o,t,r={}){return html`
    <div class="text-field">
      <label>${unsafeHTML(e)}</label>
      <chrono-cg-textfield
        .value=${String(o??"")}
        type=${r.type??"text"}
        step=${r.step??""}
        min=${r.min??""}
        max=${r.max??""}
        @input=${t}
      ></chrono-cg-textfield>
    </div>
  `}function cgColorPicker(e,o,t){const r=o||"#000000";return html`
    <div class="text-field">
      <label>${unsafeHTML(e)}</label>
      <div class="color-picker-row">
        <input type="color" .value=${r} @input=${t}
          @change=${e=>{"#000000"!==e.target.value&&t(e)}}>
        <chrono-cg-textfield
          .value=${String(o??"")}
          @input=${t}
        ></chrono-cg-textfield>
      </div>
    </div>
  `}function cgSelectField(e,o,t,r){return html`
    <div class="text-field">
      <label>${unsafeHTML(e)}</label>
      <chrono-cg-select
        .value=${o??""}
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
        @input=${e=>{this.value=e.target.value,this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}}
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
  `;render(){const e=this.options??[];return html`${e.map((o,t)=>{const r=1===e.length,i=[o.value===this.value?"active":"",r?"only":""].filter(Boolean).join(" ");return html`<button class="${i}" @click=${()=>this._select(o.value)}>${o.label}</button>`})}`}_select(e){this.value=e,this.dispatchEvent(new CustomEvent("change",{detail:{value:e},bubbles:!0,composed:!0}))}}customElements.define("chrono-cg-button-toggle-group",CgButtonToggleGroup);class CgSelect extends LitElement{static properties={value:{type:String},options:{type:Array},_open:{state:!0},_cursor:{state:!0}};static styles=css`
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
  `;constructor(){super(),this.value="",this.options=[],this._open=!1,this._cursor=-1,this._onOutsideClick=this._onOutsideClick.bind(this)}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this._onOutsideClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onOutsideClick)}_onOutsideClick(e){this.shadowRoot.contains(e.composedPath()[0])||e.composedPath()[0]===this||(this._open=!1,this._cursor=-1)}_select(e){this.value=e,this._open=!1,this._cursor=-1,this.dispatchEvent(new CustomEvent("change",{detail:{value:e},bubbles:!0,composed:!0}))}_handleKeyDown(e){const o=this.options??[];this._open?"ArrowDown"===e.key?(this._cursor=Math.min(this._cursor+1,o.length-1),e.preventDefault()):"ArrowUp"===e.key?(this._cursor=Math.max(this._cursor-1,0),e.preventDefault()):"Enter"===e.key?(this._cursor>=0&&this._cursor<o.length&&this._select(o[this._cursor].value),e.preventDefault()):"Escape"===e.key&&(this._open=!1,this._cursor=-1,e.preventDefault()):"ArrowDown"!==e.key&&"ArrowUp"!==e.key||(this._open=!0,this._cursor=0,e.preventDefault())}render(){const e=this.options??[];return html`
      <div class="combobox ${this._open?"combobox-open":""}">
        <input
          class="combobox-input"
          .value=${live(this.value??"")}
          @input=${e=>{this.dispatchEvent(new CustomEvent("change",{detail:{value:e.target.value},bubbles:!0,composed:!0}))}}
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
          ${e.map((e,o)=>html`
            <div
              class="combobox-option
                     ${e.value===this.value?"combobox-option-selected":""}
                     ${o===this._cursor?"combobox-option-cursor":""}"
              @mousedown=${o=>{o.preventDefault(),this._select(e.value)}}
            >${e.label}</div>
          `)}
        </div>
      `:""}
    `}}customElements.define("chrono-cg-select",CgSelect);class ChronoGridCardEditor extends LitElement{static properties={hass:{attribute:!1},lovelace:{attribute:!1},_config:{state:!0}};setConfig(e){this._config={...DEFAULT_CONFIG,...e}}_dispatchConfig(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_valueChanged(e,o){if(!this._config)return;const t=o.target.value??o.detail?.value;let r;if(NUMERIC_CONFIG_KEYS.has(e)){const o=cgParseNumber(t);if(null===o)return;r=void 0===o?DEFAULT_CONFIG[e]:o}else r=t;this._config={...this._config,[e]:r},this._dispatchConfig()}_rowChanged(e,o,t){if(!this._config)return;const r=t.target.value??t.detail?.value;let i;if(NUMERIC_ROW_KEYS.has(o)){const e=cgParseNumber(r);if(null===e)return;i=void 0===e?DEFAULT_ROW[o]:e}else i=r;const d=this._config.rows.map((t,r)=>r===e?{...t,[o]:i}:t);this._config={...this._config,rows:d},this._dispatchConfig()}_cellChanged(e,o,t,r){if(!this._config)return;const i=r.target.value??r.detail?.value;let d;if(NUMERIC_CELL_KEYS.has(t)){const e=cgParseNumber(i);if(null===e)return;d=void 0===e?DEFAULT_CELL[t]:e}else d=i;const n=this._config.rows.map((r,i)=>{if(i!==e)return r;const n=r.cells.map((e,r)=>r===o?{...e,[t]:d}:e);return{...r,cells:n}});this._config={...this._config,rows:n},this._dispatchConfig()}_cardEditorElements=new Map;_pickCard(e,o){this._config&&this.lovelace&&this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"hui-dialog-create-card",dialogImport:()=>import("/frontend_latest/hui-dialog-create-card.js").catch(()=>{}),dialogParams:{lovelaceConfig:this.lovelace,saveConfig:()=>{},path:[0],saveCard:t=>{const r=this._config.rows.map((r,i)=>{if(i!==e)return r;const d=r.cells.map((e,r)=>r===o?{...e,card:t}:e);return{...r,cells:d}});this._config={...this._config,rows:r},this._cardEditorElements.delete(`${e}-${o}`),this._dispatchConfig()}}}}))}_cardConfigChanged(e,o,t){if(t.stopPropagation(),!this._config)return;const r=t.detail.config,i=this._config.rows.map((t,i)=>{if(i!==e)return t;const d=t.cells.map((e,t)=>t===o?{...e,card:r}:e);return{...t,cells:d}});this._config={...this._config,rows:i},this._dispatchConfig()}_clearCard(e,o){if(!this._config)return;this._cardEditorElements.delete(`${e}-${o}`);const t=this._config.rows.map((t,r)=>{if(r!==e)return t;const i=t.cells.map((e,t)=>t===o?{...e,card:{}}:e);return{...t,cells:i}});this._config={...this._config,rows:t},this._dispatchConfig()}updated(){(this._config?.rows??[]).forEach((e,o)=>{(e.cells??[]).forEach((e,t)=>{if(!e.card||0===Object.keys(e.card).length)return;const r=`${o}-${t}`,i=this.shadowRoot.querySelector(`.card-editor-mount[data-row="${o}"][data-cell="${t}"]`);if(!i)return;let d=this._cardEditorElements.get(r);d||(d=document.createElement("hui-card-element-editor"),d.addEventListener("config-changed",e=>this._cardConfigChanged(o,t,e)),this._cardEditorElements.set(r,d)),d.hass=this.hass,d.lovelace=this.lovelace,d.value=e.card,i.contains(d)||(i.innerHTML="",i.appendChild(d))})})}_addRow(){const e=[...this._config.rows??[],{...DEFAULT_ROW,cells:[{...DEFAULT_CELL}]}];this._config={...this._config,rows:e},this._dispatchConfig()}_removeRow(e){const o=this._config.rows.filter((o,t)=>t!==e);this._config={...this._config,rows:o},this._dispatchConfig()}_duplicateRow(e){const o=JSON.parse(JSON.stringify(this._config.rows[e])),t=[...this._config.rows];t.splice(e+1,0,o),this._config={...this._config,rows:t},this._dispatchConfig()}_rowMoved(e){e.stopPropagation();const{oldIndex:o,newIndex:t}=e.detail,r=[...this._config.rows];r.splice(t,0,r.splice(o,1)[0]),this._config={...this._config,rows:r},this._dispatchConfig()}_addCell(e){const o=this._config.rows.map((o,t)=>t!==e?o:{...o,cells:[...o.cells,{...DEFAULT_CELL}]});this._config={...this._config,rows:o},this._dispatchConfig()}_removeCell(e,o){const t=this._config.rows.map((t,r)=>r!==e?t:{...t,cells:t.cells.filter((e,t)=>t!==o)});this._config={...this._config,rows:t},this._dispatchConfig()}_cellMoved(e,o){o.stopPropagation();const{oldIndex:t,newIndex:r}=o.detail,i=this._config.rows.map((o,i)=>{if(i!==e)return o;const d=[...o.cells];return d.splice(r,0,d.splice(t,1)[0]),{...o,cells:d}});this._config={...this._config,rows:i},this._dispatchConfig()}_borderStyleOptions=[{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"Double",value:"double"},{label:"None",value:"none"}];static styles=css`

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

  `;render(){if(!this._config)return html``;const e=this._config,o=e.rows??[];return html`

      <!-- ── Appearance section ───────────────────────────────────────────── -->

      <ha-expansion-panel header="Appearance" outlined .expanded=${!0}>

        <!-- Row 1: Background color + Padding -->
        <div class="wrapper-bg-padding">
          ${cgColorPicker("Background color\n<i>leave empty for default</i>",e.background_color,e=>this._valueChanged("background_color",e))}
          ${cgTextField("Padding\ntop (px)",e.padding_top,e=>this._valueChanged("padding_top",e),{type:"number",step:"1",min:"0"})}
          ${cgTextField("Padding\nbottom (px)",e.padding_bottom,e=>this._valueChanged("padding_bottom",e),{type:"number",step:"1",min:"0"})}
          ${cgTextField("Padding\nleft (px)",e.padding_left,e=>this._valueChanged("padding_left",e),{type:"number",step:"1",min:"0"})}
          ${cgTextField("Padding\nright (px)",e.padding_right,e=>this._valueChanged("padding_right",e),{type:"number",step:"1",min:"0"})}
        </div>

        <!-- Row 2: Border -->
        <div class="wrapper-border">
          ${cgColorPicker("Border color",e.border_color,e=>this._valueChanged("border_color",e))}
          ${cgTextField("Width (px)",e.border_width,e=>this._valueChanged("border_width",e),{type:"number",step:"1",min:"0"})}
          ${cgTextField("Radius (px)",e.border_radius,e=>this._valueChanged("border_radius",e),{type:"number",step:"1",min:"0"})}
          ${cgSelectField("Style",e.border_style,this._borderStyleOptions,e=>this._valueChanged("border_style",e))}
        </div>

      </ha-expansion-panel>

      <!-- ── Rows section ─────────────────────────────────────────────────── -->

      <ha-sortable handle-selector=".handle" @item-moved=${this._rowMoved}>
        <div class="rows-list">
          ${o.map((e,o)=>html`
            <ha-expansion-panel outlined header="Row ${o+1}">

              <div class="handle" slot="leading-icon">
                <ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon>
              </div>

              <!-- Row: gap + background color -->
              <div class="row-gap-color">
                ${cgTextField("Gap (px)",e.gap,e=>this._rowChanged(o,"gap",e),{type:"number",step:"1",min:"0"})}
                ${cgColorPicker("Background color",e.background_color,e=>this._rowChanged(o,"background_color",e))}
              </div>

              <!-- Row: border -->
              <div class="row-border">
                ${cgColorPicker("Border color",e.border_color,e=>this._rowChanged(o,"border_color",e))}
                ${cgTextField("Width (px)",e.border_width,e=>this._rowChanged(o,"border_width",e),{type:"number",step:"1",min:"0"})}
                ${cgTextField("Radius (px)",e.border_radius,e=>this._rowChanged(o,"border_radius",e),{type:"number",step:"1",min:"0"})}
                ${cgSelectField("Style",e.border_style,this._borderStyleOptions,e=>this._rowChanged(o,"border_style",e))}
              </div>

              <!-- Row: padding -->
              <div class="row-padding">
                ${cgTextField("Padding\ntop (px)",e.padding_top,e=>this._rowChanged(o,"padding_top",e),{type:"number",step:"1",min:"0"})}
                ${cgTextField("Padding\nbottom (px)",e.padding_bottom,e=>this._rowChanged(o,"padding_bottom",e),{type:"number",step:"1",min:"0"})}
                ${cgTextField("Padding\nleft (px)",e.padding_left,e=>this._rowChanged(o,"padding_left",e),{type:"number",step:"1",min:"0"})}
                ${cgTextField("Padding\nright (px)",e.padding_right,e=>this._rowChanged(o,"padding_right",e),{type:"number",step:"1",min:"0"})}
              </div>

              <!-- Cells -->
              <ha-sortable handle-selector=".handle" @item-moved=${e=>this._cellMoved(o,e)}>
                <div class="cells-list">
                  ${(e.cells??[]).map((e,t)=>html`
                    <ha-expansion-panel outlined header="Cell ${t+1} — ${e.width||"1fr"}">

                      <div class="handle" slot="leading-icon">
                        <ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon>
                      </div>

                      <!-- Cell: width -->
                      <div class="cell-width">
                        ${cgTextField("Width (CSS units: 1fr, 2fr, 50%, 200px…)",e.width,e=>this._cellChanged(o,t,"width",e))}
                      </div>

                      <!-- Cell: background color -->
                      <div class="cell-bg-color">
                        ${cgColorPicker("Background color",e.background_color,e=>this._cellChanged(o,t,"background_color",e))}
                      </div>

                      <!-- Cell: border -->
                      <div class="cell-border">
                        ${cgColorPicker("Border color",e.border_color,e=>this._cellChanged(o,t,"border_color",e))}
                        ${cgTextField("Width (px)",e.border_width,e=>this._cellChanged(o,t,"border_width",e),{type:"number",step:"1",min:"0"})}
                        ${cgTextField("Radius (px)",e.border_radius,e=>this._cellChanged(o,t,"border_radius",e),{type:"number",step:"1",min:"0"})}
                        ${cgSelectField("Style",e.border_style,this._borderStyleOptions,e=>this._cellChanged(o,t,"border_style",e))}
                      </div>

                      <!-- Cell: padding -->
                      <div class="cell-padding">
                        ${cgTextField("Padding\ntop (px)",e.padding_top,e=>this._cellChanged(o,t,"padding_top",e),{type:"number",step:"1",min:"0"})}
                        ${cgTextField("Padding\nbottom (px)",e.padding_bottom,e=>this._cellChanged(o,t,"padding_bottom",e),{type:"number",step:"1",min:"0"})}
                        ${cgTextField("Padding\nleft (px)",e.padding_left,e=>this._cellChanged(o,t,"padding_left",e),{type:"number",step:"1",min:"0"})}
                        ${cgTextField("Padding\nright (px)",e.padding_right,e=>this._cellChanged(o,t,"padding_right",e),{type:"number",step:"1",min:"0"})}
                      </div>

                      <!-- Cell: card picker or card editor -->
                      <div class="cell-card-editor">
                        ${e.card&&Object.keys(e.card).length>0?html`
                          <div
                            class="card-editor-mount"
                            data-row=${o}
                            data-cell=${t}
                          ></div>
                          <div class="change-card-row">
                            <button class="change-card-btn" @click=${()=>this._clearCard(o,t)}>Change card type</button>
                          </div>
                        `:html`
                          <div class="pick-card-row">
                            <button class="add-btn" @click=${()=>this._pickCard(o,t)}>+ Pick card</button>
                          </div>
                        `}
                      </div>

                      <!-- Remove cell button -->
                      <div class="add-btn-row">
                        <button class="remove-btn" @click=${()=>this._removeCell(o,t)}>Remove cell</button>
                      </div>

                    </ha-expansion-panel>
                  `)}
                </div>
              </ha-sortable>

              <!-- Add cell button -->
              <div class="add-btn-row">
                <button class="add-btn" @click=${()=>this._addCell(o)}>+ Add cell</button>
              </div>

              <!-- Row actions: duplicate + remove -->
              <div class="row-action-btns">
                <button class="duplicate-btn" @click=${()=>this._duplicateRow(o)}>Duplicate row</button>
                <button class="remove-btn"    @click=${()=>this._removeRow(o)}>Remove row</button>
              </div>

            </ha-expansion-panel>
          `)}
        </div>
      </ha-sortable>

      <!-- ── Add row button ───────────────────────────────────────────────── -->

      <div class="add-btn-row">
        <button class="add-btn" @click=${this._addRow}>+ Add row</button>
      </div>

    `}}customElements.define("chrono-grid-card-editor",ChronoGridCardEditor);class ChronoGridCard extends LitElement{static properties={_config:{attribute:!1}};static getCardSize(){return 3}static getConfigElement(){return document.createElement("chrono-grid-card-editor")}static getStubConfig(){return{...DEFAULT_CONFIG,rows:[{...DEFAULT_ROW,cells:[{...DEFAULT_CELL}]}]}}constructor(){super(),this._config=null,this._hass=null,this._helpers=null,this._cardElements=[]}async connectedCallback(){super.connectedCallback(),this._helpers||(this._helpers=await window.loadCardHelpers()),this._config&&(this._rebuildCardElements(),this.requestUpdate())}set hass(e){this._hass=e,this._cardElements.forEach(o=>{o&&(o.hass=e)})}get hass(){return this._hass}setConfig(e){this._config={...DEFAULT_CONFIG,...e},this._helpers&&(this._rebuildCardElements(),this.requestUpdate())}_rebuildCardElements(){if(!this._helpers)return;const e=this._config.rows??[];this._cardElements=[],e.forEach(e=>{(e.cells??[]).forEach(e=>{if(e.card&&Object.keys(e.card).length>0){const o=this._helpers.createCardElement(e.card);this._hass&&(o.hass=this._hass),this._cardElements.push(o)}else this._cardElements.push(null)})})}updated(){let e=0;(this._config?.rows??[]).forEach((o,t)=>{(o.cells??[]).forEach((o,r)=>{const i=this.shadowRoot.querySelector(`.grid-cell[data-row="${t}"][data-cell="${r}"]`);if(i){const o=this._cardElements[e];o?i.contains(o)||(i.innerHTML="",i.appendChild(o)):i.innerHTML=""}e++})})}static styles=css`
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
  `;render(){if(!this._config)return html``;const e=this._config,o=e.rows??[],t=e=>void 0!==e&&""!==e?`${e}px`:void 0,r=e=>void 0!==e&&""!==e?e:void 0,i=(e,o,t,r)=>void 0!==e&&""!==e&&void 0!==o&&""!==o&&void 0!==t&&""!==t&&void 0!==r&&""!==r?`${e}px ${o}px ${t}px ${r}px`:void 0,d={"background-color":r(e.background_color),"border-width":t(e.border_width),"border-style":r(e.border_style),"border-color":r(e.border_color),"border-radius":t(e.border_radius),padding:i(e.padding_top,e.padding_right,e.padding_bottom,e.padding_left),"box-shadow":r(e.box_shadow)};return html`
      <div class="grid-wrapper" style=${styleMap(d)}>
        ${o.map((e,o)=>{const d={"grid-template-columns":(e.cells??[]).map(e=>e.width||"1fr").join(" ")||"1fr",gap:t(e.gap),"background-color":r(e.background_color),"border-width":t(e.border_width),"border-style":r(e.border_style),"border-color":r(e.border_color),"border-radius":t(e.border_radius),padding:i(e.padding_top,e.padding_right,e.padding_bottom,e.padding_left)};return html`
            <div class="grid-row" style=${styleMap(d)}>
              ${(e.cells??[]).map((e,d)=>{const n={"background-color":r(e.background_color),"border-width":t(e.border_width),"border-style":r(e.border_style),"border-color":r(e.border_color),"border-radius":t(e.border_radius),padding:i(e.padding_top,e.padding_right,e.padding_bottom,e.padding_left)};return html`
                  <div
                    class="grid-cell"
                    data-row=${o}
                    data-cell=${d}
                    style=${styleMap(n)}
                  ></div>
                `})}
            </div>
          `})}
      </div>
    `}}customElements.define("chrono-grid-card",ChronoGridCard),window.customCards=window.customCards||[],window.customCards.push({type:"chrono-grid-card",name:"Chrono Grid Card",description:"A fully configurable grid wrapper card. Arrange any Home Assistant cards in rows and columns with full styling control.",preview:!1});