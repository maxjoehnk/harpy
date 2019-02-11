import { Display } from '../../native';
import { MenuItem } from '../store/reducers/display';
import * as debug from 'debug';
import { State } from '../store';
import { performance } from 'perf_hooks';
import { promisify } from 'util';

const d = debug('harpy:ui');

export function connect(display: Display) {
    const renderMenu = promisify(display.renderMenu.bind(display));
    const renderBar = promisify(display.renderBar.bind(display));

    async function render(state: State) {
        d('render');
        performance.mark('render');
        if (state.display.overview) {
            await renderMenu('Menu', MenuItem[state.display.item]);
        }else {
            await renderBar('Volume', state.mediaPlayer.volume);
        }
        performance.mark('render_done');
        performance.measure('render', 'render', 'render_done');
    }

    return performance.timerify(render);
}

