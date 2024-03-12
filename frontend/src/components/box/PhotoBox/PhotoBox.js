import React, { useState, useEffect } from 'react';
import './PhotoBox.css';

function PhotoBox({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    // Функция для обработки события вставки
    const handlePaste = (event) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      for (let item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file && file.type.startsWith('image/')) {
            onFileSelect(file);
          }
        }
      }
    };

    // Добавляем обработчик события вставки
    document.addEventListener('paste', handlePaste);

    // Удаляем обработчик события, когда компонент будет размонтирован
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [onFileSelect]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };
  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          setSelectedFile(file);
          onFileSelect(file);
        }
      }
    }
  }
  const truncateFileName = (fileName, maxLength) => {
    if (fileName.length <= maxLength) return fileName;
    return `${fileName.substring(0, maxLength - 3)}...`;
  };  

  return (
    <>
    <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
        <p>Вставьте изображение сюда (Ctrl+V) или кликните для загрузки.</p>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      {/* <label className="file-upload-wrapper">
        Загрузить фото
        <input type="file" onChange={handleFileChange} />
      </label> */}
    </>
  );
}

export default PhotoBox;
