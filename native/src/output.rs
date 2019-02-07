use hal;
use hal::Pin;
use hal::sysfs_gpio::Direction;

use crate::error::Result;

pub fn setup_output(pin_number: u64) -> Result<Pin> {
    let pin = Pin::new(pin_number);
    pin.export()?;

    while !pin.is_exported() {}
    pin.set_direction(Direction::Out)?;

    Ok(pin)
}
