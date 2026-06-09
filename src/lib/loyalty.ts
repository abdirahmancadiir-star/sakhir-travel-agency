const LOYALTY_PROFILE_KEY = 'sakhir-loyalty-profile'
const REWARD_RULES_KEY = 'sakhir-reward-rules'
const MEMBERSHIP_LEVELS_KEY = 'sakhir-membership-levels'
const COUPONS_KEY = 'sakhir-coupons'
const REFERRALS_KEY = 'sakhir-referrals'

export type MembershipLevelName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export type RewardRule = {
  id: string
  name: string
  type: 'flight' | 'hotel' | 'tour' | 'cargo' | 'bonus'
  pointsRequired: number
  discount: string
  description: string
}

export type MembershipLevel = {
  name: MembershipLevelName
  minPoints: number
  benefits: string[]
}

export type Coupon = {
  id: string
  code: string
  type: 'fixed' | 'percentage'
  value: number
  service: 'Flights' | 'Hotels' | 'Tours' | 'Cargo' | 'All'
  expiryDate: string
  usageLimit: number
  usedCount: number
  active: boolean
}

export type ReferralRecord = {
  id: string
  referrerId: string
  referrerEmail: string
  referralCode: string
  invitedEmail: string
  status: 'pending' | 'completed'
  reward: string
  createdAt: string
}

export type LoyaltyProfile = {
  userId: string
  email: string
  points: number
  level: MembershipLevelName
  rewardsHistory: Array<{ id: string; label: string; points: number; status: string; createdAt: string }>
  referralCode: string
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getMemberLevel(points: number): MembershipLevelName {
  if (points >= 1600) return 'Platinum'
  if (points >= 900) return 'Gold'
  if (points >= 300) return 'Silver'
  return 'Bronze'
}

export function getDefaultRewardRules(): RewardRule[] {
  return [
    { id: 'r1', name: 'Flight Saver', type: 'flight', pointsRequired: 300, discount: '10% flight discount', description: 'Great for repeat flyers.' },
    { id: 'r2', name: 'Hotel Escape', type: 'hotel', pointsRequired: 450, discount: '15% hotel discount', description: 'Use on premium hotel bookings.' },
    { id: 'r3', name: 'Tour Explorer', type: 'tour', pointsRequired: 600, discount: '12% tour discount', description: 'Perfect for multi-day tours.' },
    { id: 'r4', name: 'Cargo Boost', type: 'cargo', pointsRequired: 800, discount: '8% cargo credit', description: 'For logistics and cargo requests.' },
  ]
}

export function getDefaultMembershipLevels(): MembershipLevel[] {
  return [
    { name: 'Bronze', minPoints: 0, benefits: ['1x points on bookings', 'Access to seasonal offers'] },
    { name: 'Silver', minPoints: 300, benefits: ['2x points on payments', 'Priority booking support'] },
    { name: 'Gold', minPoints: 900, benefits: ['3x points on referrals', 'Extra travel discounts'] },
    { name: 'Platinum', minPoints: 1600, benefits: ['VIP concierge, premium coupons & concierge support'] },
  ]
}

export function getDefaultCoupons(): Coupon[] {
  return [
    { id: 'c1', code: 'SAVE10', type: 'percentage', value: 10, service: 'Flights', expiryDate: '2026-12-31', usageLimit: 25, usedCount: 5, active: true },
    { id: 'c2', code: 'HOTEL15', type: 'percentage', value: 15, service: 'Hotels', expiryDate: '2026-09-30', usageLimit: 15, usedCount: 2, active: true },
    { id: 'c3', code: 'TRIP20', type: 'fixed', value: 20, service: 'All', expiryDate: '2026-11-15', usageLimit: 10, usedCount: 0, active: true },
  ]
}

export function getLoyaltyProfile(userId: string, email: string): LoyaltyProfile {
  const existing = readStorage<LoyaltyProfile | null>(LOYALTY_PROFILE_KEY + ':' + userId, null)
  if (existing) return existing

  const profile: LoyaltyProfile = {
    userId,
    email,
    points: 0,
    level: 'Bronze',
    rewardsHistory: [],
    referralCode: createReferralCode(email),
  }
  writeStorage(LOYALTY_PROFILE_KEY + ':' + userId, profile)
  return profile
}

export function updateLoyaltyProfile(profile: LoyaltyProfile) {
  writeStorage(LOYALTY_PROFILE_KEY + ':' + profile.userId, profile)
}

export function getRewardRules() {
  return readStorage<RewardRule[]>(REWARD_RULES_KEY, getDefaultRewardRules())
}

export function saveRewardRules(rules: RewardRule[]) {
  writeStorage(REWARD_RULES_KEY, rules)
}

export function getMembershipLevels() {
  return readStorage<MembershipLevel[]>(MEMBERSHIP_LEVELS_KEY, getDefaultMembershipLevels())
}

export function saveMembershipLevels(levels: MembershipLevel[]) {
  writeStorage(MEMBERSHIP_LEVELS_KEY, levels)
}

export function getCoupons() {
  return readStorage<Coupon[]>(COUPONS_KEY, getDefaultCoupons())
}

export function saveCoupons(coupons: Coupon[]) {
  writeStorage(COUPONS_KEY, coupons)
}

export function getReferrals() {
  return readStorage<ReferralRecord[]>(REFERRALS_KEY, [])
}

export function saveReferrals(referrals: ReferralRecord[]) {
  writeStorage(REFERRALS_KEY, referrals)
}

export function createReferralCode(email: string) {
  const base = (email.split('@')[0] || 'traveler').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
  return `${base}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

export function generateReferralLink(code: string) {
  return `${window.location.origin}/register?ref=${code}`
}
