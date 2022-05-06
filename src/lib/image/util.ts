import cld  from './cdn';

export function getSource( sourceUrl ) {
  
  let cldImage = cld.image(sourceUrl);
  cldImage = cldImage.setDeliveryType("fetch");

  return cldImage.toURL();
}
