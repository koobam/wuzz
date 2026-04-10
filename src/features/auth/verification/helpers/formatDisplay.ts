/**
 * Helper functions for formatting phone and email for display
 */

/**
 * Format phone number for display (mask middle digits)
 * @param phoneNum - Phone number as number
 * @param code - Country code
 * @returns Formatted phone string (e.g., "+1 ****1234")
 */
export const formatPhoneForDisplay = (phoneNum: number, code: number): string => {
  const phoneStr = phoneNum.toString();
  if (phoneStr.length <= 4) return `+${code} ${phoneStr}`;
  const last4 = phoneStr.slice(-4);
  const masked = '*'.repeat(phoneStr.length - 4);
  return `+${code} ${masked}${last4}`;
};

/**
 * Format email for display (mask middle part)
 * @param emailStr - Email address string
 * @returns Formatted email string (e.g., "u***r@example.com")
 */
export const formatEmailForDisplay = (emailStr: string): string => {
  const [localPart, domain] = emailStr.split('@');
  if (!domain) return emailStr;
  
  if (localPart.length <= 2) {
    return `${localPart}@${domain}`;
  }
  
  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  const masked = '*'.repeat(Math.max(0, localPart.length - 2));
  return `${firstChar}${masked}${lastChar}@${domain}`;
};

