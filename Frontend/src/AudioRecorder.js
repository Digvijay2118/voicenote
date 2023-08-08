import React, { useState } from 'react';
import { ReactMic } from 'react-mic';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000'); // Replace with your server URL

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedBlob) => {
    // Do something with recordedBlob if needed
  };

  const onStop = (recordedBlob) => {
    setAudioBlob(recordedBlob.blob);
  };

  const sendAudio = () => {
    if (audioBlob) {
      socket.emit('send-audio', audioBlob);
     
    }
  };

  

  return (
    <div>
      <ReactMic
        record={isRecording}
        onData={onData}
        onStop={onStop}
        className="sound-wave"
        mimeType="audio/webm"
      />
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <button onClick={sendAudio} disabled={!audioBlob}>
        Send Audio
      </button>
      {audioBlob && (
        <div>
          <AudioPlayer
            src={URL.createObjectURL(audioBlob)}
            autoPlay
            controls
          />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
