import { all, call, put, spawn, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { Button, Encoder } from '../../../native';
import { buttonPress, turnLeft, turnRight } from '../actions/hardware';

const POLL_INTERVAL = 10;

const btn = new Button(17);
const encoder = new Encoder(27, 22);

export function* hardwareSaga() {
    yield all([
        spawn(buttonSaga),
        spawn(encoderSaga)
    ]);
}

function* buttonSaga() {
    const channel = yield call(poll, btn);
    while (true) {
        const pressed = yield take(channel);
        if (pressed) {
            yield put(buttonPress());
        }
    }
}

function* encoderSaga() {
    while (true) {
        const direction = yield call(pollEncoder, encoder);
        if (direction === 1) {
            yield put(turnRight());
        }else if (direction === -1) {
            yield put(turnLeft());
        }
    }
}

const poll = (pollable) => {
    return eventChannel(emitter => {
        const intervalId = setInterval(() => {
            const result = pollable.poll();
            emitter(result);
        }, POLL_INTERVAL);

        return () => clearInterval(intervalId);
    });
};

const pollEncoder = (encoder: Encoder) =>
    new Promise((resolve, reject) =>
        encoder.poll((err, dir) => {
            if (err) {
                return reject(err);
            }
            return resolve(dir);
        })
    );