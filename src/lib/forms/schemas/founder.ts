import type { FormSchema } from '../types'

/**
 * Founder Flightpath — WISE Lab Incubation Application Form.
 *
 * Field-for-field match to "WISE Incubation Application Form.docx" (the
 * ground-truth schema). Section order and every question follow the docx;
 * nothing added or removed. The "Applicant Signature" commitment is
 * implemented as a required consent checkbox rather than a signature field,
 * since this is a web form (per the master prompt's explicit instruction).
 *
 * All human-readable `label`/`title`/`placeholder`/`helpText` strings are
 * i18n key paths (looked up via `t()` in DynamicForm.tsx), not literal
 * English — see src/i18n/locales/en.json under `forms.founder`. The
 * `name`/`dimension` values below are stable analytics keys and are never
 * translated.
 */
export const founderFormSchema: FormSchema = {
  track: 'founder',
  title: 'forms.founder.meta.title',
  subtitle: 'forms.founder.meta.subtitle',
  themeTrack: 'founder',
  submitLabel: 'forms.founder.meta.submitLabel',
  successTitle: 'forms.founder.meta.successTitle',
  successBody: 'forms.founder.meta.successBody',
  sections: [
    {
      id: 'startup-basics',
      title: 'forms.founder.sections.startup-basics.title',
      fields: [
        {
          name: 'startupName',
          label: 'forms.founder.startupName.label',
          type: 'text',
          required: true,
          placeholder: 'forms.founder.startupName.placeholder',
        },
        {
          name: 'vertical',
          label: 'forms.founder.vertical.label',
          type: 'select',
          required: true,
          analytics: { dimension: 'vertical', kind: 'categorical' },
          options: [
            { value: 'ecommerce', label: 'forms.founder.vertical.options.ecommerce' },
            { value: 'fashion-apparel', label: 'forms.founder.vertical.options.fashion-apparel' },
            { value: 'beauty-wellness', label: 'forms.founder.vertical.options.beauty-wellness' },
            { value: 'food-beverages', label: 'forms.founder.vertical.options.food-beverages' },
            { value: 'handicrafts', label: 'forms.founder.vertical.options.handicrafts' },
            { value: 'education-training', label: 'forms.founder.vertical.options.education-training' },
            { value: 'health-wellness', label: 'forms.founder.vertical.options.health-wellness' },
            { value: 'social-enterprise', label: 'forms.founder.vertical.options.social-enterprise' },
            { value: 'creative-industries', label: 'forms.founder.vertical.options.creative-industries' },
            { value: 'services', label: 'forms.founder.vertical.options.services' },
            { value: 'others', label: 'forms.founder.vertical.options.others' },
          ],
        },
        {
          name: 'stage',
          label: 'forms.founder.stage.label',
          type: 'select',
          required: true,
          analytics: { dimension: 'stage', kind: 'categorical' },
          options: [
            { value: 'idea', label: 'forms.founder.stage.options.idea' },
            { value: 'prototype', label: 'forms.founder.stage.options.prototype' },
            { value: 'mvp', label: 'forms.founder.stage.options.mvp' },
            { value: 'established', label: 'forms.founder.stage.options.established' },
          ],
        },
        {
          name: 'establishmentYear',
          label: 'forms.founder.establishmentYear.label',
          type: 'number',
          required: true,
          placeholder: 'forms.founder.establishmentYear.placeholder',
        },
      ],
    },
    {
      id: 'idea-overview',
      title: 'forms.founder.sections.idea-overview.title',
      fields: [
        {
          name: 'ideaBrief',
          label: 'forms.founder.ideaBrief.label',
          type: 'textarea',
          required: true,
          placeholder: 'forms.founder.ideaBrief.placeholder',
        },
        {
          name: 'productDescription',
          label: 'forms.founder.productDescription.label',
          type: 'textarea',
          required: true,
        },
        {
          name: 'valueProposition',
          label: 'forms.founder.valueProposition.label',
          type: 'textarea',
          required: true,
          helpText: 'forms.founder.valueProposition.helpText',
        },
        {
          name: 'targetMarket',
          label: 'forms.founder.targetMarket.label',
          type: 'textarea',
          required: true,
        },
        {
          name: 'customers',
          label: 'forms.founder.customers.label',
          type: 'textarea',
          required: true,
        },
        {
          name: 'competition',
          label: 'forms.founder.competition.label',
          type: 'textarea',
          required: true,
        },
        {
          name: 'coreStrength',
          label: 'forms.founder.coreStrength.label',
          type: 'textarea',
          required: true,
        },
        {
          name: 'marketingStrategy',
          label: 'forms.founder.marketingStrategy.label',
          type: 'textarea',
          required: true,
        },
        {
          name: 'onlinePresence',
          label: 'forms.founder.onlinePresence.label',
          type: 'text',
          placeholder: 'forms.founder.onlinePresence.placeholder',
        },
        {
          name: 'revenueStreams',
          label: 'forms.founder.revenueStreams.label',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      id: 'team-details',
      title: 'forms.founder.sections.team-details.title',
      fields: [
        {
          name: 'team',
          label: 'forms.founder.team.label',
          type: 'table',
          required: true,
          minRows: 1,
          columns: [
            { key: 'name', label: 'forms.founder.team.columns.name', type: 'text', required: true },
            { key: 'role', label: 'forms.founder.team.columns.role', type: 'text', required: true },
            { key: 'qualification', label: 'forms.founder.team.columns.qualification', type: 'text', required: true },
            { key: 'skillset', label: 'forms.founder.team.columns.skillset', type: 'text', required: true },
            { key: 'city', label: 'forms.founder.team.columns.city', type: 'text', required: true },
            { key: 'age', label: 'forms.founder.team.columns.age', type: 'number', required: true },
          ],
        },
      ],
    },
    {
      id: 'previous-experience',
      title: 'forms.founder.sections.previous-experience.title',
      fields: [
        {
          name: 'hasLaunchedBusiness',
          label: 'forms.founder.hasLaunchedBusiness.label',
          type: 'radio',
          required: true,
          options: [
            { value: 'yes', label: 'forms.founder.common.options.yes' },
            { value: 'no', label: 'forms.founder.common.options.no' },
          ],
        },
        {
          name: 'previousBusinessName',
          label: 'forms.founder.previousBusinessName.label',
          type: 'text',
          conditional: { field: 'hasLaunchedBusiness', equals: 'yes' },
          required: true,
        },
        {
          name: 'hasIncubationExperience',
          label: 'forms.founder.hasIncubationExperience.label',
          type: 'radio',
          required: true,
          options: [
            { value: 'yes', label: 'forms.founder.common.options.yes' },
            { value: 'no', label: 'forms.founder.common.options.no' },
          ],
        },
        {
          name: 'incubationDetails',
          label: 'forms.founder.incubationDetails.label',
          type: 'textarea',
          conditional: { field: 'hasIncubationExperience', equals: 'yes' },
          required: true,
        },
      ],
    },
    {
      id: 'availability',
      title: 'forms.founder.sections.availability.title',
      fields: [
        {
          name: 'availableFullYear',
          label: 'forms.founder.availableFullYear.label',
          type: 'radio',
          required: true,
          analytics: { dimension: 'availability', kind: 'boolean' },
          options: [
            { value: 'yes', label: 'forms.founder.common.options.yes' },
            { value: 'no', label: 'forms.founder.common.options.no' },
          ],
        },
      ],
    },
    {
      id: 'funding',
      title: 'forms.founder.sections.funding.title',
      fields: [
        {
          name: 'hasFunding',
          label: 'forms.founder.hasFunding.label',
          type: 'radio',
          required: true,
          analytics: { dimension: 'funded', kind: 'boolean' },
          options: [
            { value: 'yes', label: 'forms.founder.common.options.yes' },
            { value: 'no', label: 'forms.founder.common.options.no' },
          ],
        },
        {
          name: 'fundingDetails',
          label: 'forms.founder.fundingDetails.label',
          type: 'textarea',
          conditional: { field: 'hasFunding', equals: 'yes' },
          required: true,
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'forms.founder.sections.contact-information.title',
      fields: [
        {
          name: 'primaryFounderName',
          label: 'forms.founder.primaryFounderName.label',
          type: 'text',
          required: true,
        },
        {
          name: 'contactNumber',
          label: 'forms.founder.contactNumber.label',
          type: 'tel',
          required: true,
        },
        {
          name: 'email',
          label: 'forms.founder.email.label',
          type: 'email',
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          patternMessage: 'forms.founder.email.patternMessage',
        },
        {
          name: 'cityProvince',
          label: 'forms.founder.cityProvince.label',
          type: 'text',
          required: true,
          analytics: { dimension: 'city', kind: 'categorical' },
        },
        {
          name: 'gender',
          label: 'forms.founder.gender.label',
          type: 'select',
          required: true,
          analytics: { dimension: 'gender', kind: 'categorical' },
          options: [
            { value: 'female', label: 'forms.founder.gender.options.female' },
            { value: 'male', label: 'forms.founder.gender.options.male' },
            { value: 'other', label: 'forms.founder.gender.options.other' },
            { value: 'prefer-not-to-say', label: 'forms.founder.gender.options.prefer-not-to-say' },
          ],
        },
      ],
    },
    {
      id: 'how-did-you-hear',
      title: 'forms.founder.sections.how-did-you-hear.title',
      fields: [
        {
          name: 'referralSource',
          label: 'forms.founder.referralSource.label',
          type: 'select',
          required: true,
          analytics: { dimension: 'source', kind: 'categorical' },
          options: [
            { value: 'social-media', label: 'forms.founder.referralSource.options.social-media' },
            { value: 'peer-referral', label: 'forms.founder.referralSource.options.peer-referral' },
            { value: 'email', label: 'forms.founder.referralSource.options.email' },
            { value: 'print-electronic-media', label: 'forms.founder.referralSource.options.print-electronic-media' },
            { value: 'others', label: 'forms.founder.referralSource.options.others' },
          ],
        },
      ],
    },
    {
      id: 'commitment',
      title: 'forms.founder.sections.commitment.title',
      fields: [
        {
          name: 'commitmentConsent',
          label: 'forms.founder.commitmentConsent.label',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
