export class Display {
    renderMenu(title: string, entry: string, cb: (err?: Error | null) => void);
    renderBar(title: string, value: number, cb: (err?: Error | null) => void);
}

export class Button {
    constructor(pin: number);

    poll(): boolean;
}

export class Encoder {
    constructor(clk: number, data: number);

    poll(cb: (err, dir: number) => void);
}