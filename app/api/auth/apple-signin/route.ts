import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { identityToken } = await request.json();

    if (!identityToken) {
      return NextResponse.json(
        { error: 'Missing identityToken' },
        { status: 400 }
      );
    }

    try {
      // Decode Apple ID token (base64)
      // Apple ID token structure: header.payload.signature
      const tokenParts = identityToken.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Decode payload (user info is here)
      const payload = JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString()
      );

      const email = payload.email;
      const appleId = payload.sub;
      const isEmailVerified = payload.email_verified === 'true';

      // Generate app JWT token
      const appToken = jwt.sign(
        {
          email,
          appleId,
          provider: 'apple',
          isEmailVerified,
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // For testing: return mock user data
      // In production: query your database to find or create user
      const user = {
        id: appleId,
        email,
        name: payload.fullName || 'Apple User',
        provider: 'apple',
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        token: appToken,
        refreshToken: 'mock-refresh-token',
        user,
        accessToken: appToken,
      });

    } catch (tokenError) {
      console.error('Token decode error:', tokenError);
      return NextResponse.json(
        { error: 'Invalid Apple ID token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Apple sign-in error:', error);
    return NextResponse.json(
      { error: 'Apple sign-in failed' },
      { status: 500 }
    );
  }
}
