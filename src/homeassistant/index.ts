import { Auth, createConnection } from 'home-assistant-js-websocket'
import { HASS_TOKEN, HASS_URL } from '../config';
import { createSocket } from './socket';

export const connect = async () => {
    const auth = new Auth(<any>{
        access_token: HASS_TOKEN,
        hassUrl: HASS_URL
    });
    const conn = await createConnection({
        auth,
        createSocket
    });
    return conn;
};

