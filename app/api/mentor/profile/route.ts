import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { mentorProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.mentorProfile) {
      return NextResponse.json({ profile: null });
    }

    // Parse JSON fields
    const profile = {
      ...user.mentorProfile,
      expertise: JSON.parse(user.mentorProfile.expertise || '[]'),
      certifications: JSON.parse(user.mentorProfile.certifications || '[]'),
      projects: JSON.parse(user.mentorProfile.projects || '[]'),
      socialLinks: JSON.parse(user.mentorProfile.socialLinks || '{}'),
      availability: JSON.parse(user.mentorProfile.availability || '{}'),
      languages: JSON.parse(user.mentorProfile.languages || '[]'),
      education: JSON.parse(user.mentorProfile.education || '[]'),
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.fullName || !body.title || !body.company || !body.bio || !body.hourlyRate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!body.expertise || body.expertise.length === 0) {
      return NextResponse.json({ error: 'At least one expertise is required' }, { status: 400 });
    }

    if (!body.yearsExperience || body.yearsExperience <= 0) {
      return NextResponse.json({ error: 'Years of experience must be greater than 0' }, { status: 400 });
    }

    // Stringify JSON fields
    const profileData = {
      fullName: body.fullName,
      title: body.title,
      company: body.company,
      yearsExperience: body.yearsExperience,
      category: body.category || 'Tech',
      bio: body.bio,
      expertise: JSON.stringify(body.expertise || []),
      hourlyRate: body.hourlyRate,
      profilePhotoUrl: body.profilePhotoUrl || null,
      cvUrl: body.cvUrl || null,
      certifications: JSON.stringify(body.certifications || []),
      projects: JSON.stringify(body.projects || []),
      socialLinks: JSON.stringify(body.socialLinks || {}),
      availability: JSON.stringify(body.availability || {}),
      languages: JSON.stringify(body.languages || []),
      education: JSON.stringify(body.education || []),
      isApproved: true, // Auto-approve for now
    };

    // Upsert mentor profile
    const profile = await prisma.mentorProfile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        ...profileData,
        userId: user.id,
      },
    });

    // Update user role to mentor if profile is complete
    if (user.role !== 'mentor') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'mentor' },
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving mentor profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
