# Vanilla benchmarks

These are benchmarks measuring how many vanilla web components (custom elements) can be added to a page in 1 millisecond, 
by adding 100.000 components using various strategies (see below) and measuring elapsed time until the browser has rendered the components.

The focus of this benchmark is on measuring component overhead for the simplest component that actually renders something. 
Each component renders a span containing just a single dot `'.'`.

Part of the [Plain Vanilla Web](https://plainvanillaweb.com) project.

## Running

To run the benchmark yourself:

- Host as a static site: `npx http-server public -c-1`
- Browse to `http://localhost/vanilla`  and run the tests
- Browse to `http://localhost/react`  and run the tests

## Benchmark results (summary)

### How it was run

Benchmark executed with current software versions as of september 5, 2024.

All browsers were loaded without extensions.

Measured on two machines:

- Macbook Air M1 (MacOS), standing in as a "fast" device. Passmark benchmark score: 14255 multi 3730 single.
- Asus Chi T300 (2015) with Core M 5Y10C CPU (Linux Mint Cinnamon), standing in as a "slow" device. Passmark benchmark score: 1911 multi 1120 single.

### Different strategies compared

**How many components can be added to the page per millisecond? (higher is better)**

Techniques:

- `innerhtml`: set custom element content via innerHTML
- `append`: set content via document.createElement and append
- `append (buffered)`: same as append, except buffered first in a document fragment
- `shadow + innerhtml`: set shadow content via innerHTML
- `shadow + append`: set shadow content via append
- `lit`: render via Lit framework
- `template + append`: append a cloned template
- `react pure`: standard react component
- `react + wc`: react component wraps the `append` web component

**Chrome on M1, best of three**

| technique          | ticks/ms |
| ------------------ | -------- |
| innerHTML          | 143      |
| append             | 233      |
| append (buffered)  | 228      |
| shadow + innerHTML | 132      |
| shadow + append    | 183      |
| lit                | 133      |
| template + append  | 181      |
| react pure         | 275      |
| react + wc         | 172      |

**Chrome on Chi, best of three**

| technique          | ticks/ms |
| ------------------ | -------- |
| innerHTML          | 25       |
| append             | 55       |
| append (buffered)  | 56       |
| shadow + innerHTML | 24       |
| shadow + append    | 36       |
| lit                | 30       |
| template + append  | 45       |
| react pure         | 77       |
| react + wc         | 45       |

### Different browsers compared

**On M1, best of three**

(for `append` technique)

| browser  | ticks/ms |
| -------- | -------- |
| Brave    | 146      |
| Chrome   | 233      |
| Edge     | 224      |
| Firefox  | 232      |
| Safari   | 260      |

**On Chi, best of three**

(for `append` technique)

| browser  | ticks/ms |
| -------- | -------- |
| Chrome   | 55       |
| Firefox  | 180      |

### Conclusions

About strategy:

- No matter the strategy, you can render thousands of web components in 100 milliseconds on all devices.
- So in other words, the strategy doesn't matter for typical web applications.
- Appending cloned templates is however clearly preferable over other techniques, as it offers great performance and good ergonomics.
- Buffering in a document fragment before appending doesn't seem to matter, browsers are well-optimized and batch DOM changes automatically.

About shadow DOM:

- Shadow DOM slows down by up to a third, one more reason to avoid it in web components when possible (see also: accessibility, FOUC, complexity).
- Shadow DOM + innerHTML performs the worst of all techniques.

About libraries/frameworks:

- On old and slow devices the Lit framework performs the worst of all strategies,
  because it uses shadow DOM and pairs that with a JS-heavy approach.
- Lit on fast devices performs ok-ish, but is still one of the slowest strategies.
- React renders faster than web components in all cases, due to the overhead of initializing the custom element class for each web component.
- React's performance delta is however less than 2x in all cases, so ultimately it doesn't matter for typical web apps.
- React as a web components wrapper does not slow down the web components.

About slow devices:

- Performance was up to 6x slower than on the fast device, which will be very noticeable to the user for heavy pages.
- Most affected strategies were Lit and innerHTML.
  (Likely reasons: Lit because of shadow DOM and JS-heavy approach, innerHTML because of parsing cost.)

About browsers:

- Brave is soooo slow, not clear why.
- Safari is fast, Apple's claims are not bogus.
- Firefox is a good performer, and a great performer on slow devices.
- Using the "wrong" browser can make a fast machine perform like a slow machine.

## Vanilla detailed benchmark results

### simple component

Set custom element content via innerHTML.

| device | browser  | attempt | ticks/ms |
| ------ | -------- | ------- | -------- |
| M1 Air | brave    | #1      | 95       |
| M1 Air | brave    | #2      | 90       |
| M1 Air | brave    | #3      | 90       |
| M1 Air | chrome   | #1      | 104      |
| M1 Air | chrome   | #2      | 111      |
| M1 Air | chrome   | #3      | 143      |
| M1 Air | edge     | #1      | 119      |
| M1 Air | edge     | #2      | 136      |
| M1 Air | edge     | #3      | 103      |
| M1 Air | firefox  | #1      | 190      |
| M1 Air | firefox  | #2      | 139      |
| M1 Air | firefox  | #3      | 146      |
| M1 Air | safari   | #1      | 191      |
| M1 Air | safari   | #2      | 203      |
| M1 Air | safari   | #3      | 204      |
| Chi    | firefox  | #1      | 129      |
| Chi    | firefox  | #2      | 128      |
| Chi    | firefox  | #3      | 129      |
| Chi    | chrome   | #1      | 25       |
| Chi    | chrome   | #2      | 23       |
| Chi    | chrome   | #3      | 24       |

### simple component (append)

Set content via document.createElement and append.

| device | browser  | attempt | ticks/ms |
| ------ | -------- | ------- | -------- |
| M1 Air | brave    | #1      | 125      |
| M1 Air | brave    | #2      | 126      |
| M1 Air | brave    | #3      | 146      |
| M1 Air | chrome   | #1      | 179      |
| M1 Air | chrome   | #2      | 175      |
| M1 Air | chrome   | #3      | 233      |
| M1 Air | edge     | #1      | 177      |
| M1 Air | edge     | #2      | 177      |
| M1 Air | edge     | #3      | 224      |
| M1 Air | firefox  | #1      | 215      |
| M1 Air | firefox  | #2      | 198      |
| M1 Air | firefox  | #3      | 232      |
| M1 Air | safari   | #1      | 260      |
| M1 Air | safari   | #2      | 58       |
| M1 Air | safari   | #3      | 259      |
| Chi    | firefox  | #1      | 179      |
| Chi    | firefox  | #2      | 180      |
| Chi    | firefox  | #3      | 180      |
| Chi    | chrome   | #1      | 55       |
| Chi    | chrome   | #2      | 48       |
| Chi    | chrome   | #3      | 46       |

### simple component (append, buffered)

Set content via document.createElement and append,
buffered in a document fragment before appending to the main DOM.

| device | browser  | attempt | ticks/ms |
| ------ | -------- | ------- | -------- |
| M1 Air | brave    | #1      | 130      |
| M1 Air | brave    | #2      | 125      |
| M1 Air | brave    | #3      | 144      |
| M1 Air | chrome   | #1      | 228      |
| M1 Air | chrome   | #2      | 225      |
| M1 Air | chrome   | #3      | 176      |
| M1 Air | edge     | #1      | 200      |
| M1 Air | edge     | #2      | 217      |
| M1 Air | edge     | #3      | 218      |
| M1 Air | firefox  | #1      | 385      |
| M1 Air | firefox  | #2      | 350      |
| M1 Air | firefox  | #3      | 239      |
| M1 Air | safari   | #1      | 249      |
| M1 Air | safari   | #2      | 236      |
| M1 Air | safari   | #3      | 253      |
| Chi    | firefox  | #1      | 198      |
| Chi    | firefox  | #2      | 186      |
| Chi    | firefox  | #3      | 202      |
| Chi    | chrome   | #1      | 45       |
| Chi    | chrome   | #2      | 56       |
| Chi    | chrome   | #3      | 47       |

### shadowed component

Set shadow content via innerHTML.

| device | browser  | attempt | ticks/ms |
| ------ | -------- | ------- | -------- |
| M1 Air | brave    | #1      | 83     |
| M1 Air | brave    | #2      | 65     |
| M1 Air | brave    | #3      | 84     |
| M1 Air | chrome   | #1      | 127    |
| M1 Air | chrome   | #2      | 114    |
| M1 Air | chrome   | #3      | 132    |
| M1 Air | edge     | #1      | 118    |
| M1 Air | edge     | #2      | 115    |
| M1 Air | edge     | #3      | 122    |
| M1 Air | firefox  | #1      | 245    |
| M1 Air | firefox  | #2      | 259    |
| M1 Air | firefox  | #3      | 261    |
| M1 Air | safari   | #1      | 161    |
| M1 Air | safari   | #2      | 170    |
| M1 Air | safari   | #3      | 164    |
| Chi    | firefox  | #1      | 88     |
| Chi    | firefox  | #2      | 83     |
| Chi    | firefox  | #3      | 91     |
| Chi    | chrome   | #1      | 17     |
| Chi    | chrome   | #2      | 24     |
| Chi    | chrome   | #3      | 20     |

### shadowed append component

Set shadow content via append.

| device | browser  | attempt | ticks/ms |
| ------ | -------- | ------- | -------- |
| M1 Air | brave    | #1      | 111      |
| M1 Air | brave    | #2      | 111      |
| M1 Air | brave    | #3      | 128      |
| M1 Air | chrome   | #1      | 162      |
| M1 Air | chrome   | #2      | 146      |
| M1 Air | chrome   | #3      | 183      |
| M1 Air | edge     | #1      | 151      |
| M1 Air | edge     | #2      | 145      |
| M1 Air | edge     | #3      | 186      |
| M1 Air | firefox  | #1      | 275      |
| M1 Air | firefox  | #2      | 169      |
| M1 Air | firefox  | #3      | 278      |
| M1 Air | safari   | #1      | 200      |
| M1 Air | safari   | #2      | 201      |
| M1 Air | safari   | #3      | 206      |
| Chi    | firefox  | #1      | 114      |
| Chi    | firefox  | #2      | 110      |
| Chi    | firefox  | #3      | 113      |
| Chi    | chrome   | #1      | 33       |
| Chi    | chrome   | #2      | 36       |
| Chi    | chrome   | #3      | 34       |

### lit component

Render via lit framework.

| device | browser  | attempt | ticks/ms |
| ------ | -------- | ------- | -------- |
| M1 Air | brave    | #1      | 99       |
| M1 Air | brave    | #2      | 97       |
| M1 Air | brave    | #3      | 89       |
| M1 Air | chrome   | #1      | 133      |
| M1 Air | chrome   | #2      | 98       |
| M1 Air | chrome   | #3      | 124      |
| M1 Air | edge     | #1      | 126      |
| M1 Air | edge     | #2      | 106      |
| M1 Air | edge     | #3      | 134      |
| M1 Air | firefox  | #1      | 90       |
| M1 Air | firefox  | #2      | 72       |
| M1 Air | firefox  | #3      | 76       |
| M1 Air | safari   | #1      | 147      |
| M1 Air | safari   | #2      | 148      |
| M1 Air | safari   | #3      | 152      |
| Chi    | firefox  | #1      | 35       |
| Chi    | firefox  | #2      | 31       |
| Chi    | firefox  | #3      | 31       |
| Chi    | chrome   | #1      | 30       |
| Chi    | chrome   | #2      | 23       |
| Chi    | chrome   | #3      | 21       |

### template component

Append by cloning a template.

| device | browser  | attempt | ticks/ms |
| ------ | -------- | ------- | -------- |
| M1 Air | brave    | #1      | 93    |
| M1 Air | brave    | #2      | 100    |
| M1 Air | brave    | #3      | 127    |
| M1 Air | chrome   | #1      | 143    |
| M1 Air | chrome   | #2      | 144    |
| M1 Air | chrome   | #3      | 181    |
| M1 Air | edge     | #1      | 145    |
| M1 Air | edge     | #2      | 150    |
| M1 Air | edge     | #3      | 140    |
| M1 Air | firefox  | #1      | 172    |
| M1 Air | firefox  | #2      | 121    |
| M1 Air | firefox  | #3      | 133    |
| M1 Air | safari   | #1      | 222    |
| M1 Air | safari   | #2      | 219    |
| M1 Air | safari   | #3      | 209    |
| Chi    | firefox  | #1      | 132    |
| Chi    | firefox  | #2      | 139    |
| Chi    | firefox  | #3      | 139    |
| Chi    | chrome   | #1      | 44     |
| Chi    | chrome   | #2      | 43     |
| Chi    | chrome   | #3      | 45     |

## React detailed benchmark results

### Pure react component

Standard react components. Benchmarked to measure relative performance of react to vanilla web components.

| device | browser  | attempt | ticks/ms |
| ------ | -------- | ------- | -------- |
| M1 Air | brave    | #1      | 265      |
| M1 Air | brave    | #2      | 226      |
| M1 Air | brave    | #3      | 275      |
| M1 Air | chrome   | #1      | 274      |
| M1 Air | chrome   | #2      | 265      |
| M1 Air | chrome   | #3      | 275      |
| M1 Air | edge     | #1      | 268      |
| M1 Air | edge     | #2      | 258      |
| M1 Air | edge     | #3      | 267      |
| M1 Air | firefox  | #1      | 171      |
| M1 Air | firefox  | #2      | 185      |
| M1 Air | firefox  | #3      | 167      |
| M1 Air | safari   | #1      | 309      |
| M1 Air | safari   | #2      | 313      |
| M1 Air | safari   | #3      | 316      |
| Chi    | firefox  | #1      | 134      |
| Chi    | firefox  | #2      | 101      |
| Chi    | firefox  | #3      | 102      |
| Chi    | chrome   | #1      | 77       |
| Chi    | chrome   | #2      | 64       |
| Chi    | chrome   | #3      | 72       |

## Custom element wrapper

Each react component is a wrapper around the `append` custom element. Benchmarked to measure the overhead of React
when used to build an app out of vanilla web components.

| device | browser  | attempt | ticks/ms |
| ------ | -------- | ------- | -------- |
| M1 Air | brave    | #1      | 108      |
| M1 Air | brave    | #2      | 102      |
| M1 Air | brave    | #3      | 120      |
| M1 Air | chrome   | #1      | 151      |
| M1 Air | chrome   | #2      | 171      |
| M1 Air | chrome   | #3      | 172      |
| M1 Air | edge     | #1      | 148      |
| M1 Air | edge     | #2      | 167      |
| M1 Air | edge     | #3      | 139      |
| M1 Air | firefox  | #1      | 115      |
| M1 Air | firefox  | #2      | 125      |
| M1 Air | firefox  | #3      | 91       |
| M1 Air | safari   | #1      | 196      |
| M1 Air | safari   | #2      | 193      |
| M1 Air | safari   | #3      | 181      |
| Chi    | firefox  | #1      | 56       |
| Chi    | firefox  | #2      | 62       |
| Chi    | firefox  | #3      | 73       |
| Chi    | chrome   | #1      | 45       |
| Chi    | chrome   | #2      | 44       |
| Chi    | chrome   | #3      | 44       |
