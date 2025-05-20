export declare function extractTransportInfoFromUrl(url: string): Promise<Partial<{
    type: string;
    departure: string;
    arrival: string;
    date: string;
    duration: string;
    price: number;
    company: string;
    flightNumber: string;
}>>;
