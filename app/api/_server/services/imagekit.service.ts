import ImageKit from "imagekit";

function getClient() {
  if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) throw new Error("IMAGEKIT_NOT_CONFIGURED");
  return new ImageKit({ publicKey: process.env.IMAGEKIT_PUBLIC_KEY, privateKey: process.env.IMAGEKIT_PRIVATE_KEY, urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT });
}

export function getUploadAuthenticationParameters() { const imagekit = getClient(); return imagekit.getAuthenticationParameters(); }

export async function uploadImages(files: File[], folder: string) {
  if (files.length < 1 || files.length > 10) throw new Error("PHOTO_COUNT_INVALID");
  if (files.some(file => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024)) throw new Error("PHOTO_INVALID");
  const imagekit = getClient();
  return Promise.all(files.map(async file => { const uploaded = await imagekit.upload({ file: Buffer.from(await file.arrayBuffer()), fileName: `${Date.now()}-${crypto.randomUUID()}-${file.name.replace(/[^a-z0-9.-]/gi, "-")}`, folder }); return `${uploaded.url}?tr=w-400`; }));
}
