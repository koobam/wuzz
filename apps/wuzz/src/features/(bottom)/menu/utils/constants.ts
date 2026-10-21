import type { MenuCategory, MenuItem } from '../types';

/** Banner image URLs for menu carousel (coffee / drinks, 800px width). */
export const MENU_BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
];

export const MENU_BANNER_HEIGHT = 160;

export const MENU_BANNER_DOT_WIDTH_ACTIVE = 30;
export const MENU_BANNER_DOT_WIDTH_INACTIVE = 8;

/** Empty state copy for menu list. */
export const MENU_EMPTY = {
  search: {
    title: 'No items match your search.',
    description: 'Try a different keyword or category.',
    clearSearchLabel: 'Clear search',
  },
  data: {
    title: 'No menu items',
    description: 'Request a new menu or refresh to load items.',
    refreshLabel: 'Refresh',
    requestMenuLabel: 'Request a new menu',
  },
  error: {
    title: 'Something went wrong',
    description: 'Please try again.',
    refreshLabel: 'Refresh',
    requestMenuLabel: 'Request a new menu',
  },
} as const;

/** Scroll distance (px) after which the header outlet section is fully collapsed. */
export const MENU_HEADER_COLLAPSE_THRESHOLD = 80;
/** Approximate height of the outlet card in the menu header (for collapse animation).
 *  Includes the 20px the outlet card's pill badge hangs above the card itself —
 *  without that room the collapsing wrapper's overflow:hidden clips the pill. */
export const MENU_HEADER_OUTLET_SECTION_HEIGHT = 108;

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'coffee', name: 'Coffee' },
  { id: 'cold-brew', name: 'Cold Brew' },
  { id: 'non-coffee', name: 'Non-Coffe' },
  { id: 'smoothies', name: 'Smooth' },
  { id: 'food', name: 'Food' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'snack', name: 'Snack' },
  { id: 'combo', name: 'Combo' },
  { id: 'add-on', name: 'Add-on' },
];

export const MENU_ITEMS: MenuItem[] = [
  // Coffee
  { id: '1', categoryId: 'coffee', name: 'Americano', description: 'Espresso + water', price: 25000 },
  { id: '2', categoryId: 'coffee', name: 'Latte', description: 'Espresso + steamed milk', price: 28000 },
  { id: '3', categoryId: 'coffee', name: 'Cappuccino', description: 'Espresso + foam', price: 28000 },
  { id: '4', categoryId: 'coffee', name: 'Espresso', description: '', price: 18000 },
  { id: '5', categoryId: 'coffee', name: 'Mocha', description: 'Chocolate + espresso', price: 30000 },
  { id: '6', categoryId: 'coffee', name: 'Flat White', description: 'Double ristretto + microfoam', price: 32000 },
  { id: '7', categoryId: 'coffee', name: 'Macchiato', description: 'Espresso + milk foam', price: 22000 },
  { id: '8', categoryId: 'coffee', name: 'Affogato', description: 'Espresso + vanilla gelato', price: 35000 },
  { id: '9', categoryId: 'coffee', name: 'Vienna', description: 'Espresso + whipped cream', price: 29000 },
  { id: '10', categoryId: 'coffee', name: 'Long Black', description: '', price: 24000 },
  // Cold Brew
  { id: '11', categoryId: 'cold-brew', name: 'Classic Cold Brew', description: '', price: 28000 },
  { id: '12', categoryId: 'cold-brew', name: 'Nitro Cold Brew', description: 'Smooth & creamy', price: 32000 },
  { id: '13', categoryId: 'cold-brew', name: 'Vanilla Cold Brew', description: '', price: 30000 },
  { id: '14', categoryId: 'cold-brew', name: 'Salted Caramel Cold Brew', description: '', price: 33000 },
  { id: '15', categoryId: 'cold-brew', name: 'Hazelnut Cold Brew', description: '', price: 31000 },
  // Non-Coffee
  { id: '16', categoryId: 'non-coffee', name: 'Matcha Latte', description: '', price: 29000 },
  { id: '17', categoryId: 'non-coffee', name: 'Chocolate', description: '', price: 26000 },
  { id: '18', categoryId: 'non-coffee', name: 'Tea', description: '', price: 15000 },
  { id: '19', categoryId: 'non-coffee', name: 'Chai Latte', description: 'Spiced tea + milk', price: 27000 },
  { id: '20', categoryId: 'non-coffee', name: 'Turmeric Latte', description: '', price: 28000 },
  { id: '21', categoryId: 'non-coffee', name: 'Hot Chocolate', description: '', price: 25000 },
  { id: '22', categoryId: 'non-coffee', name: 'Green Tea', description: '', price: 14000 },
  { id: '23', categoryId: 'non-coffee', name: 'Earl Grey', description: '', price: 16000 },
  // Smoothies
  { id: '24', categoryId: 'smoothies', name: 'Berry Blast', description: 'Mixed berries + yogurt', price: 32000 },
  { id: '25', categoryId: 'smoothies', name: 'Mango Tango', description: '', price: 28000 },
  { id: '26', categoryId: 'smoothies', name: 'Green Detox', description: 'Spinach + apple + lime', price: 30000 },
  { id: '27', categoryId: 'smoothies', name: 'Tropical Paradise', description: '', price: 31000 },
  { id: '28', categoryId: 'smoothies', name: 'Peanut Butter Banana', description: '', price: 29000 },
  { id: '29', categoryId: 'smoothies', name: 'Strawberry Banana', description: '', price: 27000 },
  // Food
  { id: '30', categoryId: 'food', name: 'Sandwich', description: '', price: 35000 },
  { id: '31', categoryId: 'food', name: 'Croissant', description: '', price: 22000 },
  { id: '32', categoryId: 'food', name: 'Avocado Toast', description: '', price: 38000 },
  { id: '33', categoryId: 'food', name: 'Eggs Benedict', description: '', price: 45000 },
  { id: '34', categoryId: 'food', name: 'Pancake Stack', description: '', price: 42000 },
  { id: '35', categoryId: 'food', name: 'Waffle', description: '', price: 35000 },
  { id: '36', categoryId: 'food', name: 'Quiche', description: '', price: 32000 },
  { id: '37', categoryId: 'food', name: 'Bagel with Cream Cheese', description: '', price: 28000 },
  // Bakery
  { id: '38', categoryId: 'bakery', name: 'Chocolate Croissant', description: '', price: 26000 },
  { id: '39', categoryId: 'bakery', name: 'Almond Croissant', description: '', price: 28000 },
  { id: '40', categoryId: 'bakery', name: 'Cinnamon Roll', description: '', price: 24000 },
  { id: '41', categoryId: 'bakery', name: 'Brownie', description: '', price: 22000 },
  { id: '42', categoryId: 'bakery', name: 'Cheese Danish', description: '', price: 25000 },
  { id: '43', categoryId: 'bakery', name: 'Scone', description: '', price: 20000 },
  { id: '44', categoryId: 'bakery', name: 'Banana Bread', description: '', price: 23000 },
  // Snack
  { id: '45', categoryId: 'snack', name: 'Cookie', description: '', price: 12000 },
  { id: '46', categoryId: 'snack', name: 'Muffin', description: '', price: 18000 },
  { id: '47', categoryId: 'snack', name: 'Granola Bar', description: '', price: 15000 },
  { id: '48', categoryId: 'snack', name: 'Popcorn', description: '', price: 14000 },
  { id: '49', categoryId: 'snack', name: 'Mixed Nuts', description: '', price: 25000 },
  { id: '50', categoryId: 'snack', name: 'Fruit Cup', description: '', price: 20000 },
  { id: '51', categoryId: 'snack', name: 'Yogurt Parfait', description: '', price: 28000 },
  // Combo
  { id: '52', categoryId: 'combo', name: 'Coffee + Croissant', description: '', price: 40000 },
  { id: '53', categoryId: 'combo', name: 'Latte + Muffin', description: '', price: 43000 },
  { id: '54', categoryId: 'combo', name: 'Cold Brew + Sandwich', description: '', price: 58000 },
  { id: '55', categoryId: 'combo', name: 'Breakfast Set', description: 'Coffee + eggs + toast', price: 65000 },
  { id: '56', categoryId: 'combo', name: 'Office Combo', description: '2 coffee + 2 snack', price: 75000 },
  { id: '57', categoryId: 'combo', name: 'Sweet Combo', description: 'Drink + pastry', price: 45000 },
  // Add-on
  { id: '58', categoryId: 'add-on', name: 'Extra shot', description: '', price: 5000 },
  { id: '59', categoryId: 'add-on', name: 'Oat milk', description: '', price: 7000 },
  { id: '60', categoryId: 'add-on', name: 'Almond milk', description: '', price: 7000 },
  { id: '61', categoryId: 'add-on', name: 'Soy milk', description: '', price: 6000 },
  { id: '62', categoryId: 'add-on', name: 'Vanilla syrup', description: '', price: 5000 },
  { id: '63', categoryId: 'add-on', name: 'Caramel syrup', description: '', price: 5000 },
  { id: '64', categoryId: 'add-on', name: 'Hazelnut syrup', description: '', price: 5000 },
  { id: '65', categoryId: 'add-on', name: 'Whipped cream', description: '', price: 4000 },
];
