/**
 * AyuSangh — Prisma Seed Script
 * Populates realistic Indian healthcare demo data.
 * Run: pnpm seed (from apps/api)
 */

import { PrismaClient, ReviewStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Rating calculation helpers (mirrors the Strategy Pattern in ReviewService)
// ---------------------------------------------------------------------------

interface RatingTotals {
  overall: number;
  cleanliness: number;
  staffBehaviour: number;
  waitTime: number;
  totalReviews: number;
}

type ReviewInput = {
  overallRating: number;
  cleanlinessRating: number;
  staffRating: number;
  waitTimeRating: number;
};

function calcHospitalRating(reviews: ReviewInput[]): RatingTotals {
  if (reviews.length === 0)
    return { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0, totalReviews: 0 };

  const count = reviews.length;
  const t = reviews.reduce(
    (acc, r) => {
      acc.c += r.cleanlinessRating;
      acc.s += r.staffRating;
      acc.w += r.waitTimeRating;
      acc.o += r.overallRating;
      return acc;
    },
    { c: 0, s: 0, w: 0, o: 0 },
  );

  const avgC = t.c / count;
  const avgS = t.s / count;
  const avgW = t.w / count;
  const avgO = t.o / count;
  // HospitalRatingStrategy weights: cleanliness 30%, staff 30%, waitTime 20%, overall 20%
  const weighted = avgC * 0.3 + avgS * 0.3 + avgW * 0.2 + avgO * 0.2;

  return {
    overall: Number(weighted.toFixed(2)),
    cleanliness: Number(avgC.toFixed(2)),
    staffBehaviour: Number(avgS.toFixed(2)),
    waitTime: Number(avgW.toFixed(2)),
    totalReviews: count,
  };
}

function calcLabRating(reviews: ReviewInput[]): RatingTotals {
  if (reviews.length === 0)
    return { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0, totalReviews: 0 };

  const count = reviews.length;
  const t = reviews.reduce(
    (acc, r) => {
      acc.c += r.cleanlinessRating;
      acc.s += r.staffRating;
      acc.w += r.waitTimeRating;
      acc.o += r.overallRating;
      return acc;
    },
    { c: 0, s: 0, w: 0, o: 0 },
  );

  const avgC = t.c / count;
  const avgS = t.s / count;
  const avgW = t.w / count;
  const avgO = t.o / count;
  // LabRatingStrategy weights: overall 40%, staff 30%, waitTime 20%, cleanliness 10%
  const weighted = avgO * 0.4 + avgS * 0.3 + avgW * 0.2 + avgC * 0.1;

  return {
    overall: Number(weighted.toFixed(2)),
    cleanliness: Number(avgC.toFixed(2)),
    staffBehaviour: Number(avgS.toFixed(2)),
    waitTime: Number(avgW.toFixed(2)),
    totalReviews: count,
  };
}

function calcDefaultRating(reviews: ReviewInput[]): RatingTotals {
  if (reviews.length === 0)
    return { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0, totalReviews: 0 };

  const count = reviews.length;
  const t = reviews.reduce(
    (acc, r) => {
      acc.o += r.overallRating;
      acc.c += r.cleanlinessRating;
      acc.s += r.staffRating;
      acc.w += r.waitTimeRating;
      return acc;
    },
    { o: 0, c: 0, s: 0, w: 0 },
  );

  return {
    overall: Number((t.o / count).toFixed(2)),
    cleanliness: Number((t.c / count).toFixed(2)),
    staffBehaviour: Number((t.s / count).toFixed(2)),
    waitTime: Number((t.w / count).toFixed(2)),
    totalReviews: count,
  };
}

function recalculate(type: string, reviews: ReviewInput[]): RatingTotals {
  switch (type.toUpperCase()) {
    case 'HOSPITAL':
      return calcHospitalRating(reviews);
    case 'DIAGNOSTIC_CENTRE':
      return calcLabRating(reviews);
    default:
      return calcDefaultRating(reviews);
  }
}

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱  Starting AyuSangh seed...\n');

  const SALT = 10;
  const hash = (pw: string) => bcrypt.hash(pw, SALT);

  // ── 1. Clean existing data (order matters for FK constraints) ──────────────
  await prisma.reviewReply.deleteMany();
  await prisma.review.deleteMany();
  await prisma.doctorInstitution.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.cost.deleteMany();
  await prisma.department.deleteMany();
  await prisma.accreditation.deleteMany();
  await prisma.institutionPhoto.deleteMany();
  await prisma.location.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓  Cleared existing data');

  // ── 2. Users ───────────────────────────────────────────────────────────────
  const platformAdmin = await prisma.user.create({
    data: {
      name: 'Platform Admin',
      email: 'admin@ayusangh.in',
      passwordHash: await hash('Admin@123'),
      role: UserRole.PLATFORM_ADMIN,
    },
  });

  const hospitalAdmin1 = await prisma.user.create({
    data: {
      name: 'Vikram Malhotra',
      email: 'admin.fortis@ayusangh.in',
      passwordHash: await hash('Admin@123'),
      role: UserRole.HOSPITAL_ADMIN,
    },
  });

  const hospitalAdmin2 = await prisma.user.create({
    data: {
      name: 'Neha Kapoor',
      email: 'admin.apollo@ayusangh.in',
      passwordHash: await hash('Admin@123'),
      role: UserRole.HOSPITAL_ADMIN,
    },
  });

  const hospitalAdmin3 = await prisma.user.create({
    data: {
      name: 'Suresh Iyer',
      email: 'admin.cloudnine@ayusangh.in',
      passwordHash: await hash('Admin@123'),
      role: UserRole.HOSPITAL_ADMIN,
    },
  });

  const patients = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        passwordHash: await hash('Patient@123'),
        role: UserRole.PATIENT,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Priya Singh',
        email: 'priya.singh@gmail.com',
        passwordHash: await hash('Patient@123'),
        role: UserRole.PATIENT,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Amit Verma',
        email: 'amit.verma@gmail.com',
        passwordHash: await hash('Patient@123'),
        role: UserRole.PATIENT,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sneha Gupta',
        email: 'sneha.gupta@gmail.com',
        passwordHash: await hash('Patient@123'),
        role: UserRole.PATIENT,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Karan Mehta',
        email: 'karan.mehta@gmail.com',
        passwordHash: await hash('Patient@123'),
        role: UserRole.PATIENT,
      },
    }),
  ]);

  console.log('✓  Created 1 platform admin, 3 hospital admins, 5 patients');

  // ── 3. Doctor users ────────────────────────────────────────────────────────
  const doctorUser1 = await prisma.user.create({
    data: {
      name: 'Dr. Ankit Verma',
      email: 'ankit.verma@ayusangh.in',
      passwordHash: await hash('Doctor@123'),
      role: UserRole.DOCTOR,
    },
  });

  const doctorUser2 = await prisma.user.create({
    data: {
      name: 'Dr. Sunita Rao',
      email: 'sunita.rao@ayusangh.in',
      passwordHash: await hash('Doctor@123'),
      role: UserRole.DOCTOR,
    },
  });

  const doctorUser3 = await prisma.user.create({
    data: {
      name: 'Dr. Rohit Gupta',
      email: 'rohit.gupta@ayusangh.in',
      passwordHash: await hash('Doctor@123'),
      role: UserRole.DOCTOR,
    },
  });

  // ── 4. Institutions ────────────────────────────────────────────────────────
  const fortis = await prisma.institution.create({
    data: {
      name: 'Fortis Hospital Noida',
      type: 'HOSPITAL',
      description:
        'Fortis Hospital Noida is a multi-specialty tertiary care hospital offering world-class medical services. Located in Sector 62, it is equipped with state-of-the-art infrastructure and a team of highly experienced doctors.',
      city: 'Noida',
      pincode: '201301',
      address: 'B-22, Sector 62',
      phone: '0120-4677777',
      bookingLink: 'https://www.fortishealthcare.com',
      isVerified: true,
      location: {
        create: {
          latitude: 28.6139,
          longitude: 77.3648,
          googleMapsUrl: 'https://maps.google.com/?q=Fortis+Hospital+Noida',
        },
      },
    },
  });

  const apollo = await prisma.institution.create({
    data: {
      name: 'Apollo Diagnostics Noida',
      type: 'DIAGNOSTIC_CENTRE',
      description:
        'Apollo Diagnostics is a leading diagnostic chain offering a comprehensive range of pathology and radiology services. Our Sector 18 centre is equipped with advanced imaging technology and a NABL-accredited lab.',
      city: 'Noida',
      pincode: '201301',
      address: 'D-58, Sector 18',
      phone: '0120-4100200',
      bookingLink: 'https://www.apollodiagnostics.in',
      isVerified: true,
      location: {
        create: {
          latitude: 28.5706,
          longitude: 77.3219,
          googleMapsUrl: 'https://maps.google.com/?q=Apollo+Diagnostics+Noida+Sector+18',
        },
      },
    },
  });

  const cloudnine = await prisma.institution.create({
    data: {
      name: 'Cloudnine Hospital Noida',
      type: 'NURSING_HOME',
      description:
        'Cloudnine is a premium chain of maternity and childcare hospitals. Our Sector 45 facility specialises in obstetrics, gynaecology, and neonatology, providing a safe and comfortable environment for mothers and newborns.',
      city: 'Noida',
      pincode: '201303',
      address: 'H-122, Sector 45',
      phone: '0120-6180000',
      bookingLink: 'https://www.cloudninecare.com',
      isVerified: true,
      location: {
        create: {
          latitude: 28.5672,
          longitude: 77.3489,
          googleMapsUrl: 'https://maps.google.com/?q=Cloudnine+Hospital+Noida+Sector+45',
        },
      },
    },
  });

  console.log('✓  Created 3 institutions (Fortis, Apollo, Cloudnine)');

  // ── 5. Doctors ─────────────────────────────────────────────────────────────
  const doctor1 = await prisma.doctor.create({
    data: {
      userId: doctorUser1.id,
      name: 'Dr. Ankit Verma',
      specialty: 'Cardiology',
      experience: 12,
      consultationFee: 800,
      qualifications: 'MBBS, MD (Cardiology), DM (Interventional Cardiology)',
      bio: 'Dr. Ankit Verma is a senior interventional cardiologist with over 12 years of experience in treating complex cardiac conditions.',
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      userId: doctorUser2.id,
      name: 'Dr. Sunita Rao',
      specialty: 'Gynaecology',
      experience: 8,
      consultationFee: 600,
      qualifications: 'MBBS, MS (Obstetrics & Gynaecology)',
      bio: 'Dr. Sunita Rao specialises in high-risk pregnancies and minimally invasive gynaecological procedures with 8 years of clinical experience.',
    },
  });

  const doctor3 = await prisma.doctor.create({
    data: {
      userId: doctorUser3.id,
      name: 'Dr. Rohit Gupta',
      specialty: 'Radiology',
      experience: 6,
      consultationFee: 500,
      qualifications: 'MBBS, MD (Radiodiagnosis)',
      bio: 'Dr. Rohit Gupta is an expert radiologist specialising in MRI, CT, and ultrasound diagnostics with 6 years of experience.',
    },
  });

  // Link doctors to institutions
  await prisma.doctorInstitution.createMany({
    data: [
      { doctorId: doctor1.id, institutionId: fortis.id },
      { doctorId: doctor2.id, institutionId: cloudnine.id },
      { doctorId: doctor3.id, institutionId: apollo.id },
    ],
  });

  console.log('✓  Created 3 doctors and linked to institutions');

  // ── 6. Reviews ─────────────────────────────────────────────────────────────
  // Fortis Hospital — HOSPITAL type (HospitalRatingStrategy)
  const fortisReviewData = [
    {
      userId: patients[0].id,
      text: 'Excellent experience at Fortis Noida. The cardiology department is top-notch. Dr. Ankit Verma was very thorough and explained everything clearly. The staff was courteous and the facility was spotlessly clean.',
      overallRating: 5,
      cleanlinessRating: 5,
      staffRating: 5,
      waitTimeRating: 4,
    },
    {
      userId: patients[1].id,
      text: 'Good hospital overall. The infrastructure is impressive and the doctors are knowledgeable. However, the waiting time at the OPD was a bit long. The nursing staff was very helpful and attentive.',
      overallRating: 4,
      cleanlinessRating: 4,
      staffRating: 4,
      waitTimeRating: 3,
    },
    {
      userId: patients[2].id,
      text: 'I was admitted for a cardiac procedure and the entire experience was smooth. The ICU facilities are world-class. The food could be better but the medical care was exceptional.',
      overallRating: 4,
      cleanlinessRating: 5,
      staffRating: 4,
      waitTimeRating: 4,
    },
    {
      userId: patients[3].id,
      text: 'Average experience. The hospital is clean and well-maintained but the billing process was confusing. The doctors are good but you need to wait a long time for appointments.',
      overallRating: 3,
      cleanlinessRating: 4,
      staffRating: 3,
      waitTimeRating: 2,
    },
  ];

  // Apollo Diagnostics — DIAGNOSTIC_CENTRE type (LabRatingStrategy)
  const apolloReviewData = [
    {
      userId: patients[0].id,
      text: 'Apollo Diagnostics in Sector 18 is very reliable. Got my MRI done here and the reports were ready within the promised time. The technicians were professional and the equipment is modern.',
      overallRating: 5,
      cleanlinessRating: 4,
      staffRating: 5,
      waitTimeRating: 4,
    },
    {
      userId: patients[1].id,
      text: 'Good diagnostic centre. The blood test reports were accurate and delivered on time. The reception staff was helpful in explaining the packages. Slightly expensive but worth it for the quality.',
      overallRating: 4,
      cleanlinessRating: 4,
      staffRating: 4,
      waitTimeRating: 4,
    },
    {
      userId: patients[2].id,
      text: 'Decent place for routine tests. The waiting area is comfortable and the process is well-organised. The phlebotomist was gentle and skilled. Reports were available online quickly.',
      overallRating: 4,
      cleanlinessRating: 3,
      staffRating: 4,
      waitTimeRating: 3,
    },
    {
      userId: patients[3].id,
      text: 'Had to wait longer than expected for my CT scan slot. The staff was polite but the coordination between departments could be improved. The reports were accurate though.',
      overallRating: 3,
      cleanlinessRating: 3,
      staffRating: 3,
      waitTimeRating: 2,
    },
  ];

  // Cloudnine — NURSING_HOME type (DefaultRatingStrategy)
  const cloudnineReviewData = [
    {
      userId: patients[1].id,
      text: 'Cloudnine Noida is an amazing maternity hospital. The delivery suite was comfortable and the entire team made the experience stress-free. Dr. Sunita Rao is an outstanding gynaecologist. Highly recommended for expecting mothers.',
      overallRating: 5,
      cleanlinessRating: 5,
      staffRating: 5,
      waitTimeRating: 5,
    },
    {
      userId: patients[2].id,
      text: 'Very good experience for my wife\'s delivery. The nurses were caring and attentive throughout the stay. The NICU facilities are excellent. The rooms are spacious and well-equipped.',
      overallRating: 5,
      cleanlinessRating: 5,
      staffRating: 5,
      waitTimeRating: 4,
    },
    {
      userId: patients[3].id,
      text: 'Good hospital for maternity care. The doctors are experienced and the staff is friendly. The food quality for patients was good. A bit pricey compared to other options but the quality justifies it.',
      overallRating: 4,
      cleanlinessRating: 4,
      staffRating: 4,
      waitTimeRating: 4,
    },
    {
      userId: patients[4].id,
      text: 'Satisfactory experience overall. The hospital is clean and the medical care is good. The waiting time for consultations was a bit long. The billing was transparent which I appreciated.',
      overallRating: 3,
      cleanlinessRating: 4,
      staffRating: 3,
      waitTimeRating: 3,
    },
  ];

  // Insert all reviews as APPROVED
  const insertReviews = async (
    institutionId: string,
    reviewDataList: typeof fortisReviewData,
  ) => {
    const created: Awaited<ReturnType<typeof prisma.review.create>>[] = [];
    for (const r of reviewDataList) {
      const review = await prisma.review.create({
        data: {
          ...r,
          institutionId,
          status: ReviewStatus.APPROVED,
        },
      });
      created.push(review);
    }
    return created;
  };

  await insertReviews(fortis.id, fortisReviewData);
  await insertReviews(apollo.id, apolloReviewData);
  await insertReviews(cloudnine.id, cloudnineReviewData);

  console.log('✓  Created 12 approved reviews (4 per institution)');

  // ── 7. Recalculate ratings using Strategy Pattern logic ────────────────────
  const updateRatings = async (institutionId: string, type: string) => {
    const reviews = await prisma.review.findMany({
      where: { institutionId, status: ReviewStatus.APPROVED, isDeleted: false },
    });

    const ratings = recalculate(type, reviews);

    await prisma.institution.update({
      where: { id: institutionId },
      data: {
        averageRating: ratings.overall,
        overallAvg: ratings.overall,
        cleanlinessAvg: ratings.cleanliness,
        staffAvg: ratings.staffBehaviour,
        waitTimeAvg: ratings.waitTime,
        totalReviews: ratings.totalReviews,
      },
    });

    console.log(
      `  → ${type} ratings: overall=${ratings.overall}, cleanliness=${ratings.cleanliness}, staff=${ratings.staffBehaviour}, waitTime=${ratings.waitTime}`,
    );
  };

  console.log('✓  Recalculating ratings...');
  await updateRatings(fortis.id, 'HOSPITAL');
  await updateRatings(apollo.id, 'DIAGNOSTIC_CENTRE');
  await updateRatings(cloudnine.id, 'NURSING_HOME');

  // ── 8. Add an admin reply to one review per hospital ──────────────────────
  const firstFortisReview = await prisma.review.findFirst({
    where: { institutionId: fortis.id, status: ReviewStatus.APPROVED },
    orderBy: { createdAt: 'asc' },
  });
  if (firstFortisReview) {
    await prisma.reviewReply.create({
      data: {
        reviewId: firstFortisReview.id,
        adminUserId: hospitalAdmin1.id,
        text: 'Thank you for your kind words! We are delighted to hear about your positive experience at Fortis Hospital Noida. Your feedback motivates our entire team.',
      },
    });
  }

  const firstApolloReview = await prisma.review.findFirst({
    where: { institutionId: apollo.id, status: ReviewStatus.APPROVED },
    orderBy: { createdAt: 'asc' },
  });
  if (firstApolloReview) {
    await prisma.reviewReply.create({
      data: {
        reviewId: firstApolloReview.id,
        adminUserId: hospitalAdmin2.id,
        text: 'Thank you for choosing Apollo Diagnostics! We are glad our team met your expectations. We look forward to serving you again.',
      },
    });
  }

  const firstCloudnineReview = await prisma.review.findFirst({
    where: { institutionId: cloudnine.id, status: ReviewStatus.APPROVED },
    orderBy: { createdAt: 'asc' },
  });
  if (firstCloudnineReview) {
    await prisma.reviewReply.create({
      data: {
        reviewId: firstCloudnineReview.id,
        adminUserId: hospitalAdmin3.id,
        text: 'Thank you so much for this wonderful review! It was our privilege to be part of such a special moment. Wishing your family good health always.',
      },
    });
  }

  console.log('✓  Added admin replies to reviews');

  // ── 9. Sample costs ────────────────────────────────────────────────────────
  await prisma.cost.createMany({
    data: [
      { institutionId: fortis.id, serviceName: 'OPD Consultation (Cardiology)', price: 800 },
      { institutionId: fortis.id, serviceName: 'ECG', price: 300 },
      { institutionId: fortis.id, serviceName: 'Echocardiography', price: 2500 },
      { institutionId: apollo.id, serviceName: 'Complete Blood Count (CBC)', price: 350 },
      { institutionId: apollo.id, serviceName: 'MRI Brain (without contrast)', price: 6500 },
      { institutionId: apollo.id, serviceName: 'CT Scan Chest', price: 4500 },
      { institutionId: cloudnine.id, serviceName: 'OPD Consultation (Gynaecology)', price: 600 },
      { institutionId: cloudnine.id, serviceName: 'Antenatal Package', price: 15000 },
      { institutionId: cloudnine.id, serviceName: 'Normal Delivery Package', price: 45000 },
    ],
  });

  console.log('✓  Added sample service costs');

  // ── 10. Summary ────────────────────────────────────────────────────────────
  console.log('\n✅  Seed completed successfully!\n');
  console.log('Demo credentials:');
  console.log('  Platform Admin : admin@ayusangh.in        / Admin@123');
  console.log('  Hospital Admin : admin.fortis@ayusangh.in / Admin@123');
  console.log('  Patient        : rahul.sharma@gmail.com   / Patient@123');
  console.log('  Doctor         : ankit.verma@ayusangh.in  / Doctor@123');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
