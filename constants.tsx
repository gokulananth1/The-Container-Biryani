
import { MenuItem, Table, UserRole, InventoryItem, HomePageContent } from './types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Container Biryani',
    category: 'Main Course',
    price: 350,
    description: 'Slow-cooked aromatic basmati rice with tender spiced chicken and a boiled egg.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '2',
    name: 'Paneer Tikka Starter',
    category: 'Starters',
    price: 220,
    description: 'Smoky grilled paneer cubes marinated in yogurt and spices.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '3',
    name: 'Spicy Mango Mojito',
    category: 'Beverages',
    price: 150,
    description: 'Refreshing blend of ripe mango, mint, and a hint of chili.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a9f690?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '4',
    name: 'Gulab Jamun with Ice Cream',
    category: 'Desserts',
    price: 180,
    description: 'Warm gulab jamuns served with a scoop of vanilla bean ice cream.',
    image: 'https://images.unsplash.com/photo-1591465001581-2c579301099a?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '5',
    name: 'Hyderabadi Mutton Dum Biryani',
    category: 'Main Course',
    price: 450,
    description: 'Authentic goat meat biryani with long grain rice and saffron.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '6',
    name: 'Crispy Corn Fry',
    category: 'Starters',
    price: 190,
    description: 'Sweet corn kernels fried to perfection with curry leaves.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  // AFTERNOON & EVENING
  // Chicken Starters
  {
    id: '7',
    name: 'Chicken Starter (Bone)',
    category: 'Starters',
    price: 60,
    description: 'Classic bone-in chicken pieces, fried with a blend of local spices.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '8',
    name: 'Chicken Starter (Boneless)',
    category: 'Starters',
    price: 80,
    description: 'Tender boneless chicken bites, perfect for a quick and easy snack.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c7bab720?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '9',
    name: 'Chicken Lollipop',
    category: 'Starters',
    price: 140,
    description: 'Frenched chicken winglet, marinated and deep-fried until crisp.',
    image: 'https://images.unsplash.com/photo-1642112426344-9b51079453c9?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  // Snacks
  {
    id: '10',
    name: 'French Fries',
    category: 'Starters',
    price: 50,
    description: 'Classic golden french fries, salted and served hot.',
    image: 'https://images.unsplash.com/photo-1598679253544-2c9740680140?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '11',
    name: 'Grab Lollipop',
    category: 'Starters',
    price: 150,
    description: 'A special house version of the classic chicken lollipop, with extra spice.',
    image: 'https://images.unsplash.com/photo-1603542289953-855518b209a8?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '12',
    name: 'Fish Lollipop',
    category: 'Starters',
    price: 150,
    description: 'Boneless fish shaped into a lollipop, coated and fried.',
    image: 'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '13',
    name: 'Paneer Finger Fries',
    category: 'Starters',
    price: 120,
    description: 'Crispy fried paneer fingers, a vegetarian delight.',
    image: 'https://images.unsplash.com/photo-1619095952627-2c67452a8e73?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '14',
    name: 'Garlic Chicken',
    category: 'Starters',
    price: 140,
    description: 'Stir-fried chicken pieces tossed in a savory garlic sauce.',
    image: 'https://images.unsplash.com/photo-1604329221262-ac01a4036496?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  // Grill
  {
    id: '15',
    name: 'Full Grill Chicken',
    category: 'Main Course',
    price: 350,
    description: 'A whole chicken grilled to perfection with smoky flavors.',
    image: 'https://images.unsplash.com/photo-1598511829623-23b535436664?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '16',
    name: 'Half Grill Chicken',
    category: 'Main Course',
    price: 180,
    description: 'Half portion of our signature grilled chicken.',
    image: 'https://images.unsplash.com/photo-1625944112332-140a3318ff56?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '17',
    name: 'Quarter Grill Chicken',
    category: 'Main Course',
    price: 100,
    description: 'A single serving of our delicious grilled chicken.',
    image: 'https://images.unsplash.com/photo-1606041724754-b58a1d7c355c?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  // Other Items
  {
    id: '18',
    name: 'Margherita Pizza',
    category: 'Main Course',
    price: 250,
    description: 'Classic pizza with fresh tomatoes, mozzarella, and basil.',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '19',
    name: 'Spicy Chicken Burger',
    category: 'Main Course',
    price: 150,
    description: 'Crispy chicken patty with spicy sauce in a toasted bun.',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '20',
    name: 'Chocolate Milkshake',
    category: 'Beverages',
    price: 120,
    description: 'Rich and creamy chocolate milkshake, topped with whipped cream.',
    image: 'https://images.unsplash.com/photo-1600718374662-08150a2936e8?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  // EVENING
  // Fried Rice
  {
    id: '21',
    name: 'Veg Fried Rice',
    category: 'Main Course',
    price: 50,
    description: 'Wok-tossed rice with assorted fresh vegetables.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '22',
    name: 'Egg Fried Rice',
    category: 'Main Course',
    price: 60,
    description: 'Classic fried rice with scrambled eggs and veggies.',
    image: 'https://images.unsplash.com/photo-1582576353988-55725f448108?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '23',
    name: 'Chicken Fried Rice',
    category: 'Main Course',
    price: 80,
    description: 'Flavorful fried rice with tender chicken pieces.',
    image: 'https://images.unsplash.com/photo-1625113123833-fd73d6d56736?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '24',
    name: 'Paneer Fried Rice',
    category: 'Main Course',
    price: 80,
    description: 'Fried rice with soft paneer cubes and vegetables.',
    image: 'https://images.unsplash.com/photo-1631015243889-8a1e2f75871f?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '25',
    name: 'Mushroom Fried Rice',
    category: 'Main Course',
    price: 80,
    description: 'Earthy mushrooms and vegetables tossed with rice.',
    image: 'https://images.unsplash.com/photo-1599923508134-24a9f4c3a5ed?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  // Noodles
  {
    id: '26',
    name: 'Veg Noodles',
    category: 'Main Course',
    price: 50,
    description: 'Stir-fried noodles with a medley of crunchy vegetables.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '27',
    name: 'Egg Noodles',
    category: 'Main Course',
    price: 60,
    description: 'Noodles tossed with scrambled eggs and savory sauces.',
    image: 'https://images.unsplash.com/photo-1612927601601-76ce5927ef35?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '28',
    name: 'Chicken Noodles',
    category: 'Main Course',
    price: 80,
    description: 'A hearty bowl of noodles with chicken and vegetables.',
    image: 'https://images.unsplash.com/photo-1626645734283-79b8a2218206?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '29',
    name: 'Paneer Noodles',
    category: 'Main Course',
    price: 80,
    description: 'Soft paneer cubes stir-fried with noodles and veggies.',
    image: 'https://images.unsplash.com/photo-1631015243889-8a1e2f75871f?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '30',
    name: 'Mushroom Noodles',
    category: 'Main Course',
    price: 80,
    description: 'Sautéed mushrooms and noodles in a light sauce.',
    image: 'https://images.unsplash.com/photo-1599923508134-24a9f4c3a5ed?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  // Style of Chickens
  {
    id: '31',
    name: 'Chicken Manchurian',
    category: 'Main Course',
    price: 100,
    description: 'An Indo-Chinese classic with crispy chicken in a tangy sauce.',
    image: 'https://images.unsplash.com/photo-1585721999912-19d8e748f85f?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '32',
    name: 'Chinthamani Chicken',
    category: 'Main Course',
    price: 120,
    description: 'A spicy South Indian chicken preparation with red chilies.',
    image: 'https://images.unsplash.com/photo-1604329221262-ac01a4036496?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '33',
    name: 'Pallipalayam Chicken',
    category: 'Main Course',
    price: 120,
    description: 'A traditional chicken dish from Tamil Nadu with coconut flavors.',
    image: 'https://images.unsplash.com/photo-1618481187862-904021f56177?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '34',
    name: 'Dragon Chicken',
    category: 'Main Course',
    price: 160,
    description: 'A fiery dish with crispy chicken strips in a spicy red sauce.',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800',
    isAvailable: true,
    isVeg: false
  },
  {
    id: '35',
    name: 'Dragon Mushroom',
    category: 'Main Course',
    price: 120,
    description: 'Crispy mushrooms tossed in a sweet and spicy dragon sauce.',
    image: 'https://images.unsplash.com/photo-1598373182133-5b658d203994?q=80&w=800',
    isAvailable: true,
    isVeg: true
  },
  {
    id: '36',
    name: 'Dragon Paneer',
    category: 'Main Course',
    price: 140,
    description: 'A vegetarian version with paneer in a fiery dragon sauce.',
    image: 'https://images.unsplash.com/photo-1596043588923-a1a72a15f013?q=80&w=800',
    isAvailable: true,
    isVeg: true
  }
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 10 }, (_, i) => ({
  id: `t-${i + 1}`,
  number: `${i + 1}`,
  capacity: i < 4 ? 2 : 4,
  status: 'AVAILABLE'
}));

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i-1', name: 'Basmati Rice', quantity: 120, unit: 'KG', lowStockThreshold: 20, status: 'IN_STOCK' },
  { id: 'i-2', name: 'Chicken Breast', quantity: 45, unit: 'KG', lowStockThreshold: 15, status: 'IN_STOCK' },
  { id: 'i-3', name: 'Saffron Spices', quantity: 2, unit: 'KG', lowStockThreshold: 5, status: 'OUT_OF_STOCK' },
  { id: 'i-4', name: 'Onions', quantity: 12, unit: 'KG', lowStockThreshold: 20, status: 'IN_STOCK' },
  { id: 'i-5', name: 'Vegetable Oil', quantity: 80, unit: 'Liters', lowStockThreshold: 10, status: 'IN_STOCK' },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', roles: [UserRole.ADMIN] },
  { id: 'menu', label: 'Menu', roles: [UserRole.ADMIN, UserRole.STAFF] },
  { id: 'orders', label: 'Orders', roles: [UserRole.ADMIN, UserRole.STAFF] },
  { id: 'kitchen', label: 'Kitchen', roles: [UserRole.ADMIN, UserRole.CHEF] },
  { id: 'tables', label: 'Tables', roles: [UserRole.ADMIN] },
  { id: 'inventory', label: 'Inventory', roles: [UserRole.ADMIN, UserRole.CHEF] },
  { id: 'content', label: 'Content', roles: [UserRole.ADMIN] }
];

export const INITIAL_HOME_CONTENT: HomePageContent = {
  hero: {
    title: 'STEEL <br/><span class="text-orange-600 italic">CRAFTED</span>',
    subtitle: 'An innovative architectural fusion in Kadathur. <br/> Modern industrial-chic meets traditional Indian heritage.'
  },
  about: {
    title: 'ABOUT THE <br/><span class="text-orange-600">CONTAINER</span>',
    description: 'This restaurant is a landmark in Kadathur, known for its innovative architectural style using shipping containers. It offers a modern, vibrant dining experience that blends traditional Indian flavors with a contemporary "industrial-chic" atmosphere.',
    features: [
      { title: 'SIGNATURE AMBIANCE', desc: 'Multi-level container structure with warm lighting, popular for photography and social gatherings.' },
      { title: 'SEATING OPTIONS', desc: 'Choose between comfortable indoor climate-control or pleasant open-air outdoor seating.' },
      { title: 'FAMILY FRIENDLY', desc: 'Equipped with toddler high-chairs and a dedicated kids\' menu for family units.' },
      { title: 'ACCESSIBILITY', desc: 'Full wheelchair-accessible seating and entry ensures a welcoming environment for all.' }
    ]
  },
  culinary: {
    title: 'THE <span class="text-orange-600 italic">HIGHLIGHTS</span>',
    specialtyTitle: 'POT BIRYANI & <br/>SEERAGA SAMBA',
    specialtyDescription: 'Highly recommended for its "Pot Biryani" and Seeraga Samba rice varieties, noted for rich aroma and traditional spice blends.',
    mustTry: ['Tandoori Chicken', 'Chicken Lollipop', 'Prawn Masala', 'Tandoori Rotis']
  },
  insights: {
    serviceTip: '"Food quality is widely praised, but guests recommend arriving slightly early during peak weekend hours as service can take longer due to high demand."',
    atmosphere: '"Reviewers frequently describe the vibe as \'cozy\' and \'delightful,\' making it suitable for both casual lunches and special occasion dinners."'
  }
};
