use hal;
use hal::Pin;
use hal::sysfs_gpio::{Direction, Edge};
use std::sync::mpsc;
use std::thread;
use crate::error::Result;

const BTN_PIN: u64 = 17;
const ENCODER_CLK_PIN: u64 = 27;
const ENCODER_DAT_PIN: u64 = 22;

pub struct Button {
    receiver: mpsc::Receiver<()>,
    handle: thread::JoinHandle<()>
}

impl Button {
    pub fn new(pin_number: u64) -> Result<Button> {
        let pin = setup_input(BTN_PIN)?;
        pin.set_edge(Edge::RisingEdge).unwrap();

        let (sender, receiver) = mpsc::channel();

        let handle = thread::spawn(move || {
            let mut poller = pin.get_poller().unwrap();

            loop {
                match poller.poll(isize::max_value()) {
                    Ok(Some(1)) => sender.send(()).unwrap(),
                    Ok(_) => {},
                    Err(err) => println!("Error {:?}", err)
                }
            }
        });

        Ok(Button {
            receiver,
            handle
        })
    }

    pub fn poll(&self) -> Result<bool> {
        match self.receiver.try_recv() {
            Ok(_) => Ok(true),
            Err(mpsc::TryRecvError::Empty) => Ok(false),
            Err(err) => Err(err.into())
        }
    }
}

pub struct Encoder {
    receiver: mpsc::Receiver<i32>,
    handle: thread::JoinHandle<()>
}

impl Encoder {
    pub fn new(clk_pin: u64, dat_pin: u64) -> Result<Encoder> {
        let clk = setup_input(ENCODER_CLK_PIN).unwrap();
        let dat = setup_input(ENCODER_DAT_PIN).unwrap();

        clk.set_edge(Edge::RisingEdge).unwrap();

        let (sender, receiver) = mpsc::channel();

        let handle = thread::spawn(move || {
            let mut poller = clk.get_poller().unwrap();

            loop {
                match poller.poll(isize::max_value()) {
                    Ok(Some(1)) => {
                        if let Ok(0) = dat.get_value() {
                            sender.send(1).unwrap();
                        }else {
                            sender.send(-1).unwrap();
                        }
                    },
                    Ok(_) => {},
                    Err(err) => {
                        println!("err {:?}", err);
                    }
                }

                thread::sleep_ms(1);
            }
        });

        Ok(Encoder {
            receiver,
            handle
        })
    }

    pub fn poll(&self) -> Result<i32> {
        match self.receiver.try_recv() {
            Ok(dir) => Ok(dir),
            Err(mpsc::TryRecvError::Empty) => Ok(0),
            Err(err) => Err(err.into())
        }
    }
}

fn setup_input(pin_number: u64) -> hal::sysfs_gpio::Result<Pin> {
    let pin = Pin::new(pin_number);
    pin.export()?;

    while !pin.is_exported() {}
    pin.set_direction(Direction::In)?;

    Ok(pin)
}