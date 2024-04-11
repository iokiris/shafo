import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Exception from '../../components/exceptions/Exception';

function ShortUrlRedirect() {
  const { shortUrl } = useParams();
  const [redirectError, setRedirectError] = useState(false);

  useEffect(() => {
    async function fetchFullUrl() {
      try {
        const response = await axios.get(`/api/redirect/${shortUrl}`);
        if (response.status === 200) {
            console.log(response);
          const fullUrl  = response.data.redirect_to;
          console.log(fullUrl);
          if (fullUrl) {
            window.location.href = fullUrl;
          } else {
            setRedirectError(true);
          }
        }
      } catch (error) {
        setRedirectError(true);
      }
    }

    fetchFullUrl();
  }, [shortUrl]);

  if (redirectError) {
    return <Exception type="notFound" />;
  }

  return <div>Redirecting...</div>;
}

export default ShortUrlRedirect;
