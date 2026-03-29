type MulterFile = Express.Multer.File;
declare global {
    namespace Express {
        namespace Multer {
            interface File {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                destination: string;
                filename: string;
                path: string;
                buffer: Buffer;
            }
        }
    }
}
export declare class CloudinaryService {
    private readonly uploadDir;
    private readonly maxFileSize;
    private readonly allowedMimeTypes;
    constructor();
    uploadImage(file: MulterFile, folder?: 'institutions' | 'doctors' | 'reviews'): Promise<UploadResponse>;
    uploadImages(files: MulterFile[], folder?: 'institutions' | 'doctors' | 'reviews'): Promise<UploadResponse[]>;
    deleteImage(publicId: string): Promise<void>;
    deleteImages(publicIds: string[]): Promise<void>;
    getImageMetadata(publicId: string): Promise<Partial<UploadResponse>>;
    generateThumbnail(publicId: string, width?: number, height?: number): Promise<string>;
    getOptimizedUrl(sourceUrl: string, options?: {
        width?: number;
        height?: number;
        quality?: 'auto' | 'low' | 'medium' | 'high';
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    }): string;
    private _ensureUploadDir;
}
export interface UploadResponse {
    url: string;
    publicId: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
}
export {};
