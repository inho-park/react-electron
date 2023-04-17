import {useRef, useEffect, useState} from 'react';

const Styles = {
  Video: { width: '30vw', background: 'rgba(245, 240, 215, 0.5)', border: '1px solid green' },
  Canvas: { width: '62vw', background: 'rgba(245, 240, 215, 0.5)', border: '1px solid green' },
  None: { display: 'none' },
}

function WebcamCanvas(props) {
  const [timer, setTimer] = useState(undefined);

  const localVideoRef = props.localVideoRef;
  const remoteVideoRef = props.remoteVideoRef;
  const canvasRef = useRef(null);

  useEffect(() => {
    getWebcam((stream => {
      videoRef.current.srcObject = stream;
    }));
  }, []);

  const drawToCanvas = () => {
    try {
      const ctx = canvasRef.current.getContext('2d');

      canvasRef.current.width = localVideoRef.current.videoWidth + remoteVideoRef.current.videoWidth;
      canvasRef.current.height = localVideoRef.current.videoHeight + remoteVideoRef.current.videoHeight;

      if (ctx && ctx !== null) {
        if (localVideoRef.current || remoteVideoRef.current) {
          ctx.translate(canvasRef.current.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(localVideoRef.current, 0, 0, localVideoRef.current.width, localVideoRef.current.height);
          ctx.drawImage(remoteVideoRef.current, localVideoRef.current.width, localVideoRef.current.height, remoteVideoRef.current.width, remoteVideoRef.current.height);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const startOrStop = () => {
    if (!timer) {
      const t = setInterval(() => drawToCanvas(), 33);
      setTimer(t);
    } else {
      clearInterval(timer);
      setTimer(undefined);
    }
  }

  return (<>
    <div style={{ width: '100vw', height: '100vh', padding: '3em' }}>
      <table>
        <thead>
          <tr>
            <td>Video</td>
            <td>Canvas</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* <td><video ref={localVideoRef} autoPlay style={Styles.Video} /></td> */}
            <td><canvas ref={canvasRef} style={Styles.Canvas} /></td>
          </tr>
        </tbody>
      </table>
      <hr />
      <button color="warning" onClick={() => drawToCanvas()}>Draw to Canvas </button>
      <hr />
      <button color="warning" onClick={() => startOrStop()}>{timer ? 'Stop' : 'Repeat (0.033s)'} </button>
    </div >
    <hr />
  </>);
}

export default WebcamCanvas;