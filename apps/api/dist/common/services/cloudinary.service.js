"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let CloudinaryService = class CloudinaryService {
    uploadDir = './uploads/images';
    maxFileSize = 5 * 1024 * 1024;
    allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    constructor() {
        this._ensureUploadDir();
    }
    async uploadImage(file, folder = 'institutions') {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`);
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
        }
        try {
            const filename = `${folder}_${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
            const filepath = path.join(this.uploadDir, folder, filename);
            const folderPath = path.dirname(filepath);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            fs.writeFileSync(filepath, file.buffer);
            const url = `/uploads/images/${folder}/${filename}`;
            return {
                url,
                publicId: filename,
                filename: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                uploadedAt: new Date(),
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to upload image: ${error.message}`);
        }
    }
    async uploadImages(files, folder = 'institutions') {
        return Promise.all(files.map((file) => this.uploadImage(file, folder)));
    }
    async deleteImage(publicId) {
        try {
            const filepath = path.join(this.uploadDir, publicId);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to delete image: ${error.message}`);
        }
    }
    async deleteImages(publicIds) {
        await Promise.all(publicIds.map((id) => this.deleteImage(id)));
    }
    async getImageMetadata(publicId) {
        try {
            const filepath = path.join(this.uploadDir, publicId);
            if (!fs.existsSync(filepath)) {
                throw new common_1.BadRequestException('Image not found');
            }
            const stats = fs.statSync(filepath);
            return {
                publicId,
                size: stats.size,
                uploadedAt: stats.birthtime,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get image metadata: ${error.message}`);
        }
    }
    async generateThumbnail(publicId, width = 200, height = 200) {
        return `${publicId}?w=${width}&h=${height}`;
    }
    getOptimizedUrl(sourceUrl, options = {}) {
        const { width = 800, height = 600, quality = 'auto', format = 'auto' } = options;
        return `${sourceUrl}?w=${width}&h=${height}&q=${quality}&f=${format}`;
    }
    _ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map