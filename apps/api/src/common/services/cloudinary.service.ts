import { Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

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

/**
 * CloudinaryService handles image uploads and management
 * For production, integrate with actual Cloudinary SDK
 * For now, implements local file storage with Cloudinary-like API
 */
@Injectable()
export class CloudinaryService {
  private readonly uploadDir = './uploads/images';
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  constructor() {
    this._ensureUploadDir();
  }

  /**
   * Upload image file
   * In production, use cloudinary.v2.uploader.upload()
   */
  async uploadImage(
    file: MulterFile,
    folder: 'institutions' | 'doctors' | 'reviews' = 'institutions',
  ): Promise<UploadResponse> {
    // Validate file
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`,
      );
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    try {
      // Generate unique filename
      const filename = `${folder}_${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
      const filepath = path.join(this.uploadDir, folder, filename);

      // Ensure folder exists
      const folderPath = path.dirname(filepath);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Save file
      fs.writeFileSync(filepath, file.buffer);

      // Return URL-like response (in production, return Cloudinary URL)
      const url = `/uploads/images/${folder}/${filename}`;

      return {
        url,
        publicId: filename,
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Upload multiple images
   */
  async uploadImages(
    files: MulterFile[],
    folder: 'institutions' | 'doctors' | 'reviews' = 'institutions',
  ): Promise<UploadResponse[]> {
    return Promise.all(
      files.map((file) => this.uploadImage(file, folder)),
    );
  }

  /**
   * Delete image
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      const filepath = path.join(this.uploadDir, publicId);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Delete multiple images
   */
  async deleteImages(publicIds: string[]): Promise<void> {
    await Promise.all(publicIds.map((id) => this.deleteImage(id)));
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(publicId: string): Promise<Partial<UploadResponse>> {
    try {
      const filepath = path.join(this.uploadDir, publicId);

      if (!fs.existsSync(filepath)) {
        throw new BadRequestException('Image not found');
      }

      const stats = fs.statSync(filepath);

      return {
        publicId,
        size: stats.size,
        uploadedAt: stats.birthtime,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to get image metadata: ${error.message}`,
      );
    }
  }

  /**
   * Generate thumbnail (placeholder for actual implementation)
   * In production, use Cloudinary transformations
   */
  async generateThumbnail(
    publicId: string,
    width: number = 200,
    height: number = 200,
  ): Promise<string> {
    // In production, return Cloudinary transformation URL
    // Format: cloudinary_url/c_fill,h_{height},w_{width}/publicId
    return `${publicId}?w=${width}&h=${height}`;
  }

  /**
   * Get optimized image URL with transformations
   * In production, use Cloudinary transformations
   */
  getOptimizedUrl(
    sourceUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: 'auto' | 'low' | 'medium' | 'high';
      format?: 'auto' | 'webp' | 'jpg' | 'png';
    } = {},
  ): string {
    const { width = 800, height = 600, quality = 'auto', format = 'auto' } =
      options;

    // In production, return Cloudinary URL with transformations
    // Example: cloudinary_url/c_fill,h_600,q_auto,f_auto,w_800/source_url
    return `${sourceUrl}?w=${width}&h=${height}&q=${quality}&f=${format}`;
  }

  /**
   * Private helper methods
   */

  private _ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }
}

export interface UploadResponse {
  url: string;
  publicId: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}
