// Frontend-only repository layer.
// Supabase will be connected later by replacing these mock functions with real queries.
// Keep all data access behind this layer so RLS-aware Supabase calls can be added cleanly.

import { businesses, dashboardStats, documents, products, roadmap } from './mockData';

const wait = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMarketplaceProducts() {
  await wait();
  return products;
}

export async function getBusinesses() {
  await wait();
  return businesses;
}

export async function getBusinessDashboard() {
  await wait();
  return { stats: dashboardStats, documents };
}

export async function getRoadmap() {
  await wait();
  return roadmap;
}
