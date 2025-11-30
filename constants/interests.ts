export interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const INTERESTS: Interest[] = [
  { id: 'adventure', name: 'Adventure', icon: 'mountain', color: '#FF6B6B' },
  { id: 'culture', name: 'Culture', icon: 'landmark', color: '#4ECDC4' },
  { id: 'food', name: 'Food & Dining', icon: 'utensils', color: '#FFD93D' },
  { id: 'nature', name: 'Nature', icon: 'trees', color: '#6BCF7F' },
  { id: 'beach', name: 'Beach', icon: 'waves', color: '#45B7D1' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping-bag', color: '#F38181' },
  { id: 'nightlife', name: 'Nightlife', icon: 'music', color: '#A78BFA' },
  { id: 'relaxation', name: 'Relaxation', icon: 'spa', color: '#FCA5A5' },
  { id: 'history', name: 'History', icon: 'book-open', color: '#FBBF24' },
  { id: 'sports', name: 'Sports', icon: 'dumbbell', color: '#34D399' },
  { id: 'photography', name: 'Photography', icon: 'camera', color: '#818CF8' },
  { id: 'wildlife', name: 'Wildlife', icon: 'bird', color: '#FB923C' },
];
