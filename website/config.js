// ========== VOXEL.GG CONFIGURATION ==========
// Update this file with your Supabase Edge Function URL

// Replace 'your-project' with your actual Supabase project name
// Example: https://abcdefgh.supabase.co/functions/v1/voxel-api

window.VOXEL_CONFIG = {
  API_URL: 'https://jzhzbiwvdrwhycwidhmx.supabase.co/functions/v1/voxel-api',
  WEBSOCKET_URL: 'wss://jzhzbiwvdrwhycwidhmx.supabase.co/functions/v1/voxel-ws',
  BRAND: 'Voxel.gg',
  TIMEOUT: 30000,
};

// Make it global
const API_URL = window.VOXEL_CONFIG.API_URL;
