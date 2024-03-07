import React, { useState } from 'react';
import './PhotoBox.css';

function PhotoBox({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };
  const truncateFileName = (fileName, maxLength) => {
    if (fileName.length <= maxLength) return fileName;
    return `${fileName.substring(0, maxLength - 3)}...`;
  };  

  return (
    <>
      <label className="file-upload-wrapper">
        Загрузить фото
        <input type="file" onChange={handleFileChange} />
      </label>
    </>
  );
}

export default PhotoBox;
