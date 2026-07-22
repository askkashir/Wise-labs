import type { FormSchema } from '../types'

/**
 * Open the Ecosystem — Partner with WISE application.
 * Drafted from the Content Brief's Power Circle section: consortium /
 * supporting partner categories (Academic, Corporate, Development,
 * Financial, Media, Investor Networks, Training, Market Access, Community).
 *
 * All human-readable `label`/`title`/`placeholder`/`helpText` strings are
 * i18n key paths (looked up via `t()` in DynamicForm.tsx), not literal
 * English — see src/i18n/locales/en.json under `forms.partner`. The
 * `name`/`dimension` values below are stable analytics keys and are never
 * translated.
 */
export const partnerFormSchema: FormSchema = {
  track: 'partner',
  title: 'forms.partner.meta.title',
  subtitle: 'forms.partner.meta.subtitle',
  themeTrack: 'neutral',
  submitLabel: 'forms.partner.meta.submitLabel',
  successTitle: 'forms.partner.meta.successTitle',
  successBody: 'forms.partner.meta.successBody',
  sections: [
    {
      id: 'organization-basics',
      title: 'forms.partner.sections.organization-basics.title',
      fields: [
        { name: 'organizationName', label: 'forms.partner.organizationName.label', type: 'text', required: true },
        {
          name: 'partnerCategory',
          label: 'forms.partner.partnerCategory.label',
          type: 'select',
          required: true,
          analytics: { dimension: 'partnerCategory', kind: 'categorical' },
          options: [
            { value: 'academic', label: 'forms.partner.partnerCategory.options.academic' },
            { value: 'corporate', label: 'forms.partner.partnerCategory.options.corporate' },
            { value: 'development', label: 'forms.partner.partnerCategory.options.development' },
            { value: 'financial', label: 'forms.partner.partnerCategory.options.financial' },
            { value: 'media', label: 'forms.partner.partnerCategory.options.media' },
            { value: 'investor-network', label: 'forms.partner.partnerCategory.options.investor-network' },
            { value: 'training', label: 'forms.partner.partnerCategory.options.training' },
            { value: 'market-access', label: 'forms.partner.partnerCategory.options.market-access' },
            { value: 'community', label: 'forms.partner.partnerCategory.options.community' },
            { value: 'other', label: 'forms.partner.partnerCategory.options.other' },
          ],
        },
        { name: 'website', label: 'forms.partner.website.label', type: 'url', placeholder: 'forms.partner.website.placeholder' },
        {
          name: 'proposedCollaboration',
          label: 'forms.partner.proposedCollaboration.label',
          type: 'textarea',
          required: true,
        },
        {
          name: 'contributionAreas',
          label: 'forms.partner.contributionAreas.label',
          type: 'textarea',
          required: true,
          helpText: 'forms.partner.contributionAreas.helpText',
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'forms.partner.sections.contact-information.title',
      fields: [
        { name: 'contactName', label: 'forms.partner.contactName.label', type: 'text', required: true },
        { name: 'contactRole', label: 'forms.partner.contactRole.label', type: 'text', required: true },
        { name: 'contactNumber', label: 'forms.partner.contactNumber.label', type: 'tel', required: true },
        {
          name: 'email',
          label: 'forms.partner.email.label',
          type: 'email',
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          patternMessage: 'forms.partner.email.patternMessage',
        },
        {
          name: 'cityProvince',
          label: 'forms.partner.cityProvince.label',
          type: 'text',
          required: true,
          analytics: { dimension: 'city', kind: 'categorical' },
        },
      ],
    },
    {
      id: 'commitment',
      title: 'forms.partner.sections.commitment.title',
      fields: [
        {
          name: 'commitmentConsent',
          label: 'forms.partner.commitmentConsent.label',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
