import type { FormSchema } from '../types'

/**
 * Guide Her Growth — Become a Mentor application.
 * Drafted from the Content Brief: "For experts, founders, investors,
 * trainers, and professionals who want to guide women entrepreneurs through
 * practical support." Uses `themeTrack: 'neutral'` since mentor/partner
 * aren't part of the founder/enterprise track-color system.
 *
 * All human-readable `label`/`title`/`placeholder`/`helpText` strings are
 * i18n key paths (looked up via `t()` in DynamicForm.tsx), not literal
 * English — see src/i18n/locales/en.json under `forms.mentor`. The
 * `name`/`dimension` values below are stable analytics keys and are never
 * translated.
 */
export const mentorFormSchema: FormSchema = {
  track: 'mentor',
  title: 'forms.mentor.meta.title',
  subtitle: 'forms.mentor.meta.subtitle',
  themeTrack: 'neutral',
  submitLabel: 'forms.mentor.meta.submitLabel',
  successTitle: 'forms.mentor.meta.successTitle',
  successBody: 'forms.mentor.meta.successBody',
  sections: [
    {
      id: 'mentor-basics',
      title: 'forms.mentor.sections.mentor-basics.title',
      fields: [
        { name: 'fullName', label: 'forms.mentor.fullName.label', type: 'text', required: true },
        { name: 'currentRole', label: 'forms.mentor.currentRole.label', type: 'text', required: true },
        { name: 'organization', label: 'forms.mentor.organization.label', type: 'text' },
        {
          name: 'expertiseAreas',
          label: 'forms.mentor.expertiseAreas.label',
          type: 'select',
          required: true,
          analytics: { dimension: 'expertise', kind: 'categorical' },
          options: [
            { value: 'business-strategy', label: 'forms.mentor.expertiseAreas.options.business-strategy' },
            { value: 'finance-investment', label: 'forms.mentor.expertiseAreas.options.finance-investment' },
            { value: 'marketing-branding', label: 'forms.mentor.expertiseAreas.options.marketing-branding' },
            { value: 'product-tech', label: 'forms.mentor.expertiseAreas.options.product-tech' },
            { value: 'legal', label: 'forms.mentor.expertiseAreas.options.legal' },
            { value: 'operations', label: 'forms.mentor.expertiseAreas.options.operations' },
            { value: 'sales-market-access', label: 'forms.mentor.expertiseAreas.options.sales-market-access' },
            { value: 'other', label: 'forms.mentor.expertiseAreas.options.other' },
          ],
        },
        {
          name: 'yearsExperience',
          label: 'forms.mentor.yearsExperience.label',
          type: 'number',
          required: true,
        },
        {
          name: 'motivation',
          label: 'forms.mentor.motivation.label',
          type: 'textarea',
          required: true,
        },
        {
          name: 'availability',
          label: 'forms.mentor.availability.label',
          type: 'select',
          required: true,
          options: [
            { value: '1-2-hours', label: 'forms.mentor.availability.options.1-2-hours' },
            { value: '3-5-hours', label: 'forms.mentor.availability.options.3-5-hours' },
            { value: '5-plus-hours', label: 'forms.mentor.availability.options.5-plus-hours' },
          ],
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'forms.mentor.sections.contact-information.title',
      fields: [
        { name: 'contactNumber', label: 'forms.mentor.contactNumber.label', type: 'tel', required: true },
        {
          name: 'email',
          label: 'forms.mentor.email.label',
          type: 'email',
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          patternMessage: 'forms.mentor.email.patternMessage',
        },
        {
          name: 'linkedin',
          label: 'forms.mentor.linkedin.label',
          type: 'url',
          placeholder: 'forms.mentor.linkedin.placeholder',
        },
        {
          name: 'cityProvince',
          label: 'forms.mentor.cityProvince.label',
          type: 'text',
          required: true,
          analytics: { dimension: 'city', kind: 'categorical' },
        },
      ],
    },
    {
      id: 'commitment',
      title: 'forms.mentor.sections.commitment.title',
      fields: [
        {
          name: 'commitmentConsent',
          label: 'forms.mentor.commitmentConsent.label',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
