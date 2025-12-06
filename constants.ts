import { Category } from './types';

// Placeholder images
const PLACEHOLDER_IMG = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;

export const WHATSAPP_NUMBER = "919876543210"; // Replace with actual cafe owner number

export const INITIAL_MENU: Category[] = [
  {
    id: 'c1',
    name: 'Thick Shake',
    image: 'images/thickshake.jpg',
    subCategories: [
      {
        id: 'sc1',
        name: 'Regular Thick Shake',
        image: PLACEHOLDER_IMG('regular-shake'),
        products: [
          { id: 'p1', name: 'Vanilla Classic', price: 150, image: PLACEHOLDER_IMG('vanilla') },
          { id: 'p2', name: 'Strawberry Blast', price: 160, image: PLACEHOLDER_IMG('strawberry') },
        ]
      },
      {
        id: 'sc2',
        name: 'Brown Thick Shake',
        image: PLACEHOLDER_IMG('brown-shake'),
        products: [
          { id: 'p3', name: 'Bournville Delight', price: 180, image: PLACEHOLDER_IMG('bournville') },
          { id: 'p4', name: 'Nutella Brownie', price: 200, image: PLACEHOLDER_IMG('nutella') },
        ]
      },
      {
        id: 'sc3',
        name: 'Chocolate Thick Shake',
        image: PLACEHOLDER_IMG('choco-shake'),
        products: [
          { id: 'p5', name: 'Belgian Dark', price: 190, image: PLACEHOLDER_IMG('belgian') },
          { id: 'p6', name: 'KitKat Crunch', price: 180, image: PLACEHOLDER_IMG('kitkat') },
        ]
      },
      {
        id: 'sc4',
        name: 'Fruit Thick Shake',
        image: PLACEHOLDER_IMG('fruit-shake'),
        products: [
          { id: 'p7', name: 'Mango Alphonso', price: 170, image: PLACEHOLDER_IMG('mango') },
          { id: 'p8', name: 'Mixed Berry', price: 180, image: PLACEHOLDER_IMG('berry') },
        ]
      },
      {
        id: 'sc5',
        name: 'Dry Fruit Thick Shake',
        image: PLACEHOLDER_IMG('dryfruit-shake'),
        products: [
          { id: 'p9', name: 'Kaju Anjeer', price: 220, image: PLACEHOLDER_IMG('kaju') },
          { id: 'p10', name: 'Royal Pista', price: 230, image: PLACEHOLDER_IMG('pista') },
        ]
      },
      {
        id: 'sc6',
        name: 'Special Classic Thick Shake',
        image: PLACEHOLDER_IMG('special-shake'),
        products: [
          { id: 'p11', name: 'Dezzerto Signature', price: 250, image: PLACEHOLDER_IMG('signature') },
          { id: 'p12', name: 'Rose Falooda Shake', price: 210, image: PLACEHOLDER_IMG('rose') },
        ]
      }
    ]
  },
  {
    id: 'c2',
    name: 'Milkshake',
    image: 'images/milkshake.jpg',
    products: [
      { id: 'p13', name: 'Classic Vanilla', price: 120, image: PLACEHOLDER_IMG('m-vanilla') },
      { id: 'p14', name: 'Chocolate Chip', price: 130, image: PLACEHOLDER_IMG('m-choco') },
      { id: 'p15', name: 'Butterscotch', price: 130, image: PLACEHOLDER_IMG('m-butter') },
    ]
  },
  {
    id: 'c3',
    name: 'Ice Creams',
    image: 'images/icecreams.jpg',
    products: [
      { id: 'p16', name: 'Single Scoop Vanilla', price: 60, image: PLACEHOLDER_IMG('sc-vanilla') },
      { id: 'p17', name: 'Double Scoop Chocolate', price: 110, image: PLACEHOLDER_IMG('sc-choco') },
      { id: 'p18', name: 'Sundae Special', price: 180, image: PLACEHOLDER_IMG('sundae') },
    ]
  },
  {
    id: 'c4',
    name: 'Brownies',
    image: 'images/brownies.jpg',
    products: [
      { id: 'p19', name: 'Walnut Brownie', price: 90, image: PLACEHOLDER_IMG('walnut') },
      { id: 'p20', name: 'Sizzling Brownie', price: 160, image: PLACEHOLDER_IMG('sizzling') },
    ]
  },
  {
    id: 'c5',
    name: 'Hot Breve',
    image: 'images/hotbreve.jpg',
    products: [
      { id: 'p21', name: 'Espresso', price: 80, image: PLACEHOLDER_IMG('espresso') },
      { id: 'p22', name: 'Cappuccino', price: 120, image: PLACEHOLDER_IMG('cappuccino') },
    ]
  },
  {
    id: 'c6',
    name: 'Cold Breve',
    image: 'images/coldbreve.jpg',
    products: [
      { id: 'p23', name: 'Iced Latte', price: 140, image: PLACEHOLDER_IMG('iced-latte') },
      { id: 'p24', name: 'Frappe', price: 160, image: PLACEHOLDER_IMG('frappe') },
    ]
  },
  {
    id: 'c7',
    name: 'Jamun Shot',
    image: 'images/jamunshot.jpg',
    products: [
      { id: 'p25', name: 'Classic Jamun Shot', price: 50, image: PLACEHOLDER_IMG('jamun-shot') },
      { id: 'p26', name: 'Spicy Jamun Shot', price: 60, image: PLACEHOLDER_IMG('spicy-jamun') },
    ]
  },
  {
    id: 'c8',
    name: 'Hot Chocolate',
    image: 'images/hotchocolate.jpg',
    products: [
      { id: 'p27', name: 'Classic Hot Chocolate', price: 150, image: PLACEHOLDER_IMG('classic-hc') },
      { id: 'p28', name: 'Hazelnut Hot Chocolate', price: 180, image: PLACEHOLDER_IMG('hazel-hc') },
    ]
  }
];