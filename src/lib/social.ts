import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from '@/components/BrandIcons'

export interface SocialLink {
  label: string
  href: string
  Icon: typeof LinkedinIcon
}

/** Single source of truth for WISE Lab's real social profiles. */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/women-innovation-and-startup-empowerment-lab/?viewAsMember=true',
    Icon: LinkedinIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/wise.labpk/',
    Icon: InstagramIcon,
  },
  {
    label: 'X',
    href: 'https://x.com/wise_labpk',
    Icon: XIcon,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61591692284630',
    Icon: FacebookIcon,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@wiselabpk',
    Icon: YoutubeIcon,
  },
]
