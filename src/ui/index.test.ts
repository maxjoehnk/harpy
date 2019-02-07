import { connect } from './index';
import * as mocha from 'mocha';
import * as testCases from 'test-cases';
import { MenuItem } from '../store/reducers/display';
import { assert as sinonAssert, stub } from 'sinon';

const test = testCases.setup(mocha.test);

suite('UI', () => {
    let displayMock;
    let render;

    beforeEach(() => {
        displayMock = {
            clear: stub(),
            flush: stub(),
            renderText: stub(),
            renderBar: stub()
        };
        render = connect(displayMock);
    });

    test('render should clear the display', () => {
        render({ ...defaultState });

        sinonAssert.called(displayMock.clear);
    });

    test('render should flush the display', () => {
        render({ ...defaultState });

        sinonAssert.called(displayMock.flush);
    });

    test
        .case(MenuItem.Volume, 'Volume')
        .case(MenuItem.Light, 'Light')
        .run('render should draw the main menu', (item, expected) => {
            render({
                ...defaultState, display: {
                    overview: true,
                    item
                }
            });

            sinonAssert.calledWith(displayMock.renderText, 'Menu', 0);
            sinonAssert.calledWith(displayMock.renderText, expected, 1);
        });

    test
        .case(0.1)
        .case(0.5)
        .run('render should draw volume bar', (volume) => {
            render({
                ...defaultState,
                mediaPlayer: {
                    volume,
                    muted: false
                },
                display: {
                    overview: false,
                    item: MenuItem.Volume
                }
            });

            sinonAssert.calledWith(displayMock.renderText, 'Volume', 0);
            sinonAssert.calledWith(displayMock.renderBar, volume);
        });
});

const defaultState = {
    display: {
        overview: true,
        menu: MenuItem.Volume
    }
};