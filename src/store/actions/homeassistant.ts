import { HassEntities } from 'home-assistant-js-websocket';

export enum HomeassistantActions {
    EntityUpdate = 'hass/entity-update'
}

export const hassEntityUpdate = (entities: HassEntities) => ({
    type: HomeassistantActions.EntityUpdate,
    payload: {
        entities
    }
});
