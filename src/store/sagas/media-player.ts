import { all, put, select, takeEvery } from 'redux-saga/effects';
import { HardwareActions } from '../actions/hardware';
import { State } from '../index';
import { MenuItem } from '../reducers/display';
import { volumeDown, volumeUp } from '../actions/media-player';

export function* mediaPlayerSaga() {
    yield all([
        takeEvery(HardwareActions.TurnRight, volumeUpSaga),
        takeEvery(HardwareActions.TurnLeft, volumeDownSaga)
    ]);
}

function* volumeUpSaga() {
    const state = yield select();
    if (!isInRightState(state)) {
        return;
    }
    yield put(volumeUp());
}

function* volumeDownSaga() {
    const state = yield select();
    if (!isInRightState(state)) {
        return;
    }
    yield put(volumeDown());
}

function isInRightState(state: State): boolean {
    return !state.display.overview && state.display.item === MenuItem.Volume;
}