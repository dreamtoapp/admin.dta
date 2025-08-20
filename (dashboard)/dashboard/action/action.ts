'use server';

import db from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getDashboardStats() {
  try {
    // Get real statistics from database
    const [
      totalJobApplications,
      activeJobApplications,
      totalVisitors,
      recentSubmissions,
      jobApplications,
      contacts,
      visitors,
      consultations
    ] = await Promise.all([
      // Job Applications Stats
      db.jobApplication.count(),
      db.jobApplication.count({
        where: {
          status: {
            in: ['SUBMITTED', 'UNDER_REVIEW']
          }
        }
      }),

      // Visitors Stats
      db.visitor.count(),

      // Recent submissions (last 7 days)
      db.jobApplication.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Recent Job Applications
      db.jobApplication.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      }),

      // Recent Contact Submissions
      db.projectRequest.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      }),

      // Recent Visitors
      db.visitor.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      }),

      // Recent Consultations
      db.consultationRequest.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    return {
      stats: {
        totalJobApplications,
        activeJobApplications,
        totalVisitors,
        recentSubmissions
      },
      jobApplications,
      contacts,
      visitors,
      consultations
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}

export async function refreshDashboardData() {
  try {
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error refreshing dashboard data:', error);
    throw new Error('Failed to refresh dashboard data');
  }
}
