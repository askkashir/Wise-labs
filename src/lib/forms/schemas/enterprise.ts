import type { FormSchema } from '../types'

/**
 * Enterprise Flightpath — MSME Training application.
 * No authoritative docx exists for this track (unlike Founder Flightpath),
 * so this schema is drafted from the Website Content Brief's description of
 * the track: "women-led small businesses and home-based entrepreneurs
 * seeking business training, digital skills, visibility, and market access."
 * Mirrors the Founder schema's shape/sections where sensible so the two
 * forms feel like one system.
 *
 * All human-readable `label`/`title`/`placeholder`/`helpText` strings are
 * i18n key paths (looked up via `t()` in DynamicForm.tsx), not literal
 * English — see src/i18n/locales/en.json under `forms.enterprise`. The
 * `name`/`dimension` values below are stable analytics keys and are never
 * translated.
 */
export const enterpriseFormSchema: FormSchema = {
  track: 'enterprise',
  title: 'forms.enterprise.meta.title',
  subtitle: 'forms.enterprise.meta.subtitle',
  themeTrack: 'enterprise',
  submitLabel: 'forms.enterprise.meta.submitLabel',
  successTitle: 'forms.enterprise.meta.successTitle',
  successBody: 'forms.enterprise.meta.successBody',
  sections: [
    {
      id: 'business-basics',
      title: 'forms.enterprise.sections.business-basics.title',
      fields: [
        { name: 'businessName', label: 'forms.enterprise.businessName.label', type: 'text', required: true },
        {
          name: 'vertical',
          label: 'forms.enterprise.vertical.label',
          type: 'select',
          required: true,
          analytics: { dimension: 'vertical', kind: 'categorical' },
          options: [
            { value: 'ecommerce', label: 'forms.enterprise.vertical.options.ecommerce' },
            { value: 'fashion-apparel', label: 'forms.enterprise.vertical.options.fashion-apparel' },
            { value: 'beauty-wellness', label: 'forms.enterprise.vertical.options.beauty-wellness' },
            { value: 'food-beverages', label: 'forms.enterprise.vertical.options.food-beverages' },
            { value: 'handicrafts', label: 'forms.enterprise.vertical.options.handicrafts' },
            { value: 'education-training', label: 'forms.enterprise.vertical.options.education-training' },
            { value: 'health-wellness', label: 'forms.enterprise.vertical.options.health-wellness' },
            { value: 'creative-industries', label: 'forms.enterprise.vertical.options.creative-industries' },
            { value: 'services', label: 'forms.enterprise.vertical.options.services' },
            { value: 'others', label: 'forms.enterprise.vertical.options.others' },
          ],
        },
        {
          name: 'yearsOperating',
          label: 'forms.enterprise.yearsOperating.label',
          type: 'number',
          required: true,
        },
        {
          name: 'businessDescription',
          label: 'forms.enterprise.businessDescription.label',
          type: 'textarea',
          required: true,
        },
        {
          name: 'trainingNeeds',
          label: 'forms.enterprise.trainingNeeds.label',
          type: 'textarea',
          required: true,
          helpText: 'forms.enterprise.trainingNeeds.helpText',
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'forms.enterprise.sections.contact-information.title',
      fields: [
        { name: 'primaryContactName', label: 'forms.enterprise.primaryContactName.label', type: 'text', required: true },
        { name: 'contactNumber', label: 'forms.enterprise.contactNumber.label', type: 'tel', required: true },
        {
          name: 'email',
          label: 'forms.enterprise.email.label',
          type: 'email',
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          patternMessage: 'forms.enterprise.email.patternMessage',
        },
        {
          name: 'cityProvince',
          label: 'forms.enterprise.cityProvince.label',
          type: 'text',
          required: true,
          analytics: { dimension: 'city', kind: 'categorical' },
        },
        {
          name: 'gender',
          label: 'forms.enterprise.gender.label',
          type: 'select',
          required: true,
          analytics: { dimension: 'gender', kind: 'categorical' },
          options: [
            { value: 'female', label: 'forms.enterprise.gender.options.female' },
            { value: 'male', label: 'forms.enterprise.gender.options.male' },
            { value: 'other', label: 'forms.enterprise.gender.options.other' },
            { value: 'prefer-not-to-say', label: 'forms.enterprise.gender.options.prefer-not-to-say' },
          ],
        },
      ],
    },
    {
      id: 'how-did-you-hear',
      title: 'forms.enterprise.sections.how-did-you-hear.title',
      fields: [
        {
          name: 'referralSource',
          label: 'forms.enterprise.referralSource.label',
          type: 'select',
          required: true,
          analytics: { dimension: 'source', kind: 'categorical' },
          options: [
            { value: 'social-media', label: 'forms.enterprise.referralSource.options.social-media' },
            { value: 'peer-referral', label: 'forms.enterprise.referralSource.options.peer-referral' },
            { value: 'email', label: 'forms.enterprise.referralSource.options.email' },
            { value: 'print-electronic-media', label: 'forms.enterprise.referralSource.options.print-electronic-media' },
            { value: 'others', label: 'forms.enterprise.referralSource.options.others' },
          ],
        },
      ],
    },
    {
      id: 'commitment',
      title: 'forms.enterprise.sections.commitment.title',
      fields: [
        {
          name: 'commitmentConsent',
          label: 'forms.enterprise.commitmentConsent.label',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
