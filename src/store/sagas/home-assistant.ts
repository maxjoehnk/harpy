import { connect } from '../../homeassistant';
import { call, put, select, spawn, take, takeEvery } from 'redux-saga/effects';
import { MediaPlayerActions } from '../actions/media-player';
import { callService, Connection, subscribeEntities } from 'home-assistant-js-websocket';
import { State } from '../index';
import { eventChannel } from 'redux-saga';
import { hassEntityUpdate } from '../actions/homeassistant';

export function* homeAssistantSaga() {
    const connection = yield connect();
    yield takeEvery(MediaPlayerActions.VolumeUp, changeVolumeSaga(connection));
    yield takeEvery(MediaPlayerActions.VolumeDown, changeVolumeSaga(connection));
    yield spawn(entityUpdateSaga(connection));
}

function changeVolumeSaga(hass: Connection) {
    return function* () {
        const state: State = yield select();
        yield call(callService, hass, 'media_player', 'volume_set', {
            entity_id: 'media_player.yamaha_receiver',
            volume_level: state.mediaPlayer.volume
        });
    };
}

function entityUpdateSaga(hass: Connection) {
    return function* () {
        const entityChannel = yield call(observeEntities, hass);
        while (true) {
            const entities = yield take(entityChannel);
            yield put(hassEntityUpdate(entities));
        }
    };
}

const observeEntities = (hass: Connection) => {
    return eventChannel(emitter => subscribeEntities(hass, entities => emitter(entities)));
};