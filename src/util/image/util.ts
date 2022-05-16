import cloudinary from './cloudinary';

export function getSource(sourceUrl: string): string {
  const cloudinaryImage = cloudinary.image(sourceUrl).setDeliveryType('fetch');

  return cloudinaryImage.toURL();
}
