import React from 'react';

const getWebcam = (callback) => {
  try {
    const constraints = {
      'video': true,
      'audio': false
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(callback);
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

const Styles = {
  Video: { width: '30vw', background: 'rgba(245, 240, 215, 0.5)', border: '1px solid green' },
  Canvas: { width: '30vw', background: 'rgba(245, 240, 215, 0.5)', border: '1px solid green' },
  None: { display: 'none' },
}

function WebcamCanvas() {
  const [timer, setTimer] = React.useState(undefined);

  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    getWebcam((stream => {
      videoRef.current.srcObject = stream;
    }));
  }, []);

  const drawToCanvas = () => {
    try {
      const ctx = canvasRef.current.getContext('2d');

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      if (ctx && ctx !== null) {
        if (videoRef.current) {
          console.log("videoRef.current : " );
          console.log(videoRef.current);
          console.log("videoRef.current.srcObject : ");
          console.log(videoRef.current.srcObject);
          
          ctx.translate(canvasRef.current.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const startOrStop = () => {
    if (!timer) {
      const t = setInterval(() => drawToCanvas(), 200);
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
            <td><video ref={videoRef} autoPlay style={Styles.Video} /></td>
            <td><canvas ref={canvasRef} style={Styles.Canvas} /></td>
          </tr>
        </tbody>
      </table>
      <hr />
      <button color="warning" onClick={() => drawToCanvas()}>Draw to Canvas </button>
      <hr />
      <button color="warning" onClick={() => startOrStop()}>{timer ? 'Stop' : 'Repeat (0.2s)'} </button>
    </div >
  </>);
}

export default WebcamCanvas;
