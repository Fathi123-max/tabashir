import { NextRequest, NextResponse } from "next/server";
import { verifyAccess } from "@/app/utils/jwt";
import { prisma } from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

/**
 * GET /api/mobile/resumes/{id}
 * Get a specific resume by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get the resume and verify ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        candidateId: candidate.id,
      },
      select: {
        id: true,
        filename: true,
        originalUrl: true,
        formatedUrl: true,
        formatedContent: true,
        isAiResume: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("[GET_RESUME_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/mobile/resumes/{id}
 * Update a resume (replace file)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify the resume exists and belongs to the candidate
    const existingResume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        candidateId: candidate.id,
      },
      select: {
        id: true,
        originalUrl: true,
      },
    });

    if (!existingResume) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
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

    // Delete old file from UploadThing
    try {
      const urlParts = existingResume.originalUrl.split("/f/");
      if (urlParts.length > 1) {
        const fileKey = urlParts[1];
        await utapi.deleteFiles(fileKey);
      }
    } catch (deleteError) {
      console.error("[UPLOADTHING_DELETE_ERROR]", deleteError);
      // Continue even if delete fails
    }

    // Upload new file to UploadThing
    const uploadedFiles = await utapi.uploadFiles([file]);
    const uploadedFile = uploadedFiles[0];

    if (!uploadedFile || !uploadedFile.data?.url) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Update resume record in database
    const updatedResume = await prisma.resume.update({
      where: { id: params.id },
      data: {
        filename: uploadedFile.data.name,
        originalUrl: uploadedFile.data.url,
        formatedUrl: null, // Reset formatted version
        formatedContent: null, // Reset formatted content
        updatedAt: new Date(),
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
      resume: updatedResume,
    });
  } catch (error) {
    console.error("[UPDATE_RESUME_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/mobile/resumes/{id}
 * Delete a resume
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify the resume exists and belongs to the candidate
    const resume = await prisma.resume.findFirst({
      where: {
        id: params.id,
        candidateId: candidate.id,
      },
      select: {
        id: true,
        originalUrl: true,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete file from UploadThing
    try {
      const urlParts = resume.originalUrl.split("/f/");
      if (urlParts.length > 1) {
        const fileKey = urlParts[1];
        await utapi.deleteFiles(fileKey);
      }
    } catch (deleteError) {
      console.error("[UPLOADTHING_DELETE_ERROR]", deleteError);
      // Continue even if delete fails
    }

    // Delete resume record from database
    await prisma.resume.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE_RESUME_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
