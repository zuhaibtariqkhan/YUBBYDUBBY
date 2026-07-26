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

async function testDistributionFix() {
  const [cats, p1, p2] = await Promise.all([
    fetch(`${url}/wp-json/wc/v3/products/categories?per_page=100`, { headers: { Authorization: `Basic ${auth}` } }).then(r => r.json()),
    fetch(`${url}/wp-json/wc/v3/products?per_page=100&page=1`, { headers: { Authorization: `Basic ${auth}` } }).then(r => r.json()),
    fetch(`${url}/wp-json/wc/v3/products?per_page=100&page=2`, { headers: { Authorization: `Basic ${auth}` } }).then(r => r.json()),
  ]);

  const allProducts = [...p1, ...p2];

  // Test Men's parent category resolution (filtering for top-level parent: 0)
  const parentObj = cats.find(c => {
    const s = (c.slug || "").toLowerCase();
    const n = (c.name || "").toLowerCase();
    const isTopLevel = c.parent === 0 || c.parent === undefined;
    return isTopLevel && (
      n === "men's fashion" || n === "mens fashion" || n === "men fashion" ||
      s === "mens-fashion" || s === "men-fashion" || s === "menswear" || s === "mens" || s === "men" ||
      ((s.includes("men") || n.includes("men")) && !s.includes("women") && !n.includes("women"))
    );
  });

  console.log('\nResolved Men parent category:', parentObj ? `ID ${parentObj.id} ("${parentObj.name}", slug: "${parentObj.slug}")` : 'NOT FOUND');

  if (parentObj) {
    const validCatIds = new Set([parentObj.id]);
    const validCatSlugs = new Set([parentObj.slug.toLowerCase()]);
    const childCats = cats.filter(c => c.parent === parentObj.id);
    childCats.forEach(c => {
      validCatIds.add(c.id);
      validCatSlugs.add(c.slug.toLowerCase());
    });

    console.log(`Child categories under Men's Fashion (${childCats.length}):`);
    childCats.forEach(c => console.log(`  - ID ${c.id}: "${c.name}" (slug: "${c.slug}", count: ${c.count})`));

    // Filter products matching Men's Fashion
    const menMatches = allProducts.filter(p => {
      const pCats = p.categories || [];
      return pCats.some(c => validCatIds.has(c.id) || validCatSlugs.has(c.slug.toLowerCase()));
    });

    console.log(`\nFound ${menMatches.length} products matching Men's Fashion category tree!`);
    console.log('Sample Men Products:');
    menMatches.slice(0, 15).forEach(p => {
      const cNames = (p.categories || []).map(c => c.name).join(', ');
      console.log(`  - ID: ${p.id} | "${p.name}" | Categories: [${cNames}]`);
    });
  }
}

testDistributionFix().catch(console.error);
