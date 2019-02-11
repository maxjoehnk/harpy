use std::sync::{Arc, Mutex};
use neon::prelude::*;
use hal::{Pin, Spidev};
use embedded_graphics::fonts::Font8x16;
use embedded_graphics::prelude::*;
use embedded_graphics::primitives::Rect;
use ssd1306::prelude::*;

pub struct RenderBarTask {
    title: String,
    value: f64,
    display: Arc<Mutex<GraphicsMode<SpiInterface<Spidev, Pin>>>>
}

impl RenderBarTask {
    pub fn new(title: String, value: f64, display: Arc<Mutex<GraphicsMode<SpiInterface<Spidev, Pin>>>>) -> RenderBarTask {
        RenderBarTask {
            title,
            value,
            display
        }
    }
}

impl Task for RenderBarTask {
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
            let stroke = 2u8;
            let top_left = Coord::new(0, 16);
            let bottom_right = Coord::new(126, 30);
            display.draw(
                Rect::new(top_left, bottom_right)
                    .with_stroke(Some(1u8.into()))
                    .with_stroke_width(stroke)
                    .into_iter()
            );
            let width = (124f64 * self.value).floor() as i32;
            let top_left = Coord::new(1, 17);
            let bottom_right = Coord::new(width, 29);
            display.draw(
                Rect::new(top_left, bottom_right)
                    .with_fill(Some(1u8.into()))
                    .into_iter()
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