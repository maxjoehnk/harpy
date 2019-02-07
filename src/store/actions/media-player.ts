export enum MediaPlayerActions {
    VolumeUp = 'media-player/volume/up',
    VolumeDown = 'media-player/volume/down'
}

export const volumeUp = () => ({
    type: MediaPlayerActions.VolumeUp
});

export const volumeDown = () => ({
    type: MediaPlayerActions.VolumeDown
});
