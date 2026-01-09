import { Prisma } from "@prisma/client";
import { db } from "./db";
import { updateContest, updateMemoryAndExecutionTime } from "./utils";
import http from 'http';

type SubmissionWithTestcases = Prisma.SubmissionGetPayload<{
  include: {
    testcases: true;
  };
}>;

async function updateSubmission(queued_Submission: SubmissionWithTestcases) {
  var isAcceptable = true;

  for (const testcase of queued_Submission?.testcases || []) {
    switch (testcase.status_id) {
      case 1:
      case 2:
        isAcceptable = false;
        break;
      case 3:
        break;
      default:
        isAcceptable = false;
        await db.submission.update({
          where: {
            id: queued_Submission.id,
          },
          data: {
            status: "REJECTED",
          },
        });
        return;
    }

    if (!isAcceptable) {
      break;
    }
  }

  if (isAcceptable && queued_Submission?.testcases) {
    updateMemoryAndExecutionTime(queued_Submission);
    if (queued_Submission?.activeContestId) {
      updateContest(queued_Submission);
    }
    await db.submission.update({
      where: {
        id: queued_Submission.id,
      },
      data: {
        status: "AC",
      },
    });
  }
}

async function runMainLoop() {
  while (true) {
    try {
      const submissions = await db.submission.findMany({
        orderBy: {
          id: "desc",
        },
        take: 20,
        include: {
          testcases: true,
        },
      });
      for (const submission of submissions || []) {
        await updateSubmission(submission);
      }
    } catch (err) {
      console.error("Error during processing:", err);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay of 1 second
  }
}

// Health check HTTP server for Render
const PORT = process.env.PORT || 3007;
let startTime = Date.now();
let healthCheckCount = 0;

const healthServer = http.createServer((req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    healthCheckCount++;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'algoearth-sweeper',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
      totalChecks: healthCheckCount,
      environment: process.env.NODE_ENV || 'development'
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

healthServer.listen(PORT, () => {
  console.log(`Sweeper health check server listening on port ${PORT}`);
});

// Keep-alive mechanism for production
if (process.env.NODE_ENV === 'production') {
  const SWEEPER_URL = process.env.SWEEPER_URL;
  
  if (SWEEPER_URL) {
    const pingInterval = setInterval(async () => {
      try {
        const response = await fetch(`${SWEEPER_URL}/health`);
        const data = await response.json();
        console.log('✅ Sweeper keep-alive:', data.status);
      } catch (error: any) {
        console.error('❌ Sweeper keep-alive failed:', error.message);
      }
    }, 14 * 60 * 1000); // Ping every 14 minutes

    process.on('SIGTERM', () => {
      clearInterval(pingInterval);
    });

    console.log('🔄 Keep-alive mechanism enabled for Sweeper');
  }
}

runMainLoop();
