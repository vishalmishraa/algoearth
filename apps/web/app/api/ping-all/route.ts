import { NextResponse } from 'next/server';

const SERVICES = [
  { 
    name: 'Web App', 
    url: process.env.NEXTAUTH_URL + '/api/health',
    required: true 
  },
  { 
    name: 'Compiler', 
    url: (process.env.JUDGE0_URI || process.env.COMPILER_URL) + '/health',
    required: true 
  },
  { 
    name: 'Worker', 
    url: process.env.WORKER_URL + '/health',
    required: true 
  },
  { 
    name: 'Sweeper', 
    url: process.env.SWEEPER_URL + '/health',
    required: true 
  },
];

export async function GET() {
  const results = await Promise.allSettled(
    SERVICES.filter(s => s.url && s.url !== 'undefined/health').map(async (service) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(service.url, { 
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeout);
        const data = await response.json();
        
        return {
          service: service.name,
          status: response.ok ? 'healthy' : 'error',
          statusCode: response.status,
          data
        };
      } catch (error: any) {
        return {
          service: service.name,
          status: 'error',
          error: error.message
        };
      }
    })
  );

  const servicesStatus = results.map((r, i) => {
    const service = SERVICES.filter(s => s.url && s.url !== 'undefined/health')[i];
    return {
      ...service,
      ...(r.status === 'fulfilled' ? r.value : { 
        status: 'failed', 
        error: r.reason?.message || 'Unknown error' 
      })
    };
  });

  const allHealthy = servicesStatus.every(s => s.status === 'healthy');

  return NextResponse.json({
    status: allHealthy ? 'all_healthy' : 'some_unhealthy',
    timestamp: new Date().toISOString(),
    services: servicesStatus
  }, {
    status: allHealthy ? 200 : 503
  });
}

// Auto-ping all services every 10 minutes in production
if (process.env.NODE_ENV === 'production') {
  const pingAllInterval = setInterval(async () => {
    try {
      const url = process.env.NEXTAUTH_URL;
      if (url) {
        const response = await fetch(`${url}/api/ping-all`, {
          signal: AbortSignal.timeout(30000) // 30s for all services
        });
        const data = await response.json();
        console.log('✅ All services pinged:', data.status);
      }
    } catch (error: any) {
      console.error('❌ Ping all failed:', error.message);
    }
  }, 10 * 60 * 1000);

  process.on('SIGTERM', () => {
    clearInterval(pingAllInterval);
  });
}

