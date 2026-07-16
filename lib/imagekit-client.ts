export type ImageUploadResult = { url: string; fileId?: string };

export async function uploadImageDirect(file: File, folder: string): Promise<ImageUploadResult> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Each image must be 10 MB or smaller.");
  const authResponse = await fetch("/api/uploads/auth");
  const auth = await authResponse.json();
  if (!authResponse.ok) throw new Error(auth.error ?? "Could not authorize image upload.");
  const form = new FormData();
  form.append("file", file);
  form.append("fileName", `${Date.now()}-${file.name}`);
  form.append("folder", folder);
  form.append("publicKey", auth.publicKey);
  form.append("signature", auth.signature);
  form.append("expire", String(auth.expire));
  form.append("token", auth.token);
  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body: form });
  const result = await response.json();
  if (!response.ok || !result.url) throw new Error(result.message ?? "Image upload failed.");
  return { url: `${result.url}?tr=w-400`, fileId: result.fileId };
}