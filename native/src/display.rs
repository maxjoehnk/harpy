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

const RST_PIN: u64 = 23;
const DC_PIN: u64 = 24;

pub struct Display {
    pub display: GraphicsMode<SpiInterface<Spidev, Pin>>
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
            display
        })
    }

    pub fn clear(&mut self) {
        self.display.clear()
    }

    pub fn flush(&mut self) -> Result<()> {
        self.display.flush()?;
        Ok(())
    }

    pub fn render_text(&mut self, text: &str, row: i32) {
        let pos = Coord::new(0, row * 16);
        self.display.draw(
            Font8x16::render_str(text).translate(pos).into_iter()
        )
    }

    pub fn render_bar(&mut self, progress: f64) {
        let stroke = 2u8;
        let top_left = Coord::new(0, 16);
        let bottom_right = Coord::new(126, 30);
        self.display.draw(
            Rect::new(top_left, bottom_right)
                .with_stroke(Some(1u8.into()))
                .with_stroke_width(stroke)
                .into_iter()
        );
        let width = (124f64 * progress).floor() as i32;
        let top_left = Coord::new(1, 17);
        let bottom_right = Coord::new(width, 29);
        self.display.draw(
            Rect::new(top_left, bottom_right)
                .with_fill(Some(1u8.into()))
                .into_iter()
        )
    }
}