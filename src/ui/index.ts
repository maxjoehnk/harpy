import { Display } from '../../native';
import { DisplayState, MenuItem } from '../store/reducers/display';
import * as debug from 'debug';
import { State } from '../store';
import { performance } from 'perf_hooks';

const d = debug('harpy:ui');

export function connect(display: Display) {
    function render(state: State) {
        d('render');
        display.clear();
        if (state.display.overview) {
            mainMenu(state.display);
        }else {
            volumeBar(state);
        }
        performance.mark('flush_before');
        display.flush();
        performance.mark('flush_after');
        performance.measure('flush', 'flush_before', 'flush_after');
    }

    function drawMainMenu(state: DisplayState) {
        display.renderText('Menu', 0);
        const text = MenuItem[state.item];
        display.renderText(text, 1);
    }

    function drawVolumeBar(state) {
        display.renderText('Volume', 0);
        display.renderBar(state.mediaPlayer.volume);
    }

    const mainMenu = performance.timerify(drawMainMenu);
    const volumeBar = performance.timerify(drawVolumeBar);

    return performance.timerify(render);
}

