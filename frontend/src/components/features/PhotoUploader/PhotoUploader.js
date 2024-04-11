import React, { useState } from 'react';
import PhotoBox from '../../box/PhotoBox/PhotoBox';
import { uploadPhoto } from '../../../services/FileServices/PhotoService';
import CentralizedBox from '../../box/CentralizedBox/CentralizedBox';
import FaceDataViewer from '../../box/FaceDataViewer/FaceDataViewer';
import withAuthCheck from '../../highers/withAuthCheck'
import './PhotoUploader.css';

function PhotoUploaderComponent() {
  const [faceData, setFaceData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (image) => {
    setFaceData(null);
    setImagePreview(URL.createObjectURL(image));
    setError(null);
    setIsLoading(true);
    try {
      const data = await uploadPhoto(image, '/ai/analyze-face/');
      setFaceData(data);
    } catch (e) {
      let error_code = e.response.status;
      if (error_code === 429) setError("Вы отправляете запросы слишком часто, подождите немного")
      else setError('Ошибка при анализе изображения. Возможно, лицо не найдено.');
      setFaceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CentralizedBox>
      {imagePreview && <img src={imagePreview} alt="Preview"/>}
      {isLoading && <div>Загрузка...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {faceData && <FaceDataViewer data={faceData} />}
      <PhotoBox onFileSelect={handleFileSelect} />
    </CentralizedBox>
  );
}

const PhotoUploader = withAuthCheck(PhotoUploaderComponent)
export default PhotoUploader;
