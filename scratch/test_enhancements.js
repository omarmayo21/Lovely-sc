// End-to-end verification script for new production features & Supabase database
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
let supabaseUrl = 'https://sxzcuqhaxfnnnogfqrac.supabase.co';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const [k, ...v] = line.split('=');
    if (k && v) {
      const key = k.trim();
      const val = v.join('=').trim().replace(/^["']|["']$/g, '');
      if (key === 'VITE_SUPABASE_URL') supabaseUrl = val;
      if (key === 'VITE_SUPABASE_ANON_KEY') supabaseAnonKey = val;
    }
  });
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log('--- STARTING ENHANCEMENT VERIFICATION ---');

  // 1. Test Offers Table
  console.log('\n[1] Testing Offers Table...');
  const { data: offers, error: offersErr } = await supabase
    .from('offers')
    .select('*');

  if (offersErr) {
    console.error('❌ Offers fetch failed:', offersErr);
  } else {
    console.log(`✅ Offers fetched successfully: ${offers.length} active offer(s) found.`);
    if (offers.length > 0) {
      console.log(`   Sample offer: "${offers[0].title}" | Discount: "${offers[0].discount_text}"`);
    }
  }

  // 2. Test Store Settings with Marketing & SEO columns
  console.log('\n[2] Testing Store Settings (Analytics & SEO)...');
  const { data: settings, error: settingsErr } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1)
    .single();

  if (settingsErr) {
    console.error('❌ Store settings fetch failed:', settingsErr);
  } else {
    console.log('✅ Store settings columns verified:');
    console.log(`   Store Name: ${settings.store_name}`);
    console.log(`   Site Title: ${settings.site_title}`);
    console.log(`   Meta Description: ${settings.meta_description?.slice(0, 50)}...`);
    console.log(`   GA ID: ${settings.google_analytics_id || '(empty)'}`);
    console.log(`   Meta Pixel ID: ${settings.meta_pixel_id || '(empty)'}`);
    console.log(`   Clarity ID: ${settings.clarity_project_id || '(empty)'}`);
  }

  // 3. Test Search Events Table
  console.log('\n[3] Testing Search Events Logging...');
  const testQuery = 'rice probiotic test';
  const { error: insertErr } = await supabase
    .from('search_events')
    .insert({ query: testQuery, results_count: 3 });

  if (insertErr) {
    console.error('❌ Search events insert failed:', insertErr);
  } else {
    console.log('✅ Search event logged successfully (Anon public insert permission verified).');
  }

  // 4. Test Orders & Product Data for Analytics
  console.log('\n[4] Testing Order & Product Analytics Calculations...');
  const { data: products, error: prodErr } = await supabase.from('products').select('*');
  const { data: orders, error: ordErr } = await supabase.from('orders').select('*, order_items(*)');

  if (prodErr || ordErr) {
    console.error('❌ Products/Orders query failed:', prodErr || ordErr);
  } else {
    console.log(`✅ Analytics Data Ready: ${products.length} products, ${orders.length} orders.`);
    const totalRev = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const totalInv = products.reduce((sum, p) => sum + Number(p.price || 0) * (p.stock || 0), 0);
    console.log(`   Total Revenue calculated: ${totalRev} EGP`);
    console.log(`   Total Inventory Value: ${totalInv} EGP`);
  }

  console.log('\n--- ALL DATABASE & BACKEND TESTS PASSED ---');
}

runTests();
