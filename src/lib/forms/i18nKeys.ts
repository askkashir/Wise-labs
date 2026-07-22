import type { TFunction } from 'i18next'
import type { FieldDef, FormSchema, FormSection, TableColumn } from './types'

/**
 * Deterministic i18n key derivation for form schemas.
 *
 * The schema files (src/lib/forms/schemas/*.ts) stay the single source of
 * truth for English copy and field structure — nothing in them changes for
 * i18n. Every translatable string is looked up here as
 * `forms.<track>.…` with the schema's own English text passed as the
 * react-i18next fallback (`t(key, fallback)`), the same pattern already used
 * for nav links. Missing/not-yet-translated locale keys silently render in
 * English instead of breaking.
 */

const ns = (schema: FormSchema) => `forms.${schema.track}`

export const tTitle = (t: TFunction, schema: FormSchema) =>
  t(`${ns(schema)}.title`, schema.title)

export const tSubtitle = (t: TFunction, schema: FormSchema) =>
  t(`${ns(schema)}.subtitle`, schema.subtitle)

export const tSubmitLabel = (t: TFunction, schema: FormSchema) =>
  t(`${ns(schema)}.submitLabel`, schema.submitLabel)

export const tSuccessTitle = (t: TFunction, schema: FormSchema) =>
  t(`${ns(schema)}.successTitle`, schema.successTitle)

export const tSuccessBody = (t: TFunction, schema: FormSchema) =>
  t(`${ns(schema)}.successBody`, schema.successBody)

export const tSectionTitle = (t: TFunction, schema: FormSchema, section: FormSection) =>
  t(`${ns(schema)}.sections.${section.id}.title`, section.title)

export const tSectionDescription = (t: TFunction, schema: FormSchema, section: FormSection) =>
  section.description
    ? t(`${ns(schema)}.sections.${section.id}.description`, section.description)
    : undefined

export const tFieldLabel = (t: TFunction, schema: FormSchema, field: FieldDef) =>
  t(`${ns(schema)}.fields.${field.name}.label`, field.label)

export const tFieldPlaceholder = (t: TFunction, schema: FormSchema, field: FieldDef) =>
  field.placeholder
    ? t(`${ns(schema)}.fields.${field.name}.placeholder`, field.placeholder)
    : undefined

export const tFieldHelpText = (t: TFunction, schema: FormSchema, field: FieldDef) =>
  field.helpText
    ? t(`${ns(schema)}.fields.${field.name}.helpText`, field.helpText)
    : undefined

export const tFieldPatternMessage = (t: TFunction, schema: FormSchema, field: FieldDef) =>
  field.patternMessage
    ? t(`${ns(schema)}.fields.${field.name}.patternMessage`, field.patternMessage)
    : undefined

export const tOptionLabel = (
  t: TFunction,
  schema: FormSchema,
  field: FieldDef,
  value: string,
  fallback: string
) => t(`${ns(schema)}.fields.${field.name}.options.${value}`, fallback)

export const tColumnLabel = (
  t: TFunction,
  schema: FormSchema,
  field: FieldDef,
  column: TableColumn
) => t(`${ns(schema)}.fields.${field.name}.columns.${column.key}`, column.label)
