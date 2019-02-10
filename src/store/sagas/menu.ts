import { all, put, select, takeEvery } from 'redux-saga/effects';
import { HardwareActions } from '../actions/hardware';
import { enterMenu, leaveMenu, nextMenuEntry, prevMenuEntry } from '../actions/menu';

export function* menuSaga() {
    yield all([
        takeEvery(HardwareActions.ButtonPress, buttonPressSaga),
        takeEvery(HardwareActions.TurnRight, turnRightSaga),
        takeEvery(HardwareActions.TurnLeft, turnLeftSaga)
    ]);
}

export function* buttonPressSaga() {
    const state = yield select();
    if (state.display.overview) {
        yield put(enterMenu());
    }else {
        yield put(leaveMenu());
    }
}

export function* turnRightSaga() {
    const state = yield select();
    if (state.display.overview) {
        yield put(nextMenuEntry());
    }
}

export function* turnLeftSaga() {
    const state = yield select();
    if (state.display.overview) {
        yield put(prevMenuEntry());
    }
}