import { menuSaga } from './menu';
import { all } from 'redux-saga/effects';
import { mediaPlayerSaga } from './media-player';
import { homeAssistantSaga } from './home-assistant';
import { hardwareSaga } from './hardware';
import { uiSaga } from './ui';

export default function* rootSaga() {
    yield all([
        menuSaga(),
        mediaPlayerSaga(),
        homeAssistantSaga(),
        hardwareSaga(),
        uiSaga()
    ]);
}