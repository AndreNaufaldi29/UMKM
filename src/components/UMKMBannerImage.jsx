'use client';

import React, { useState } from 'react';
import { withBasePath } from '../utils/basePath';
import { PhotoSVG } from './DynamicSVGs';

export default function UMKMBannerImage({ imageUrl, name, cat, id }) {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError) {
    return (
      <img
        src={withBasePath(imageUrl)}
        alt={name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => setImgError(true)}
      />
    );
  }

  return <PhotoSVG cat={cat} seed={id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
}
