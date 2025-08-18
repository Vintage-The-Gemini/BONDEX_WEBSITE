// File Path: backend/scripts/seedCategories.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bondex-safety';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Enhanced Safety Equipment Categories
const safetyCategories = [
  {
    name: 'Head Protection',
    slug: 'head-protection',
    description: 'Safety helmets, hard hats, bump caps, and protective headgear for impact and electrical protection.',
    type: 'protection_type',
    icon: '⛑️',
    colors: {
      primary: '#FFD700',
      secondary: '#FFFACD'
    },
    status: 'active',
    sortOrder: 1,
    isFeatured: true,
    metaTitle: 'Head Protection Equipment - Safety Helmets & Hard Hats | Bondex Safety',
    metaDescription: 'Professional head protection equipment including safety helmets, hard hats, and industrial headgear. Certified protection for construction, mining, and workplace safety.',
    keywords: ['safety helmets', 'hard hats', 'head protection', 'construction helmets', 'industrial safety']
  },
  {
    name: 'Eye Protection',
    slug: 'eye-protection', 
    description: 'Safety glasses, goggles, face shields, and protective eyewear for impact, chemical splash, and UV protection.',
    type: 'protection_type',
    icon: '🥽',
    colors: {
      primary: '#4169E1',
      secondary: '#B0C4DE'
    },
    status: 'active',
    sortOrder: 2,
    isFeatured: true,
    metaTitle: 'Eye Protection Equipment - Safety Glasses & Goggles | Bondex Safety',
    metaDescription: 'Professional eye protection including safety glasses, goggles, and face shields. Protect against impact, chemical splash, and UV radiation.',
    keywords: ['safety glasses', 'safety goggles', 'eye protection', 'face shields', 'industrial eyewear']
  },
  {
    name: 'Hand Protection',
    slug: 'hand-protection',
    description: 'Safety gloves and hand protection for cut, chemical, thermal, and mechanical hazard protection.',
    type: 'protection_type', 
    icon: '🧤',
    colors: {
      primary: '#32CD32',
      secondary: '#98FB98'
    },
    status: 'active',
    sortOrder: 3,
    isFeatured: true,
    metaTitle: 'Hand Protection Equipment - Safety Gloves & Hand Gear | Bondex Safety',
    metaDescription: 'Professional hand protection including cut-resistant gloves, chemical-resistant gloves, and specialized hand protection for every industry.',
    keywords: ['safety gloves', 'hand protection', 'cut resistant gloves', 'chemical gloves', 'work gloves']
  },
  {
    name: 'Foot Protection',
    slug: 'foot-protection',
    description: 'Safety boots, shoes, and protective footwear with steel toes, slip resistance, and electrical hazard protection.',
    type: 'protection_type',
    icon: '👢',
    colors: {
      primary: '#8B4513',
      secondary: '#DEB887'
    },
    status: 'active',
    sortOrder: 4,
    isFeatured: true,
    metaTitle: 'Foot Protection Equipment - Safety Boots & Shoes | Bondex Safety',
    metaDescription: 'Professional foot protection including steel toe boots, slip-resistant shoes, and specialized safety footwear for construction and industrial work.',
    keywords: ['safety boots', 'steel toe shoes', 'foot protection', 'work boots', 'slip resistant shoes']
  },
  {
    name: 'Body Protection',
    slug: 'body-protection',
    description: 'Protective clothing, coveralls, aprons, and full-body protection against various workplace hazards.',
    type: 'protection_type',
    icon: '🦺',
    colors: {
      primary: '#FF6347',
      secondary: '#FFE4E1'
    },
    status: 'active',
    sortOrder: 5,
    isFeatured: true,
    metaTitle: 'Body Protection Equipment - Protective Clothing & Coveralls | Bondex Safety',
    metaDescription: 'Professional body protection including coveralls, protective suits, aprons, and full-body protection gear for industrial and chemical safety.',
    keywords: ['protective clothing', 'coveralls', 'body protection', 'safety suits', 'protective aprons']
  },
  {
    name: 'Respiratory Protection',
    slug: 'respiratory-protection',
    description: 'Respirators, masks, and breathing protection equipment for dust, chemical, and particle protection.',
    type: 'protection_type',
    icon: '😷',
    colors: {
      primary: '#DC143C',
      secondary: '#FFB6C1'
    },
    status: 'active',
    sortOrder: 6,
    isFeatured: true,
    metaTitle: 'Respiratory Protection Equipment - Masks & Respirators | Bondex Safety',
    metaDescription: 'Professional respiratory protection including N95 masks, respirators, and breathing apparatus for chemical, dust, and particle protection.',
    keywords: ['respirators', 'breathing protection', 'N95 masks', 'dust masks', 'chemical respirators']
  },
  {
    name: 'Hearing Protection',
    slug: 'hearing-protection',
    description: 'Ear plugs, ear muffs, and hearing protection equipment for noise control in industrial environments.',
    type: 'protection_type',
    icon: '🎧',
    colors: {
      primary: '#9370DB',
      secondary: '#E6E6FA'
    },
    status: 'active',
    sortOrder: 7,
    isFeatured: false,
    metaTitle: 'Hearing Protection Equipment - Ear Plugs & Ear Muffs | Bondex Safety',
    metaDescription: 'Professional hearing protection including ear plugs, ear muffs, and noise-canceling equipment for industrial and construction environments.',
    keywords: ['ear plugs', 'ear muffs', 'hearing protection', 'noise protection', 'industrial hearing safety']
  },
  {
    name: 'Fall Protection',
    slug: 'fall-protection',
    description: 'Harnesses, lanyards, anchor points, and fall arrest systems for working at height safety.',
    type: 'protection_type',
    icon: '🪢',
    colors: {
      primary: '#FF4500',
      secondary: '#FFEEE6'
    },
    status: 'active',
    sortOrder: 8,
    isFeatured: false,
    metaTitle: 'Fall Protection Equipment - Harnesses & Safety Lines | Bondex Safety',
    metaDescription: 'Professional fall protection including safety harnesses, lanyards, and fall arrest systems for construction and height work safety.',
    keywords: ['safety harnesses', 'fall protection', 'lanyards', 'fall arrest', 'height safety equipment']
  },
  {
    name: 'Workwear & Clothing',
    slug: 'workwear-clothing',
    description: 'High-visibility clothing, uniforms, coveralls, and professional workwear for safety and identification.',
    type: 'protection_type',
    icon: '👕',
    colors: {
      primary: '#FFA500',
      secondary: '#FFE4B5'
    },
    status: 'active',
    sortOrder: 9,
    isFeatured: true,
    metaTitle: 'Workwear & Clothing - High Visibility & Protective Clothing | Bondex Safety',
    metaDescription: 'Professional workwear including high visibility clothing, uniforms, coveralls, and specialized protective clothing for all industries.',
    keywords: ['high visibility clothing', 'workwear', 'uniforms', 'coveralls', 'protective clothing']
  },
  {
    name: 'Chemical Protection',
    slug: 'chemical-protection',
    description: 'Chemical-resistant suits, gloves, and equipment for handling hazardous materials and chemicals.',
    type: 'protection_type',
    icon: '🧪',
    colors: {
      primary: '#228B22',
      secondary: '#90EE90'
    },
    status: 'active',
    sortOrder: 10,
    isFeatured: false,
    metaTitle: 'Chemical Protection Equipment - Hazmat Suits & Chemical Gear | Bondex Safety',
    metaDescription: 'Professional chemical protection including hazmat suits, chemical-resistant gloves, and specialized equipment for handling dangerous chemicals.',
    keywords: ['chemical protection', 'hazmat suits', 'chemical resistant gloves', 'chemical safety equipment']
  },
  {
    name: 'Fire Protection',
    slug: 'fire-protection',
    description: 'Fire-resistant clothing, fire extinguishers, and firefighting equipment for fire safety and prevention.',
    type: 'protection_type',
    icon: '🔥',
    colors: {
      primary: '#B22222',
      secondary: '#FFA0A0'
    },
    status: 'active',
    sortOrder: 11,
    isFeatured: false,
    metaTitle: 'Fire Protection Equipment - Fire Resistant Clothing & Safety Gear | Bondex Safety',
    metaDescription: 'Professional fire protection including flame-resistant clothing, fire extinguishers, and firefighting safety equipment.',
    keywords: ['fire protection', 'flame resistant clothing', 'fire extinguishers', 'firefighting equipment']
  }
];

// Industry Categories
const industryCategories = [
  {
    name: 'Construction & Infrastructure',
    slug: 'construction-infrastructure',
    type: 'industry',
    description: 'Building sites, civil engineering, and infrastructure projects',
    icon: '🏗️',
    colors: {
      primary: '#FF8C00',
      secondary: '#FFE4B5'
    },
    status: 'active',
    sortOrder: 1,
    isFeatured: true,
    metaTitle: 'Construction Safety Equipment | Bondex Safety Kenya',
    metaDescription: 'Professional construction safety equipment including helmets, boots, gloves, and protective gear for building and construction work.',
    keywords: ['construction safety', 'building safety equipment', 'construction PPE', 'site safety gear']
  },
  {
    name: 'Manufacturing & Industrial',
    slug: 'manufacturing-industrial',
    type: 'industry',
    description: 'Factories, assembly lines, and industrial production',
    icon: '🏭',
    colors: {
      primary: '#4682B4',
      secondary: '#B0C4DE'
    },
    status: 'active',
    sortOrder: 2,
    isFeatured: true,
    metaTitle: 'Manufacturing Safety Equipment | Bondex Safety Kenya',
    metaDescription: 'Industrial safety equipment for manufacturing including protective gear, safety equipment, and PPE for production environments.',
    keywords: ['manufacturing safety', 'industrial PPE', 'factory safety equipment', 'production safety gear']
  },
  {
    name: 'Healthcare & Medical',
    slug: 'healthcare-medical',
    type: 'industry',
    description: 'Hospitals, clinics, and medical laboratories',
    icon: '🏥',
    colors: {
      primary: '#DC143C',
      secondary: '#FFB6C1'
    },
    status: 'active',
    sortOrder: 3,
    isFeatured: false,
    metaTitle: 'Healthcare Safety Equipment | Medical PPE | Bondex Safety Kenya',
    metaDescription: 'Medical safety equipment including gloves, masks, gowns, and healthcare PPE for hospitals and medical facilities.',
    keywords: ['medical PPE', 'healthcare safety', 'medical gloves', 'surgical masks', 'hospital safety equipment']
  },
  {
    name: 'Oil, Gas & Energy',
    slug: 'oil-gas-energy',
    type: 'industry',
    description: 'Petroleum, gas extraction, and energy production',
    icon: '⛽',
    colors: {
      primary: '#228B22',
      secondary: '#90EE90'
    },
    status: 'active',
    sortOrder: 4,
    isFeatured: false,
    metaTitle: 'Oil & Gas Safety Equipment | Bondex Safety Kenya',
    metaDescription: 'Specialized safety equipment for oil and gas operations including flame-resistant clothing, gas detection, and petroleum industry PPE.',
    keywords: ['oil and gas safety', 'petroleum industry PPE', 'flame resistant clothing', 'gas detection equipment']
  },
  {
    name: 'Mining & Quarrying',
    slug: 'mining-quarrying',
    type: 'industry',
    description: 'Underground mining, surface extraction, and quarries',
    icon: '⛏️',
    colors: {
      primary: '#2F4F4F',
      secondary: '#708090'
    },
    status: 'active',
    sortOrder: 5,
    isFeatured: false,
    metaTitle: 'Mining Safety Equipment | Heavy Duty PPE | Bondex Safety Kenya',
    metaDescription: 'Heavy-duty mining safety equipment including helmets, boots, protective clothing, and specialized PPE for mining operations.',
    keywords: ['mining safety equipment', 'mining PPE', 'quarrying safety', 'heavy duty protective gear']
  },
  {
    name: 'Agriculture & Farming',
    slug: 'agriculture-farming',
    type: 'industry',
    description: 'Crop production, livestock, and food processing',
    icon: '🚜',
    colors: {
      primary: '#8FBC8F',
      secondary: '#F0FFF0'
    },
    status: 'active',
    sortOrder: 6,
    isFeatured: false,
    metaTitle: 'Agriculture Safety Equipment | Farming PPE | Bondex Safety Kenya',
    metaDescription: 'Agricultural safety equipment including protective clothing, respiratory protection, and safety gear for farming and food processing.',
    keywords: ['agriculture safety', 'farming PPE', 'agricultural protective equipment', 'farm safety gear']
  },
  {
    name: 'Transportation & Logistics',
    slug: 'transportation-logistics',
    type: 'industry',
    description: 'Warehousing, freight, and delivery operations',
    icon: '🚚',
    colors: {
      primary: '#4169E1',
      secondary: '#B0C4DE'
    },
    status: 'active',
    sortOrder: 7,
    isFeatured: false,
    metaTitle: 'Transportation Safety Equipment | Logistics PPE | Bondex Safety Kenya',
    metaDescription: 'Transportation and logistics safety equipment including high-visibility clothing, safety boots, and protective gear for warehouse operations.',
    keywords: ['transportation safety', 'logistics PPE', 'warehouse safety equipment', 'delivery safety gear']
  },
  {
    name: 'Utilities & Public Services',
    slug: 'utilities-public-services',
    type: 'industry',
    description: 'Water, electricity, sanitation, and municipal services',
    icon: '💡',
    colors: {
      primary: '#FFD700',
      secondary: '#FFFACD'
    },
    status: 'active',
    sortOrder: 8,
    isFeatured: false,
    metaTitle: 'Utilities Safety Equipment | Public Services PPE | Bondex Safety Kenya',
    metaDescription: 'Safety equipment for utilities and public services including electrical protection, water treatment PPE, and municipal safety gear.',
    keywords: ['utilities safety', 'electrical protection', 'municipal safety equipment', 'public services PPE']
  },
  {
    name: 'Fire & Emergency Services',
    slug: 'fire-emergency-services',
    type: 'industry',
    description: 'Firefighters, rescue teams, and emergency responders',
    icon: '🚒',
    colors: {
      primary: '#B22222',
      secondary: '#FFA0A0'
    },
    status: 'active',
    sortOrder: 9,
    isFeatured: false,
    metaTitle: 'Fire & Emergency Safety Equipment | Bondex Safety Kenya',
    metaDescription: 'Professional firefighting and emergency response equipment including fire-resistant clothing, rescue gear, and emergency safety equipment.',
    keywords: ['firefighting equipment', 'emergency response gear', 'rescue equipment', 'fire safety gear']
  },
  {
    name: 'Laboratories & Research',
    slug: 'laboratories-research',
    type: 'industry',
    description: 'Scientific research, chemical labs, and testing facilities',
    icon: '🔬',
    colors: {
      primary: '#9370DB',
      secondary: '#E6E6FA'
    },
    status: 'active',
    sortOrder: 10,
    isFeatured: false,
    metaTitle: 'Laboratory Safety Equipment | Research PPE | Bondex Safety Kenya',
    metaDescription: 'Laboratory and research safety equipment including chemical protection, laboratory gloves, and scientific safety gear.',
    keywords: ['laboratory safety', 'research PPE', 'chemical protection', 'lab safety equipment']
  },
  {
    name: 'Tourism & Hospitality',
    slug: 'tourism-hospitality',
    type: 'industry',
    description: 'Hotels, resorts, tour operations, and hospitality services',
    icon: '🏨',
    colors: {
      primary: '#20B2AA',
      secondary: '#AFEEEE'
    },
    status: 'active',
    sortOrder: 11,
    isFeatured: false,
    metaTitle: 'Tourism & Hospitality Safety Equipment | Bondex Safety Kenya',
    metaDescription: 'Safety equipment for tourism and hospitality industry including first aid kits, emergency equipment, and staff safety gear.',
    keywords: ['tourism safety', 'hospitality PPE', 'hotel safety equipment', 'tour operator safety']
  },
  {
    name: 'Security Services',
    slug: 'security-services',
    type: 'industry',
    description: 'Private security firms, guard services, and protective services',
    icon: '🛡️',
    colors: {
      primary: '#000080',
      secondary: '#ADD8E6'
    },
    status: 'active',
    sortOrder: 12,
    isFeatured: false,
    metaTitle: 'Security Services Safety Equipment | Bondex Safety Kenya',
    metaDescription: 'Professional safety equipment for security personnel including protective gear, communication devices, and security uniforms.',
    keywords: ['security equipment', 'guard safety gear', 'protective services PPE', 'security uniforms']
  },
  {
    name: 'Corporate Institutions',
    slug: 'corporate-institutions',
    type: 'industry',
    description: 'Offices, corporate headquarters, and business facilities',
    icon: '🏢',
    colors: {
      primary: '#696969',
      secondary: '#D3D3D3'
    },
    status: 'active',
    sortOrder: 13,
    isFeatured: false,
    metaTitle: 'Corporate Safety Equipment | Office PPE | Bondex Safety Kenya',
    metaDescription: 'Safety equipment for corporate environments including first aid kits, emergency equipment, and office safety gear.',
    keywords: ['corporate safety', 'office PPE', 'business safety equipment', 'workplace safety gear']
  },
  {
    name: 'Education Institutions',
    slug: 'education-institutions',
    type: 'industry',
    description: 'Schools, universities, colleges, and training centers',
    icon: '🎓',
    colors: {
      primary: '#800080',
      secondary: '#D8BFD8'
    },
    status: 'active',
    sortOrder: 14,
    isFeatured: false,
    metaTitle: 'Education Safety Equipment | School PPE | Bondex Safety Kenya',
    metaDescription: 'Safety equipment for educational institutions including first aid kits, lab safety gear, and emergency equipment for schools and universities.',
    keywords: ['school safety', 'education PPE', 'university safety equipment', 'lab safety gear']
  }
];

// Seed function
const seedCategories = async () => {
  try {
    console.log('🌱 Starting category seeding...');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing categories');

    // Combine all categories
    const allCategories = [...safetyCategories, ...industryCategories];

    // Insert all categories
    const insertedCategories = await Category.insertMany(allCategories);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Separate and display by type
    const protectionTypes = insertedCategories.filter(cat => cat.type === 'protection_type');
    const industries = insertedCategories.filter(cat => cat.type === 'industry');

    console.log('\n📊 CATEGORY SEEDING SUMMARY:');
    console.log('================================');
    
    console.log(`\n🛡️ PROTECTION TYPES (${protectionTypes.length}):`);
    protectionTypes.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug})`);
    });
    
    console.log(`\n🏭 INDUSTRY CATEGORIES (${industries.length}):`);
    industries.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.slug})`);
    });

    console.log('\n✅ Category seeding completed successfully!');
    console.log('\n🔗 You can now use these category slugs in your frontend:');
    console.log('   - /products?category=head-protection');
    console.log('   - /products?category=body-protection');
    console.log('   - /products?category=workwear-clothing');
    console.log('   - /products?industry=construction-infrastructure');

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};

// Main execution function
const main = async () => {
  try {
    await connectDB();
    await seedCategories();
    console.log('\n🎉 All categories seeded successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your backend server: npm start');
    console.log('2. Test category endpoint: http://localhost:5000/api/categories');
    console.log('3. Test admin panel - should now show Body Protection and Workwear & Clothing');
    console.log('4. Add some products through the admin panel');
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeding
main();