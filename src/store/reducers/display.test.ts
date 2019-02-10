import displayReducer, { MenuItem } from './display';
import { assert } from 'chai';
import * as mocha from 'mocha';
import * as testCases from 'test-cases';
import { enterMenu, leaveMenu, nextMenuEntry, prevMenuEntry } from '../actions/menu';

const test = testCases.setup(mocha.test);

suite('DisplayReducer', () => {
    test('should return a default state', () => {
        const state = displayReducer(undefined, { type: 'something else' });

        assert.deepEqual(state, {
            overview: true,
            item: MenuItem.Volume
        });
    });

    test('an unrelated action should not modify the state', () => {
        const state = {
            overview: false,
            item: MenuItem.Light
        };

        const result = displayReducer(state, { type: 'some action' });

        assert.deepEqual(result, state);
    });

    test
        .case(MenuItem.Light)
        .case(MenuItem.Volume)
        .run('enter should leave the overview mode', item => {
            const state = {
                overview: true,
                item
            };

            const result = displayReducer(state, enterMenu());

            assert.deepEqual(result, {
                item,
                overview: false
            });
        });

    test
        .case(MenuItem.Light)
        .case(MenuItem.Volume)
        .run('leave should enter the overview mode', item => {
            const state = {
                overview: false,
                item
            };

            const result = displayReducer(state, leaveMenu());

            assert.deepEqual(result, {
                item,
                overview: true
            });
        });

    test
        .case(MenuItem.Volume, MenuItem.Light)
        .case(MenuItem.Light, MenuItem.Volume)
        .run('next should select the next menu item', (initial, expected) => {
            const state = {
                overview: true,
                item: initial
            };

            const result = displayReducer(state, nextMenuEntry());

            assert.deepEqual(result.item, expected);
        });

    test
        .case(MenuItem.Volume, MenuItem.Light)
        .case(MenuItem.Light, MenuItem.Volume)
        .run('prev should select the prev menu item', (initial, expected) => {
            const state = {
                overview: true,
                item: initial
            };

            const result = displayReducer(state, prevMenuEntry());

            assert.deepEqual(result.item, expected);
        });
});