export declare class UrlValidator {
    private readonly allowedDomains;
    validateUrl(url: string, type: 'transport' | 'accommodation'): boolean;
    getDomainType(url: string): 'transport' | 'accommodation' | null;
}
