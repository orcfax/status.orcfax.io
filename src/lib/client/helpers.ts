export function formatPercentageValue(num: number) {
	// Check if the number is close to an integer
	if (Math.abs(num - Math.round(num)) < 0.005) {
		return Math.round(num).toString();
	} else {
		return num.toFixed(2);
	}
}

interface EllipsisOptions {
	maxLength?: number;
	placement?: 'start' | 'middle' | 'end';
}

export function ellipsis(str: string | number, options?: EllipsisOptions) {
	const maxLength = options?.maxLength || 20;
	const placement = options?.placement || 'end';

	if (typeof str === 'number') str = str.toString();

	if (str.length > maxLength) {
		if (placement === 'start') return '...' + str.slice(-maxLength);
		else if (placement === 'middle') return str.slice(0, 6) + '...' + str.slice(-6);
		else if (placement === 'end') return str.slice(0, maxLength) + '...';
	}
	return str;
}

interface FormatOptions {
	truncate?: boolean;
}

export function formatNumber(number: number, { truncate = true }: FormatOptions = {}) {
	return new Intl.NumberFormat('en-US').format(truncate ? Math.trunc(number) : number);
}
