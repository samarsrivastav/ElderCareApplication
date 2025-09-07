import { Room } from '../models/Room';

/**
 * Sample room data for testing and demonstration
 */
export const sampleRooms = [
  {
    name: "Artha Senior Care - Assisted Living",
    facilityName: "Artha Senior Care",
    location: {
      city: "Gurugram",
      area: "Sector 53",
      address: "Sector 53, Gurugram, Haryana"
    },
    pricing: {
      rent: 70000,
      securityDeposit: 250000,
      admissionCharge: 20000,
      pettyCashReserve: 25000,
      currency: "INR"
    },
    roomType: "assisted_living",
    occupancy: "single",
    lengthOfStay: "long",
    careLevel: "high",
    description: "Artha Senior Care provides comprehensive assisted living, daycare, and memory care services for seniors in Gurugram. They provide round-the-clock nursing care, medication management, and help with everyday activities to ensure seniors have access to the support they need.",
    medicalServices: [
      "Round-the-clock nursing care",
      "Medication management",
      "Memory care for dementia and Alzheimer's",
      "Physiotherapy",
      "Pre-and post-operative care",
      "Regular health check-ups",
      "Doctor visits",
      "On-call ambulance services"
    ],
    lifestyle: {
      rating: 8,
      amenities: [
        "Private Balcony",
        "Sofa",
        "Air Conditioning",
        "Television",
        "Internet",
        "Bed & Mattress",
        "Elevator",
        "Fire Alarm"
      ]
    },
    medical: {
      rating: 9,
      services: [
        "24/7 medical support",
        "Specialized memory care",
        "Physiotherapy facility",
        "Blood sugar monitoring",
        "Blood pressure monitoring",
        "Post-surgery recovery support"
      ]
    },
    services: {
      rating: 8,
      offerings: [
        "Daily assistance with dressing",
        "Grooming and bathing support",
        "Meal preparation and dining",
        "Housekeeping services",
        "Laundry services",
        "Transportation for appointments"
      ]
    },
    community: {
      rating: 8,
      activities: [
        "Fitness classes",
        "Social events",
        "Indoor games (chess, carom)",
        "Arts and crafts",
        "Library access",
        "Festival celebrations"
      ]
    },
    facilities: {
      sharedSpaces: [
        "Lounge",
        "Library",
        "Central dining area",
        "Outdoor areas",
        "Visitor room",
        "Help desk"
      ],
      safetyFeatures: [
        "Fire alarm",
        "Power backup",
        "CCTV surveillance",
        "Fire extinguisher",
        "Emergency response system"
      ],
      accessibility: [
        "Wheelchair friendly",
        "Grab handles",
        "Elevator access",
        "Ramp access",
        "Wide doorways"
      ]
    },
    images: [
      "https://images.pexels.com/photos/33339522/pexels-photo-33339522.jpeg",
      "https://example.com/artha-caregivers.jpg",
      "https://example.com/artha-support.jpg"
    ],
    contactInfo: {
      phone: "+91-XXXXXXXXXX",
      email: "info@arthaseniorcare.com",
      website: "https://arthaseniorcare.com"
    }
  },
  {
    name: "Aurum Senior and Assisted Living",
    facilityName: "Aurum Senior Living",
    location: {
      city: "Gurugram",
      area: "Sector 54",
      address: "Sector 54, Gurugram, Haryana"
    },
    pricing: {
      rent: 70000,
      securityDeposit: 200000,
      admissionCharge: 15000,
      pettyCashReserve: 20000,
      currency: "INR"
    },
    roomType: "assisted_living",
    occupancy: "double",
    lengthOfStay: "medium",
    careLevel: "medium",
    description: "Aurum Senior Living offers premium assisted living services with a focus on community and wellness. The facility provides personalized care plans and modern amenities for comfortable senior living.",
    medicalServices: [
      "24/7 nursing care",
      "Medication management",
      "Health monitoring",
      "Emergency response",
      "Regular health check-ups"
    ],
    lifestyle: {
      rating: 9,
      amenities: [
        "Private Balcony",
        "Air Conditioning",
        "Television",
        "Internet",
        "Bed & Mattress",
        "Elevator",
        "Fire Alarm",
        "Power Backup"
      ]
    },
    medical: {
      rating: 8,
      services: [
        "Basic medical support",
        "Health monitoring",
        "Emergency response",
        "Regular check-ups"
      ]
    },
    services: {
      rating: 9,
      offerings: [
        "Personal care assistance",
        "Meal services",
        "Housekeeping",
        "Laundry",
        "Transportation"
      ]
    },
    community: {
      rating: 9,
      activities: [
        "Wellness programs",
        "Social activities",
        "Recreational events",
        "Community dining",
        "Outdoor activities"
      ]
    },
    facilities: {
      sharedSpaces: [
        "Community lounge",
        "Dining hall",
        "Garden area",
        "Activity room",
        "Reception area"
      ],
      safetyFeatures: [
        "Security system",
        "Emergency alarms",
        "Fire safety",
        "24/7 monitoring"
      ],
      accessibility: [
        "Wheelchair accessible",
        "Elevator access",
        "Ramp access",
        "Wide corridors"
      ]
    },
    images: [
      "https://images.pexels.com/photos/33339522/pexels-photo-33339522.jpeg",
      "https://example.com/aurum-amenities.jpg"
    ],
    contactInfo: {
      phone: "+91-XXXXXXXXXX",
      email: "info@aurumseniorliving.com"
    }
  },
  {
    name: "NEMA Eldercare",
    facilityName: "NEMA Eldercare",
    location: {
      city: "Gurugram",
      area: "Sector 56",
      address: "Sector 56, Gurugram, Haryana"
    },
    pricing: {
      rent: 100000,
      securityDeposit: 300000,
      admissionCharge: 25000,
      pettyCashReserve: 30000,
      currency: "INR"
    },
    roomType: "independent_living",
    occupancy: "single",
    lengthOfStay: "long",
    careLevel: "low",
    description: "NEMA Eldercare specializes in independent living with premium amenities and luxury services. The facility offers high-end accommodations with optional care services.",
    medicalServices: [
      "Basic health monitoring",
      "Emergency response",
      "Optional nursing care",
      "Health check-ups",
      "Wellness programs"
    ],
    lifestyle: {
      rating: 10,
      amenities: [
        "Luxury furnishings",
        "Premium appliances",
        "High-speed internet",
        "Smart home features",
        "Private garden",
        "Concierge services"
      ]
    },
    medical: {
      rating: 7,
      services: [
        "Basic health support",
        "Emergency response",
        "Optional care services"
      ]
    },
    services: {
      rating: 10,
      offerings: [
        "Concierge services",
        "Housekeeping",
        "Laundry",
        "Transportation",
        "Personal assistance"
      ]
    },
    community: {
      rating: 10,
      activities: [
        "Luxury events",
        "Fine dining",
        "Cultural activities",
        "Wellness programs",
        "Social gatherings"
      ]
    },
    facilities: {
      sharedSpaces: [
        "Luxury lounge",
        "Fine dining restaurant",
        "Spa and wellness center",
        "Library",
        "Business center"
      ],
      safetyFeatures: [
        "Advanced security",
        "Emergency systems",
        "Fire safety",
        "24/7 monitoring"
      ],
      accessibility: [
        "Premium accessibility",
        "Elevator access",
        "Wide spaces",
        "Luxury accommodations"
      ]
    },
    images: [
      "https://images.pexels.com/photos/33339522/pexels-photo-33339522.jpeg",
      "https://example.com/nema-amenities.jpg"
    ],
    contactInfo: {
      phone: "+91-XXXXXXXXXX",
      email: "info@nemaeldercare.com"
    }
  }
];

/**
 * Seed the database with sample room data
 */
export const seedRooms = async (): Promise<void> => {
  try {
    // Clear existing rooms
    await Room.deleteMany({});
    
    // Insert sample rooms
    await Room.insertMany(sampleRooms);
    
    console.log('✅ Sample rooms seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
  }
};
