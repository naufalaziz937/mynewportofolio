import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
type Props = { children: ReactNode; primary?: boolean; className?: string } & ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement> | { href?: never } & ButtonHTMLAttributes<HTMLButtonElement>);
export function TerminalButton(props: Props) {
  const { children, primary, className = '', ...rest } = props;
  const classes = `terminal-button ${primary ? 'primary' : ''} ${className}`;
  if ('href' in rest && rest.href) return <a {...rest as AnchorHTMLAttributes<HTMLAnchorElement>} className={classes}>{children}</a>;
  return <button {...rest as ButtonHTMLAttributes<HTMLButtonElement>} className={classes}>{children}</button>;
}
