import React, { useState } from 'react';

function PhotoBox({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
    </>
  );
}

export default PhotoBox;
