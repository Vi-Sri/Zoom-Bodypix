// @author : Vishal Srinivas


import * as bodyPix from '@tensorflow-models/body-pix';

const state = {
    video: null,
    stream: null,
    net: null,
    videoConstraints: {},
    changingArchitecture: false,
    changingMultiplier: false,
    changingStride: false,
    changingResolution: false,
    changingQuantBytes: false,
  };

const NNProperties = {
  input: {
    architecture: 'MobileNetV1',
    outputStride: 16,
    internalResolution: 'medium',
    multiplier: 0.50,
    quantBytes: 4,
  },
  segmentation: {
    segmentationThreshold: 0.7,
    effect: 'mask',
    maskBackground: true,
    opacity: 0.7,
    backgroundBlurAmount: 3,
    maskBlurAmount: 0,
    edgeBlurAmount: 3
  },
};

  async function getDeviceIdForLabel(cameraLabel) {
    const videoInputs = await getVideoInputs();
    for (let i = 0; i < videoInputs.length; i++) {
      const videoInput = videoInputs[i];
      if (videoInput.label === cameraLabel) {
        return videoInput.deviceId;
      }
    }
    return null;
  }
  
async function getConstraints(cameraLabel) {
    let deviceId;
    let facingMode;

    if (cameraLabel) {
      deviceId = await getDeviceIdForLabel(cameraLabel);
      facingMode = 'user';
    };
    return {deviceId, facingMode};
  }


function stopExistingVideoCapture() {
    if (state.video && state.video.srcObject) {
      state.video.srcObject.getTracks().forEach(track => {
        track.stop();
      })
      state.video.srcObject = null;
    }
  }

async function setupCamera(cameraLabel) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
          'Device API not available');
    }
    const videoElement = document.getElementById('video');
    stopExistingVideoCapture();
    const videoConstraints = await getConstraints(cameraLabel);
    const stream = await navigator.mediaDevices.getUserMedia(
        {'audio': false, 'video': videoConstraints});
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.width = videoElement.videoWidth;
        videoElement.height = videoElement.videoHeight;
        resolve(videoElement);
      };
    });
  }

async function loadVideo(cameraLabel) {
    try {
      state.video = await setupCamera(cameraLabel);
    } catch (e) {
      console.log(e);
    }
    state.video.play();
  }

function toggleLoadingUI(
    showLoadingUI, loadingDivId = 'loading', mainDivId = 'main') {
  if (showLoadingUI) {
    document.getElementById(loadingDivId).style.display = 'block';
    document.getElementById(mainDivId).style.display = 'none';
  } else {
    document.getElementById(loadingDivId).style.display = 'none';
    document.getElementById(mainDivId).style.display = 'block';
  }
}

async function loadBodyPix() {
    toggleLoadingUI(true);
    state.net = await bodyPix.load({
      architecture: NNProperties.input.architecture,
      outputStride: NNProperties.input.outputStride,
      multiplier: NNProperties.input.multiplier,
      quantBytes: NNProperties.input.quantBytes
    });
    console.log(state.net)
    toggleLoadingUI(false);
    console.log("model loaded")
}

async function estimateSegmentation() {
  return await state.net.segmentPerson(state.video, {
    internalResolution: NNProperties.input.internalResolution,
    segmentationThreshold: NNProperties.segmentation.segmentationThreshold,
    maxDetections: 2,
    scoreThreshold: 0.3,
    nmsRadius: 10,
  });
}

async function segmentBodyInRealTime() {
  let canvas = document.getElementById('output');
  let PersonSegmentation = await estimateSegmentation();
  if (PersonSegmentation != undefined) {
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.save()
    const foregroundColor = {r: 1, g: 1, b: 1, a: 1};
    const backgroundColor = {r: 0, g: 0, b: 0, a: 0};
    const mask = bodyPix.toMask(PersonSegmentation, foregroundColor, backgroundColor,true);
    console.log(mask)
    ctx.drawImage(state.video, 0, 0, 640, 480);
    let frame = ctx.getImageData(0, 0, 640, 480);
    let l = frame.data.length / 4;
    for (let i = 0; i < l; i++) {
        frame.data[i * 4 + 0] = frame.data[i * 4 + 0] * mask.data[i * 4 + 0];
        frame.data[i * 4 + 1] = frame.data[i * 4 + 1] * mask.data[i * 4 + 1];
        frame.data[i * 4 + 2] = frame.data[i * 4 + 2] * mask.data[i * 4 + 2];
        frame.data[i * 4 + 3] = frame.data[i * 4 + 3] * mask.data[i * 4 + 3];
    }
    ctx.putImageData(frame, 0, 0);
    // bodyPix.drawMask(canvas, state.video, mask, NNProperties.segmentation.opacity,NNProperties.segmentation.maskBlurAmount, false);
  }
}

loadBodyPix().then(function(){
  loadVideo().then(function(){
    setInterval(function(){ 
      segmentBodyInRealTime();
    }, 0);
  });
});

