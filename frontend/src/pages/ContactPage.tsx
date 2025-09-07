import React from 'react';
import {
  ContactHero,
  ContactInfoSection,
  ContactFormSection,
  EmergencyContactSection
} from '../components/contact';

/**
 * Contact page component with contact information and contact form
 * @returns JSX.Element
 */
const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ContactHero />
      <ContactInfoSection />
      <ContactFormSection />
      <EmergencyContactSection />
    </div>
  );
};

export default ContactPage;