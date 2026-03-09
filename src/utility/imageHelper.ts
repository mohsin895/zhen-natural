export const getCartImageUrl = (image: string | null | undefined): string => {
  console.log("getCartImageUrl called with:", image);

  if (!image || image === "undefined") {
    console.log("Image is falsy, returning placeholder");
    return "/placeholder.png";
  }

  const basePath = process.env.NEXT_PUBLIC_PATH || "";

  if (image.startsWith("http")) return image;

  return `${basePath}/${image}`;
};
