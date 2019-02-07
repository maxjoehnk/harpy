import {
    ConnectionOptions,
    ERR_CANNOT_CONNECT,
    ERR_HASS_HOST_REQUIRED,
    ERR_INVALID_AUTH,
} from 'home-assistant-js-websocket';
import * as WebSocket from 'ws';
import * as debug from 'debug';

const d = debug('harpy:homeassistant:socket');

const MSG_TYPE_AUTH_REQUIRED = 'auth_required';
const MSG_TYPE_AUTH_INVALID = 'auth_invalid';
const MSG_TYPE_AUTH_OK = 'auth_ok';


export async function createSocket(options: ConnectionOptions): Promise<any> {
    if (!options.auth) {
        throw ERR_HASS_HOST_REQUIRED;
    }
    const auth = options.auth;

    // Convert from http:// -> ws://, https:// -> wss://
    const url = auth.wsUrl;

    d('Initializing', url);

    function connect(
        triesLeft: number,
        promResolve: (socket: WebSocket) => void,
        promReject: (err) => void
    ) {
        d('New connection', url);

        const socket = new WebSocket(url);

        // If invalid auth, we will not try to reconnect.
        let invalidAuth = false;

        const closeMessage = () => {
            // If we are in error handler make sure close handler doesn't also fire.
            socket.removeEventListener('close', closeMessage);
            if (invalidAuth) {
                promReject(ERR_INVALID_AUTH);
                return;
            }

            // Reject if we no longer have to retry
            if (triesLeft === 0) {
                // We never were connected and will not retry
                promReject(ERR_CANNOT_CONNECT);
                return;
            }

            const newTries = triesLeft === -1 ? -1 : triesLeft - 1;
            // Try again in a second
            setTimeout(
                () =>
                    connect(
                        newTries,
                        promResolve,
                        promReject
                    ),
                1000
            );
        };

        // Auth is mandatory, so we can send the auth message right away.
        const handleOpen = async () => {
            try {
                socket.send(JSON.stringify(authMessage(auth.accessToken)));
            }catch (err) {
                // Refresh token failed
                invalidAuth = err === ERR_INVALID_AUTH;
                socket.close();
            }
        };

        const handleMessage = async (data) => {
            const message = JSON.parse(data);

            d('Received', message);
            switch (message.type) {
                case MSG_TYPE_AUTH_INVALID:
                    invalidAuth = true;
                    socket.close();
                    break;

                case MSG_TYPE_AUTH_OK:
                    socket.removeEventListener('open', <any>handleOpen);
                    socket.removeEventListener('message', <any>handleMessage);
                    socket.removeEventListener('close', closeMessage);
                    socket.removeEventListener('error', closeMessage);
                    promResolve(socket);
                    break;

                default:
                    // We already send this message when socket opens
                    if (message.type !== MSG_TYPE_AUTH_REQUIRED) {
                        d('Unhandled message', message);
                    }
            }
        };

        socket.on('open', <any>handleOpen);
        socket.on('message', <any>handleMessage);
        socket.on('close', closeMessage);
        socket.on('error', closeMessage);
    }

    return new Promise((resolve, reject) =>
        connect(
            options.setupRetry,
            resolve,
            reject
        )
    );
}

export function authMessage(accessToken: string) {
    return {
        type: "auth",
        access_token: accessToken
    };
}