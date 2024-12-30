import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from './ui/slider';

function ImageCropper({ image, onSave, onClose }) {
  const [cropData, setCropData] = useState({ crop: { x: 0, y: 0 }, zoom: 1, aspect: 3/4 });
  const cropperRef = useRef(null);

  const handleCropComplete = (_, croppedAreaPixels) => {
    cropperRef.current = croppedAreaPixels;
  };

  const getCroppedImage = async () => {
    if (!image || !cropperRef.current) return null;

    const imgElement = new Image();
    imgElement.src = image;

    return new Promise((resolve) => {
      imgElement.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const { x, y, width, height } = cropperRef.current;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(
          imgElement,
          x,
          y,
          width,
          height,
          0,
          0,
          width,
          height
        );

        resolve(canvas.toDataURL('image/jpeg')); // Return cropped image as base64
      };
    });
  };

  const handleSave = async () => {
    const croppedImage = await getCroppedImage();
    onSave(croppedImage); // Pass the cropped image back to the parent
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Crop Image</DialogTitle>
      </DialogHeader>
      <div className="relative w-full h-72 !padding-0">
        <Cropper
          image={image}
          crop={cropData.crop}
          zoom={cropData.zoom}
          aspect={cropData.aspect}
          objectFit="contain"
          onCropChange={(crop) => setCropData((prev) => ({ ...prev, crop }))}
          onZoomChange={(zoom) => setCropData((prev) => ({ ...prev, zoom }))}
          onCropComplete={handleCropComplete}
          className="!padding-0"
        />
      </div>
      <div className="mt-2 flex flex-col items-center">
        {/* Zoom Slider */}
        <div className="w-full">
          <label className="text-sm font-medium text-gray-700">Zoom</label>
          {/* <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={cropData.zoom}
            onChange={(e) => setCropData((prev) => ({ ...prev, zoom: parseFloat(e.target.value) }))}
            className="w-full mt-2"
          /> */}
          <Slider onValueChange={(zoom) => setCropData((prev) => ({ ...prev, zoom }))} min={1} max={3} step={0.1} value={[cropData.zoom]} />

        </div>
        <div className="mt-4 flex justify-end w-full">
          <Button onClick={handleSave} className="mr-2">
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default ImageCropper;
