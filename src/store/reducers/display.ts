import { MenuActions } from '../actions/menu';

const actionReducers = new Map();
actionReducers.set(MenuActions.Enter, enterReducer);
actionReducers.set(MenuActions.Leave, leaveReducer);
actionReducers.set(MenuActions.Next, nextReducer);
actionReducers.set(MenuActions.Previous, prevReducer);

export enum MenuItem {
    Volume,
    Light
}

export interface DisplayState {
    item: MenuItem;
    overview: boolean;
}

const initialState: DisplayState = {
    item: MenuItem.Volume,
    overview: true
};

function enterReducer(state: DisplayState, action): DisplayState {
    return {
        ...state,
        overview: false
    };
}

function leaveReducer(state: DisplayState, action): DisplayState {
    return {
        ...state,
        overview: true
    };
}

function nextReducer(state: DisplayState, action): DisplayState {
    let item = state.item + 1;
    if (item > MenuItem.Light) {
        item = MenuItem.Volume;
    }
    return {
        ...state,
        item
    };
}

function prevReducer(state: DisplayState, action): DisplayState {
    let item = state.item - 1;
    if (item < 0) {
        item = MenuItem.Light;
    }
    return {
        ...state,
        item
    };
}

export function displayReducer(state: DisplayState = initialState, action): DisplayState {
    const reducer = actionReducers.get(action.type);
    if (reducer == null) {
        return state;
    }
    return reducer(state, action);
}
