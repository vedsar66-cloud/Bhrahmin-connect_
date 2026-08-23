// Dummy Cloudinary and image helper to bypass build error
export interface CompressionResult {
  file: File;
  previewUrl: string;
}

export const compressImage = async (file: File): Promise<CompressionResult> => {
  return {
    file,
    previewUrl: URL.createObjectURL(file)
  };
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  return '';
};

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  return '';
};
