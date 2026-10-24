// 360 Coherent Sales Orders spanning 12 months for InsightIQ Analytics
import { initialProducts } from './products';
import { initialCustomers } from './customers';
import { initialRegions } from './regions';

const channels = ['Direct Web', 'Enterprise Sales', 'Partner Referral', 'Reseller Network'];
const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Processing', 'Delivered', 'Refunded'];

// Deterministic Pseudo-Random Generator
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const generateOrders = () => {
  const orders = [];
  const startDate = new Date('2025-10-20').getTime();
  const endDate = new Date('2026-10-19').getTime();
  const timeSpan = endDate - startDate;

  for (let i = 1; i <= 360; i++) {
    const seed = i * 1337;
    const progress = (i - 1) / 360;

    // Distribute dates across last 12 months with growing density in recent months
    const dateOffset = Math.floor(Math.pow(progress, 0.95) * timeSpan);
    const orderDate = new Date(startDate + dateOffset).toISOString().split('T')[0];

    // Pick customer and product deterministically
    const customer = initialCustomers[i % initialCustomers.length];
    const product = initialProducts[(i * 3) % initialProducts.length];
    const region = initialRegions[i % initialRegions.length];
    const channel = channels[(i * 7) % channels.length];

    // Order quantities: 1 to 5 units, occasionally larger for enterprise
    let quantity = 1;
    if (customer.segment === 'Enterprise') {
      quantity = 1 + Math.floor(seededRandom(seed + 1) * 4); // 1 to 4
    } else if (customer.segment === 'Mid-Market') {
      quantity = 1 + Math.floor(seededRandom(seed + 2) * 2); // 1 to 2
    }

    const unitPrice = product.unitPrice;
    const unitCost = product.unitCost;
    const grossAmount = quantity * unitPrice;

    // Status & Discounts
    let status = statuses[i % statuses.length];
    let discountAmount = 0;
    let refundAmount = 0;

    if (customer.segment === 'Enterprise' && quantity > 1) {
      discountAmount = Math.round(grossAmount * 0.10); // 10% volume discount
    } else if (i % 8 === 0) {
      discountAmount = Math.round(grossAmount * 0.05);
    }

    if (status === 'Refunded') {
      refundAmount = grossAmount - discountAmount;
    }

    const netAmount = Math.max(0, grossAmount - discountAmount - refundAmount);
    const totalCost = quantity * unitCost;
    const profit = status === 'Refunded' ? -Math.round(totalCost * 0.2) : netAmount - totalCost;

    orders.push({
      id: `ORD-2026-${String(i).padStart(4, '0')}`,
      orderDate,
      productId: product.id,
      productName: product.name,
      category: product.category,
      customerId: customer.id,
      customerName: customer.name,
      customerSegment: customer.segment,
      region: region.name,
      regionCode: region.code,
      salesChannel: channel,
      quantity,
      unitPrice,
      unitCost,
      grossAmount,
      discountAmount,
      refundAmount,
      netAmount,
      cost: totalCost,
      profit,
      status // 'Completed' | 'Processing' | 'Delivered' | 'Refunded'
    });
  }

  // Sort descending by date (most recent first)
  return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
};

export const initialOrders = generateOrders();
