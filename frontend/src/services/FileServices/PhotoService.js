import axios from 'axios';

const uploadPhoto = async (image, url) => {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export { uploadPhoto };
