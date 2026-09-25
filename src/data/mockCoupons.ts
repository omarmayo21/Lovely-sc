import { Coupon } from '../types';

export const mockCoupons: Coupon[] = [
  {
    id: 'c-1',
    code: 'LOVELY10',
    discountPercentage: 10,
    minOrderAmount: 500,
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 42,
  },
  {
    id: 'c-2',
    code: 'KBEAUTY15',
    discountPercentage: 15,
    minOrderAmount: 1000,
    expiryDate: '2026-10-31',
    isActive: true,
    usageCount: 19,
  },
  {
    id: 'c-3',
    code: 'MUSKI20',
    discountPercentage: 20,
    minOrderAmount: 1500,
    expiryDate: '2026-11-15',
    isActive: true,
    usageCount: 8,
  },
  {
    id: 'c-4',
    code: 'WELCOME5',
    discountPercentage: 5,
    minOrderAmount: 300,
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 67,
  },
];
