"use client";

import { useEffect } from 'react';

export default function MembershipFormScript() {
  useEffect(() => {
    // Find the button by its ID
    const generalMembershipButton = document.getElementById('general-membership-form-link');
    
    // Add click event listener
    if (generalMembershipButton) {
      generalMembershipButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Replace this URL with the actual Google Form URL when provided
        window.open('https://forms.google.com/membership-form', '_blank');
      });
    }
  }, []);

  // This component doesn't render anything
  return null;
}