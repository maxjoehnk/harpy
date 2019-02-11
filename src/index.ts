import 'dotenv/config';
import { PerformanceObserver } from 'perf_hooks';
import './store';
import * as debug from 'debug';

if (process.env.NODE_ENV !== 'production') {
    const d = debug('harpy:performance');
    const obs = new PerformanceObserver(list => {
        d(list.getEntries());
    });
    obs.observe({ entryTypes: ['function', 'measure'], buffered: true });
}
