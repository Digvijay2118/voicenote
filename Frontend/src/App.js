import AudioRecorder from "../src/AudioRecorder";
import AudioReceiver from "./AudioReceiver";
import './App.css';

function App() {
  return (
    <div>
      <h1>Audio Recorder</h1>
      <AudioRecorder />
      <AudioReceiver/>
    </div>
  );
}

export default App;
