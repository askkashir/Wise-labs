import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SUPPORTED_LANGUAGES } from '@/i18n'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ light = false, className }: { light?: boolean; className?: string }) {
  const { i18n, t } = useTranslation()

  return (
    <Select value={i18n.language} onValueChange={(lng) => i18n.changeLanguage(lng)}>
      <SelectTrigger
        aria-label={t('language.label')}
        className={cn(
          'h-9 w-[92px] gap-1.5 rounded-full border-none px-3 text-[13px] shadow-none',
          light ? 'bg-white/10 text-white' : 'bg-plum/5 text-plum',
          className
        )}
      >
        <Globe className="h-3.5 w-3.5 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SUPPORTED_LANGUAGES.map((lng) => (
          <SelectItem key={lng} value={lng}>
            {t(`language.${lng}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
