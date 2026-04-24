import{LitElement,html,css}from"https://unpkg.com/lit@2.0.0/index.js?module";const CARD_VERSION="0.0.3";console.info("%c CHRONO-%cGRID%c-CARD %c v0.0.3 ","background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 0 2px 4px; border-radius: 3px 0 0 3px;","background-color: #101010; color: #4676d3; font-weight: bold; padding: 2px 0;","background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 4px 2px 0;","background-color: #1E1E1E; color: #FFFFFF; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;");const STUB_CONFIG={rows:[{gap:8,cells:[{width:"1fr",card:{type:"markdown",content:"**Cell 1.1** — width: 1fr"}},{width:"2fr",card:{type:"markdown",content:"**Cell 1.2** — width: 2fr"}}]},{gap:8,cells:[{width:"1fr",card:{type:"markdown",content:"**Cell 2.1** — full width (1fr)"}}]}]};class ChronoGridCard extends LitElement{static properties={_config:{attribute:!1}};static getCardSize(){return 3}static getStubConfig(){return{...STUB_CONFIG}}constructor(){super(),this._config=null,this._hass=null,this._helpers=null,this._cardElements=[]}async connectedCallback(){super.connectedCallback(),this._helpers||(this._helpers=await window.loadCardHelpers()),this._config&&(this._rebuildCardElements(),this.requestUpdate())}set hass(r){this._hass=r,this._cardElements.forEach(e=>{e&&(e.hass=r)})}get hass(){return this._hass}setConfig(r){this._config=r,this._helpers&&(this._rebuildCardElements(),this.requestUpdate())}_rebuildCardElements(){if(!this._helpers)return;const r=(this._config??STUB_CONFIG).rows??[];this._cardElements=[],r.forEach(r=>{(r.cells??[]).forEach(r=>{if(r.card&&Object.keys(r.card).length>0){const e=this._helpers.createCardElement(r.card);this._hass&&(e.hass=this._hass),this._cardElements.push(e)}else this._cardElements.push(null)})})}updated(){let r=0;((this._config??STUB_CONFIG).rows??[]).forEach((e,s)=>{(e.cells??[]).forEach((e,t)=>{const o=this.shadowRoot.querySelector(`.grid-cell[data-row="${s}"][data-cell="${t}"]`);o&&this._cardElements[r]&&(o.contains(this._cardElements[r])||(o.innerHTML="",o.appendChild(this._cardElements[r]))),r++})})}static styles=css`
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
  `;render(){const r=(this._config??STUB_CONFIG).rows??[];return html`
      <div class="grid-wrapper">
        ${r.map((r,e)=>{const s=(r.cells??[]).map(r=>r.width||"1fr").join(" "),t=r.gap??8;return html`
            <div
              class="grid-row"
              style="grid-template-columns: ${s}; gap: ${t}px;"
            >
              ${(r.cells??[]).map((r,s)=>html`
                <div
                  class="grid-cell"
                  data-row=${e}
                  data-cell=${s}
                ></div>
              `)}
            </div>
          `})}
      </div>
    `}}customElements.define("chrono-grid-card",ChronoGridCard),window.customCards=window.customCards||[],window.customCards.push({type:"chrono-grid-card",name:"Chrono Grid Card",description:"A fully configurable grid wrapper card. Arrange any Home Assistant cards in rows and columns with full styling control.",preview:!1});