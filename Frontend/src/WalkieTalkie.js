import React, { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import io from "socket.io-client";
import axios from "axios";
import { ReactMic } from "react-mic";
import { faPlus, faMinus,faCaretUp,faCaretDown } from "@fortawesome/free-solid-svg-icons";

const socket = io("http://localhost:5000");


function WalkieTalkie() {
  const [buttonColor, setButtonColor] = useState('red');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  // const [selectedFrequency, setSelectedFrequency] = useState("frequency 1");
  const [selectedFrequency, setSelectedFrequency] = useState("Frequency 1");

  const [selectedImage, setSelectedImage] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [audioMessages, setAudioMessages] = useState([]);
  const [volume, setVolume] = useState(50);
  const [alertShown, setAlertShown] = useState(false);


  const frequencyOptions = ["Frequency 1", "Frequency 2", "Frequency 3", "Frequency 4"];

  // Function to toggle the button color
  const toggleButton = () => {
    // Toggle between green and red
    const newColor = buttonColor === 'green' ? 'red' : 'green';
    setButtonColor(newColor);
  };


  


  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };
  const onStop = (recordedBlob) => {
    const audioBlob = recordedBlob.blob;
    sendAudio(audioBlob);
  };

  const onData = (recordedBlob) => {
    // Do something with recordedBlob if needed
  };


  const sendAudio = async (audioBlob) => {
    try {
      if (audioBlob) {
        socket.emit("send-audio", { audioBlob, group: selectedFrequency });
        console.log("Sending audio with group:", selectedFrequency);
      } else {
        console.log("No audio to send");
      }
    } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  


  const handleTextChange = (e) => {
    setTextMessage(e.target.value);
  };

  const sendTextMessage = () => {
    socket.emit("send-text", { sender: "YourName", messageText: textMessage });
    setTextMessage(""); // Clear the input field after sending
  };

    // Handle image selection and upload
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      setSelectedImage(file);
    };

    const sendImage = async () => {
      try {
        if (selectedImage) {
          const formData = new FormData();
          formData.append("image", selectedImage);
  
          await axios.post("http://localhost:5000/api/upload-image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          console.log("Image sent successfully");
        } else {
          console.log("No image to send");
        }
      } catch (error) {
        console.error("Error sending image:", error);
      }
    };


    useEffect(() => {
      handleGroupChange(selectedFrequency);
    }, [selectedFrequency]);
  
    const handleGroupChange = (group) => {
      setSelectedFrequency(group);
      socket.emit("join-group", group);
      fetchAudioMessages(group);
      console.log("Selected Group:", group);
    };
  
    const fetchAudioMessages = async (group) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/audio-messages?group=${group}`
        );
        setAudioMessages(response.data);
        console.log("audiomessage===>", audioMessages);
      } catch (error) {
        console.error("Error fetching audio messages:", error);
      }
    };


     // Function to handle increasing the frequency
  const increaseFrequency = () => {
    const currentIndex = frequencyOptions.indexOf(selectedFrequency);
    if (currentIndex > 0) {
      setSelectedFrequency(frequencyOptions[currentIndex - 1]);
    }
  };

  // Function to handle decreasing the frequency
  const decreaseFrequency = () => {
    const currentIndex = frequencyOptions.indexOf(selectedFrequency);
    if (currentIndex < frequencyOptions.length - 1) {
      setSelectedFrequency(frequencyOptions[currentIndex + 1]);
    }
  };


  const increaseVolume = () => {
    if (volume < 100) { // Limit volume to a maximum value (e.g., 100)
      setVolume(volume + 10); // Increase the volume by 10 (you can adjust this value)
    }
  };

  // Function to handle decreasing the volume
  const decreaseVolume = () => {
    if (volume > 0) { // Limit volume to a minimum value (e.g., 0)
      setVolume(volume - 10); // Decrease the volume by 10 (you can adjust this value)
    }
  };

  useEffect(() => {
    if (alertShown) {
      // Reset the alertShown state after showing the alert
      setAlertShown(false);
    }
  }, [alertShown]);
  
  
  


  return (
    <div>
      <section className="walkie_talkie_section">
        <div className="container-fluid">
          <div className="main_mobile_part">
            <div className="mobile_bg_box">
              <img src="images/mobile_bg.png" alt="Mobile Background" />
              <button className="walkie_top_btn" onClick={toggleButton}>
               
                <img src="images/walkie_top_img.png" alt="Walkie Top Image" className="walkie_top_img" />
              </button>
              <button className="press_line" style={{ backgroundColor: buttonColor }} ></button>
              <div className="mobile_display">
                <div className="select_box" >
              
                  <select
                  className="form-control transparent-background"
                    value={selectedFrequency}
                    onChange={(e) => handleGroupChange(e.target.value)}
                    
                  >
                    {/* Map through frequencyOptions and generate dropdown options */}
                    {frequencyOptions.map((frequency) => (
                      <option key={frequency} value={frequency}>
                        {frequency}
                      </option>
                    ))}
                  </select>
                  <div className="pulse_box">
                  <ReactMic
          record={isRecording}
          onData={onData}
          onStop={onStop}
          className="sound-wave"
          mimeType="audio/webm"
         
        />
                  </div>
                </div>
              </div>
              <div className="mobile_body">
                <span className="chat_btn">
                  <button>Chat</button>
                </span>
                <span className="upload_btn">
                  <button>Upload</button>
                </span>
                <div className="ch_box">
                <button onClick={increaseFrequency}><FontAwesomeIcon icon={faCaretUp}/></button>
                  <span>CH</span>
                  <button onClick={decreaseFrequency}><FontAwesomeIcon icon={faCaretDown}/></button>
                </div>
                <div className="vol_box">
                  <button className="blue animated" onClick={increaseVolume}>   <FontAwesomeIcon icon={faPlus} /></button>
                  <span>Vol</span>
                  <button onClick={decreaseVolume}><FontAwesomeIcon icon={faMinus} /></button>
                </div>
              </div>
              <div className="voice_btn">
              <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={buttonColor === 'red'} 
         
          
        >
                <img src="recording.svg" alt="recording" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WalkieTalkie;
