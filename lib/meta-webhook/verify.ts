import crypto from "crypto"

/**
 * Validate Meta's X-Hub-Signature-256 header against the raw request body.
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started#validate-payloads
 */
export function isValidSignature(
    rawBody: string | Buffer,
    signatureHeader: string | null,
    appSecret: string,
): boolean {
    if (!signatureHeader || !appSecret) return false
    const expected = signatureHeader.startsWith("sha256=")
        ? signatureHeader.slice(7)
        : signatureHeader
    const computed = crypto
        .createHmac("sha256", appSecret)
        .update(rawBody)
        .digest("hex")
    if (expected.length !== computed.length) return false
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(computed))
}
