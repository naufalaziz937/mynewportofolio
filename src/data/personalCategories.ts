export const PERSONAL_CATEGORIES = [
  { key: 'hobbies', label: 'Hobbies' },
  { key: 'currently', label: 'Currently Into' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'dream-setup', label: 'Dream Setup' },
  { key: 'dream-garage', label: 'Dream Garage' },
  { key: 'dream-home', label: 'Dream Home' },
  { key: 'career-goal', label: 'Career Goal' },
  { key: 'life-goal', label: 'Life Goal' },
  { key: 'bucket-list', label: 'Bucket List' },
  { key: 'fun-facts', label: 'Fun Facts' },
  { key: 'personal-quote', label: 'Personal Quote' }
] as const;

export type PersonalCategory = typeof PERSONAL_CATEGORIES[number]['key'];
export type PersonalCardSize = 'small' | 'wide' | 'tall' | 'large';
export type PersonalDisplayMode = 'visual' | 'text';
export const PERSONAL_CARD_SIZES: PersonalCardSize[] = ['small', 'wide', 'tall', 'large'];
export const personalCategoryLabel = (key: PersonalCategory): string => PERSONAL_CATEGORIES.find(category => category.key === key)?.label ?? key;
