import { formatUnits, parseUnits } from "viem";

const USDT_DECIMALS = 6;
const DEFAULT_TOKEN_DECIMALS = 18;

/**
 * Formats a BigInt amount from its smallest unit to a human-readable string,
 * considering the specified number of decimals.
 * @param amount The BigInt amount in smallest units.
 * @param decimals The number of decimal places for the token.
 * @param currencySymbol Optional currency symbol to prepend.
 * @returns A formatted string representation of the amount (e.g., "1,234.56 USDT").
 */
export function formatTokenAmount(
    amount: bigint | undefined | null,
    decimals: number,
    options?: { currencySymbol?: string; showUnits?: boolean, keepTrailingZeros?: boolean }
): string {
    if (amount === undefined || amount === null) return "N/A";
    const formatted = formatUnits(amount, decimals);
    
    let numberPart = formatted;
    if (!options?.keepTrailingZeros) {
        // Remove trailing zeros after decimal point, but keep decimal point if there are non-zero digits before it.
        if (formatted.includes('.')) {
            numberPart = formatted.replace(/(\.\d*?[1-9])0+$|(\.0*)$/, '$1');
             if (numberPart.endsWith('.')) {
                numberPart = numberPart.slice(0, -1);
            }
        }
    }

    // Basic thousands separator (can be improved with Intl.NumberFormat for locales)
    const parts = numberPart.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const valueWithSeparators = parts.join('.');

    let result = valueWithSeparators;
    if (options?.showUnits && options.currencySymbol) {
        result = `${result} ${options.currencySymbol}`;
    } else if (options?.currencySymbol && !options?.showUnits) {
         result = `${options.currencySymbol}${result}`;
    }
    return result;
}

/**
 * Parses a human-readable string amount to its BigInt representation in smallest units.
 * @param amount The string amount (e.g., "1234.56").
 * @param decimals The number of decimal places for the token.
 * @returns A BigInt representing the amount in smallest units.
 */
export function parseTokenAmount(amount: string | number, decimals: number): bigint {
    return parseUnits(amount.toString(), decimals);
}

// Specific formatters
export const formatUsdtAmount = (
    amount: bigint | undefined | null,
    options?: { showUnits?: boolean, keepTrailingZeros?: boolean }
) => formatTokenAmount(amount, USDT_DECIMALS, { ...options, currencySymbol: "USDT" });

export const parseUsdtAmount = (amount: string | number) => parseTokenAmount(amount, USDT_DECIMALS);

export const formatDefaultTokenAmount = (
    amount: bigint | undefined | null,
    options?: { currencySymbol?: string; showUnits?: boolean, keepTrailingZeros?: boolean }
) => formatTokenAmount(amount, DEFAULT_TOKEN_DECIMALS, options);

export const parseDefaultTokenAmount = (amount: string | number) => parseTokenAmount(amount, DEFAULT_TOKEN_DECIMALS);


/**
 * Formats an Ethereum address for display (e.g., 0x123...def).
 * @param address The Ethereum address string.
 * @param startChars Number of characters to show at the start.
 * @param endChars Number of characters to show at the end.
 * @returns A truncated address string or the original if too short.
 */
export function formatAddress(address: string | undefined | null, startChars = 6, endChars = 4): `0x${string}` {
   return address as `0x${string}`;
}

/**
 * Formats a BigInt representing Basis Points (BPS) into a percentage string.
 * 100 BPS = 1%
 * @param bps The amount in basis points.
 * @returns A string like "12.34%" or "N/A".
 */
export function formatBpsRate(bps: bigint | number | undefined | null): string {
    if (bps === undefined || bps === null) return "N/A";
    const bpsAsNumber = Number(bps);
    if (isNaN(bpsAsNumber)) return "N/A";
    return `${(bpsAsNumber / 100).toFixed(2)}%`;
}

/**
 * Formats a BigInt Unix timestamp (seconds) into a human-readable date string.
 * @param timestampSeconds The Unix timestamp in seconds.
 * @returns A date string (e.g., "Jan 1, 2023, 12:00 PM") or "N/A".
 */
export function formatTimestamp(timestampSeconds: bigint | number | undefined | null): string {
    if (timestampSeconds === undefined || timestampSeconds === null || BigInt(timestampSeconds) === BigInt(0)) return "N/A";
    try {
        const date = new Date(Number(timestampSeconds) * 1000);
        return date.toLocaleString(); // Or use a more specific format
    } catch (e) {
        return "Invalid Date";
    }
}

/**
 * Formats a duration in seconds into a human-readable string (e.g., "2 days, 5 hours").
 * @param durationSeconds The duration in seconds.
 * @returns A human-readable duration string or "N/A".
 */
export function formatDuration(durationSeconds: bigint | number | undefined | null): string {
    if (durationSeconds === undefined || durationSeconds === null) return "N/A";
    let seconds = Number(durationSeconds);
    if (isNaN(seconds) || seconds < 0) return "N/A";
    if (seconds === 0) return "0 seconds";

    const d = Math.floor(seconds / (3600 * 24));
    seconds -= d * 3600 * 24;
    const h = Math.floor(seconds / 3600);
    seconds -= h * 3600;
    const m = Math.floor(seconds / 60);
    seconds -= m * 60;
    const s = Math.floor(seconds);

    let result = "";
    if (d > 0) result += `${d} day${d > 1 ? "s" : ""}, `;
    if (h > 0) result += `${h} hour${h > 1 ? "s" : ""}, `;
    if (m > 0) result += `${m} minute${m > 1 ? "s" : ""}, `;
    if (s > 0 || result === "") result += `${s} second${s > 1 ? "s" : ""}`;
    
    return result.endsWith(", ") ? result.slice(0, -2) : result;
}

/**
 * Formats a number or BigInt with thousands separators.
 * @param value The number or BigInt to format.
 * @returns A string with thousands separators (e.g., "1,234,567") or "N/A".
 */
export function formatNumber(value: bigint | number | undefined | null): string {
    if (value === undefined || value === null) return "N/A";
    return value.toLocaleString();
} 