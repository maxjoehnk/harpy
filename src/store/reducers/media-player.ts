import { HomeassistantActions } from '../actions/homeassistant';
import { MediaPlayerActions } from '../actions/media-player';

const actionReducers = new Map();
actionReducers.set(HomeassistantActions.EntityUpdate, entityUpdateReducer);
actionReducers.set(MediaPlayerActions.VolumeDown, volumeDownReducer);
actionReducers.set(MediaPlayerActions.VolumeUp, volumeUpReducer);

const ENTITY_ID = 'media_player.yamaha_receiver';

export interface MediaPlayerState {
    volume: number;
    muted: boolean;
}

const initialState: MediaPlayerState = {
    volume: 0,
    muted: false
};

function entityUpdateReducer(state: MediaPlayerState, action) {
    const { entities } = action.payload;
    return {
        ...state,
        volume: entities[ENTITY_ID].attributes.volume_level
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

export function mediaPlayerReducer(state: MediaPlayerState = initialState, action): MediaPlayerState {
    const reducer = actionReducers.get(action.type);
    if (reducer == null) {
        return state;
    }
    return reducer(state, action);
}