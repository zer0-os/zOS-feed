export const isLeafNode = (route, items) => {
  return route.includes('.') && items && items.length === 0
}

export const shorty = (address) => {
  if (!address) return null;
  
  return [address.slice(0, 2), '...', address.slice(-4)].join('');
}
