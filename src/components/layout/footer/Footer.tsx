import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import Link from 'next/link';

import CustomImage from '@/components/utils/images/Image';

const footerLinks = {
  // Product: [
  //   ['Features', '/features'],
  //   ['Pricing', '/pricing'],
  //   ['Integrations', '/integrations-overview'],
  //   ['Updates', '/updates'],
  // ],
  Resources: [
    // ['Documentation', '/documentation'],
    // ['Tutorials', '/tutorials'],
    ['Blog', '/blog'],
    // ['Support', '/support'],
  ],
  Company: [
    ['About', '/about'],
    // ['Careers', '/careers'],
    // ['Contact', '/contact'],
    ['Privacy', '/privacy'],
    // ['Terms', '/terms'],
  ],
};

export default function Footer() {
  return (
    <>
      {/* upper */}
      <footer className="border-t border-border bg-sidebar">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-start justify-between gap-8">
          <div className="flex flex-col gap-4">
            <CustomImage
              src="/images/full_logo_trimmed.png"
              alt="Iterova"
              className="h-18 object-fill self-start"
              width={200}
              height={150}
            />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-55">
              Powerful task management and project planning for modern teams.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title} className="flex flex-col gap-3">
              <h4 className="text-sm text-foreground">{title}</h4>
              <ul className="space-y-2">
                {items.map(([label, path]) => (
                  <li key={path}>
                    <Link
                      href={path}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* lower */}
        <div className="border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground/60">
              &copy; 2026 Iterova. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              {(
                [
                  { Icon: XIcon, href: 'https://x.com/iterova_2026/', label: 'X' },
                  {
                    Icon: InstagramIcon,
                    href: 'https://www.instagram.com/iterova_2026/',
                    label: 'Instagram',
                  },
                  // { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                  {
                    Icon: GitHubIcon,
                    href: 'https://github.com/NedasBarsteika/jira-ultra',
                    label: 'GitHub',
                  },
                  // { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
                ] as const
              ).map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
