import pg from "pg";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(__dirname, "..", "supabase", "schema.sql");
const sql = readFileSync(schemaPath, "utf-8");

const client = new pg.Client({
  host: "db.hwiyjimmrsfjhkbdjfzq.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "gtf@dxb2026",
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    console.log("Connecting to Supabase Postgres...");
    await client.connect();
    console.log("Connected. Executing schema...\n");

    await client.query(sql);
    console.log("Schema executed successfully!\n");

    // Verify tables
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    console.log("=== Tables created ===");
    tablesResult.rows.forEach((r) => console.log(`  - ${r.table_name}`));
    console.log(`  Total: ${tablesResult.rows.length}\n`);

    // Verify seed data counts
    const counts = await client.query(`
      SELECT 'counties' AS tbl, COUNT(*)::int AS cnt FROM counties
      UNION ALL
      SELECT 'service_types', COUNT(*)::int FROM service_types
      UNION ALL
      SELECT 'establishment_types', COUNT(*)::int FROM establishment_types;
    `);
    console.log("=== Seed data ===");
    counts.rows.forEach((r) => console.log(`  ${r.tbl}: ${r.cnt} rows`));

    // Verify indexes
    const indexes = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public' AND indexname LIKE 'idx_%'
      ORDER BY indexname;
    `);
    console.log(`\n=== Custom indexes: ${indexes.rows.length} ===`);
    indexes.rows.forEach((r) => console.log(`  - ${r.indexname}`));

  } catch (err) {
    console.error("ERROR:", err.message);
    if (err.message.includes("already exists")) {
      console.log("\nTables may already exist. Checking current state...");
      const tablesResult = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `);
      console.log("Existing tables:");
      tablesResult.rows.forEach((r) => console.log(`  - ${r.table_name}`));
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
