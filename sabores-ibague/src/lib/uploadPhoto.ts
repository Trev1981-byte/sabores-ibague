import { supabase } from "@/lib/supabase";

/**
 * Shrinks a photo down before it's uploaded. A phone photo straight out of
 * the camera is often 3-5MB — nobody needs that much detail to show a
 * plate of food on a phone screen, and full-size photos would make the
 * site slow and run up storage costs for no benefit. This runs entirely in
 * the browser via a canvas, so no extra library is needed just for this.
 */
async function compressImage(file: File, maxDimension = 1280, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", quality);
  });
}

/**
 * Uploads a photo to the "restaurant-photos" storage bucket and returns its
 * public URL, or null if the upload failed. `folder` groups files by what
 * they belong to (e.g. a restaurant's id) so photos don't collide and stay
 * easy to find in the bucket.
 */
export async function uploadPhoto(file: File, folder: string): Promise<string | null> {
  try {
    const compressed = await compressImage(file);
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

    const { error } = await supabase.storage
      .from("restaurant-photos")
      .upload(path, compressed, { contentType: "image/jpeg" });

    if (error) {
      console.error("uploadPhoto failed:", error.message);
      return null;
    }

    const { data } = supabase.storage.from("restaurant-photos").getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error("uploadPhoto failed:", err);
    return null;
  }
}
