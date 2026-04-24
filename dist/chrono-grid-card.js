import{LitElement,html,css}from"https://unpkg.com/lit@2.0.0/index.js?module";const CARD_VERSION="0.0.2";console.info("%c CHRONO-%cGRID%c-CARD %c v0.0.2 ","background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 0 2px 4px; border-radius: 3px 0 0 3px;","background-color: #101010; color: #4676d3; font-weight: bold; padding: 2px 0;","background-color: #101010; color: #FFFFFF; font-weight: bold; padding: 2px 4px 2px 0;","background-color: #1E1E1E; color: #FFFFFF; font-weight: bold; padding: 2px 4px; border-radius: 0 3px 3px 0;");const STUB_CONFIG={rows:[{gap:8,cells:[{width:"1fr",card:{type:"markdown",content:"**Cell 1.1** — width: 1fr"}},{width:"2fr",card:{type:"markdown",content:"**Cell 1.2** — width: 2fr"}}]},{gap:8,cells:[{width:"1fr",card:{type:"markdown",content:"**Cell 2.1** — full width (1fr)"}}]}]};class ChronoGridCard extends LitElement{static properties={_config:{attribute:!1}};static getCardSize(){return 3}static getStubConfig(){return{...STUB_CONFIG}}constructor(){super(),this._config=null,this._hass=null,this._cardElements=[]}set hass(r){this._hass=r,this._cardElements.forEach(o=>{o&&(o.hass=r)})}get hass(){return this._hass}setConfig(r){this._config=r,this._rebuildCardElements(),this.requestUpdate()}_rebuildCardElements(){const r=(this._config??STUB_CONFIG).rows??[];this._cardElements=[],r.forEach(r=>{(r.cells??[]).forEach(r=>{const o=document.createElement("hui-element");r.card&&Object.keys(r.card).length>0&&(o.config=r.card),this._hass&&(o.hass=this._hass),this._cardElements.push(o)})})}updated(){let r=0;((this._config??STUB_CONFIG).rows??[]).forEach((o,t)=>{(o.cells??[]).forEach((o,d)=>{const e=this.shadowRoot.querySelector(`.grid-cell[data-row="${t}"][data-cell="${d}"]`);e&&this._cardElements[r]&&(e.contains(this._cardElements[r])||(e.innerHTML="",e.appendChild(this._cardElements[r]))),r++})})}static styles=css`
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
        ${r.map((r,o)=>{const t=(r.cells??[]).map(r=>r.width||"1fr").join(" "),d=r.gap??8;return html`
            <div
              class="grid-row"
              style="grid-template-columns: ${t}; gap: ${d}px;"
            >
              ${(r.cells??[]).map((r,t)=>html`
                <div
                  class="grid-cell"
                  data-row=${o}
                  data-cell=${t}
                ></div>
              `)}
            </div>
          `})}
      </div>
    `}}customElements.define("chrono-grid-card",ChronoGridCard),window.customCards=window.customCards||[],window.customCards.push({type:"chrono-grid-card",name:"Chrono Grid Card",description:"A fully configurable grid wrapper card. Arrange any Home Assistant cards in rows and columns with full styling control.",preview:!1});