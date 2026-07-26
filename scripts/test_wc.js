const fs = require('fs');
const path = require('path');

// Read .env.local manually
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

async function testWc() {
  console.log('Fetching WooCommerce Categories...');
  const catRes = await fetch(`${url}/wp-json/wc/v3/products/categories?per_page=100`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  const categories = await catRes.json();
  console.log('--- WOOCOMMERCE CATEGORIES ---');
  categories.forEach(c => {
    console.log(`ID: ${c.id} | Name: "${c.name}" | Slug: "${c.slug}" | Parent: ${c.parent} | Count: ${c.count}`);
  });

  console.log('\nFetching WooCommerce Products...');
  const prodRes = await fetch(`${url}/wp-json/wc/v3/products?per_page=100`, {
    headers: { Authorization: `Basic ${auth}` }
  });
  const products = await prodRes.json();
  console.log(`--- FETCHED ${products.length} PRODUCTS ---`);
  products.slice(0, 15).forEach(p => {
    const catList = (p.categories || []).map(c => `${c.name} (id:${c.id}, slug:${c.slug})`).join(', ');
    console.log(`ID: ${p.id} | Name: "${p.name}" | Categories: [${catList}]`);
  });
}

testWc().catch(console.error);
