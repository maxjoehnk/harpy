import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { displayReducer, DisplayState } from './reducers/display';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import { logger } from './middleware/logger';
import { mediaPlayerReducer, MediaPlayerState } from './reducers/media-player';

export interface State {
    display: DisplayState;
    mediaPlayer: MediaPlayerState;
}

const reducers = combineReducers({
    display: displayReducer,
    mediaPlayer: mediaPlayerReducer
});

const sagaMiddleware = createSagaMiddleware();

const store: Store<State, any> = createStore(reducers, applyMiddleware(
    logger,
    sagaMiddleware
));

sagaMiddleware.run(rootSaga);

export default store;