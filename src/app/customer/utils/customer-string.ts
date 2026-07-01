/**
 * I use this function to set an id on each row of data tables.
 * ex: "w7afi"
 * @returns a 5 letters string.
 */
export function StrTempId(): string {
    return crypto.randomUUID();
}

/**
 * Create the initials shown on header.
 */
export function getInitials(name: string): string {
    if (!name) return '';
    const words = name.trim().split(/\s+/).filter(Boolean);
    const firstTwo = words.slice(0, 2);
    const initials = firstTwo.map((w) => w.charAt(0).toUpperCase()).join('');
    return initials;
}

/**
 * Returns a full name concatened, with proper spaces, given name in parts.
 */
export function concatFullName(firstName?: string, secondFirstName?: string, lastName?: string, secondLastName?: string): string {
    let fn  = firstName       ?? '';
    let sfn = secondFirstName ?? '';
    let ln  = lastName        ?? '';
    let sln = secondLastName  ?? '';

    let n = fn + ' ';
    n += sfn === '' ? '' : sfn + ' ';
    n += ln  === '' ? '' : ln  + ' ';
    n += sln === '' ? '' : sln + ' ';

    n = n.trim();

    return n;
}
