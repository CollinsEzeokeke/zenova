import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines classnames with tailwind merge for better styling
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Formats an address to a shortened version for display
 * @param address The address to format
 * @param prefixLength Number of characters to show at the beginning
 * @param suffixLength Number of characters to show at the end
 * @returns Formatted address string
 */
export function formatAddressShort(address: string, prefixLength = 6, suffixLength = 4): string {
    if (!address) return '';
    if (address.length <= prefixLength + suffixLength) return address;
    return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Format a number with thousands separators
 * @param value Number to format
 * @param decimals Number of decimal places
 * @returns Formatted number string with commas
 */
export function formatNumberWithCommas(value: number | string, decimals = 2): string {
    if (value === null || value === undefined) return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

type FontSizeVariant = 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

/**
 * Provides an adaptive font size class based on the length of the text
 * @param value The text value to render
 * @param baseSize The base font size to start with
 * @param minSize The minimum font size to use (defaults to xs)
 * @returns A Tailwind font size class
 */
export function getAdaptiveFontSize(
    value: string | number | undefined | null,
    baseSize: FontSizeVariant = 'lg',
    minSize: FontSizeVariant = 'xs'
): string {
    if (value === undefined || value === null) return `text-${baseSize}`;

    const stringValue = value.toString();
    const length = stringValue.length;

    // Map of length thresholds to font sizes
    const fontSizeMap: Record<number, FontSizeVariant> = {
        3: baseSize, // 0-3 characters uses baseSize
        6: getPreviousFontSize(baseSize),
        9: getPreviousFontSize(getPreviousFontSize(baseSize)),
        12: getPreviousFontSize(getPreviousFontSize(getPreviousFontSize(baseSize))),
        15: minSize,
    };

    // Find the appropriate font size based on text length
    let selectedSize = baseSize;
    const thresholds = Object.keys(fontSizeMap).map(Number).sort((a, b) => a - b);

    for (const threshold of thresholds) {
        if (length > threshold) {
            selectedSize = fontSizeMap[threshold];
        } else {
            break;
        }
    }

    return `text-${selectedSize}`;
}

/**
 * Gets the previous smaller font size in the Tailwind scale
 */
function getPreviousFontSize(size: FontSizeVariant): FontSizeVariant {
    const sizeScale: FontSizeVariant[] = ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    const currentIndex = sizeScale.indexOf(size);

    if (currentIndex <= 0) return 'xs';
    return sizeScale[currentIndex - 1];
}

/**
 * Utility to combine the adaptive font size with additional classes
 */
export function adaptiveText(
    value: string | number | undefined | null,
    baseSize: FontSizeVariant = 'lg',
    additionalClasses?: string,
    minSize: FontSizeVariant = 'xs'
): string {
    const fontSizeClass = getAdaptiveFontSize(value, baseSize, minSize);
    return additionalClasses ? `${fontSizeClass} ${additionalClasses}` : fontSizeClass;
} 