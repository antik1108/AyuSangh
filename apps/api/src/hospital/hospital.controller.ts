import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HospitalService } from './hospital.service';
import { FavouritesService } from './favourites.service';
import { CloudinaryService } from '../common/cloudinary.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { SearchHospitalDto } from './dto/search-hospital.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@Controller('hospitals')
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly favouritesService: FavouritesService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly db: DatabaseService,
  ) {}

  @Get()
  async search(@Query() searchDto: SearchHospitalDto) {
    return this.hospitalService.search(searchDto);
  }

  @Get('users/me/favourites')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  async getMyFavourites(@Req() req: AuthRequest) {
    return this.favouritesService.getUserFavourites(req.user.id);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.hospitalService.getProfile(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL_ADMIN)
  async register(@Body() createHospitalDto: CreateHospitalDto, @Req() req: AuthRequest) {
    return this.hospitalService.register(createHospitalDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL_ADMIN)
  async update(@Param('id') id: string, @Body() updateHospitalDto: UpdateHospitalDto, @Req() req: AuthRequest) {
    return this.hospitalService.update(id, updateHospitalDto, req.user.id);
  }

  @Post(':id/photos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL_ADMIN)
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const { url, publicId } = await this.cloudinaryService.uploadImage(file);
    
    const photos = await this.db.institutionPhoto.findMany({
      where: { institutionId: id },
      orderBy: { displayOrder: 'desc' }
    });
    const order = photos.length > 0 ? photos[0].displayOrder + 1 : 1;

    const photo = await this.db.institutionPhoto.create({
      data: {
        institutionId: id,
        cloudinaryUrl: url,
        publicId,
        displayOrder: order,
      }
    });
    return photo;
  }

  @Delete(':id/photos/:photoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL_ADMIN)
  async deletePhoto(@Param('id') id: string, @Param('photoId') photoId: string) {
    const photo = await this.db.institutionPhoto.findUnique({ where: { id: photoId } });
    if (photo) {
      await this.cloudinaryService.deleteImage(photo.publicId);
      await this.db.institutionPhoto.delete({ where: { id: photoId } });
    }
    return { success: true };
  }

  @Post(':id/favourite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  async addToFavourites(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.favouritesService.addToFavourites(req.user.id, id);
  }

  @Delete(':id/favourite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  async removeFromFavourites(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.favouritesService.removeFromFavourites(req.user.id, id);
  }

  @Get(':id/favourite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  async isFavourite(@Param('id') id: string, @Req() req: AuthRequest) {
    const isFav = await this.favouritesService.isFavourite(req.user.id, id);
    return { isFavourite: isFav };
  }
}
