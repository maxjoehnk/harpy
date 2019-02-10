export class Display {
    clear();
    flush();
    renderText(text: string, row: 0 | 1);
    renderBar(progress: number);
}

export class Button {
    constructor(pin: number);

    poll(): boolean;
}

export class Encoder {
    constructor(clk: number, data: number);

    poll(cb: (err, dir: number) => void);
}