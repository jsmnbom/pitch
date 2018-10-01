//! An implementation of the YIN frequency estimation algorithm
//! Algorithm source: http://audition.ens.fr/adc/pdf/2002_JASA_YIN.pdf

extern crate cfg_if;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

pub fn difference(buffer: &mut Vec<f64>, input: &[u8]) {
    let mut delta: f64;

    for tau in 0..input.len() / 2 {
        for i in 0..input.len() / 2 {
            delta = input[i] as f64 - input[i + tau] as f64;
            buffer[tau] += delta * delta;
        }
    }
}

pub fn cumulative_mean_normalized_difference(buffer: &mut Vec<f64>) {
    buffer[0] = 1.0;
    let mut running_sum: f64 = 0.0;
    for tau in 0..buffer.len() {
        running_sum += buffer[tau];
        buffer[tau] *= tau as f64 / running_sum;
    }
}

pub fn absolute_threshold(buffer: &Vec<f64>, threshold: f64) -> (i16, f64) {
    let probability: f64;
    for i in 2..buffer.len() {
        if buffer[i] < threshold {
            let mut tau = i;
            while tau + 1 < buffer.len() && buffer[tau + 1] < buffer[tau] {
                tau += 1;
            }
            probability = 1.0 - buffer[tau];
            return (tau as i16, probability);
        }
    }
    return (-1, 0.0);
}

pub fn parabolic_interpolation(buffer: &Vec<f64>, tau_estimate: i16) -> f64 {
    let better_tau: f64;
    let x0: i16;
    let x2: i16;

    if tau_estimate < 1 {
        x0 = tau_estimate;
    } else {
        x0 = tau_estimate - 1;
    }

    if tau_estimate + 1 < buffer.len() as i16 {
        x2 = tau_estimate + 1;
    } else {
        x2 = tau_estimate;
    }

    if x0 == tau_estimate {
        if buffer[tau_estimate as usize] <= buffer[x2 as usize] {
            better_tau = tau_estimate as f64;
        } else {
            better_tau = x2 as f64;
        }
    } else if x2 == tau_estimate {
        if buffer[tau_estimate as usize] <= buffer[x0 as usize] {
            better_tau = tau_estimate as f64;
        } else {
            better_tau = x0 as f64;
        }
    } else {
        let (s0, s1, s2) = (
            buffer[x0 as usize],
            buffer[tau_estimate as usize],
            buffer[x2 as usize],
        );
        better_tau = tau_estimate as f64 + (s2 - s0) / (2.0 * (2.0 * s1 - s2 - s0));
    }
    better_tau
}

#[wasm_bindgen]
pub struct Result {
    pitch_in_hertz: f64,
    probability: f64,
}

#[wasm_bindgen]
impl Result {
    pub fn get_pitch_in_hertz(&self) -> f64 {
        self.pitch_in_hertz
    }

    pub fn get_probability(&self) -> f64 {
        self.probability
    }
}

#[wasm_bindgen]
pub fn yin(input: &[u8], threshold: f64, sampling_rate: f64) -> Result {
    let mut buffer = vec![0.0; input.len() / 2];

    difference(&mut buffer, &input);
    cumulative_mean_normalized_difference(&mut buffer);

    let (tau_estimate, probability) = absolute_threshold(&buffer, threshold);

    if tau_estimate != -1 {
        return Result {
            pitch_in_hertz: sampling_rate / parabolic_interpolation(&buffer, tau_estimate),
            probability,
        };
    }

    return Result {
        pitch_in_hertz: -1.0,
        probability: 0.0,
    };
}
