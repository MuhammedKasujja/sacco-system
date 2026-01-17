import { cn } from '@/lib/utils'
import { Link, type LinkComponentProps } from '@tanstack/react-router'

type MemberDetailsLinkProps = { memberId: string } & Omit<
  LinkComponentProps,
  'to' | 'params'
>

export function MemberDetailsLink({
  memberId,
  className,
  children,
  ...props
}: MemberDetailsLinkProps) {
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
