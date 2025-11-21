import { NextRequest, NextResponse } from "next/server";
import { verifyAccess } from "@/app/utils/jwt";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/mobile/saved-jobs
 * Get all saved job IDs for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // Get and verify JWT token
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = verifyAccess(token);

    // Get all saved job IDs for the user
    const savedJobs = await prisma.savedJobPost.findMany({
      where: { userId },
      select: {
        jobId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Extract just the job IDs for easier consumption
    const savedJobIds = savedJobs.map(savedJob => savedJob.jobId);

    return NextResponse.json({
      success: true,
      savedJobs: savedJobIds,
      count: savedJobIds.length,
    });
  } catch (error) {
    console.error("[GET_SAVED_JOBS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mobile/saved-jobs
 * Save a job for the authenticated user
 * Body: { jobId: string }
 */
export async function POST(req: NextRequest) {
  try {
    // Get and verify JWT token
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = verifyAccess(token);

    // Parse request body
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Verify the job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, title: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if job is already saved
    const existingSavedJob = await prisma.savedJobPost.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingSavedJob) {
      return NextResponse.json(
        { error: "Job is already saved" },
        { status: 409 }
      );
    }

    // Save the job
    const savedJob = await prisma.savedJobPost.create({
      data: {
        userId,
        jobId,
      },
      select: {
        jobId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      savedJob,
      message: "Job saved successfully",
    });
  } catch (error) {
    console.error("[SAVE_JOB_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to save job" },
      { status: 500 }
    );
  }
}
