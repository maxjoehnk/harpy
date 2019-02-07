import { Display } from '../../native';
import { DisplayState, MenuItem } from '../store/reducers/display';
import * as debug from 'debug';
import { State } from '../store';

const d = debug('harpy:ui');

export function connect(display: Display) {
    function render(state: State) {
        d('render');
        display.clear();
        if (state.display.overview) {
            drawMainMenu(state.display);
        }else {
            drawVolumeBar(state);
        }
        display.flush();
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

    return render;
}

