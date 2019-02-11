use std::io;
use std::result;
use std::fmt;
use std::sync::mpsc;

#[derive(Debug)]
pub enum Error {
    None,
    Io(io::Error),
    Format(fmt::Error),
    Gpio(hal::sysfs_gpio::Error),
    Disconnected,
    Msg(String)
}

pub type Result<S> = result::Result<S, Error>;

impl From<()> for Error {
    fn from(_err: ()) -> Error {
        Error::None
    }
}

impl From<io::Error> for Error {
    fn from(err: io::Error) -> Error {
        Error::Io(err)
    }
}

impl From<fmt::Error> for Error {
    fn from(err: fmt::Error) -> Error {
        Error::Format(err)
    }
}

impl From<hal::sysfs_gpio::Error> for Error {
    fn from(err: hal::sysfs_gpio::Error) -> Error {
        Error::Gpio(err)
    }
}

impl From<mpsc::TryRecvError> for Error {
    fn from(_err: mpsc::TryRecvError) -> Error {
        Error::Disconnected
    }
}

impl From<String> for Error {
    fn from(err: String) -> Error {
        Error::Msg(err)
    }
}