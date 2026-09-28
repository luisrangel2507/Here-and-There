import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// Photo keys look like "dest:<id>:highlight:<name>" — turn the colons into
// slashes so Cloudinary groups them into folders in its media library.
export function publicIdForKey(key: string) {
  return 'here-and-there/' + key.replace(/:/g, '/');
}
