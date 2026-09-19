const url = process.env.APP_URL;

if (!url) {
  console.error("APP_URL env var not set");
  process.exit(1);
}

const target = new URL("/api/health", url).toString();

const res = await fetch(target);
if (!res.ok) {
  console.error(`Ping failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}

console.log(`Ping ok: ${target} -> ${res.status}`);
