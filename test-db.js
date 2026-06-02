const fs = require('fs');
const path = require('path');

// Manually parse .env file
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Error loading .env", e);
}

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Checking DB with Driver Adapter...");
  const users = await prisma.user.findMany({ take: 5 });
  console.log("Users:", users.map(u => ({ id: u.id, email: u.email })));

  const progress = await prisma.progress.findMany({
    take: 10,
    orderBy: { completedAt: 'desc' }
  });
  console.log("Progress records:");
  console.log(progress);

  const completedCount = await prisma.progress.count({
    where: { completed: true }
  });
  console.log("Total completed items in DB:", completedCount);

  // Check if any completions exist with completedAt null
  const nullCompletions = await prisma.progress.count({
    where: { completed: true, completedAt: null }
  });
  console.log("Completed items with completedAt as null:", nullCompletions);
}

main()
  .catch(e => {
    console.error("Prisma error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
