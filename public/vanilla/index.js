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

customElements.define('x-tick-textcontent', class extends HTMLElement {
    connectedCallback() {
        this.textContent = '. ';
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
    #rendered = true;
    #running = false;

    connectedCallback() {
        const buttonContainer = document.createElement('div');
        this.append(buttonContainer);

        ['innerhtml', 'append', 'shadowed', 'shadowed-append', 'lit', 'template', 'textcontent', 'direct'].forEach(
            element => {
                const button = document.createElement('button');
                button.textContent = element;
                button.addEventListener('click', () => this.run(element));
                buttonContainer.appendChild(button);
                buttonContainer.insertAdjacentText('beforeend', ' ');
            });

        this.addCheckbox(
            buttonContainer, 
            'buffered',
            'buffered in a document fragment before appending to the main DOM',
            (e) => this.#buffered = !!e.target.checked
        );

        this.addCheckbox(
            buttonContainer, 
            'norender',
            'create the elements but don\'t add them to the document',
            (e) => this.#rendered = !e.target.checked
        )

        this.#container = document.createElement('div');
        this.appendChild(this.#container);
    }

    run(element) {
        if (this.#running) return;
        this.#running = true;
        this.#container.innerHTML = '';
        // give the browser the chance to do housekeeping after clearing the container
        setTimeout(() => {
            const start = Date.now();
            let count = 0;
            const container = this.#buffered ? document.createDocumentFragment() : this.#container;
            let tick;
            while (count < MAX_COUNT) {
                if (element === 'direct') {
                    tick = document.createElement('span');
                    tick.textContent = '. ';
                } else {
                    tick = document.createElement('x-tick-' + element);
                }
                if (this.#rendered) container.append(tick);
                count++;
            }
            if (this.#buffered) {
                this.#container.append(container);
            }
            // wait until the browser completes the render to measure
            requestAnimationFrame(() => {
                const elapsed = Date.now() - start;
                const ticksPerMs = Math.round(count / elapsed);
                const p = document.createElement('p');
                p.textContent = `${count} ${element} ${this.#buffered ? 'buffered' : ''} components in ${elapsed} ms (${ticksPerMs} ticks/ms)`;
                this.#container.insertBefore(p, this.#container.firstChild);
                this.#running = false;
            });
        }, 10);
    }

    addCheckbox(container, id, title, handler) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = id;
        cb.onchange = handler;
        container.appendChild(cb);
        const cbLabel = document.createElement('label');
        cbLabel.htmlFor = id;
        cbLabel.textContent = id;
        cbLabel.title = title;
        container.appendChild(cbLabel);
    }
});
