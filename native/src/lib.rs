extern crate linux_embedded_hal as hal;
#[macro_use]
extern crate neon;

use neon::prelude::*;
use std::sync::Arc;
use crate::display::Display;
use crate::input::{Button, Encoder};

mod error;
mod display;
mod input;
mod output;
mod tasks;

use tasks::*;

declare_types! {
    pub class JsButton for Button {
        init(mut cx) {
            let pin_number = cx.argument::<JsNumber>(0)?.value() as u64;
            let btn = Button::new(pin_number).expect("btn failed");
            Ok(btn)
        }

        method poll(mut cx) {
            let this = cx.this();
            let pressed = {
                let guard = cx.lock();
                let btn = this.borrow(&guard);
                btn.poll().unwrap()
            };
            Ok(cx.boolean(pressed).upcast())
        }
    }
}

declare_types! {
    pub class JsEncoder for Encoder {
        init(mut cx) {
            let clk_pin = cx.argument::<JsNumber>(0)?.value() as u64;
            let dat_pin = cx.argument::<JsNumber>(1)?.value() as u64;
            let encoder = Encoder::new(clk_pin, dat_pin).expect("encoder failed");
            Ok(encoder)
        }

        method poll(mut cx) {
            let cb = cx.argument::<JsFunction>(0)?;
            let this = cx.this();
            let rx = cx.borrow(&this, |encoder| Arc::clone(&encoder.receiver));
            let task = EncoderTask::new(rx);

            task.schedule(cb);

            Ok(JsUndefined::new().upcast())
        }
    }
}

declare_types! {
    pub class JsDisplay for Display {
        init(_cx) {
            let display = Display::new().expect("display failed");
            Ok(display)
        }

        method renderMenu(mut cx) {
            let title = cx.argument::<JsString>(0)?.value();
            let entry = cx.argument::<JsString>(1)?.value();
            let cb = cx.argument::<JsFunction>(2)?;

            let this = cx.this();
            let display = cx.borrow(&this, |display| Arc::clone(&display.display));
            let task = RenderMenuTask::new(title, entry, display);

            task.schedule(cb);

            Ok(JsUndefined::new().upcast())
        }

        method renderBar(mut cx) {
            let title = cx.argument::<JsString>(0)?.value();
            let value = cx.argument::<JsNumber>(1)?.value();
            let cb = cx.argument::<JsFunction>(2)?;

            let this = cx.this();
            let display = cx.borrow(&this, |display| Arc::clone(&display.display));
            let task = RenderBarTask::new(title, value, display);

            task.schedule(cb);

            Ok(JsUndefined::new().upcast())
        }
    }
}


register_module!(mut cx, {
    cx.export_class::<JsDisplay>("Display")?;
    cx.export_class::<JsButton>("Button")?;
    cx.export_class::<JsEncoder>("Encoder")?;
    Ok(())
});
