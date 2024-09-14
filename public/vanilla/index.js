import {LitElement, html} from './lit-core.min.js';
import { getRunParams } from '../test-shared.js';

customElements.define('x-tick-innerhtml', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<span>.</span> ';
    }
});

customElements.define('x-tick-append', class extends HTMLElement {
    connectedCallback() {
        const span = document.createElement('span');
        span.textContent = '. ';
        this.append(span);
    }
});

customElements.define('x-tick-shadowed', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = '<span>.</span> ';
    }
});

customElements.define('x-tick-shadowed-append', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
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
    #buffered;
    #norender;
    #running;
    #maxCount;

    connectedCallback() {
        const runParams = {
            // defaults can be overridden with hash: #run=innerhtml,maxCount=1000,norender=true
            run: false,
            buffered: false,
            norender: false,
            maxCount: 100000,
            ...getRunParams()
        };
        this.#buffered = runParams.buffered;
        this.#norender = runParams.norender;
        this.#maxCount = runParams.maxCount;

        // manual operation
        if (!runParams.run) {
            this.addControls();
        }

        this.#container = document.createElement('div');
        this.appendChild(this.#container);

        if (runParams.run) {
            this.run(runParams.run, true);
        }
    }

    run(method, automatic = false) {
        let count = 0;
        const doTest = () => {
            const container = this.#buffered ? document.createDocumentFragment() : this.#container;
            let tick;
            while (count < this.#maxCount) {
                if (method === 'direct') {
                    tick = document.createElement('span');
                    tick.textContent = '. ';
                } else {
                    tick = document.createElement('x-tick-' + method);
                }
                if (!this.#norender) container.append(tick);
                count++;
            }
            if (this.#buffered) {
                this.#container.append(container);
            }
            // for detecting when the test is complete
            const done = document.createElement('span');
            done.id = 'done';
            this.#container.append(done);
        }

        if (automatic) {
            // invisible button will be clicked programmatically
            const btn = document.createElement('button');
            btn.textContent = 'Run';
            btn.id = 'run';
            btn.addEventListener('click', () => doTest());
            btn.style = 'position: absolute; top: -500px;';
            this.#container.append(btn);
        } else {
            if (this.#running) return;
            this.#running = true;
            this.#container.innerHTML = '';
            // give the browser the chance to do housekeeping after clearing the container
            setTimeout(() => {
                const start = Date.now();
                doTest();
                // wait until the browser completes the render to measure
                requestAnimationFrame(() => {
                    const elapsed = Date.now() - start;
                    const ticksPerMs = Math.round(count / elapsed);
                    const p = document.createElement('p');
                    p.textContent = `${count} ${method} ${this.#buffered ? 'buffered' : ''} components in ${elapsed} ms (${ticksPerMs} ticks/ms)`;
                    this.#container.insertBefore(p, this.#container.firstChild);
                    this.#running = false;
                });
            }, 10);
        }
    }

    addControls() {
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
            (e) => this.#buffered = !!e.target.checked,
            this.#buffered
        );

        this.addCheckbox(
            buttonContainer, 
            'norender',
            'create the elements but don\'t add them to the document',
            (e) => this.#norender = !!e.target.checked,
            this.#norender
        )
    }

    addCheckbox(container, id, title, handler, checked) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = id;
        cb.checked = !!checked;
        cb.onchange = handler;
        container.appendChild(cb);
        const cbLabel = document.createElement('label');
        cbLabel.htmlFor = id;
        cbLabel.textContent = id;
        cbLabel.title = title;
        container.appendChild(cbLabel);
    }
});

window.addEventListener('hashchange', () => location.reload());
