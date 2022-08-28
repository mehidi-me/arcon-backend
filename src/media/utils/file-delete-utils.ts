export const makeImageArray = (imageKeys: string | string[]) => {
  const imageObjects = [];
  if (Array.isArray(imageKeys)) {
    imageKeys.forEach((key) => {
      imageObjects.push({
        Key: key,
      });
    });
  } else {
    imageObjects.push({
      Key: imageKeys,
    });
  }
  return imageObjects;
};
