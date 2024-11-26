const BaseCss = `
    :host {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
    
   code {
        background-color: #f8f8f8;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 90%;
        margin: 0;
        padding: .05rem .2rem;
    }
`;

class Countdown extends HTMLElement {
    _shadow;
    _toDate = null;
    _textColor;
    _updateCountDownInterval = null;
    _diffInMs = 0;
    _timeEls = [];

    constructor() {
        super();
        this._shadow = this.attachShadow({mode : 'closed' }) ;
        const css = document.createElement('style');
        css.textContent = BaseCss;
        this._shadow.appendChild(css);
    }

    static get observedAttributes() {
        return ['date', 'show', 'text-color'];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (property === 'date') {
            this._updatePropertyDate(newValue);
        } else if (property === 'show') {
            this._updatePropertyShow(newValue);
        } else if(property === 'text-color') {
            this._textColor = newValue;
            this._timeEls.forEach(el => el.setAttribute('text-color', newValue));
        }
    }

    connectedCallback() {
        this._resetTimeElements();
    }

    _updatePropertyDate(newValue) {
        this._toDate = new Date(newValue);
        this._updateInterval();
    }

    _updatePropertyShow(newValue) {
        const units = newValue.split(/[\s;,]/).map(unit => unit.trim());
        this._timeEls = ['days', 'hours', 'minutes', 'secondes']
            .filter(unit => unit.length > 0 && units.includes(unit))
            .map(unit => {
                const el = document.createElement('obs-countdown-unit');
                el.setAttribute('unit', unit);
                return el;
            });
        this._resetTimeElements();
    }

    _resetTimeElements() {
        Array.from(this._shadow.childNodes)
            .filter(node => node.nodeName !== 'STYLE')
            .forEach(el => el.remove());

        if (isNaN(this._toDate.getTime())) {
            const futureDate = new Date();
            futureDate.setTime(futureDate.getTime() + 2 * 60 * 60 * 1000);
            const el = document.createElement('p');
            el.innerHTML = `Date limite non définie, veuillez modifier le paramètre <code>date</code> du composant, par exemple <code>&lt;obs-countdown date="${futureDate.toISOString()}" /&gt;</code>`;
            this._shadow.append(el);
        } else {
            this._timeEls.forEach(el => this._shadow.appendChild(el));
            this._updateView();
        }
    }

    _updateView() {
        this._timeEls.forEach(el => el.setAttribute('remaining-time-in-ms', this._diffInMs));
    }

    _updateInterval() {
        if (!this._updateCountDownInterval) {
            this._updateCountDownInterval = setInterval(() => {
                const now = new Date();
                this._diffInMs = Math.max(0, this._toDate.getTime() - now.getTime());
                if (!this._diffInMs) {
                    clearInterval(this._updateCountDownInterval);
                    this._updateCountDownInterval = null;
                }
                this._updateView();
            }, 200);
        }
    }
}

window.customElements.define('obs-countdown', Countdown);
