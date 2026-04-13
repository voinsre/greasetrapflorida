#!/usr/bin/env node
// Standalone script: pull last 30 days of GSC data for greasetrapflorida.com
// Usage: node pull-gsc-data.js

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const KEY_FILE = 'C:\\Users\\altas\\Projects\\gen-lang-client-0883509855-72a40f150171.json';
const SITE_URL = 'sc-domain:greasetrapflorida.com';
const OUTPUT_FILE = path.join(__dirname, 'gsc-raw-greasetrapflorida.json');

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

async function main() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const webmasters = google.webmasters({ version: 'v3', auth });

  const dimensions = ['page', 'query', 'device', 'country', 'date'];
  const ROW_LIMIT = 25000; // GSC API max per request
  let startRow = 0;
  const allRows = [];
  let lastResponseMeta = null;

  console.log(`Pulling GSC data for ${SITE_URL}`);
  console.log(`Date range: ${isoDate(start)} → ${isoDate(end)}`);
  console.log(`Dimensions: ${dimensions.join(', ')}`);

  while (true) {
    console.log(`  fetching rows ${startRow}..${startRow + ROW_LIMIT}`);
    const res = await webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: isoDate(start),
        endDate: isoDate(end),
        dimensions,
        rowLimit: ROW_LIMIT,
        startRow,
        dataState: 'all',
      },
    });

    lastResponseMeta = { responseAggregationType: res.data.responseAggregationType };
    const rows = res.data.rows || [];
    allRows.push(...rows);

    if (rows.length < ROW_LIMIT) break;
    startRow += ROW_LIMIT;
  }

  const output = {
    siteUrl: SITE_URL,
    startDate: isoDate(start),
    endDate: isoDate(end),
    dimensions,
    fetchedAt: new Date().toISOString(),
    totalRows: allRows.length,
    ...lastResponseMeta,
    rows: allRows,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${allRows.length} rows to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
