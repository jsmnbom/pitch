import React, {Component, Fragment} from 'react';
import './App.css';
import PitchChart from "./PitchChart";
import TextDisplay from "./TextDisplay";

class App extends Component {
    mediaRecorder = null;

    state = {
        supported: null,
        running: false,
        data: [],
        max: 0,
        min: Infinity
    };

    constructor(props) {
        super(props);

        this.state.supported = navigator.mediaDevices.getUserMedia;
    }

    async initAudio() {
        console.log('Getting audio context');
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        console.log('Loading yin');
        this.yin = (await import("./yin/pkg/yin")).yin;
        console.log(this.yin);

        console.log('Requesting audio permissions');
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        console.log('Audio permissions OK');
        this.mediaRecorder = new MediaRecorder(stream);

        const source = this.audioCtx.createMediaStreamSource(stream);

        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048; // TODO: 1024 maybe?
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);

        source.connect(this.analyser);
    }

    update = () => {
        if (this.state.running) window.requestAnimationFrame(this.update);
        //let t0 = performance.now();

        this.analyser.getByteTimeDomainData(this.dataArray);

        const y = this.yin(this.dataArray, 0.10, this.audioCtx.sampleRate);
        const pitch = y.get_pitch_in_hertz();
        const probability = y.get_probability();
        y.free();

        //let t1 = performance.now();

        this.setState(prevState => ({
            data: [...prevState.data, {
                x: performance.now() - this.startedAt,
                y: pitch === -1 || isNaN(pitch) ? null : pitch,
                probability
            }],
            max: pitch === -1 || isNaN(pitch) ? prevState.max : (pitch > prevState.max ? pitch : prevState.max),
            min: pitch === -1 || isNaN(pitch) ? prevState.min : (pitch < prevState.min ? pitch : prevState.min)
        }))

        // console.log(pitch, y.get_probability());


        //console.log("took " + (t1 - t0) + " milliseconds.")
    };

    handleStart = async (e) => {
        if (!this.mediaRecorder) {
            await this.initAudio()
        }

        this.startedAt = performance.now();
        this.mediaRecorder.start();
        this.setState({
            running: true
        }, () => {
            this.update()
        });
    };

    handleStop = (e) => {
        this.setState({
            running: false
        });
        this.mediaRecorder.stop();
    };

    render() {
        const {supported} = this.state;

        return (
            <div className="App">
                <header className="header">
                    <h1 className="title">Hello!</h1>
                </header>
                {supported ? (
                    <div className="buttons">
                        <button onClick={this.handleStart}>Start</button>
                        <button onClick={this.handleStop}>Stop</button>
                    </div>
                ) : (
                    <p>Not supported on this platform! :(</p>
                )}
                <PitchChart data={this.state.data} min={this.state.min} max={this.state.max}/>
                <TextDisplay/>
            </div>
        );
    }
}

export default App;
