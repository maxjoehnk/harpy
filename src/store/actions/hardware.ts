export enum HardwareActions {
    ButtonPress = 'hardware/button-press',
    TurnLeft = 'hardware/turn-left',
    TurnRight = 'hardware/turn-right'
}

export const buttonPress = () => ({
    type: HardwareActions.ButtonPress
});

export const turnLeft = () => ({
    type: HardwareActions.TurnLeft
});

export const turnRight = () => ({
    type: HardwareActions.TurnRight
});