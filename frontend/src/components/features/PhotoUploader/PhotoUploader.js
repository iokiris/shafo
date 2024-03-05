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
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (image) => {
    setImagePreview(URL.createObjectURL(image));
    setError(null);
    setIsLoading(true);
    try {
      const data = await uploadPhoto(image, '/ai/analyze-face/');
      setFaceData(data);
    } catch (e) {
      setError('Ошибка при анализе изображения. Возможно, лицо не найдено.');
      setFaceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CentralizedBox>
      <PhotoBox onFileSelect={handleFileSelect} />
      {imagePreview && <img src={imagePreview} alt="Preview"/>}
      {isLoading && <div>Загрузка...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {faceData && <FaceDataViewer data={faceData} />}
    </CentralizedBox>
  );
}

export default PhotoUploader;
