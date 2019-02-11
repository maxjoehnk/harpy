use embedded_graphics::fonts::*;
use embedded_graphics::prelude::*;
use embedded_graphics::primitives::Rect;
use hal;
use hal::{Delay, Pin, Spidev};
use hal::spidev::SpidevOptions;
use ssd1306::Builder;
use ssd1306::prelude::*;

use crate::error::Result;
use crate::output::setup_output;
use std::sync::Arc;
use std::sync::Mutex;

const RST_PIN: u64 = 23;
const DC_PIN: u64 = 24;

pub struct Display {
    pub display: Arc<Mutex<GraphicsMode<SpiInterface<Spidev, Pin>>>>
}

impl Display {
    pub fn new() -> Result<Display> {
        let mut spi = Spidev::open("/dev/spidev0.0")?;
        let options = SpidevOptions::new().max_speed_hz(50_000).build();

        spi.configure(&options)?;

        // Setup Reset Pin
        let mut reset = setup_output(RST_PIN).unwrap();

        // Setup DC Pin
        let dc = setup_output(DC_PIN).unwrap();

        let mut delay = Delay {};

        let mut display: GraphicsMode<_> = Builder::new().with_size(DisplaySize::Display128x32).connect_spi(spi, dc).into();
        display.reset(&mut reset, &mut delay);
        display.init()?;
        display.clear();

        Ok(Display {
            display: Arc::new(Mutex::new(display))
        })
    }

    pub fn clear(&self) -> Result<()> {
        let mut display = self.display.lock().map_err(|err| format!("{:?}", err))?;
        display.clear();
        Ok(())
    }

    pub fn render_text(&self, text: &str, row: i32) -> Result<()> {
        let pos = Coord::new(0, row * 16);
        let mut display = self.display.lock().map_err(|err| format!("{:?}", err))?;
        display.draw(
            Font8x16::render_str(text).translate(pos).into_iter()
        );
        Ok(())
    }

    pub fn render_bar(&self, progress: f64) -> Result<()> {
        let mut display = self.display.lock().map_err(|err| format!("{:?}", err))?;
        let stroke = 2u8;
        let top_left = Coord::new(0, 16);
        let bottom_right = Coord::new(126, 30);
        display.draw(
            Rect::new(top_left, bottom_right)
                .with_stroke(Some(1u8.into()))
                .with_stroke_width(stroke)
                .into_iter()
        );
        let width = (124f64 * progress).floor() as i32;
        let top_left = Coord::new(1, 17);
        let bottom_right = Coord::new(width, 29);
        display.draw(
            Rect::new(top_left, bottom_right)
                .with_fill(Some(1u8.into()))
                .into_iter()
        );
        Ok(())
    }
}
