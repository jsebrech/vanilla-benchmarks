const ALL_TESTS = [
    // rendered (vanilla)
    { test: 'vanilla', run: 'innerhtml' },
    { test: 'vanilla', run: 'append' },
    { test: 'vanilla', run: 'append', buffered: true },
    { test: 'vanilla', run: 'shadowed' },
    { test: 'vanilla', run: 'shadowed-append' },
    { test: 'vanilla', run: 'lit' },
    { test: 'vanilla', run: 'template' },
    { test: 'vanilla', run: 'textcontent' },
    { test: 'vanilla', run: 'direct' },
    // rendered (react)
    { test: 'react', run: 'react' },
    { test: 'react', run: 'webcomponent' },
    // not rendered (vanilla)
    { test: 'vanilla', run: 'append', norender: true },
    { test: 'vanilla', run: 'shadowed', norender: true },
    { test: 'vanilla', run: 'lit', norender: true },
    { test: 'vanilla', run: 'direct', norender: true },
];

// create this many elements in each run
const ELEMENT_COUNT = 50000;

customElements.define('x-suite', class extends HTMLElement {

    #btn;
    #label;
    #container;
    #log;

    connectedCallback() {
        this.#btn = document.createElement('button');
        this.#btn.textContent = 'Run';
        this.#btn.style = 'margin-right: 0.5em; margin-bottom: 1em;';
        this.#btn.addEventListener('click', () => {
            this.runAll();
        });
        this.append(this.#btn);

        this.#label = document.createElement('label');
        this.append(this.#label);

        this.#container = document.createElement('div');
        this.append(this.#container);

        this.#log = document.createElement('div');
        this.append(this.#log);
    }

    async runAll() {
        this.#btn.setAttribute('disabled', true);
        this.#log.innerHTML = '';
        // warmup: run through each method / combination once to warmup the browser
        for (const test of ALL_TESTS) {
            this.#label.textContent = `Warming up ${test.test} ${test.run} ${test.norender ? '(norender)' : ''} ${test.buffered ? '(buffered)' : ''}...`;
            await this.runTest(test);
        }
        // iterations: repeat each method 10 times, measure total elapsed time / (iterations * number of elements)
        for (const test of ALL_TESTS) {
            this.#label.textContent = `Running ${test.test} ${test.run} ${test.norender ? '(norender)' : ''} ${test.buffered ? '(buffered)' : ''}...`;
            let measurements = [];
            for (let i = 0; i < 10; i++) {
                const { elapsed } = await this.runTest(test);
                measurements.push(elapsed);
            }
            const meanElapsed = geomean(measurements);
            const elementsPerMs = Math.round(ELEMENT_COUNT / meanElapsed);
            this.#log.insertAdjacentHTML('beforeend', 
                `<p>${test.test} ${test.run} ${test.norender ? 'norender' : ''} ${test.buffered ? 'buffered' : ''} - elements/ms: ${elementsPerMs}</p>`);
        }

        this.#label.textContent = 'done';
        this.#btn.removeAttribute('disabled');
    }

    async runTest(test) {
        const hash = Object.entries(test).map(([k, v]) => `${k}=${v}`).join(',') + ',maxCount=' + ELEMENT_COUNT;
        const frame = document.createElement('iframe');
        // must use deprecated attribute: https://github.com/davidjbradshaw/iframe-resizer/issues/1142#issuecomment-1959544213
        frame.setAttribute("scrolling", "no");
        this.#container.append(frame);
        frame.src = `${test.test}/index.html#${hash}`;
        const runBtn = await waitForElement(frame, '#run');
        const start = performance.now();
        runBtn.click();
        await waitForElement(frame, '#done');
        // Some browsers don't immediately update the layout for paint.
        // Force the layout here to ensure we're measuring the layout time.
        frame.contentDocument.body.getBoundingClientRect();
        const elapsed = performance.now() - start;
        frame.remove();
        return { test, elapsed };
    }
});


// taken from speedometer: https://github.com/WebKit/Speedometer
async function waitForElement(frame, selector) {
    return new Promise((resolve) => {
        const resolveIfReady = () => {
            const element = frame.contentDocument.querySelector(selector);
            let callback = resolveIfReady;
            if (element)
                callback = () => resolve(element);
            window.requestAnimationFrame(callback);
        };
        resolveIfReady();
    });
}
function geomean(measurements) {
    let product = 1;
    for (const measurement of measurements) {
        product *= measurement;
    }
    return Math.pow(product, 1 / measurements.length);
}