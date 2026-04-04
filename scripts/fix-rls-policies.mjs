import pg from "pg";

const client = new pg.Client({
  host: "db.hwiyjimmrsfjhkbdjfzq.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "gtf@dxb2026",
  ssl: { rejectUnauthorized: false },
});

const READ_TABLES = [
  "counties",
  "cities",
  "businesses",
  "service_types",
  "business_services",
  "content_pages",
  "establishment_types",
];

async function run() {
  await client.connect();
  console.log("Connected.\n");

  for (const table of READ_TABLES) {
    // Ensure RLS is enabled
    await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);

    // Drop existing policy if any (idempotent)
    await client.query(
      `DROP POLICY IF EXISTS "Allow public read" ON ${table};`
    );

    // Create public SELECT policy
    await client.query(
      `CREATE POLICY "Allow public read" ON ${table} FOR SELECT USING (true);`
    );

    console.log(`  ✓ ${table}: public SELECT policy added`);
  }

  // Leads table needs INSERT for anonymous form submissions
  await client.query(`ALTER TABLE leads ENABLE ROW LEVEL SECURITY;`);
  await client.query(`DROP POLICY IF EXISTS "Allow public insert" ON leads;`);
  await client.query(
    `CREATE POLICY "Allow public insert" ON leads FOR INSERT WITH CHECK (true);`
  );
  console.log(`  ✓ leads: public INSERT policy added`);

  // Verify
  const result = await client.query(`
    SELECT tablename, policyname, cmd
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
  `);
  console.log("\n=== All RLS policies ===");
  result.rows.forEach((r) =>
    console.log(`  ${r.tablename}: ${r.policyname} (${r.cmd})`)
  );

  await client.end();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
