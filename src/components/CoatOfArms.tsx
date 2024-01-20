import { useState, useEffect, useMemo } from "react";
import { Avatar } from "@mui/material";

import { constants } from "misc";

export const CoatOfArms = ({
  province_name,
  province_number,
}: {
  province_number: number;
  province_name: string;
}) => {
  const svgImageUrl = `${constants.BASE_URL}/coat_of_arms/${province_number}.svg`;
  const img = useMemo(() => {
    const image = new Image();
    image.src = svgImageUrl;
    return image;
  }, [svgImageUrl]);
  img.src = svgImageUrl;
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);

  useEffect(() => {
    img.addEventListener("load", handleImageLoad);

    return () => {
      img.removeEventListener("load", handleImageLoad);
    };
  }, [img]);

  let width = img.width;
  let height = img.height;
  const aspectRatio = width / height;
  const targetSize = 300;

  if (width > height) {
    width = targetSize;
    height = width / aspectRatio;
  } else {
    height = targetSize;
    width = height * aspectRatio;
  }

  return (
    <>
      {imageLoaded && (
        <Avatar
          alt={province_name}
          src={svgImageUrl}
          variant="square"
          sx={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        />
      )}
    </>
  );
};
