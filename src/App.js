// import Rtc from './components/Rtc.js';
import { useState, useEffect } from "react";
import VideoRecorder from "./components/recording/VideoRecorder.jsx";
import AudioRecorder from "./components/recording/AudioRecorder.jsx";
import emotion from "./emotion.json"

const file_path = {
  webm : "./python_src/video/test4.webm",
  mp4 : "./python_src/video/test4.mp4"
}

const JsonData = () => {
  console.log(emotion.Angry);
  console.log(emotion.Disgusted);
  console.log(emotion.Happy);
  console.log(emotion.Fearful);
  console.log(emotion.Neutral);
  console.log(emotion.Sad);
  console.log(emotion.Surprised);
};

function App() {
  const onSendData = (data) => {
    window.electronAPI.sendConvertScript(data);
  };
  
  useEffect(() => {
    window.electronAPI.onConvertScript((args) => {
      console.log("받은 데이터:", args);
    });
  }, []);

  let [recordOption, setRecordOption] = useState("video");

  const toggleRecordOption = (type) => {
    return () => {
      setRecordOption(type);
    };
  };



  return (
    <div>
      <h1>React Media Recorder</h1>
      <div className="button-flex">
        <button onClick={toggleRecordOption("video")}>
          Record Video
        </button>
        <button onClick={toggleRecordOption("audio")}>
          Record audio
        </button>
      </div>
      <div>
        {recordOption === "video" ? <VideoRecorder /> : <AudioRecorder />}
      </div>

      <div>
        <button onClick={JsonData} type="button">emotion</button>
      </div>
      <div>
        <button onClick={onSendData(file_path)} type="button">execution file</button>
      </div>
    </div>
  );
}
export default App;