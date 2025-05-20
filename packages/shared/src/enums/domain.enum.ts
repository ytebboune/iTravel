export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TransportType {
  PLANE = 'PLANE',
  TRAIN = 'TRAIN',
  BUS = 'BUS',
  CAR = 'CAR',
  BOAT = 'BOAT',
  OTHER = 'OTHER'
}

export enum AccommodationType {
  HOTEL = 'HOTEL',
  HOSTEL = 'HOSTEL',
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  CAMPING = 'CAMPING',
  OTHER = 'OTHER'
}

export enum ProjectStep {
  DATE_SELECTION = 'DATE_SELECTION',
  TRANSPORT = 'TRANSPORT',
  ACCOMMODATION = 'ACCOMMODATION',
  ACTIVITIES = 'ACTIVITIES',
} 