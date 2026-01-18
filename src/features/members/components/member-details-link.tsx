import { cn } from '@/lib/utils'
import { Link, type LinkComponentProps } from '@tanstack/react-router'

type MemberDetailsLinkProps = { memberId: string; maskLabel?: string } & Omit<
  LinkComponentProps,
  'to' | 'params' | 'mask'
>

export function MemberDetailsLink({
  memberId,
  className,
  children,
  maskLabel,
  ...props
}: MemberDetailsLinkProps) {
  if (maskLabel) {
    return (
      <Link
        {...props}
        to={'/members/$memberId'}
        params={{ memberId }}
        mask={{ to: '/members/$memberId', params: { memberId: maskLabel } }}
        className={cn('font-semibold', className)}
      >
        {children}
      </Link>
    )
  }
  return (
    <Link
      {...props}
      to={'/members/$memberId'}
      params={{ memberId }}
      className={cn('font-semibold', className)}
    >
      {children}
    </Link>
  )
}
