import { mediaPlayerReducer } from './media-player';
import { assert } from 'chai';
import * as mocha from 'mocha';
import * as testCases from 'test-cases';
import { HomeassistantActions } from '../actions/homeassistant';
import { volumeDown, volumeUp } from '../actions/media-player';

const test = testCases.setup(mocha.test);

suite('MediaPlayerReducer', () => {
    test('should return a default state', () => {
        const state = mediaPlayerReducer(undefined, { type: 'something else' });

        assert.deepEqual(state, {
            volume: 0,
            muted: false
        });
    });

    test('an unrelated action should not modify the state', () => {
        const state = {
            volume: 0.5,
            muted: true
        };

        const result = mediaPlayerReducer(state, { type: 'some action' });

        assert.deepEqual(result, state);
    });

    test
        .case(0.5)
        .case(0.1)
        .run('entities update should update the volume', volume => {
            const action = {
                type: HomeassistantActions.EntityUpdate,
                payload: {
                    entities: {
                        'media_player.yamaha_receiver': {
                            attributes: {
                                volume_level: volume
                            }
                        }
                    }
                }
            };

            const state = {
                volume: 0,
                muted: false
            };

            const result = mediaPlayerReducer(state, action);

            assert.deepEqual(result, {
                volume,
                muted: false
            });
        });

    test
        .case(0.2, 0.22)
        .case(0.54, 0.56)
        .run('volume up should update the volume', (volume, expected) => {
            const state = {
                volume,
                muted: false
            };

            const result = mediaPlayerReducer(state, volumeUp());

            assert.approximately(result.volume, expected, Number.EPSILON);
        });

    test
        .case(0.2, 0.18)
        .case(0.54, 0.52)
        .run('volume down should update the volume', (volume, expected) => {
            const state = {
                volume,
                muted: false
            };

            const result = mediaPlayerReducer(state, volumeDown());

            assert.approximately(result.volume, expected, Number.EPSILON);
        });
});