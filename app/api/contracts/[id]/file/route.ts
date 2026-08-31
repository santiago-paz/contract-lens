import { prisma } from '@/lib/prisma';
import { getSessionWithOrg } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { decryptBuffer } from '@/lib/encryption';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionWithOrg();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const resolvedParams = await params;
  const contract = await prisma.contract.findUnique({
    where: {
      id: resolvedParams.id,
      organizationId: session.orgId,
    },
    select: {
      fileData: true,
      fileName: true
    }
  });

  if (!contract || !contract.fileData) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Determine content type
  const ext = contract.fileName?.split('.').pop()?.toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === 'pdf') contentType = 'application/pdf';
  if (ext === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const decryptedData = decryptBuffer(contract.fileData);

  // fileName is user-controlled (it's the uploaded file's name), so never
  // interpolate it raw into the header. Build an ASCII-safe fallback plus an
  // RFC 5987 filename* for the real name to avoid header injection.
  const rawName = contract.fileName || 'document';
  const asciiName = rawName.replace(/[^\x20-\x7e]/g, '_').replace(/["\\\r\n]/g, '_');
  const encodedName = encodeURIComponent(rawName);
  const contentDisposition = `attachment; filename="${asciiName}"; filename*=UTF-8''${encodedName}`;

  return new NextResponse(decryptedData as any, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
