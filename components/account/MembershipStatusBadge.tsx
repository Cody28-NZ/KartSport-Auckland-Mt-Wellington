import type { MembershipStatus } from "@/types/database";
import { formatMembershipStatus, membershipStatusVariant } from "@/lib/account/format";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface MembershipStatusBadgeProps {
  status: MembershipStatus | null | undefined;
}

export function MembershipStatusBadge({ status }: MembershipStatusBadgeProps) {
  return (
    <StatusBadge
      status={membershipStatusVariant(status)}
      label={`Membership status: ${formatMembershipStatus(status)}`}
    />
  );
}
