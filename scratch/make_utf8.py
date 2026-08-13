carousel_code = '''\'use client\';

import React, { useState } from \'react\';
import { withBasePath } from \'../utils/basePath\';
import { ProductSVG } from \'./DynamicSVGs\';

export default function ProductImageCarousel({ images = [], name = \'\', cat = \'\', price = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = Array.isArray(images) && images.length > 0 ? images.filter(Boolean) : [];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const currentImage = imageList[currentIndex];

  return (
    <div className=" product-carousel-wrapper\>
