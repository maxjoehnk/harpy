import { HomeassistantActions } from '../actions/homeassistant';
import { MediaPlayerActions } from '../actions/media-player';
import { MenuActions } from '../actions/menu';
import { performance } from 'perf_hooks';

const actionReducers = new Map();
actionReducers.set(HomeassistantActions.EntityUpdate, entityUpdateReducer);
actionReducers.set(MediaPlayerActions.VolumeDown, volumeDownReducer);
actionReducers.set(MediaPlayerActions.VolumeUp, volumeUpReducer);
actionReducers.set(MenuActions.Enter, enterMenuReducer);

const ENTITY_ID = 'media_player.yamaha_receiver';

export interface MediaPlayerState {
    volume: number;
    muted: boolean;
    players: EntityState;
}

export interface EntityState {
    [id: string]: number
}

const initialState: MediaPlayerState = {
    volume: 0,
    muted: false,
    players: {}
};

function entityUpdateReducer(state: MediaPlayerState, action) {
    const { entities } = action.payload;
    return {
        ...state,
        players: {
            [ENTITY_ID]: entities[ENTITY_ID].attributes.volume_level
        }
    };
}

function enterMenuReducer(state: MediaPlayerState, action) {
    return {
        ...state,
        volume: state.players[ENTITY_ID]
    };
}

function volumeUpReducer(state: MediaPlayerState) {
    return {
        ...state,
        volume: state.volume + 0.02
    };
}

function volumeDownReducer(state: MediaPlayerState) {
    return {
        ...state,
        volume: state.volume - 0.02
    };
}

function mediaPlayerReducer(state: MediaPlayerState = initialState, action): MediaPlayerState {
    const reducer = actionReducers.get(action.type);
    if (reducer == null) {
        return state;
    }
    return reducer(state, action);
}

const reducer = performance.timerify(mediaPlayerReducer);

export default reducer;