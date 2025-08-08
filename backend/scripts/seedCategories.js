import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const categories = [
  // 🛡️ PROTECTION TYPES
  {
    name: 'Head Protection',
    slug: 'head-protection',
    type: 'protection_type',
    description: 'Helmets, bump caps, and headgear for impact protection',
    icon: '🪖',
    status: 'active',
    sortOrder: 1
  },
  {
    name: 'Eye Protection',
    slug: 'eye-protection',
    type: 'protection_type',
    description: 'Safety glasses, goggles, and face shields',
    icon: '🥽',
    status: 'active',
    sortOrder: 2
  },
  {
    name: 'Hearing Protection',
    slug: 'hearing-protection',
    type: 'protection_type',
    description: 'Earplugs, earmuffs, and acoustic protection gear',
    icon: '🔇',
    status: 'active',
    sortOrder: 3
  },
  {
    name: 'Hand Protection',
    slug: 'hand-protection',
    type: 'protection_type',
    description: 'Gloves for chemical, thermal, and mechanical hazards',
    icon: '🧤',
    status: 'active',
    sortOrder: 4
  },
  {
    name: 'Foot Protection',
    slug: 'foot-protection',
    type: 'protection_type',
    description: 'Steel-toe boots, anti-slip shoes, and metatarsal guards',
    icon: '🥾',
    status: 'active',
    sortOrder: 5
  },
  {
    name: 'Breathing Protection',
    slug: 'breathing-protection',
    type: 'protection_type',
    description: 'Respirators, masks, and air filtration systems',
    icon: '😷',
    status: 'active',
    sortOrder: 6
  },
  {
    name: 'Fall Protection',
    slug: 'fall-protection',
    type: 'protection_type',
    description: 'Harnesses, lanyards, and anchor systems for working at height',
    icon: '🪢',
    status: 'active',
    sortOrder: 7
  },
  {
    name: 'Thermal Protection',
    slug: 'thermal-protection',
    type: 'protection_type',
    description: 'Heat-resistant clothing and gear for high-temperature environments',
    icon: '🔥',
    status: 'active',
    sortOrder: 8
  },
  {
    name: 'Chemical Protection',
    slug: 'chemical-protection',
    type: 'protection_type',
    description: 'Hazmat suits, chemical-resistant gloves and aprons',
    icon: '🧪',
    status: 'active',
    sortOrder: 9
  },
  {
    name: 'Workwear & Clothing',
    slug: 'workwear-clothing',
    type: 'protection_type',
    description: 'High-vis vests, coveralls, and protective uniforms',
    icon: '🦺',
    status: 'active',
    sortOrder: 10
  },

  // 🏭 INDUSTRIES / SECTORS
  {
    name: 'Construction & Infrastructure',
    slug: 'construction-infrastructure',
    type: 'industry',
    description: 'Building sites, civil engineering, and infrastructure projects',
    icon: '🏗️',
    status: 'active',
    sortOrder: 1
  },
  {
    name: 'Manufacturing & Industrial',
    slug: 'manufacturing-industrial',
    type: 'industry',
    description: 'Factories, assembly lines, and industrial production',
    icon: '🏭',
    status: 'active',
    sortOrder: 2
  },
  {
    name: 'Healthcare & Medical',
    slug: 'healthcare-medical',
    type: 'industry',
    description: 'Hospitals, clinics, and medical laboratories',
    icon: '🏥',
    status: 'active',
    sortOrder: 3
  },
  {
    name: 'Oil, Gas & Energy',
    slug: 'oil-gas-energy',
    type: 'industry',
    description: 'Petroleum, gas extraction, and energy production',
    icon: '⛽',
    status: 'active',
    sortOrder: 4
  },
  {
    name: 'Mining & Quarrying',
    slug: 'mining-quarrying',
    type: 'industry',
    description: 'Underground mining, surface extraction, and quarries',
    icon: '⛏️',
    status: 'active',
    sortOrder: 5
  },
  {
    name: 'Agriculture & Farming',
    slug: 'agriculture-farming',
    type: 'industry',
    description: 'Crop production, livestock, and food processing',
    icon: '🚜',
    status: 'active',
    sortOrder: 6
  },
  {
    name: 'Transportation & Logistics',
    slug: 'transportation-logistics',
    type: 'industry',
    description: 'Warehousing, freight, and delivery operations',
    icon: '🚚',
    status: 'active',
    sortOrder: 7
  },
  {
    name: 'Utilities & Public Services',
    slug: 'utilities-public-services',
    type: 'industry',
    description: 'Water, electricity, sanitation, and municipal services',
    icon: '💡',
    status: 'active',
    sortOrder: 8
  },
  {
    name: 'Fire & Emergency Services',
    slug: 'fire-emergency-services',
    type: 'industry',
    description: 'Firefighters, rescue teams, and emergency responders',
    icon: '🚒',
    status: 'active',
    sortOrder: 9
  },
  {
    name: 'Laboratories & Research',
    slug: 'laboratories-research',
    type: 'industry',
    description: 'Scientific research, chemical labs, and testing facilities',
    icon: '🔬',
    status: 'active',
    sortOrder: 10
  }
];

async function seedCategories() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Clearing existing categories...');
    await Category.deleteMany({});

    console.log('🌱 Seeding categories...');
    const createdCategories = await Category.insertMany(categories);

    console.log(`✅ Created ${createdCategories.length} categories`);

    const protections = createdCategories.filter(c => c.type === 'protection_type');
    const industries = createdCategories.filter(c => c.type === 'industry');

    console.log(`🛡️ Protection Types (${protections.length}):`);
    protections.forEach(p => console.log(`   - ${p.icon} ${p.name}`));

    console.log(`🏭 Industries (${industries.length}):`);
    industries.forEach(i => console.log(`   - ${i.icon} ${i.name}`));

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedCategories();