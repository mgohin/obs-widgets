class Configurator extends HTMLElement {

    _countdownEl;
    _widgetUrlEl;

    constructor() {
        super();
        this.innerHTML = `
           <section>
                <h1>Configurator <button onclick="event.stopPropagation(); toggleRenderView(true)">Close</button></h1>
                <p>Use this form to configure your widget url</p>
            </section>
            <section class="render-view">
                <obs-countdown id="countdown" class="render-view"></obs-countdown>
            </section>
            <section>
                <h2>Widget url</h2>
                <obs-countdown-configurator-widget-url id="widget-url"></obs-countdown-configurator-widget-url>
            </section>
            <section id="color-picker">

            </section>
        `;
        this._countdownEl = document.getElementById('countdown');
        this._initWidgetUrl();
        this._initCountdown();
        this._initColorPicker();
    }

    _initWidgetUrl() {
        this._widgetUrlEl = document.getElementById('widget-url');
        this._widgetUrlEl.addEventListener('change', ev => {
            this._updateCountdown(ev.detail.data);
        });
    }

    _initCountdown() {
        const searchParams = new URLSearchParams(window.location.search);
        const date = searchParams.get('date') ?? null;
        const show = searchParams.get('show') ?? 'hours,secondes       minutes;days';
        const textColor = searchParams.get('text-color') ?? '#000';

        if (date !== null) {
            this._widgetUrlEl.setAttribute('date', date);
        }

        this._widgetUrlEl.setAttribute('show', show);
        this._widgetUrlEl.setAttribute('text-color', textColor);
    }

    _updateCountdown(data) {
        if (data.date === null) {
            this._countdownEl.removeAttribute('date');
        } else {
            this._countdownEl.setAttribute('date', data.date);
        }
        if (data.show === null) {
            this._countdownEl.removeAttribute('show');
        } else {
            this._countdownEl.setAttribute('show', data.show);
        }
        if (data.textColor === null) {
            this._countdownEl.removeAttribute('text-color');
        } else {
            this._countdownEl.setAttribute('text-color', data.textColor);
        }
    }

    _initColorPicker() {
        const colorPickerEl = document.createElement('obs-countdown-configurator-color-picker');
        colorPickerEl.setAttribute('color', '#CE3B3B');
        colorPickerEl.addEventListener('change', ev => {
            this._widgetUrlEl.setAttribute('text-color', ev.detail.color);
        });
        document.getElementById('color-picker')
            .appendChild(colorPickerEl);
    }
}

window.customElements.define('obs-configurator', Configurator);