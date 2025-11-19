import { NextRequest, NextResponse } from "next/server";
import { verifyAccess } from "@/app/utils/jwt";
import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

/**
 * GET /api/mobile/resumes
 * List all resumes for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // Get and verify JWT token
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = verifyAccess(token);

    // Get candidate ID from user ID
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate profile not found" },
        { status: 404 }
      );
    }

    // Get all resumes for the candidate
    const resumes = await prisma.resume.findMany({
      where: { candidateId: candidate.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        filename: true,
        originalUrl: true,
        formatedUrl: true,
        isAiResume: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("[GET_RESUMES_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mobile/resumes
 * Upload a new resume file
 */
export async function POST(req: NextRequest) {
  try {
    // Get and verify JWT token
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = verifyAccess(token);

    // Get candidate ID from user ID
    const candidate = await prisma.candidate.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate profile not found" },
        { status: 404 }
      );
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileName = `resume_${candidate.id}_${Date.now()}.pdf`;

    // For development: use mock upload (in production, use UploadThing)
    // TODO: Replace with UploadThing when credentials are available
    const mockUrl = `https://example.com/uploads/${fileName}`;

    // Create resume record in database
    const resume = await prisma.resume.create({
      data: {
        candidateId: candidate.id,
        filename: fileName,
        originalUrl: mockUrl,
      },
      select: {
        id: true,
        filename: true,
        originalUrl: true,
        formatedUrl: true,
        isAiResume: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("[UPLOAD_RESUME_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}
