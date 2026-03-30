import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { HospitalService } from './hospital.service';
import { FavouritesService } from './favourites.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RegisterHospitalDto } from '../auth/dto/register-hospital.dto';
import type { Request as ExpressRequest } from 'express';
import type { Express } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: { userId: string; email: string; role: string };
}

@Controller('hospitals')
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly favouritesService: FavouritesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  searchHospitals(@Query('name') name?: string, @Query('city') city?: string) {
    return this.hospitalService.search(name, city);
  }

  // Static routes must come before parameterized routes to avoid shadowing
  @Get('user/favourites')
  @UseGuards(JwtAuthGuard)
  async getUserFavourites(@Request() req: RequestWithUser) {
    return this.favouritesService.getUserFavourites(req.user.userId);
  }

  @Get(':id')
  getHospital(@Param('id') id: string) {
    return this.hospitalService.getProfile(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.HOSPITAL_ADMIN)
  registerHospital(@Body() data: RegisterHospitalDto) {
    return this.hospitalService.registerHospital(data);
  }

  // Image Upload Endpoints
  @Post(':hospitalId/upload-photo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOSPITAL_ADMIN, Role.PLATFORM_ADMIN)
  @UseInterceptors(
    FileInterceptor('photo', {
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Only JPEG, PNG, and WebP files are allowed',
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadProfilePhoto(
    @Request() req: RequestWithUser,
    @Param('hospitalId') hospitalId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'institutions',
    );

    // Update hospital's profile photo URL
    await this.hospitalService.updateProfilePhoto(hospitalId, uploadResult.url);

    return {
      message: 'Profile photo uploaded successfully',
      photoUrl: uploadResult.url,
      ...uploadResult,
    };
  }

  @Post(':hospitalId/upload-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOSPITAL_ADMIN, Role.PLATFORM_ADMIN)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Only JPEG, PNG, and WebP files are allowed',
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadMultipleImages(
    @Request() req: RequestWithUser,
    @Param('hospitalId') hospitalId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadResults = await this.cloudinaryService.uploadImages(
      files,
      'institutions',
    );

    // Save images to database
    await this.hospitalService.addImages(hospitalId, uploadResults);

    return {
      message: `${uploadResults.length} images uploaded successfully`,
      images: uploadResults,
    };
  }

  @Delete(':hospitalId/images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOSPITAL_ADMIN, Role.PLATFORM_ADMIN)
  async deleteImage(
    @Param('hospitalId') hospitalId: string,
    @Param('imageId') imageId: string,
  ) {
    await this.hospitalService.deleteImage(hospitalId, imageId);
    return { message: 'Image deleted successfully' };
  }

  // Favourites Endpoints
  @Post(':hospitalId/favourite')
  @UseGuards(JwtAuthGuard)
  async addToFavourites(
    @Request() req: RequestWithUser,
    @Param('hospitalId') hospitalId: string,
  ) {
    return this.favouritesService.addToFavourites(req.user.userId, hospitalId);
  }

  @Delete(':hospitalId/favourite')
  @UseGuards(JwtAuthGuard)
  async removeFromFavourites(
    @Request() req: RequestWithUser,
    @Param('hospitalId') hospitalId: string,
  ) {
    await this.favouritesService.removeFromFavourites(
      req.user.userId,
      hospitalId,
    );
    return { message: 'Removed from favourites' };
  }

  @Get(':hospitalId/is-favourite')
  @UseGuards(JwtAuthGuard)
  async isFavourite(
    @Request() req: RequestWithUser,
    @Param('hospitalId') hospitalId: string,
  ) {
    const isFav = await this.favouritesService.isFavourite(
      req.user.userId,
      hospitalId,
    );
    return { isFavourite: isFav };
  }
}
