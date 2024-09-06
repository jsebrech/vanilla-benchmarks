const { React, ReactDOM } = window;
const e = React.createElement;

const MAX_COUNT = 100000;

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
        const buttons = ['react', 'webcomponent'].map(
            element => {
                return e(Button, 
                        { onClick: () => this.setState({ current: element, start: Date.now(), elapsed: 0 }), name: element });
            }
        );
        const buttonContainer = e('div', null, ...buttons);

        const children = [];
        if (this.state.current) {
            children.push(e(Ticks, {current: this.state.current, start: this.state.start}));
            if (!this.state.elapsed) {
                // wait until react and the browser complete the render to measure
                requestAnimationFrame(() => {
                    this.setState({ elapsed: Date.now() - this.state.start });
                });
            } else {
                const ticksPerMs = Math.round(MAX_COUNT / this.state.elapsed);
                children.unshift(e('p', null, 
                    `${MAX_COUNT} ${this.state.current} components in ${this.state.elapsed} ms (${ticksPerMs} ticks/ms)`));    
            }
        } else {
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
    while (count < MAX_COUNT) {
        children.push(e(elem));
        count++;
    }
    return children;
}

function Button(props){
    return e('button',{onClick:props.onClick},props.name);
}
const TickReact = () => e('span', null, '. ');
const TickWC = () => e('x-tick-append');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
