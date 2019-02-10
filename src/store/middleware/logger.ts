import * as debug from 'debug';
import { HomeassistantActions } from '../actions/homeassistant';
import { performance } from 'perf_hooks';

const d = debug('harpy:store:logger');

const blacklist = [
    HomeassistantActions.EntityUpdate
];

export function logger() {
    return next => action => {
        if (!blacklist.includes(action.type)) {
            d(action);
        }

        performance.mark('before-transition');
        const state = next(action);
        performance.mark('after-transition');
        performance.measure('state-transition', 'before-transition', 'after-transition');

        return state;
    };
}