export const INDUSTRIES = {
  MEDICAL: {
    id: 'medical',
    name: 'Healthcare & Medical',
    description: 'Medical facilities, hospitals, clinics, and healthcare providers',
    icon: '🏥',
    color: 'primary',
    requirements: [
      'Infection Control',
      'Sterilization Compatibility',
      'Chemical Resistance',
      'Comfort for Extended Use',
      'FDA Compliance',
      'Latex-Free Options'
    ],
    subcategories: [
      'Hospitals & Clinics',
      'Dental Offices',
      'Laboratories',
      'Pharmaceutical',
      'Emergency Medical Services',
      'Veterinary Clinics',
      'Long-term Care Facilities',
      'Home Healthcare'
    ]
  },
  CONSTRUCTION: {
    id: 'construction',
    name: 'Construction & Building',
    description: 'Construction sites, building projects, and infrastructure development',
    icon: '🏗️',
    color: 'secondary',
    requirements: [
      'Impact Resistance',
      'High Visibility',
      'Weather Resistance',
      'Durability & Longevity',
      'OSHA Compliance',
      'Multi-Hazard Protection'
    ],
    subcategories: [
      'General Construction',
      'Road Construction',
      'Bridge & Infrastructure',
      'Residential Building',
      'Commercial Construction',
      'Demolition',
      'Excavation & Earthwork',
      'Roofing & Siding'
    ]
  },
  MANUFACTURING: {
    id: 'manufacturing',
    name: 'Manufacturing & Industrial',
    description: 'Factories, plants, and industrial manufacturing facilities',
    icon: '🏭',
    color: 'accent',
    requirements: [
      'Chemical Protection',
      'Heat & Flame Resistance',
      'Cut & Puncture Protection',
      'Machine Safety',
      'Static Dissipation',
      'Precision Grip'
    ],
    subcategories: [
      'Automotive Manufacturing',
      'Food Processing',
      'Chemical Plants',
      'Steel & Metalworking',
      'Electronics Assembly',
      'Textile Manufacturing',
      'Packaging & Shipping',
      'Quality Control'
    ]
  },
  OIL_GAS: {
    id: 'oil-gas',
    name: 'Oil, Gas & Petrochemical',
    description: 'Oil refineries, gas plants, and petrochemical facilities',
    icon: '⛽',
    color: 'black',
    requirements: [
      'Flame Resistance',
      'Chemical Protection',
      'Static Dissipation',
      'Extreme Weather Protection',
      'Arc Flash Protection',
      'H2S Protection'
    ],
    subcategories: [
      'Oil Refineries',
      'Natural Gas Plants',
      'Offshore Platforms',
      'Pipeline Operations',
      'Petrochemical Plants',
      'Tank Farms',
      'Drilling Operations',
      'Marine Terminals'
    ]
  },
  MINING: {
    id: 'mining',
    name: 'Mining & Extraction',
    description: 'Underground and surface mining operations',
    icon: '⛏️',
    color: 'warning',
    requirements: [
      'MSHA Compliance',
      'Dust Protection',
      'Impact Resistance',
      'Cut Protection',
      'Visibility in Low Light',
      'Slip Resistance'
    ],
    subcategories: [
      'Coal Mining',
      'Metal Mining',
      'Quarries & Aggregates',
      'Underground Operations',
      'Surface Mining',
      'Mineral Processing',
      'Mine Maintenance',
      'Exploration'
    ]
  },
  UTILITIES: {
    id: 'utilities',
    name: 'Utilities & Energy',
    description: 'Power plants, water treatment, and utility services',
    icon: '⚡',
    color: 'primary',
    requirements: [
      'Electrical Protection',
      'Arc Flash Resistance',
      'Chemical Resistance',
      'High Visibility',
      'Weather Protection',
      'Confined Space Safety'
    ],
    subcategories: [
      'Electric Utilities',
      'Water Treatment',
      'Waste Management',
      'Telecommunications',
      'Nuclear Facilities',
      'Solar & Wind Energy',
      'Maintenance & Repair',
      'Emergency Response'
    ]
  },
  AGRICULTURE: {
    id: 'agriculture',
    name: 'Agriculture & Farming',
    description: 'Farms, ranches, and agricultural operations',
    icon: '🚜',
    color: 'success',
    requirements: [
      'Chemical Resistance',
      'Weather Protection',
      'Cut Protection',
      'Comfort & Flexibility',
      'Easy Cleaning',
      'UV Protection'
    ],
    subcategories: [
      'Crop Production',
      'Livestock Operations',
      'Dairy Farming',
      'Poultry Operations',
      'Greenhouse & Nursery',
      'Equipment Operation',
      'Pest Control',
      'Harvesting'
    ]
  },
  TRANSPORTATION: {
    id: 'transportation',
    name: 'Transportation & Logistics',
    description: 'Shipping, trucking, rail, and aviation industries',
    icon: '🚛',
    color: 'secondary',
    requirements: [
      'High Visibility',
      'Weather Protection',
      'Slip Resistance',
      'DOT Compliance',
      'Comfort for Long Shifts',
      'Multi-Environment Use'
    ],
    subcategories: [
      'Trucking & Freight',
      'Aviation',
      'Maritime & Shipping',
      'Rail Transportation',
      'Warehousing',
      'Package Delivery',
      'Ground Handling',
      'Maintenance Operations'
    ]
  },
  EMERGENCY: {
    id: 'emergency',
    name: 'Emergency Services',
    description: 'Fire departments, police, and emergency responders',
    icon: '🚨',
    color: 'danger',
    requirements: [
      'NFPA Compliance',
      'High Visibility',
      'Multi-Hazard Protection',
      'Mobility & Flexibility',
      'Communication Integration',
      'Quick Donning'
    ],
    subcategories: [
      'Fire Departments',
      'Police & Law Enforcement',
      'Emergency Medical Services',
      'Search & Rescue',
      'Hazmat Response',
      'Disaster Response',
      'Security Services',
      'Military Operations'
    ]
  },
  EDUCATION: {
    id: 'education',
    name: 'Education & Research',
    description: 'Schools, universities, and research institutions',
    icon: '🎓',
    color: 'primary',
    requirements: [
      'Student Safety',
      'Chemical Resistance',
      'Easy Maintenance',
      'Cost Effectiveness',
      'Multiple Size Options',
      'Educational Compliance'
    ],
    subcategories: [
      'K-12 Schools',
      'Universities & Colleges',
      'Research Laboratories',
      'Vocational Training',
      'Science Education',
      'Engineering Programs',
      'Art & Design Studios',
      'Maintenance & Facilities'
    ]
  }
}

export const getIndustryByID = (id) => {
  return Object.values(INDUSTRIES).find(industry => industry.id === id)
}

export const getAllIndustries = () => {
  return Object.values(INDUSTRIES)
}

export const getIndustrySubcategories = (industryId) => {
  const industry = getIndustryByID(industryId)
  return industry ? industry.subcategories : []
}