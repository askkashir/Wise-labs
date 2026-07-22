import type { FormSchema } from '../types'

/**
 * Founder Flightpath — WISE Lab Incubation Application Form.
 *
 * Field-for-field match to "WISE Incubation Application Form.docx" (the
 * ground-truth schema). Section order and every question follow the docx;
 * nothing added or removed. The "Applicant Signature" commitment is
 * implemented as a required consent checkbox rather than a signature field,
 * since this is a web form (per the master prompt's explicit instruction).
 */
export const founderFormSchema: FormSchema = {
  track: 'founder',
  title: 'Founder Flightpath — Incubation Application',
  subtitle:
    'For women founders and startup teams ready for incubation, validation, mentorship, pitch development, and investor readiness.',
  themeTrack: 'founder',
  submitLabel: 'Submit application',
  successTitle: 'Thank you, {firstName}.',
  successBody:
    "Your Founder Flightpath application is in. Our team will review it and reach out about next steps.",
  sections: [
    {
      id: 'startup-basics',
      title: 'Startup basics',
      fields: [
        {
          name: 'startupName',
          label: 'Startup name',
          type: 'text',
          required: true,
          placeholder: 'Your startup or venture name',
        },
        {
          name: 'vertical',
          label: 'Business / Innovation vertical',
          type: 'select',
          required: true,
          analytics: { dimension: 'vertical', kind: 'categorical' },
          options: [
            { value: 'ecommerce', label: 'E-Commerce / Online Store' },
            { value: 'fashion-apparel', label: 'Fashion & Apparel' },
            { value: 'beauty-wellness', label: 'Beauty, Wellness & Personal Care' },
            { value: 'food-beverages', label: 'Food & Beverages / Home-Based Food Business' },
            { value: 'handicrafts', label: 'Handicrafts / Artisanal Products' },
            { value: 'education-training', label: 'Education & Training (EdTech, Skills, Tutoring)' },
            { value: 'health-wellness', label: 'Health & Wellness (HealthTech, Fitness, Nutrition)' },
            { value: 'social-enterprise', label: 'Social Enterprise / Community Impact' },
            { value: 'creative-industries', label: 'Creative Industries (Design, Content, Photography, Crafts)' },
            { value: 'services', label: 'Services (Event Management, Marketing, Consultancy)' },
            { value: 'others', label: 'Others' },
          ],
        },
        {
          name: 'stage',
          label: 'Startup stage',
          type: 'select',
          required: true,
          analytics: { dimension: 'stage', kind: 'categorical' },
          options: [
            { value: 'idea', label: 'Idea' },
            { value: 'prototype', label: 'Prototype' },
            { value: 'mvp', label: 'MVP' },
            { value: 'established', label: 'Established Product/Service' },
          ],
        },
        {
          name: 'establishmentYear',
          label: 'Startup establishment year',
          type: 'number',
          required: true,
          placeholder: 'e.g. 2023',
        },
      ],
    },
    {
      id: 'idea-overview',
      title: 'Idea overview',
      fields: [
        {
          name: 'ideaBrief',
          label: 'Idea brief',
          type: 'textarea',
          required: true,
          placeholder: 'A short summary of your idea',
        },
        {
          name: 'productDescription',
          label: 'Product / service description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'valueProposition',
          label: 'Value proposition',
          type: 'textarea',
          required: true,
          helpText: 'What problem are you solving, and how is your solution unique?',
        },
        {
          name: 'targetMarket',
          label: 'Target market',
          type: 'textarea',
          required: true,
        },
        {
          name: 'customers',
          label: 'Customers',
          type: 'textarea',
          required: true,
        },
        {
          name: 'competition',
          label: 'Competition',
          type: 'textarea',
          required: true,
        },
        {
          name: 'coreStrength',
          label: 'Core strength / innovation',
          type: 'textarea',
          required: true,
        },
        {
          name: 'marketingStrategy',
          label: 'Marketing and sales strategy',
          type: 'textarea',
          required: true,
        },
        {
          name: 'onlinePresence',
          label: 'Online presence',
          type: 'text',
          placeholder: 'Website / Facebook / Instagram / TikTok / Other',
        },
        {
          name: 'revenueStreams',
          label: 'Revenue streams',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      id: 'team-details',
      title: 'Team details',
      fields: [
        {
          name: 'team',
          label: 'Team members',
          type: 'table',
          required: true,
          minRows: 1,
          columns: [
            { key: 'name', label: 'Name', type: 'text', required: true },
            { key: 'role', label: 'Role', type: 'text', required: true },
            { key: 'qualification', label: 'Qualification', type: 'text', required: true },
            { key: 'skillset', label: 'Skillset / Expertise', type: 'text', required: true },
            { key: 'city', label: 'City', type: 'text', required: true },
            { key: 'age', label: 'Age', type: 'number', required: true },
          ],
        },
      ],
    },
    {
      id: 'previous-experience',
      title: 'Previous experience',
      fields: [
        {
          name: 'hasLaunchedBusiness',
          label: 'Have you launched or managed a business before?',
          type: 'radio',
          required: true,
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          name: 'previousBusinessName',
          label: 'Name of previous business',
          type: 'text',
          conditional: { field: 'hasLaunchedBusiness', equals: 'yes' },
          required: true,
        },
        {
          name: 'hasIncubationExperience',
          label: 'Have you been part of any incubation / training program before?',
          type: 'radio',
          required: true,
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          name: 'incubationDetails',
          label: 'Incubation / training program details',
          type: 'textarea',
          conditional: { field: 'hasIncubationExperience', equals: 'yes' },
          required: true,
        },
      ],
    },
    {
      id: 'availability',
      title: 'Availability',
      fields: [
        {
          name: 'availableFullYear',
          label:
            'Will you be available for the next full year to incubate your startup at WISE Lab Islamabad?',
          type: 'radio',
          required: true,
          analytics: { dimension: 'availability', kind: 'boolean' },
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
      ],
    },
    {
      id: 'funding',
      title: 'Funding / investment',
      fields: [
        {
          name: 'hasFunding',
          label: 'Have you received funding / investment before?',
          type: 'radio',
          required: true,
          analytics: { dimension: 'funded', kind: 'boolean' },
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
        {
          name: 'fundingDetails',
          label: 'Funding / investment details',
          type: 'textarea',
          conditional: { field: 'hasFunding', equals: 'yes' },
          required: true,
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'Contact information',
      fields: [
        {
          name: 'primaryFounderName',
          label: 'Point of contact / primary founder',
          type: 'text',
          required: true,
        },
        {
          name: 'contactNumber',
          label: 'Contact number',
          type: 'tel',
          required: true,
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          patternMessage: 'Please enter a valid email.',
        },
        {
          name: 'cityProvince',
          label: 'City / Province',
          type: 'text',
          required: true,
          analytics: { dimension: 'city', kind: 'categorical' },
        },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          required: true,
          analytics: { dimension: 'gender', kind: 'categorical' },
          options: [
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
            { value: 'other', label: 'Other' },
            { value: 'prefer-not-to-say', label: 'Prefer not to say' },
          ],
        },
      ],
    },
    {
      id: 'how-did-you-hear',
      title: 'How did you hear about WISE Lab',
      fields: [
        {
          name: 'referralSource',
          label: 'How did you hear about WISE Lab?',
          type: 'select',
          required: true,
          analytics: { dimension: 'source', kind: 'categorical' },
          options: [
            { value: 'social-media', label: 'Social Media' },
            { value: 'peer-referral', label: 'Peer Referral' },
            { value: 'email', label: 'Email' },
            { value: 'print-electronic-media', label: 'Print / Electronic Media' },
            { value: 'others', label: 'Others' },
          ],
        },
      ],
    },
    {
      id: 'commitment',
      title: 'Commitment statement',
      fields: [
        {
          name: 'commitmentConsent',
          label:
            'I confirm my commitment to actively participate, attend mentoring sessions, and contribute to the growth of Pakistan’s women entrepreneurship ecosystem.',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
