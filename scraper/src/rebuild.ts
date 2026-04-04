export async function triggerRebuild(dryRun: boolean): Promise<boolean> {
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) {
    console.log("VERCEL_DEPLOY_HOOK not set — skipping rebuild");
    return false;
  }

  if (dryRun) {
    console.log("DRY RUN: Would trigger Vercel rebuild");
    return false;
  }

  try {
    const res = await fetch(hook, { method: "POST" });
    if (!res.ok) {
      console.error(`Vercel rebuild failed: ${res.status} ${res.statusText}`);
      return false;
    }
    console.log(`Vercel rebuild triggered at ${new Date().toISOString()}`);
    return true;
  } catch (err) {
    console.error("Failed to trigger Vercel rebuild:", err);
    return false;
  }
}
