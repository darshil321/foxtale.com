// import sharp from 'sharp';

// export async function compressAndConvertToBase64(url: string, compressionPercentage: number) {
//   try {
//     // Fetch the image from the URL
//     const response = await fetch(url);
//     const arrayBuffer = await response.arrayBuffer();

//     // Compress the image using Sharp
//     const compressedImage = await sharp(arrayBuffer)
//       .resize({ quality: compressionPercentage })
//       .toBuffer();

//     // Convert the compressed image to Base64
//     const base64Image = Buffer.from(compressedImage).toString('base64');

//     return `data:image/jpeg;base64,${base64Image}`;
//   } catch (error) {
//     console.error('Error compressing and converting image:', error);
//     return null;
//   }
// }
