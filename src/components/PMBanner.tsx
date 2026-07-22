import { useTranslation } from 'react-i18next'

/**
 * Thin government-credit strip pinned above the main nav. Per the WISE Lab
 * website brief: "PM picture in the header along with the statement: Under
 * the vision of the Honorable Prime Minister of Pakistan, WISE Lab is
 * designed & funded by the Ministry of IT & Telecom & Ignite - National
 * Technology Fund." Height is exported so Nav can offset its own fixed
 * top-0 below it instead of overlapping.
 */
export const PM_BANNER_HEIGHT = 40

export function PMBanner() {
  const { t } = useTranslation()
  return (
    <div
      className="fixed inset-x-0 top-0 z-[51] flex items-center gap-3 overflow-hidden border-b border-plum/10 bg-beige px-4 text-plum"
      style={{ height: PM_BANNER_HEIGHT }}
    >
      <img
        src="/pm-banner.jpg"
        alt=""
        aria-hidden="true"
        className="h-6 w-10 shrink-0 rounded object-cover object-top sm:h-7 sm:w-12"
      />
      <p className="min-w-0 truncate text-[11px] font-medium leading-none text-plum/75 sm:text-xs">
        {t('pmBanner.text')}
      </p>
    </div>
  )
}
