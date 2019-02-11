use std::sync::{Arc, Mutex, mpsc};
use neon::prelude::*;

pub struct EncoderTask(Arc<Mutex<mpsc::Receiver<i32>>>);

impl EncoderTask {
    pub fn new(receiver: Arc<Mutex<mpsc::Receiver<i32>>>) -> EncoderTask {
        EncoderTask(receiver)
    }
}

impl Task for EncoderTask {
    type Output = i32;
    type Error = String;
    type JsEvent = JsNumber;

    fn perform(&self) -> Result<Self::Output, Self::Error> {
        let rx = self
            .0
            .lock()
            .map_err(|_| "Could not obtain lock on receiver".to_string())?;

        rx.recv().map_err(|_| "Failed to receive event".to_string())
    }

    fn complete(
        self,
        mut cx: TaskContext,
        event: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        let event = event.or_else(|err| cx.throw_error(&err.to_string()))?;

        Ok(cx.number(event as f64))
    }
}