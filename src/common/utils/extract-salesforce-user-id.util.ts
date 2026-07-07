/**
 * Extracts the Salesforce user id from the `id` field of an OAuth token response, e.g.
 * `https://test.salesforce.com/id/00DO100000EUsR7MAL/005O100000Y922FIAR` -> `005O100000Y922FIAR`.
 * That `id` URL's last path segment is always the user id for whichever identity the
 * client-credentials grant authenticated as.
 *
 * @param identityUrl - The `id` field from Salesforce's OAuth token response.
 * @returns The Salesforce user id (last path segment).
 */
export function extractSalesforceUserId(identityUrl: string): string {
  const segments = identityUrl.split('/').filter(Boolean);
  return segments[segments.length - 1];
}
