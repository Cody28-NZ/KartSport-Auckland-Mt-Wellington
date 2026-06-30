/**
 * Future membership application notifications.
 *
 * After a membership application is submitted, the club secretary or another
 * administrator should receive an email with application details and the
 * accepted terms snapshot. Email sending is not implemented yet.
 */

export async function notifyMembershipApplicationSubmitted(applicationId: string): Promise<void> {
  void applicationId;
  // TODO: send application summary + accepted terms snapshot to club secretary/admin
}
