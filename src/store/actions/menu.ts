export enum MenuActions {
    Enter = 'menu/enter',
    Leave = 'menu/leave',
    Next = 'menu/next',
    Previous = 'menu/previous'
}

export const enterMenu = () => ({
    type: MenuActions.Enter
});

export const leaveMenu = () => ({
    type: MenuActions.Leave
});

export const nextMenuEntry = () => ({
    type: MenuActions.Next
});

export const prevMenuEntry = () => ({
    type: MenuActions.Previous
});