import React, { useState } from 'react';
import PhotoBox from '../../box/PhotoBox/PhotoBox';
import { uploadPhoto } from '../../../services/FileServices/PhotoService';
import CentralizedBox from '../../box/CentralizedBox/CentralizedBox';
import FaceDataViewer from '../../box/FaceDataViewer/FaceDataViewer';
import './PhotoUploader.css';
function PhotoUploader() {
  const [faceData, setFaceData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = async (image) => {
    setImagePreview(URL.createObjectURL(image));
    setError(null);
    try {
      const data = await uploadPhoto(image, '/ai/analyze-face/');
      console.log("Success")
      setFaceData(data);
    } catch (e) {
      setError('Ошибка при анализе изображения. Возможно, лицо не найдено.');
      setFaceData(null);
    }
  };

  return (
    <CentralizedBox>
      <PhotoBox onFileSelect={handleFileSelect} />
      {imagePreview && <img src={imagePreview} alt="Preview" />}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {faceData ? <FaceDataViewer data={faceData} /> : (imagePreview && !error ? "Загрузка данных..." : null)}
    </CentralizedBox>
  );
}

export default PhotoUploader;
