const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleJobs() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No users found. Please sign up first.');
      return;
    }
    
    console.log('Creating sample jobs for user:', user.clerkUserId);
    
    const sampleJobs = [
      {
        userId: user.clerkUserId,
        title: 'Frontend Developer',
        company: 'TechCorp',
        location: 'Remote',
        salary: '$80,000',
        status: 'Applied',
        jobType: 'Full-time',
        workType: 'Remote'
      },
      {
        userId: user.clerkUserId,
        title: 'Full Stack Engineer', 
        company: 'StartupXYZ',
        location: 'New York',
        salary: '$90,000',
        status: 'Interview',
        jobType: 'Full-time',
        workType: 'Hybrid'
      },
      {
        userId: user.clerkUserId,
        title: 'React Developer',
        company: 'DevAgency',
        location: 'San Francisco',
        salary: '$95,000',
        status: 'Pending',
        jobType: 'Full-time',
        workType: 'On-site'
      }
    ];
    
    for (const job of sampleJobs) {
      await prisma.job.create({ data: job });
    }
    
    console.log('Sample jobs created successfully!');
    
    const jobs = await prisma.job.findMany({
      where: { userId: user.clerkUserId }
    });
    console.log('Total jobs:', jobs.length);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleJobs();
