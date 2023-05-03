// import Rtc from './components/Rtc.js';
<<<<<<< HEAD
import { useState } from "react";
import VideoRecorder from "./components/recording/VideoRecorder.jsx";
import AudioRecorder from "./components/recording/AudioRecorder.jsx";

const App = () => {
  let [recordOption, setRecordOption] = useState("video");

  const toggleRecordOption = (type) => {
    return () => {
      setRecordOption(type);
    };
  }

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
        {recordOption === "video" ? <VideoRecorder/> : <AudioRecorder/>}
      </div>
    </div>
  );
}
export default App;
=======
import Practice from "./components/Practice.jsx";
import Video from "./components/Video.js";
import WebcamCanvas from "./components/WebcamCanvas.js";

export default function App() {

  return (
    <>
      {/* <WebcamCanvas /> */}
      <Practice />
      {/* <Video /> */}
    </>
  );
}
>>>>>>> c56abc7461ad8a64ac03dacaa992e3e72dfdd9f2
