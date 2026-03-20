import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';

const safeEnv = env as Record<string, string>;

// Initialize Cloudflare R2 Client
export const s3 = new S3Client({
	region: "auto",
	endpoint: `https://${safeEnv.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: safeEnv.R2_ACCESS_KEY_ID,
		secretAccessKey: safeEnv.R2_SECRET_ACCESS_KEY,
	},
});

/**
 * Mengunggah File ke Cloudflare R2 dan mengembalikan URL publiknya secara instan.
 * @param file Objek File mentah dari antarmuka HTML FormData
 * @param folder Path direktori tujuan di dalam bucket (misal: 'covers' atau 'panels/solo-leveling/1')
 * @returns Rute Absolute Publik Cloudflare berbasis CDN dari berkas terkait
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
	if (!file || file.size === 0) {
		throw new Error("File submission invalid atau terlalu kecil/rusak.");
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
    
    // Menerapkan nama file unik kriptografis agar aset CDN tidak tertukar (Cache collision prevention)
    const ext = file.name.split('.').pop() || 'jpg';
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}-${uniqueId}.${ext}`;

	const command = new PutObjectCommand({
		Bucket: safeEnv.R2_BUCKET_NAME,
		Key: fileName,
		Body: buffer,
		ContentType: file.type,
	});

	await s3.send(command);

    // Menggabungkan Public Custom Domain (.env) dengan URI target berkas baru
    const publicUrl = safeEnv.PUBLIC_R2_URL || 'https://pub-mock.r2.dev';
    const baseUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
	return `${baseUrl}/${fileName}`;
}
