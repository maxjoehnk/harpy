import 'dotenv/config';
import { Display } from '../native';
import store from './store';
import * as ui from './ui';
import { PerformanceObserver } from 'perf_hooks';
import * as debug from 'debug';

async function main() {
    const render = ui.connect(new Display());
    render(store.getState());

    store.subscribe(() => {
        const state = store.getState();
        render(state);
    });
}

main()
    .catch(err => console.error(err));

if (process.env.NODE_ENV !== 'production') {
    const d = debug('harpy:performance');
    const obs = new PerformanceObserver(list => {
        d(list.getEntries());
    });
    obs.observe({ entryTypes: ['function', 'measure'], buffered: true });
}
