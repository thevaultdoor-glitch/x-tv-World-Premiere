import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.subscription.deleteMany();
  await prisma.video.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.user.deleteMany();

  // Create Users and Channels
  const user1 = await prisma.user.create({
    data: {
      name: 'DevPro',
      email: 'devpro@example.com',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      channel: {
        create: {
          name: 'DevPro',
          avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
          subscriberCount: 1230000,
          description: 'Your daily dose of professional development content.',
        },
      },
    },
    include: { channel: true },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'CSS Masters',
      email: 'css@example.com',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      channel: {
        create: {
          name: 'CSS Masters',
          avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
          subscriberCount: 890000,
          description: 'Mastering the art of CSS.',
        },
      },
    },
    include: { channel: true },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'BackendBuilder',
      email: 'backend@example.com',
      image: 'https://randomuser.me/api/portraits/men/35.jpg',
      channel: {
        create: {
          name: 'BackendBuilder',
          avatarUrl: 'https://randomuser.me/api/portraits/men/35.jpg',
          subscriberCount: 450000,
          description: 'Building robust backends.',
        },
      },
    },
    include: { channel: true },
  });

  const user4 = await prisma.user.create({
    data: {
      name: 'StreamTech',
      email: 'stream@example.com',
      image: 'https://randomuser.me/api/portraits/women/38.jpg',
      channel: {
        create: {
          name: 'StreamTech',
          avatarUrl: 'https://randomuser.me/api/portraits/women/38.jpg',
          subscriberCount: 210000,
          description: 'All about streaming technology.',
        },
      },
    },
    include: { channel: true },
  });
  
  const channels = {
      'DevPro': user1.channel!.id,
      'CSS Masters': user2.channel!.id,
      'BackendBuilder': user3.channel!.id,
      'StreamTech': user4.channel!.id,
  }

  // Create Videos
  const videosData = [
    {
      title: 'Building a SaaS with the Next.js App Router',
      thumbnailUrl: 'https://i.ytimg.com/vi/mPZE_DGClbI/maxresdefault.jpg',
      duration: '1:23:45',
      views: 1200000,
      category: 'Web Development',
      channelName: 'DevPro',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
    {
      title: 'The Ultimate Guide to Responsive Design',
      thumbnailUrl: 'https://i.ytimg.com/vi/fis26HvvDII/maxresdefault.jpg',
      duration: '34:12',
      views: 890000,
      category: 'Design',
      channelName: 'CSS Masters',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    },
    {
      title: 'Prisma ORM: A Deep Dive for Beginners',
      thumbnailUrl: 'https://i.ytimg.com/vi/6e-Ua3eA-dE/maxresdefault.jpg',
      duration: '55:30',
      views: 450000,
      category: 'Database',
      channelName: 'BackendBuilder',
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
    },
    {
      title: 'Mux Video Streaming API Tutorial',
      thumbnailUrl: 'https://i.ytimg.com/vi/hl3bQy_b7wI/maxresdefault.jpg',
      duration: '48:15',
      views: 210000,
      category: 'Streaming Tech',
      channelName: 'StreamTech',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      title: 'Getting Started with Next.js 15',
      thumbnailUrl: 'https://i.ytimg.com/vi/fb_S-afr12c/maxresdefault.jpg',
      duration: '22:40',
      views: 500000,
      category: 'Web Development',
      channelName: 'DevPro',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    },
  ];

  for (const video of videosData) {
    await prisma.video.create({
      data: {
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        views: video.views,
        category: video.category,
        createdAt: video.createdAt,
        channelId: channels[video.channelName as keyof typeof channels],
      },
    });
  }

  // Add a subscription for our test user
  await prisma.subscription.create({
    data: {
      userId: user1.id,
      channelId: user2.channel!.id
    }
  });

  console.log(`Seeding finished. User ${user1.name} is now subscribed to ${user2.name}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });