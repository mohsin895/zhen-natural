export const getCartImageUrl = (image: any): string => {
  if (!image) return "/placeholder.png";

  const basePath = process.env.NEXT_PUBLIC_PATH || "";

  if (typeof image === "string") {
    if (image.startsWith("http")) return image;
    return `${basePath}/${image}`;
  }

  if (image?.file_name) {
    return `${basePath}/${image.file_name}`;
  }

  return "/placeholder.png";
};
