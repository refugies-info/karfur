"use client";

import NextImage, { type ImageLoader } from "next/image";
import { forwardRef } from "react";

// Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
export const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
  const parts = src.split("/upload/");
  return `${parts[0]}/upload/${params.join(",")}/${parts[1]}`;
};

const isCloudinaryUrl = (src: string): boolean => {
  if (!src || typeof src !== "string" || !src.startsWith("http")) {
    return false;
  }

  try {
    const url = new URL(src);
    return url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
};

export const Image: typeof NextImage = forwardRef(({ src, loader, ...props }, ref) => {
  const realLoader =
    typeof loader !== "undefined"
      ? loader
      : isCloudinaryUrl(src as string)
        ? cloudinaryLoader
        : undefined; // Use default loader
  return <NextImage src={src} loader={realLoader} {...props} ref={ref} />;
});

Image.displayName = "Image";
