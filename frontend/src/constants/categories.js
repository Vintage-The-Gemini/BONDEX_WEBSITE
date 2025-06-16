export const PROTECTION_CATEGORIES = {
  HEAD: {
    id: 'head',
    name: 'Head Protection',
    description: 'Hard hats, helmets, and comprehensive head safety equipment',
    icon: '👷',
    badge: 'head',
    color: 'primary',
    subcategories: [
      'Hard Hats & Safety Helmets',
      'Bump Caps & Skull Guards',
      'Welding Helmets',
      'Face Shields',
      'Hair Nets & Bouffant Caps',
      'Head Coverings & Hoods',
      'Climbing Helmets',
      'Electrical Safety Helmets',
      'High-Visibility Hard Hats',
      'Ventilated Hard Hats'
    ]
  },
  FOOT: {
    id: 'foot',
    name: 'Foot Protection',
    description: 'Safety boots, shoes, and comprehensive foot protection gear',
    icon: '👢',
    badge: 'foot',
    color: 'secondary',
    subcategories: [
      'Steel Toe Boots',
      'Composite Toe Shoes',
      'Slip Resistant Footwear',
      'Electrical Hazard Boots',
      'Chemical Resistant Boots',
      'Waterproof Safety Boots',
      'Insulated Winter Boots',
      'Metatarsal Guards',
      'Boot Covers & Overshoes',
      'Safety Sneakers',
      'Wellington Boots',
      'Cut Resistant Footwear'
    ]
  },
  EYE: {
    id: 'eye',
    name: 'Eye & Face Protection',
    description: 'Safety glasses, goggles, and comprehensive eye protection',
    icon: '👓',
    badge: 'eye',
    color: 'accent',
    subcategories: [
      'Safety Glasses',
      'Safety Goggles',
      'Face Shields',
      'Welding Helmets & Masks',
      'Prescription Safety Glasses',
      'Anti-Fog Safety Glasses',
      'Laser Safety Glasses',
      'Chemical Splash Goggles',
      'Dust & Debris Goggles',
      'Sports Safety Glasses',
      'Reading Safety Glasses',
      'Visitor Safety Glasses'
    ]
  },
  HAND: {
    id: 'hand',
    name: 'Hand & Arm Protection',
    description: 'Gloves and comprehensive hand/arm safety equipment',
    icon: '🧤',
    badge: 'hand',
    color: 'warning',
    subcategories: [
      'Work Gloves - General Purpose',
      'Cut Resistant Gloves',
      'Chemical Resistant Gloves',
      'Heat Resistant Gloves',
      'Cold Weather Gloves',
      'Disposable Gloves',
      'Welding Gloves',
      'Electrical Insulating Gloves',
      'Mechanics Gloves',
      'Food Service Gloves',
      'Arm Guards & Sleeves',
      'Puncture Resistant Gloves'
    ]
  },
  BREATHING: {
    id: 'breathing',
    name: 'Respiratory Protection',
    description: 'Respirators, masks, and breathing safety equipment',
    icon: '😷',
    badge: 'breathing',
    color: 'success',
    subcategories: [
      'N95 Respirators',
      'N99 & N100 Respirators',
      'P95 & P100 Respirators',
      'Half Face Respirators',
      'Full Face Respirators',
      'Powered Air Respirators',
      'Disposable Dust Masks',
      'Gas Masks',
      'Escape Respirators',
      'Surgical Masks',
      'Cartridges & Filters',
      'Airline Respirators'
    ]
  },
  HEARING: {
    id: 'hearing',
    name: 'Hearing Protection',
    description: 'Ear plugs, muffs, and hearing conservation equipment',
    icon: '🎧',
    badge: 'hearing',
    color: 'primary',
    subcategories: [
      'Foam Ear Plugs',
      'Silicone Ear Plugs',
      'Reusable Ear Plugs',
      'Corded Ear Plugs',
      'Ear Muffs',
      'Electronic Ear Muffs',
      'Helmet Mounted Ear Muffs',
      'Banded Hearing Protectors',
      'Custom Molded Ear Plugs',
      'Communication Headsets'
    ]
  },
  BODY: {
    id: 'body',
    name: 'Body Protection',
    description: 'Coveralls, vests, and body protection equipment',
    icon: '🦺',
    badge: 'body',
    color: 'warning',
    subcategories: [
      'High-Visibility Vests',
      'Safety Coveralls',
      'Chemical Protective Suits',
      'Disposable Coveralls',
      'Flame Resistant Clothing',
      'Arc Flash Protection',
      'Cooling Vests',
      'Rain Gear',
      'Aprons & Sleeves',
      'Back Support Belts',
      'Knee Pads',
      'Safety Shirts & Pants'
    ]
  },
  FALL: {
    id: 'fall',
    name: 'Fall Protection',
    description: 'Harnesses, lanyards, and fall arrest systems',
    icon: '🪂',
    badge: 'fall',
    color: 'danger',
    subcategories: [
      'Full Body Harnesses',
      'Safety Lanyards',
      'Self-Retracting Lifelines',
      'Anchor Points',
      'Safety Rope & Cable',
      'Positioning Belts',
      'Rescue Equipment',
      'Ladder Safety Systems',
      'Roof Safety Equipment',
      'Confined Space Equipment'
    ]
  },
  FIRST_AID: {
    id: 'first-aid',
    name: 'First Aid & Emergency',
    description: 'First aid supplies and emergency response equipment',
    icon: '🏥',
    badge: 'first-aid',
    color: 'danger',
    subcategories: [
      'First Aid Kits',
      'Bandages & Gauze',
      'Antiseptics & Ointments',
      'Emergency Eyewash',
      'Emergency Showers',
      'Spill Kits',
      'Emergency Blankets',
      'CPR Masks & Barriers',
      'Burn Care Products',
      'Blood Stop Products'
    ]
  },
  LOCKOUT: {
    id: 'lockout',
    name: 'Lockout/Tagout',
    description: 'LOTO devices and energy control systems',
    icon: '🔒',
    badge: 'lockout',
    color: 'black',
    subcategories: [
      'Padlocks & Locks',
      'Lockout Tags',
      'Circuit Breaker Lockouts',
      'Valve Lockouts',
      'Electrical Lockouts',
      'Lockout Stations',
      'Group Lockout Boxes',
      'Lockout Hasps',
      'Cable Lockouts',
      'Lockout Kits'
    ]
  }
}

export const getCategoryByID = (id) => {
  return Object.values(PROTECTION_CATEGORIES).find(category => category.id === id)
}

export const getAllCategories = () => {
  return Object.values(PROTECTION_CATEGORIES)
}

export const getCategorySubcategories = (categoryId) => {
  const category = getCategoryByID(categoryId)
  return category ? category.subcategories : []
}