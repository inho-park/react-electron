import {useRef, useEffect, useState} from "react";
import io from "socket.io-client";
import '../css/Video.css';

const socket = io(
  // server 안에 있는 webRTCNamespace
  '/webRTCPeers', {
    // server 에 있는 io 변수의 path 와 일치
    path: "/webrtc"
  }
);

export default function Rtc() {
  
  // 개인의 웹캠 화면
  const localVideoRef = useRef();
  // 상대방의 웹캠 화면
  const remoteVideoRef = useRef();

  // peer connection DOM
  const pc = useRef(new RTCPeerConnection(null));

  // sdp 통신을 담기 위한 textarea DOM
  const textRef = useRef();

  // ice candidate DOM
  // const candidates = useRef([]);
  const [offerVisible, setOfferVisible] = useState(true);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [status, setStatus] = useState("Make a call new");


  useEffect(() => {

    socket.on("connection-success", success => {
      console.log(success);
    });

    socket.on('sdp', data => {
      console.log(data);
      pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      textRef.current.value = JSON.stringify(data.sdp);

      if (data.sdp.type === 'offer' ) {
        setOfferVisible(false);
        setAnswerVisible(true);
        setStatus('Incoming call...............');
      } else {
        setStatus('Call established');
      }
    });

    socket.on('candidate', candidate => {
      console.log(candidate);
      // candidates.current = [...candidates.current, candidate];
      pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    const constraints = {
      audio: true,
      video: true
    };


    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        console.log(localVideoRef.current.srcObject);
        console.log(localVideoRef.current);
        // console.log(localVideoRef.current);


        // webcam 을 통해 stream 이 변화할 때마다 peer connection 에 추가
        stream.getTracks().forEach(track => {
          _pc.addTrack(track, stream);
        });
      }).catch(e => {
      console.log("getUserMedia Error : ", e);
    });

    // peer connection 변수 생성
    const _pc = new RTCPeerConnection(null);

    _pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log(JSON.stringify(e.candidate))
        sendToPeer('candidate', e.candidate);
      }
    };

    _pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    _pc.ontrack = (e) => {
      // we got remote stream...
      // 원격 스트림을 수신하지만 사용자 미디어를 가져올 때 로컬 트랙이나 스트림을 peer connection 에 추가하지 않음
      remoteVideoRef.current.srcObject = e.streams[0]
    }

    pc.current = _pc;
  }, []);

  const sendToPeer = (eventType, payload) => {
    socket.emit(eventType, payload);
  };

  const processSDP = (sdp) => {
    console.log(JSON.stringify(sdp));
    pc.current.setLocalDescription(sdp);

    sendToPeer('sdp', { sdp });
  }

  // offer 로 먼저 sdp 프로토콜 제안 보내기
  // offer 보낼 시 ICE ( interact connectivity establishment ) candidate 를
  // peer connection 에 추가할 때 사용가능
  const createOffer = () => {
    pc.current.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      processSDP(sdp);
      setOfferVisible(false);
      setStatus('Calling............');
    }).catch( e => console.log("createOffer error : " + e))
  }

  // answer 로 sdp 프로토콜 제안 응답하기
  const createAnswer = () => {
    pc.current.createAnswer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      processSDP(sdp);
      setAnswerVisible(false);
      setStatus('Call establish');
    }).catch( e => console.log("createOffer error : " + e))
  }


  // const setRemoteDescription = () => {
  //   // get the SDP value from the text editor
  //   const sdp = JSON.parse(textRef.current.value);
  //   console.log(sdp);
  //
  //   pc.current.setRemoteDescription(new RTCSessionDescription(sdp));
  // }

  // const addCandidate = () => {
  //   // const candidate = JSON.parse(textRef.current.value);
  //   // console.log("Adding Candidate : ", candidate);
  //
  //   candidates.current.forEach(candidate => {
  //     console.log(candidate);
  //     pc.current.addIceCandidate(new RTCIceCandidate(candidate));
  //   });
  // }

  // blob 에 담을 데이터 저장하는 스트림 배열
  const arrMediaData = [];
  // 녹음 객체 변수
  let mediaRecorder = null;
  // 상담자와 내담자간의 차이를 둬야하는 함수
  const startRecording = () => {
    setIsRecorded(true);

    const localVideoStream = localVideoRef.current.srcObject.getVideoTracks()[0];
    console.log(localAudioStream);
    const localAudioStream = localVideoRef.current.srcObject.getAudioTracks()[0];
    console.log(localVideoStream);
    const remoteAudioStream = remoteVideoRef.current.srcObject.getAudioTracks()[0];
    console.log(remoteAudioStream);
    const mediaStream = new MediaStream();
    mediaStream.addTrack(localVideoStream);
    mediaStream.addTrack(localAudioStream);
    mediaStream.addTrack(remoteAudioStream);
    mediaRecorder = new MediaRecorder(mediaStream);

    // MediaRecorder.dataavailable 이벤트 처리
    mediaRecorder.ondataavailable = (event)=>{
      // 스트림 데이터(Blob)가 들어올 때마다 배열에 담아둔다
      arrMediaData.push(event.data);
    };

    mediaRecorder.onstop = (event) => {
      // 들어온 스트림 데이터들(Blob)을 통합한 Blob객체를 생성
      const blob = new Blob(arrMediaData);

      // BlobURL 생성: 통합한 스트림 데이터를 가르키는 임시 주소를 생성
      const blobURL = window.URL.createObjectURL(blob);

      // 다운로드 구현
      const $anchor = document.createElement("a"); // 앵커 태그 생성
      document.body.appendChild($anchor);
      $anchor.style.display = "none";
      $anchor.href = blobURL; // 다운로드 경로 설정
      $anchor.download = "test.webm"; // 파일명 설정
      $anchor.click(); // 앵커 클릭
      
      // 배열 초기화
      arrMediaData.splice(0);
    }
    mediaRecorder.start();
  }

  // 녹화 중단
  const stopRecording = () => {
    setIsRecorded(false);
    mediaRecorder.stop();
  }

  const recordingButton = () => {
    if (isRecorded == true) {
      return (
        <div>
          <button onClick={startRecording}>Stop</button>
        </div>
      )
    } else {
      return (
        <div>
          <button onClick={stopRecording}>Recording</button>
        </div>
      )
    }
  }

  const showHideButtons = () => {
    if (offerVisible) {
      return (
        <div>
          <button onClick={createOffer}>Call</button>
        </div>
      )
    } else if (answerVisible) { return (
      <div>
          <button onClick={createAnswer}>Answer</button>
        </div>
      )
    }
  }
  
  // ============================================================================================================
  
  // const [timer, setTimer] = useState(undefined);
  
  // const canvasRef = useRef(null);


  // useEffect(() => {
  //   localVideoRef = props.localVideoRef;
  //   remoteVideoRef = props.remoteVideoRef;
  // }, [localVideoRef, remoteVideoRef]);

  // const drawToCanvas = () => {
  //   try {
  //     const ctx = canvasRef.current.getContext('2d');

  //     // localVideoRef = props.localVideoRef;
  //     console.log("localVideoRef : " + localVideoRef.current);
  //     // remoteVideoRef = props.remoteVideoRef;
  //     console.log("remoteVideoRef : " + remoteVideoRef.current);
      
  //     canvasRef.current.width = localVideoRef.current.videoWidth * 2 + 10;
  //     canvasRef.current.height = localVideoRef.current.videoHeight;
      
  //     if (ctx && ctx !== null) {
  //       console.log("first if");
  //       if (localVideoRef.current) {
  //         console.log(localVideoRef.current.srcObject);
  //         // ctx.translate(canvasRef.current.width, 0);
  //         // ctx.scale(-1, 1);
  //         ctx.drawImage(localVideoRef.current, 0, 0, localVideoRef.current.width, localVideoRef.current.height);
  //         // ctx.setTransform(1, 0, 0, 1, 0, 0);
  //       } if (remoteVideoRef.current) {
  //         console.log(remoteVideoRef.current.srcObject);
  //         // ctx.translate(canvasRef.current.width, 0);
  //         // ctx.scale(-1, 1);
  //         ctx.drawImage(remoteVideoRef.current, 5 + localVideoRef.current.width, localVideoRef.current.height, remoteVideoRef.current.width, remoteVideoRef.current.height);
  //         // ctx.setTransform(1, 0, 0, 1, 0, 0);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // const startOrStop = () => {
  //   if (!timer) {
  //     const t = setInterval(() => drawToCanvas(), 33);
  //     setTimer(t);
  //   } else {
  //     clearInterval(timer);
  //     setTimer(undefined);
  //   }
  // }


  return (
    <div style={{ margin: 10 }}>
      <video id="local" ref={localVideoRef} autoPlay style={{
          width: 640,
          height: 480,
          margin: 5,
          backgroundColor: "black"
      }}></video>
      <video id="remote" ref={remoteVideoRef} autoPlay style={{
        width: 640,
        height: 480,
        margin: 5,
        backgroundColor: "gray"
      }}></video>
      
      {recordingButton() }
      <br/>
      {/*<button onClick={createOffer}>*/}
      {/*  Create Offer*/}
      {/*</button>*/}
      {/*<button onClick={createAnswer}>*/}
      {/*  Create Answer*/}
      {/*</button>*/}

      { showHideButtons() }
      <div>{status}</div>
      <textarea ref={textRef}>

      </textarea>

{/* ==================================================================================================// */}
        {/* <div>
        <table>
          <thead>
            <tr>
              <td>Canvas</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><canvas id="canvas" ref={canvasRef} style={{backgroundColor: "skyblue"}}/></td>
            </tr>
          </tbody>
        </table>
        <hr />
        <button color="warning" onClick={() => drawToCanvas()}>Draw to Canvas </button>
        <hr />
        <button color="warning" onClick={() => startOrStop()}>{timer ? 'Stop' : 'Repeat (0.033s)'} </button>
      </div > */}
    </div>
  );
}