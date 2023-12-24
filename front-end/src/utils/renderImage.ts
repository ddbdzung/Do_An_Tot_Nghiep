export enum ImageFormat {
  jpg = "jpg",
  png = "png",
  jpeg = "jpeg",
}
export const renderImageCloudinary = (imageUrl, format = ImageFormat.jpg) => {
  if (!imageUrl) return "/";

  return `http://res.cloudinary.com/dbbifu1w6/image/upload/v1701505337/${imageUrl}.${format}`;
};
