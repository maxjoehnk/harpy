extern crate linux_embedded_hal as hal;
#[macro_use]
extern crate neon;

use neon::prelude::*;

use crate::display::Display;
use crate::input::{Button, Encoder};

mod error;
mod display;
mod input;
mod output;

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
            let this = cx.this();
            let direction = {
                let guard = cx.lock();
                let encoder = this.borrow(&guard);
                encoder.poll().unwrap()
            };
            Ok(cx.number(direction).upcast())
        }
    }
}

declare_types! {
    pub class JsDisplay for Display {
        init(_cx) {
            let display = Display::new().expect("display failed");
            Ok(display)
        }

        method clear(mut cx) {
            let mut this = cx.this();
            {
                let mut guard = cx.lock();
                let mut display = this.borrow_mut(&mut guard);
                display.clear();
            }
            Ok(cx.undefined().upcast())
        }

        method flush(mut cx) {
            let mut this = cx.this();
            {
                let guard = cx.lock();
                let mut display = this.borrow_mut(&guard);
                display.flush().unwrap();
            }
            Ok(cx.undefined().upcast())
        }

        method renderText(mut cx) {
            let text: String = cx.argument::<JsString>(0)?.value();
            let row = cx.argument::<JsNumber>(1)?.value() as i32;

            let mut this = cx.this();
            {
                let guard = cx.lock();
                let mut display = this.borrow_mut(&guard);
                display.render_text(&text, row);
            }
            Ok(cx.undefined().upcast())
        }

        method renderBar(mut cx) {
            let progress = cx.argument::<JsNumber>(0)?.value();
            let mut this = cx.this();
            {
                let guard = cx.lock();
                let mut display = this.borrow_mut(&guard);
                display.render_bar(progress);
            }
            Ok(cx.undefined().upcast())
        }
    }
}


register_module!(mut cx, {
    cx.export_class::<JsDisplay>("Display")?;
    cx.export_class::<JsButton>("Button")?;
    cx.export_class::<JsEncoder>("Encoder")?;
    Ok(())
});
