import { select } from 'redux-saga/effects';
import * as ui from '../../ui';
import { Display } from '../../../native';

const render = ui.connect(new Display());

export function* uiSaga() {
    while (true) {
        const state = yield select();
        yield render(state);
    }
}
