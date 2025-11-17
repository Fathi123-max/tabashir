import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all LinkedIn optimization subscriptions for testing
    const subscriptions = await prisma.subscription.findMany({
      where: {
        plan: 'LINKEDIN_OPTIMIZATION',
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      take: 5 // Limit to 5 most recent
    });

    return NextResponse.json({ 
      subscriptions,
      count: subscriptions.length,
      message: 'Found subscriptions without authentication'
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions', details: error.message },
      { status: 500 }
    );
  }
}
