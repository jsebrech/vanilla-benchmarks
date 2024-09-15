import { getRunParams } from "../test-shared.js";

const { React, ReactDOM } = window;
const e = React.createElement;

const params = {
    // defaults can be overridden with hash: #run=react,maxCount=1000
    maxCount: 100000,
    ...getRunParams()
}

customElements.define('x-tick-append', class extends HTMLElement {
    connectedCallback() {
        const span = document.createElement('span');
        span.textContent = '. ';
        this.append(span);
    }
});

class App extends React.Component {

    state = {
        current: '',
        start: 0,
        elapsed: 0,
    }

    render() {
        const automatic = !!params.run;

        let buttonContainer;
        if (!automatic) {
            const buttons = ['react', 'webcomponent'].map(
                element => {
                    return e(Button, 
                            { onClick: () => this.setState({ current: element, start: Date.now(), elapsed: 0 }), name: element });
                }
            );
            buttonContainer = e('div', null, ...buttons);        
        } else {
            const button = e(Button, { 
                onClick: () => this.setState({ current: params.run, start: Date.now(), elapsed: 0 }), 
                id: 'run', name: 'run',
                style: { position: 'absolute', left: '-500px' }
            });
            buttonContainer = e('div', null, button);
        }

        const children = [];
        if (this.state.current) {
            children.push(e(Ticks, {current: this.state.current, start: this.state.start}));
            // for detecting when the test is complete
            children.push(e('span', {id: 'done' }));
            // if this isn't run as part of a suite (manual run)
            if (!automatic) {
                if (!this.state.elapsed) {
                    // wait until react and the browser complete the render to measure
                    requestAnimationFrame(() => {
                        this.setState({ elapsed: Date.now() - this.state.start });
                    });
                } else {
                    const ticksPerMs = Math.round(params.maxCount / this.state.elapsed);
                    children.unshift(e('p', null, 
                        `${params.maxCount} ${this.state.current} components in ${this.state.elapsed} ms (${ticksPerMs} ticks/ms)`));    
                }
            }
        } else if (!automatic) {
            children.push(e('p', null, 'Choose a strategy to benchmark'));
        }

        return [buttonContainer, ...children];
    }
}

function Ticks ({current}) {
    let count = 0;
    const children = [];
    let elem;
    switch (current) {
        case 'react': elem = TickReact; break;
        case 'webcomponent': elem = TickWC; break;
        default: elem = TickReact;
    }
    while (count < params.maxCount) {
        children.push(e(elem));
        count++;
    }
    return children;
}

function Button(props){
    return e('button',{onClick:props.onClick, ...props},props.name);
}
const TickReact = () => e('span', null, '. ');
const TickWC = () => e('x-tick-append');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));

window.addEventListener('hashchange', () => location.reload());
