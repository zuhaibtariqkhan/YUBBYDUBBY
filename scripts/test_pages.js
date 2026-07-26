const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
const envText = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envText.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    envVars[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const url = envVars.NEXT_PUBLIC_WOOCOMMERCE_URL;
const key = envVars.WOOCOMMERCE_CONSUMER_KEY;
const secret = envVars.WOOCOMMERCE_CONSUMER_SECRET;
const auth = Buffer.from(`${key}:${secret}`).toString('base64');

async function testPages() {
  console.log('Testing WooCommerce Men category direct query (category=24)...');
  const menRes = await fetch(`${url}/wp-json/wc/v3/products?category=24&per_page=100`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  const menProducts = await menRes.json();
  console.log(`Direct query category=24 returned: ${menProducts.length} Men products!`);
  menProducts.slice(0, 10).forEach(p => {
    const cats = (p.categories || []).map(c => c.name).join(', ');
    console.log(`- ID: ${p.id} | Name: "${p.name}" | Categories: [${cats}]`);
  });

  console.log('\nTesting fetching Page 1 & Page 2 & Page 3...');
  const p1Res = await fetch(`${url}/wp-json/wc/v3/products?per_page=100&page=1`, { headers: { Authorization: `Basic ${auth}` } });
  const p1 = await p1Res.json();
  const p2Res = await fetch(`${url}/wp-json/wc/v3/products?per_page=100&page=2`, { headers: { Authorization: `Basic ${auth}` } });
  const p2 = await p2Res.json();
  console.log(`Page 1 count: ${p1.length}, Page 2 count: ${p2.length}`);
}

testPages().catch(console.error);
