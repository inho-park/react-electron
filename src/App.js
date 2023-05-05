// import Rtc from './components/Rtc.js';
import { useState } from "react";
import VideoRecorder from "./components/recording/VideoRecorder.jsx";
import AudioRecorder from "./components/recording/AudioRecorder.jsx";

// 이거 아마 browser 에서 child_process 를 사용하지 못하게 막는 듯
// import { exec } from "child_process";

// const onExecution = () => {
//   var process = exec("python", ["../webmToMp4/WebmToMp4.py", "../video/test4.webm", "../video/test4.mp4"]);

//   process.stdout.on("data", function(data) {
//     console.log("success");
//   });
  
//   process.stderr.on("data", function(data) {
//     console.log("false");
//   });
// }

function App() {
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
        {/* <button onClick={onExecution} type="button">python exe</button> */}
      </div>
    </div>
  );
}
export default App;