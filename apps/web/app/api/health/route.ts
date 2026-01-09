import { NextResponse } from 'next/server';

let startTime = Date.now();
let pingCount = 0;

export async function GET() {
  pingCount++;
  
  return NextResponse.json({
    status: 'healthy',
    service: 'algoearth-web',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    totalPings: pingCount,
    environment: process.env.NODE_ENV || 'development'
  });
}

// Keep-alive mechanism for production
if (process.env.NODE_ENV === 'production') {
  const pingInterval = setInterval(async () => {
    try {
      const url = process.env.NEXTAUTH_URL;
      if (url) {
        await fetch(`${url}/api/health`, { 
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        console.log('✅ Keep-alive ping sent');
      }
    } catch (error: any) {
      console.error('❌ Keep-alive ping failed:', error.message);
    }
  }, 14 * 60 * 1000); // Ping every 14 minutes

  // Cleanup on exit
  process.on('SIGTERM', () => {
    clearInterval(pingInterval);
  });
}

