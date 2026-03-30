import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from './doctor.service';
import { DoctorRepository } from './doctor.repository';

describe('DoctorService', () => {
  let service: DoctorService;
  let doctorRepository: DoctorRepository;

  const mockDoctor = {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    specialization: 'Cardiology',
    experienceYears: 10,
    bio: 'Experienced cardiologist',
    phone: '+1234567890',
    qualifications: ['MD', 'Board Certified'],
    consultationFee: 150,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: DoctorRepository,
          useValue: {
            searchDoctors: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    doctorRepository = module.get<DoctorRepository>(DoctorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should search doctors without specialization filter', async () => {
      const mockDoctors = [mockDoctor];

      jest.spyOn(doctorRepository, 'searchDoctors').mockResolvedValue(mockDoctors);

      const result = await service.search();

      expect(result).toEqual(mockDoctors);
      expect(doctorRepository.searchDoctors).toHaveBeenCalledWith(undefined);
    });

    it('should search doctors by specialization', async () => {
      const cardiologists = [mockDoctor];

      jest
        .spyOn(doctorRepository, 'searchDoctors')
        .mockResolvedValue(cardiologists);

      const result = await service.search('Cardiology');

      expect(result).toEqual(cardiologists);
      expect(doctorRepository.searchDoctors).toHaveBeenCalledWith('Cardiology');
    });

    it('should return empty array if no doctors found', async () => {
      jest.spyOn(doctorRepository, 'searchDoctors').mockResolvedValue([]);

      const result = await service.search('NonExistent');

      expect(result).toEqual([]);
    });
  });

  describe('getProfile', () => {
    it('should return doctor profile by id', async () => {
      jest.spyOn(doctorRepository, 'findById').mockResolvedValue(mockDoctor);

      const result = await service.getProfile('1');

      expect(result).toEqual(mockDoctor);
      expect(doctorRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if doctor not found', async () => {
      jest.spyOn(doctorRepository, 'findById').mockResolvedValue(null);

      const result = await service.getProfile('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('registerDoctor', () => {
    it('should register a new doctor with all details', async () => {
      const registerDto = {
        firstName: 'John',
        lastName: 'Smith',
        specialization: 'Cardiology',
        experienceYears: 10,
        bio: 'Experienced cardiologist',
        phone: '+1234567890',
        qualifications: ['MD', 'Board Certified'],
        consultationFee: 150,
        userId: 'user-1',
      };

      jest.spyOn(doctorRepository, 'create').mockResolvedValue(mockDoctor);

      const result = await service.registerDoctor(registerDto);

      expect(result).toEqual(mockDoctor);
      expect(doctorRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          specialization: registerDto.specialization,
          experienceYears: registerDto.experienceYears,
          bio: registerDto.bio,
          phone: registerDto.phone,
          consultationFee: registerDto.consultationFee,
        }),
      );
    });

    it('should register doctor with user connection if userId provided', async () => {
      const registerDto = {
        firstName: 'John',
        lastName: 'Smith',
        specialization: 'Cardiology',
        experienceYears: 10,
        bio: 'Experienced cardiologist',
        phone: '+1234567890',
        qualifications: ['MD', 'Board Certified'],
        consultationFee: 150,
        userId: 'user-1',
      };

      jest.spyOn(doctorRepository, 'create').mockResolvedValue(mockDoctor);

      await service.registerDoctor(registerDto);

      const createCall = jest.mocked(doctorRepository.create).mock.calls[0][0];
      expect(createCall).toHaveProperty('user');
      expect(createCall.user).toEqual({ connect: { id: 'user-1' } });
    });

    it('should register doctor without user connection if userId not provided', async () => {
      const registerDto = {
        firstName: 'John',
        lastName: 'Smith',
        specialization: 'Cardiology',
        experienceYears: 10,
        bio: 'Experienced cardiologist',
        phone: '+1234567890',
        qualifications: ['MD', 'Board Certified'],
        consultationFee: 150,
      };

      jest.spyOn(doctorRepository, 'create').mockResolvedValue(mockDoctor);

      await service.registerDoctor(registerDto);

      const createCall = jest.mocked(doctorRepository.create).mock.calls[0][0];
      expect(createCall).not.toHaveProperty('user');
    });

    it('should use empty array for qualifications if not provided', async () => {
      const registerDto = {
        firstName: 'John',
        lastName: 'Smith',
        specialization: 'Cardiology',
        experienceYears: 10,
        bio: 'Experienced cardiologist',
        phone: '+1234567890',
        consultationFee: 150,
      };

      jest.spyOn(doctorRepository, 'create').mockResolvedValue(mockDoctor);

      await service.registerDoctor(registerDto);

      const createCall = jest.mocked(doctorRepository.create).mock.calls[0][0];
      expect(createCall.qualifications).toEqual([]);
    });
  });
});
