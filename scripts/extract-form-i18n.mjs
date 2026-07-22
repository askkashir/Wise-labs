// One-off dev script: imports the 4 FormSchema modules and dumps a JSON
// skeleton of every translatable string, keyed the same way DynamicForm/
// ApplyPage derive i18n keys (see src/lib/forms/i18nKeys.ts). Run with
// `npx tsx scripts/extract-form-i18n.mjs`. Not part of the app bundle.
import { founderFormSchema } from '../src/lib/forms/schemas/founder.ts'
import { enterpriseFormSchema } from '../src/lib/forms/schemas/enterprise.ts'
import { mentorFormSchema } from '../src/lib/forms/schemas/mentor.ts'
import { partnerFormSchema } from '../src/lib/forms/schemas/partner.ts'

const schemas = [founderFormSchema, enterpriseFormSchema, mentorFormSchema, partnerFormSchema]

const out = {}
for (const schema of schemas) {
  const t = schema.track
  out[t] = {
    title: schema.title,
    subtitle: schema.subtitle,
    submitLabel: schema.submitLabel,
    successTitle: schema.successTitle,
    successBody: schema.successBody,
    sections: {},
    fields: {},
  }
  for (const section of schema.sections) {
    out[t].sections[section.id] = { title: section.title }
    if (section.description) out[t].sections[section.id].description = section.description

    for (const field of section.fields) {
      const f = { label: field.label }
      if (field.placeholder) f.placeholder = field.placeholder
      if (field.helpText) f.helpText = field.helpText
      if (field.patternMessage) f.patternMessage = field.patternMessage
      if (field.options) {
        f.options = {}
        for (const opt of field.options) f.options[opt.value] = opt.label
      }
      if (field.columns) {
        f.columns = {}
        for (const col of field.columns) f.columns[col.key] = col.label
      }
      out[t].fields[field.name] = f
    }
  }
}

console.log(JSON.stringify(out, null, 2))
