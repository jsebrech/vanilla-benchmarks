# Vanilla benchmarks

These are benchmarks measuring how many vanilla web components (custom elements) can be added to a page in 1 millisecond.

The focus of this benchmark is on measuring component overhead for the simplest component that actually renders something. 
Each component renders a span containing just a single dot `'.'`.

Part of the [Plain Vanilla Web](https://plainvanillaweb.com) project.

## Running

To run the benchmark yourself:

- Host as a static site: `npx http-server public`
- Browse to `http://localhost:8080/` in a freshly restarted and clean browser session (private mode)
- Click 'Run' to run all the tests

## Benchmark results (summary)

### How it was run

All browsers were first restarted, and loaded without extensions in private mode.

Measured on two machines:

- Macbook Air M1 (MacOS), standing in as a "fast" device. Passmark benchmark score: 14255 multi 3730 single.
- Asus Chi T300 (2015) with Core M 5Y10C CPU (Linux Mint Cinnamon), standing in as a "slow" device. Passmark benchmark score: 1911 multi 1120 single.

Test suite run in automatic mode.

### Different strategies compared

**How many components can be added to the page per millisecond? (higher is better)**

Techniques:

- `innerhtml`: set custom element content via innerHTML
- `append`: set content via document.createElement and append
- `append (buffered)`: same as append, except buffered first in a document fragment
- `shadow`: with shadow DOM, set shadow content via innerHTML
- `shadow + append`: with shadow DOM, set shadow content via append
- `template + append`: append a cloned template
- `textcontent`: set content via this.textContent, skipping the span
- `direct`: just create the span directly, not a custom element, to measure the overhead custom elements introduce
- `lit`: render via Lit framework, because it is a popular option to build web components
- `react pure`: render via react framework, standard react component, as a baseline comparison to "standard" web dev practice
- `react + wc`: render via react framework, react component wraps the `append` web component
- `norender`: same tests, but only creating elements and not appending to the document, to get an indication of element construction cost

**Chrome on M1**

Benchmark executed with current software versions as of september 15, 2024.

Higher is better.

| technique          | ticks/ms |
| ------------------ | -------- |
| innerHTML          | 135      |
| append             | 239      |
| append (buffered)  | 239      |
| shadow + innerHTML | 127      |
| shadow + append    | 203      |
| template + append  | 198      |
| textcontent        | 345      |
| direct             | 461      |
| lit                | 137      |
| react pure         | 338      |
| react + wc         | 212      |
| append (norender)  | 1393     |
| shadow (norender)  | 814      |
| direct (norender)  | 4277     |
| lit (norender)     | 880      |

**Chrome on Chi**

| technique          | ticks/ms |
| ------------------ | -------- |
| innerHTML          | 29       |
| append             | 55       |
| append (buffered)  | 59       |
| shadow + innerHTML | 26       |
| shadow + append    | 47       |
| template + append  | 46       |
| textcontent        | 81       |
| direct             | 116      |
| lit                | 33       |
| react pure         | 87       |
| react + wc         | 52       |
| append (norender)  | 434      |
| shadow (norender)  | 231      |
| direct (norender)  | 1290     |
| lit (norender)     | 239      |

### Different browsers compared

**On M1**

(for `append` technique)

| browser  | ticks/ms |
| -------- | -------- |
| Brave    | 145      |
| Chrome   | 239      |
| Edge     | 237      |
| Firefox  | 299      |
| Safari   | 239      |

**On Chi**

(for `append` technique)

| browser  | ticks/ms |
| -------- | -------- |
| Chrome   | 55       |
| Firefox  | 77       |

### Conclusions

About strategy:

- No matter the strategy, you can render thousands of web components in 100 milliseconds on all devices.
- For a typical web application, the strategy therefore probably doesn't matter.
- Appending cloned templates is preferable over other techniques, as it offers decent performance and good ergonomics. Because of the weak performance of innerHTML it should be avoided in performance-sensitive situations.
- Buffering in a document fragment before appending doesn't seem to matter (within the margin of error), browsers are well-optimized and batch DOM changes automatically.
- Comparing direct vs textcontent we see that custom elements offer low overhead over naked spans.

About shadow DOM:

- Shadow DOM slows down up to a third, one more reason to avoid it in web components when possible (see also: accessibility, FOUC, complexity).
- Shadow DOM also causes high memory usage (observable during test run in browser task manager)
- Shadow DOM + innerHTML performs the worst of all vanilla techniques.
- Because of the slowness and memory use shadow DOM should be avoided for components that end up on the page thousands of times.

About libraries/frameworks:

- React performs in the same performance class to optimized web components (that don't use innerHTML or shadow DOM).
- React vs web components therefore is a red herring, as getting good performance out of either approach involves project-specific details.
- React as a web components wrapper does not slow down the web components but ends up gated by them.
- Lit is a weak performer, especially when comparing to React. Firefox is particularly impacted. This is likely due to its use of shadow DOM and a JS-heavy approach to building web components.

About slow devices:

- Performance was up to 5x slower than on the fast device, which will be very noticeable to the user for heavy pages.
- Performance decreases were similar across all strategies.

About browsers:

- Brave is significantly slower, likely due to built-in ad blocking. (Adding an ad blocking extension to a browser significantly slows it down.)
- Safari, Chrome and Edge end up in roughly the same performance class.
- Firefox is the best performer overall, but is unusually slow for the Lit strategy.
- There is an up to 2x performance delta between slowest and fastest browser on the same machine.

## Vanilla detailed benchmark results

See the results folder.
