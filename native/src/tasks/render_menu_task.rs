use std::sync::{Arc, Mutex};

use embedded_graphics::fonts::Font8x16;
use embedded_graphics::prelude::*;
use hal::{Pin, Spidev};
use neon::prelude::*;
use ssd1306::prelude::*;

pub struct RenderMenuTask {
    title: String,
    entry: String,
    display: Arc<Mutex<GraphicsMode<SpiInterface<Spidev, Pin>>>>,
}

impl RenderMenuTask {
    pub fn new(title: String, entry: String, display: Arc<Mutex<GraphicsMode<SpiInterface<Spidev, Pin>>>>) -> RenderMenuTask {
        RenderMenuTask {
            title,
            entry,
            display,
        }
    }
}

impl Task for RenderMenuTask {
    type Output = ();
    type Error = String;
    type JsEvent = JsUndefined;

    fn perform(&self) -> Result<Self::Output, Self::Error> {
        let mut display = self
            .display
            .lock()
            .map_err(|_| "Could not obtain lock on display".to_string())?;

        display.clear();

        {
            let pos = Coord::new(0, 0);
            display.draw(
                Font8x16::render_str(&self.title).translate(pos).into_iter()
            );
        }

        {
            let pos = Coord::new(0, 16);
            display.draw(
                Font8x16::render_str(&self.entry).translate(pos).into_iter()
            );
        }
        display.flush().map_err(|_| "Failed to flush".to_string())
    }

    fn complete(
        self,
        mut cx: TaskContext,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        result.or_else(|err| cx.throw_error(&err.to_string()))?;

        Ok(cx.undefined())
    }
}
