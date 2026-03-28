export interface Activity {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  time?: string;
  location?: string;
  type: 'flight' | 'hotel' | 'restaurant' | 'activity' | 'transport' | 'other';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface DayItinerary {
  date: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  imageUrl?: string;
  interests?: string[];
  itinerary: DayItinerary[];
  createdAt: string;
}
