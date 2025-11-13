import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.oTP.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  console.log('👥 Creating demo users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const demoStudent = await prisma.user.create({
    data: {
      email: 'student@demo.com',
      password: hashedPassword,
      name: 'Rahul Sharma',
      phone: '+919876543210',
      role: 'STUDENT',
      subscriptionTier: 'FREE',
      isEmailVerified: true,
      isPhoneVerified: true,
      verificationLevel: 'LEVEL_2',
      credibilityScore: 85,
      profile: {
        create: {
          bio: 'Final year Computer Science student at IIT Delhi',
          location: 'Delhi, India',
          currentStatus: 'Student at IIT Delhi',
          skills: ['Python', 'JavaScript', 'Machine Learning'],
          interests: ['AI', 'Web Development', 'Data Science'],
        },
      },
    },
  });

  const demoProfessional = await prisma.user.create({
    data: {
      email: 'professional@demo.com',
      password: hashedPassword,
      name: 'Priya Patel',
      phone: '+919876543211',
      role: 'PROFESSIONAL',
      subscriptionTier: 'PROFESSIONAL_PREMIUM',
      isEmailVerified: true,
      isPhoneVerified: true,
      isFaceVerified: true,
      verificationLevel: 'LEVEL_3',
      credibilityScore: 150,
      profile: {
        create: {
          bio: 'Software Engineer with 5 years of experience',
          location: 'Bangalore, India',
          currentStatus: 'Software Engineer at Google',
          skills: ['React', 'Node.js', 'System Design', 'AWS'],
          interests: ['Cloud Computing', 'Microservices', 'DevOps'],
        },
      },
    },
  });

  const demoEntrepreneur = await prisma.user.create({
    data: {
      email: 'entrepreneur@demo.com',
      password: hashedPassword,
      name: 'Amit Kumar',
      phone: '+919876543212',
      role: 'ENTREPRENEUR',
      subscriptionTier: 'ENTERPRISE_PREMIUM',
      isEmailVerified: true,
      isPhoneVerified: true,
      isFaceVerified: true,
      verificationLevel: 'LEVEL_4',
      credibilityScore: 200,
      profile: {
        create: {
          bio: 'Founder of a successful EdTech startup',
          location: 'Mumbai, India',
          currentStatus: 'Founder & CEO at EduTech Solutions',
          skills: ['Business Strategy', 'Product Management', 'Leadership'],
          interests: ['Entrepreneurship', 'Education', 'Technology'],
        },
      },
    },
  });

  console.log('✅ Created 3 demo users');

  // Create colleges
  console.log('🏫 Creating colleges...');
  const colleges = await Promise.all([
    // IITs
    prisma.college.create({
      data: {
        name: 'Indian Institute of Technology Delhi',
        location: 'Hauz Khas, New Delhi',
        state: 'Delhi',
        city: 'New Delhi',
        type: 'Engineering',
        ranking: 1,
        website: 'https://iitd.ac.in',
        description: 'Premier engineering institution in India, known for excellence in technical education and research.',
        establishedYear: 1961,
        accreditation: ['NAAC A++', 'NBA', 'NIRF Rank 1'],
      },
    }),
    prisma.college.create({
      data: {
        name: 'Indian Institute of Technology Bombay',
        location: 'Powai, Mumbai',
        state: 'Maharashtra',
        city: 'Mumbai',
        type: 'Engineering',
        ranking: 2,
        website: 'https://iitb.ac.in',
        description: 'Top engineering college with world-class infrastructure and placement opportunities.',
        establishedYear: 1958,
        accreditation: ['NAAC A++', 'NBA', 'NIRF Rank 2'],
      },
    }),
    prisma.college.create({
      data: {
        name: 'Indian Institute of Technology Madras',
        location: 'Chennai',
        state: 'Tamil Nadu',
        city: 'Chennai',
        type: 'Engineering',
        ranking: 3,
        website: 'https://iitm.ac.in',
        description: 'Known for research and innovation, consistently ranked among top IITs.',
        establishedYear: 1959,
        accreditation: ['NAAC A++', 'NBA', 'NIRF Rank 3'],
      },
    }),

    // NITs
    prisma.college.create({
      data: {
        name: 'National Institute of Technology Trichy',
        location: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        city: 'Tiruchirappalli',
        type: 'Engineering',
        ranking: 10,
        website: 'https://nitt.edu',
        description: 'Top NIT with excellent placement record and academic excellence.',
        establishedYear: 1964,
        accreditation: ['NAAC A', 'NBA'],
      },
    }),
    prisma.college.create({
      data: {
        name: 'National Institute of Technology Karnataka',
        location: 'Surathkal, Mangalore',
        state: 'Karnataka',
        city: 'Mangalore',
        type: 'Engineering',
        ranking: 13,
        website: 'https://nitk.ac.in',
        description: 'Premier technical institute with beautiful campus and strong industry connections.',
        establishedYear: 1960,
        accreditation: ['NAAC A', 'NBA'],
      },
    }),

    // Private Universities
    prisma.college.create({
      data: {
        name: 'BITS Pilani',
        location: 'Pilani',
        state: 'Rajasthan',
        city: 'Pilani',
        type: 'Engineering',
        ranking: 25,
        website: 'https://bits-pilani.ac.in',
        description: 'Leading private engineering institution with campuses across India.',
        establishedYear: 1964,
        accreditation: ['NAAC A++', 'NBA'],
      },
    }),
    prisma.college.create({
      data: {
        name: 'Vellore Institute of Technology',
        location: 'Vellore',
        state: 'Tamil Nadu',
        city: 'Vellore',
        type: 'Engineering',
        ranking: 30,
        website: 'https://vit.ac.in',
        description: 'Large private university with diverse programs and international collaborations.',
        establishedYear: 1984,
        accreditation: ['NAAC A++', 'NBA'],
      },
    }),

    // Management Institutes
    prisma.college.create({
      data: {
        name: 'Indian Institute of Management Ahmedabad',
        location: 'Ahmedabad',
        state: 'Gujarat',
        city: 'Ahmedabad',
        type: 'Management',
        ranking: 1,
        website: 'https://iima.ac.in',
        description: 'Premier business school in India, known for its rigorous MBA program.',
        establishedYear: 1961,
        accreditation: ['NAAC A++', 'AACSB', 'EQUIS'],
      },
    }),
    prisma.college.create({
      data: {
        name: 'Indian Institute of Management Bangalore',
        location: 'Bangalore',
        state: 'Karnataka',
        city: 'Bangalore',
        type: 'Management',
        ranking: 2,
        website: 'https://iimb.ac.in',
        description: 'Top business school with excellent faculty and industry connections.',
        establishedYear: 1973,
        accreditation: ['NAAC A++', 'AACSB', 'EQUIS'],
      },
    }),

    // Medical Colleges
    prisma.college.create({
      data: {
        name: 'All India Institute of Medical Sciences Delhi',
        location: 'Ansari Nagar, New Delhi',
        state: 'Delhi',
        city: 'New Delhi',
        type: 'Medical',
        ranking: 1,
        website: 'https://aiims.edu',
        description: 'Premier medical institution with world-class healthcare and research facilities.',
        establishedYear: 1956,
        accreditation: ['NAAC A++', 'MCI'],
      },
    }),
  ]);

  console.log(`✅ Created ${colleges.length} colleges`);

  // Create courses
  console.log('📚 Creating courses...');
  const courses = await Promise.all([
    // IIT Delhi Courses
    prisma.course.create({
      data: {
        collegeId: colleges[0].id,
        name: 'B.Tech in Computer Science and Engineering',
        category: 'Engineering',
        duration: '4 years',
        fees: '₹8-10 lakhs (total)',
        mode: 'Offline',
        description: 'Comprehensive computer science program with focus on algorithms, software development, and AI.',
      },
    }),
    prisma.course.create({
      data: {
        collegeId: colleges[0].id,
        name: 'M.Tech in Artificial Intelligence',
        category: 'Engineering',
        duration: '2 years',
        fees: '₹4-5 lakhs (total)',
        mode: 'Offline',
        description: 'Advanced AI program covering machine learning, deep learning, and neural networks.',
      },
    }),

    // Online Courses
    prisma.course.create({
      data: {
        name: 'Full Stack Web Development Bootcamp',
        category: 'Programming',
        duration: '6 months',
        fees: '₹60,000',
        mode: 'Online',
        platform: 'Coursera',
        instructorName: 'Dr. Angela Yu',
        rating: 4.7,
        enrollmentCount: 50000,
        description: 'Complete web development course covering HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
      },
    }),
    prisma.course.create({
      data: {
        name: 'Data Science Specialization',
        category: 'Data Science',
        duration: '8 months',
        fees: '₹50,000',
        mode: 'Online',
        platform: 'Udacity',
        instructorName: 'Multiple Instructors',
        rating: 4.6,
        enrollmentCount: 35000,
        description: 'Learn Python, statistics, machine learning, and data visualization.',
      },
    }),
    prisma.course.create({
      data: {
        name: 'Digital Marketing Masterclass',
        category: 'Marketing',
        duration: '4 months',
        fees: '₹25,000',
        mode: 'Online',
        platform: 'upGrad',
        instructorName: 'Industry Experts',
        rating: 4.5,
        enrollmentCount: 20000,
        description: 'Complete digital marketing course covering SEO, SEM, social media, and analytics.',
      },
    }),

    // IIM Courses
    prisma.course.create({
      data: {
        collegeId: colleges[7].id,
        name: 'Post Graduate Programme in Management (MBA)',
        category: 'Management',
        duration: '2 years',
        fees: '₹25-30 lakhs (total)',
        mode: 'Offline',
        description: 'Flagship MBA program with focus on leadership, strategy, and business analytics.',
      },
    }),
  ]);

  console.log(`✅ Created ${courses.length} courses`);

  // Create reviews
  console.log('⭐ Creating reviews...');
  const reviews = await Promise.all([
    // IIT Delhi Reviews
    prisma.review.create({
      data: {
        userId: demoStudent.id,
        reviewType: 'COLLEGE',
        collegeId: colleges[0].id,
        rating: 5,
        title: 'Best Engineering College in India',
        content: 'IIT Delhi has been an amazing experience. The faculty is world-class, research opportunities are abundant, and the campus life is vibrant. The placement cell is very supportive and top companies visit for recruitment.',
        pros: 'Excellent faculty, Great placement opportunities, Strong alumni network, Research facilities',
        cons: 'High competition, Pressure can be intense',
        tags: ['engineering', 'computer-science', 'placement', 'research'],
        upvotes: 145,
        isVerified: true,
        verificationScore: 0.95,
      },
    }),
    prisma.review.create({
      data: {
        userId: demoProfessional.id,
        reviewType: 'COLLEGE',
        collegeId: colleges[0].id,
        rating: 4,
        title: 'Great Institution with Room for Improvement',
        content: 'As an alumnus, I can say IIT Delhi shaped my career. The technical education is top-notch and prepares you well for industry. However, there could be more focus on soft skills and entrepreneurship.',
        pros: 'Technical excellence, Industry connections, Campus facilities, Brand value',
        cons: 'Limited focus on soft skills, Outdated curriculum in some departments',
        tags: ['engineering', 'alumni-review', 'career-growth'],
        upvotes: 89,
        isVerified: true,
        verificationScore: 0.98,
      },
    }),

    // IIT Bombay Reviews
    prisma.review.create({
      data: {
        userId: demoStudent.id,
        reviewType: 'COLLEGE',
        collegeId: colleges[1].id,
        rating: 5,
        title: 'Dream College for Engineers',
        content: 'IIT Bombay offers unparalleled opportunities in every aspect. The professors are brilliant, peer learning is phenomenal, and the location in Mumbai adds great value for internships and networking.',
        pros: 'Best in class education, Mumbai location advantage, Excellent infrastructure, Strong coding culture',
        cons: 'Very competitive environment, Weather can be challenging',
        tags: ['engineering', 'mumbai', 'placements', 'campus-life'],
        upvotes: 203,
        isVerified: true,
        verificationScore: 0.96,
      },
    }),

    // BITS Pilani Review
    prisma.review.create({
      data: {
        userId: demoProfessional.id,
        reviewType: 'COLLEGE',
        collegeId: colleges[5].id,
        rating: 4,
        title: 'Excellent Private Engineering College',
        content: 'BITS Pilani provides quality education comparable to IITs. The flexible curriculum and practice school system are unique advantages. Great coding culture and entrepreneurial ecosystem.',
        pros: 'Flexible curriculum, Practice School program, Good placements, Strong alumni network',
        cons: 'High fees, Location can be remote, Weather extremes',
        tags: ['engineering', 'private-college', 'practice-school'],
        upvotes: 67,
        isVerified: true,
        verificationScore: 0.92,
      },
    }),

    // VIT Review
    prisma.review.create({
      data: {
        userId: demoStudent.id,
        reviewType: 'COLLEGE',
        collegeId: colleges[6].id,
        rating: 4,
        title: 'Good College for Those Who Missed IIT/NIT',
        content: 'VIT is a solid choice if you did not make it to IIT/NIT. The campus is huge, infrastructure is good, and placements are decent. However, the management can be strict and fees are on the higher side.',
        pros: 'Good infrastructure, Decent placements, International exposure, Multiple specializations',
        cons: 'High fees, Strict management, Large batch sizes, Attendance rules',
        tags: ['engineering', 'private-college', 'vit', 'placements'],
        upvotes: 134,
        isVerified: true,
        verificationScore: 0.89,
      },
    }),

    // Online Course Reviews
    prisma.review.create({
      data: {
        userId: demoProfessional.id,
        reviewType: 'COURSE',
        courseId: courses[2].id,
        rating: 5,
        title: 'Life-Changing Course for Career Switch',
        content: 'This bootcamp helped me transition from mechanical engineering to software development. The curriculum is comprehensive, projects are industry-relevant, and the instructor support is excellent. Got placed as a full-stack developer within 2 months of completion!',
        pros: 'Comprehensive curriculum, Hands-on projects, Great instructor support, Career assistance',
        cons: 'Fast-paced, requires dedication, Can be challenging for absolute beginners',
        tags: ['web-development', 'bootcamp', 'career-switch', 'online-learning'],
        upvotes: 289,
        isVerified: true,
        verificationScore: 0.94,
      },
    }),
    prisma.review.create({
      data: {
        userId: demoEntrepreneur.id,
        reviewType: 'COURSE',
        courseId: courses[3].id,
        rating: 4,
        title: 'Solid Foundation in Data Science',
        content: 'Excellent course for beginners in data science. Covers Python, statistics, and ML algorithms well. The capstone project was particularly valuable. However, could use more real-world case studies.',
        pros: 'Well-structured, Good projects, Strong fundamentals, Lifetime access',
        cons: 'Limited real-world examples, Math can be challenging, Needs more advanced topics',
        tags: ['data-science', 'python', 'machine-learning', 'online-course'],
        upvotes: 156,
        isVerified: true,
        verificationScore: 0.91,
      },
    }),

    // IIM Review
    prisma.review.create({
      data: {
        userId: demoProfessional.id,
        reviewType: 'COLLEGE',
        collegeId: colleges[7].id,
        rating: 5,
        title: 'Best MBA in India - Worth Every Penny',
        content: 'IIM Ahmedabad MBA has been transformational. The case-based learning methodology, peer group diversity, and industry connections are unmatched. The alumni network opens doors everywhere.',
        pros: 'World-class faculty, Case method learning, Excellent placements, Strong brand value, Amazing peer group',
        cons: 'Very expensive, High pressure, Limited work-life balance during course',
        tags: ['mba', 'management', 'iim', 'placements', 'case-study'],
        upvotes: 312,
        isVerified: true,
        verificationScore: 0.97,
      },
    }),
  ]);

  console.log(`✅ Created ${reviews.length} reviews`);

  // Create some comments on reviews
  console.log('💬 Creating comments...');
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        userId: demoProfessional.id,
        reviewId: reviews[0].id,
        content: 'Great review! I had a similar experience. The research opportunities at IIT Delhi are indeed exceptional.',
        upvotes: 23,
      },
    }),
    prisma.comment.create({
      data: {
        userId: demoStudent.id,
        reviewId: reviews[5].id,
        content: 'Thanks for sharing! This gives me confidence to enroll. Did you need any prior programming knowledge?',
        upvotes: 15,
      },
    }),
    prisma.comment.create({
      data: {
        userId: demoEntrepreneur.id,
        reviewId: reviews[7].id,
        content: 'As an IIM-A alumnus, I can confirm everything mentioned here. The experience is truly life-changing!',
        upvotes: 45,
      },
    }),
  ]);

  console.log(`✅ Created ${comments.length} comments`);

  // Summary
  console.log('\n✨ Database seeding completed successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary:');
  console.log(`   👥 Users: 3`);
  console.log(`   🏫 Colleges: ${colleges.length}`);
  console.log(`   📚 Courses: ${courses.length}`);
  console.log(`   ⭐ Reviews: ${reviews.length}`);
  console.log(`   💬 Comments: ${comments.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔐 Demo User Credentials:');
  console.log('   📧 Email: student@demo.com');
  console.log('   📧 Email: professional@demo.com');
  console.log('   📧 Email: entrepreneur@demo.com');
  console.log('   🔑 Password: password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
