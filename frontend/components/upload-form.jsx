import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('caption', caption);

    try {
      await axios.post('http://localhost:8000/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Upload successful');
    } catch (error) {
      alert('Upload failed');
    }

    setSelectedFiles([]);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <h2>Upload Files</h2>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <textarea
        placeholder="Enter caption"
        value={caption}
        onChange={handleCaptionChange}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadForm;
