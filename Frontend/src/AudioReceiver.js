  import React, { useState, useEffect } from 'react';
  import io from 'socket.io-client';
  import AudioPlayer from 'react-h5-audio-player';
  import 'react-h5-audio-player/lib/styles.css';
  import axios from 'axios';

  const socket = io('http://localhost:5000'); // Replace with your server URL

  const AudioReceiver = () => {
    const [audioMessages, setAudioMessages] = useState([]);

    useEffect(() => {
      socket.on('received-audio', (audioPath) => {
        setAudioMessages((prevMessages) => [...prevMessages, { audio_url: audioPath }]);
      
      });
      fetchAudioMessages();

      return () => {
        socket.off('received-audio');
      };
    }, []);

    const fetchAudioMessages = async () => {
      try {
        const response = await axios.get('/api/audio-messages');
        setAudioMessages(response.data);
        console.log("res====>",response)
      } catch (error) {
        console.log("error===>",error)
      }
    };
    console.log("audioMessages===--->",audioMessages)

  //   return (
  //     <div>
  //       {audioMessages.map((message, index) => (
          
         
          
  //         <div key={index}>
  //           {console.log("Audio src:", `/audio/${message.audio_url}`)}
  //           <AudioPlayer src={`/audio/${message.audio_url}`} autoPlay controls />
  //         </div>
          
  //       ))}
  //     </div>
      
  //   );
  // };
  return (
    <div>
      {audioMessages.map((message, index) => {
        const audioUrl = `http://localhost:5000${message.audio_url}`;
        console.log("Audio URL====:", audioUrl);

        return (
          <div key={index}>
            <AudioPlayer src={audioUrl} autoPlay controls />
          </div>
        );
      })}
    </div>
  );
};

  export default AudioReceiver;
