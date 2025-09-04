/**
 * Contact information data for Contact page
 */
export const getContactInfoData = () => [
  {
    icon: 'PhoneOutlined',
    title: 'Phone',
    details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    description: 'Available 24/7 for emergencies'
  },
  {
    icon: 'MailOutlined',
    title: 'Email',
    details: ['info@eldercare.com', 'support@eldercare.com'],
    description: 'We respond within 2 hours'
  },
  {
    icon: 'EnvironmentOutlined',
    title: 'Address',
    details: ['123 Care Street', 'Health City, HC 12345'],
    description: 'Visit us anytime'
  },
  {
    icon: 'ClockCircleOutlined',
    title: 'Hours',
    details: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Sat-Sun: 9:00 AM - 4:00 PM'],
    description: 'Emergency care available 24/7'
  }
];

/**
 * Facility locations data for Contact page
 */
export const getFacilityLocationsData = () => [
  {
    name: 'Main Facility',
    address: '123 Care Street, Health City, HC 12345',
    phone: '+1 (555) 123-4567',
    services: ['Assisted Living', 'Memory Care', 'Rehabilitation']
  },
  {
    name: 'North Branch',
    address: '456 Wellness Avenue, Health City, HC 12346',
    phone: '+1 (555) 234-5678',
    services: ['Independent Living', 'Day Care', 'Respite Care']
  },
  {
    name: 'South Branch',
    address: '789 Comfort Lane, Health City, HC 12347',
    phone: '+1 (555) 345-6789',
    services: ['Skilled Nursing', 'Hospice Care', 'Family Support']
  }
];

/**
 * Emergency contact information
 */
export const getEmergencyContactData = () => ({
  phone: '+1 (555) 123-4567',
  description: 'For urgent medical emergencies or immediate assistance, call our 24/7 emergency line'
});
