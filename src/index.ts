import 'dotenv/config';
import { Display } from '../native';
import store from './store';
import * as ui from './ui';

async function main() {
    const render = ui.connect(new Display());
    render(store.getState());

    store.subscribe(() => {
        const state = store.getState();
        render(state);
    });
}

main()
    .catch(err => console.error(err));
