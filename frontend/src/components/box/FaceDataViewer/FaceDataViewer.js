import React from 'react';
import './FaceDataViewer.css'; // Убедитесь, что этот файл CSS существует и подключен

function FaceDataViewer({ data }) {
  // Предполагая, что data - это массив, и мы хотим отобразить информацию только о первом лице
  const faceData = data[0];

  return (
    <div className="faceDataContainer">
      <h2>Face Analysis Results</h2>
      <div className="dataField"><strong>Age:</strong> {faceData.age}</div>
      <div className="dataField"><strong>Gender:</strong> {faceData.dominant_gender}</div>
      <div className="dataField"><strong>Race:</strong> {faceData.dominant_race}</div>
      <div className="dataField"><strong>Dominant Emotion:</strong> {faceData.dominant_emotion}</div>
      <div className="dataField">
        <strong>Emotions:</strong> Angry: {faceData.emotion.angry.toFixed(2)}%, Disgust: {faceData.emotion.disgust.toFixed(2)}%, Fear: {faceData.emotion.fear.toFixed(2)}%, Happy: {faceData.emotion.happy.toFixed(2)}%, Sad: {faceData.emotion.sad.toFixed(2)}%, Surprise: {faceData.emotion.surprise.toFixed(2)}%, Neutral: {faceData.emotion.neutral.toFixed(2)}%
      </div>
      <div className="dataField"><strong>Face Confidence:</strong> {faceData.face_confidence}</div>
      <div className="dataField">
        <strong>Position:</strong> X: {faceData.region.x}, Y: {faceData.region.y}
      </div>
      <div className="dataField">
        <strong>Size:</strong> Width: {faceData.region.w}, Height: {faceData.region.h}
      </div>
      <div className="dataField">
        <strong>Left Eye:</strong> X: {faceData.region.left_eye[0]}, Y: {faceData.region.left_eye[1]}
      </div>
      <div className="dataField">
        <strong>Right Eye:</strong> X: {faceData.region.right_eye[0]}, Y: {faceData.region.right_eye[1]}
      </div>
    </div>
  );
}

export default FaceDataViewer;
