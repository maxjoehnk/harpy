import * as debug from 'debug';
import { HomeassistantActions } from '../actions/homeassistant';

const d = debug('harpy:store:logger');

const blacklist = [
    HomeassistantActions.EntityUpdate
];

export function logger() {
    return next => action => {
        if (!blacklist.includes(action.type)) {
            d(action);
        }

        return next(action);
    };
}