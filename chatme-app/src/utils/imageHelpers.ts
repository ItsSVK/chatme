/**
 * Image Helper Utilities
 * Functions to detect and handle images/GIFs/stickers from clipboard
 * Only supports base64 data URIs (URL sharing disabled for now)
 */

/**
 * Check if a string is a base64 data URI (image/GIF/sticker)
 * URL detection is disabled - only base64 data URIs are supported
 */
export function isBase64Image(text: string): boolean {
  if (!text || !text.trim()) return false;

  const trimmed = text.trim();

  // Only check for base64 data URI (data:image/...)
  // URL detection is disabled as per user request
  if (trimmed.startsWith('data:image/')) {
    return true;
  }

  return false;
}

/**
 * Check if a string is an image URI (file://, content://, etc.)
 */
export function isImageUri(text: string): boolean {
  if (!text || !text.trim()) return false;

  const trimmed = text.trim();

  // Check for various image URI patterns
  if (
    trimmed.startsWith('content://') ||
    trimmed.startsWith('file://') ||
    trimmed.startsWith('file:/') ||
    trimmed.startsWith('/storage/') ||
    trimmed.startsWith('/data/')
  ) {
    // Check if it has an image extension
    const imageExtensions = /\.(gif|jpg|jpeg|png|webp|bmp|svg)$/i;
    if (imageExtensions.test(trimmed) || trimmed.includes('image')) {
      return true;
    }
  }

  return false;
}

/**
 * Extract base64 image data URI from text
 * Returns null if text is not a base64 image
 */
export function extractBase64Image(text: string): string | null {
  if (!text || !text.trim()) return null;

  const trimmed = text.trim();

  // Only return if it's a base64 data URI
  if (isBase64Image(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Extract image URI from text (content://, file://, etc.)
 */
export function extractImageUri(text: string): string | null {
  if (!text || !text.trim()) return null;

  const trimmed = text.trim();

  // Return if it's an image URI
  if (isImageUri(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Convert image file to base64 data URI
 */
export async function imageToBase64(uri: string): Promise<string | null> {
  try {
    // For React Native, we'll use fetch to get the image and convert to base64
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}
