import {LitElement, html} from './lit-core.min.js';

const MAX_COUNT = 100000;

customElements.define('x-tick-innerhtml', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<span>.</span> ';
    }
});

customElements.define('x-tick-shadowed', class extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = '<span>.</span> ';
    }
});

customElements.define('x-tick-shadowed-append', class extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        const span = document.createElement('span');
        span.textContent = '. ';
        this.shadowRoot.append(span);
    }
});

customElements.define('x-tick-lit', class extends LitElement {
    render() {
        return html`<span>.</span> `;
    }
});

customElements.define('x-tick-append', class extends HTMLElement {
    connectedCallback() {
        const span = document.createElement('span');
        span.textContent = '. ';
        this.append(span);
    }
});

const template = document.createElement('template');
template.innerHTML = '<span>.</span> ';
customElements.define('x-tick-template', class extends HTMLElement {
    connectedCallback() {
        this.append(template.content.cloneNode(true));
    }
});

customElements.define('x-app', class extends HTMLElement {

    #container;
    #buffered = false;

    connectedCallback() {
        const buttonContainer = document.createElement('div');
        this.append(buttonContainer);

        ['innerhtml', 'append', 'shadowed', 'shadowed-append', 'lit', 'template'].forEach(
            element => {
                const button = document.createElement('button');
                button.textContent = element;
                button.addEventListener('click', () => this.run(element));
                buttonContainer.appendChild(button);
                buttonContainer.insertAdjacentText('beforeend', ' ');
            });

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'buffered';
        cb.oninput = (e) => this.#buffered = e.target.checked;
        buttonContainer.appendChild(cb);
        const cbLabel = document.createElement('label');
        cbLabel.htmlFor = 'buffered';
        cbLabel.textContent = 'buffered';
        cbLabel.title = 'buffered in a document fragment before appending to the main DOM';
        buttonContainer.appendChild(cbLabel);

        this.#container = document.createElement('div');
        this.appendChild(this.#container);
    }

    run(element) {
        this.#container.innerHTML = '';
        const start = Date.now();
        let count = 0;
        const container = this.#buffered ? document.createDocumentFragment() : this.#container;
        while (count < MAX_COUNT) {
            const tick = document.createElement('x-tick-' + element);
            container.append(tick);
            count++;
        }
        if (this.#buffered) {
            this.#container.append(container);
        }
        const p = document.createElement('p');
        this.#container.insertBefore(p, this.#container.firstChild);
        // wait until the browser completes the render to measure
        requestAnimationFrame(() => {
            const elapsed = Date.now() - start;
            const ticksPerMs = Math.round(count / elapsed);
            p.textContent = `${count} ${element} ${this.#buffered ? 'buffered' : ''} components in ${elapsed} ms (${ticksPerMs} ticks/ms)`;
        });
    }
});
