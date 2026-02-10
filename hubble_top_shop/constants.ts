import { ShoppingCart, Search, User, Phone, Mail } from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Home', href: '#' },
  { name: 'Marvel', href: '#marvel' },
  { name: 'Anime', href: '#anime' },
  { name: 'Statues', href: '#statues' },
  { name: 'Exclusives', href: '#exclusives' },
];

export const NEW_ARRIVALS = [
  {
    id: 1,
    name: "Iron Man Mark LXXXV",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=600&auto=format&fit=crop",
    tag: "Hot Toys"
  },
  {
    id: 2,
    name: "Roronoa Zoro: Oni Giri",
    price: 320.00,
    image: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=600&auto=format&fit=crop",
    tag: "Best Seller"
  },
  {
    id: 3,
    name: "Spider-Man 2099",
    price: 280.00,
    image: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=600&auto=format&fit=crop",
    tag: "Trending"
  },
  {
    id: 4,
    name: "EVA Unit-01 Test Type",
    price: 600.00,
    image: "https://images.unsplash.com/photo-1615413250263-bb04cc0a3988?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tag: "Pre-order"
  }
];

export const CATEGORIES = [
  { id: 'c1', name: "Action Figures", image: "https://images.unsplash.com/photo-1762089423685-60f5cef02cda?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", span: "md:col-span-2 md:row-span-2" },
  { id: 'c2', name: "Marvel", image: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&auto=format&fit=crop", span: "md:col-span-1" },
  { id: 'c3', name: "DC", image: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=800&auto=format&fit=crop", span: "md:col-span-1" },
  { id: 'c4', name: "Dragon Ball", image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800&auto=format&fit=crop", span: "md:col-span-1" },
  { id: 'c5', name: "Naruto", image: "https://images.unsplash.com/photo-1764730282820-f9cdd430b1c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", span: "md:col-span-1" },
  // { id: 'c6', name: "Tom & Jerry", image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop", span: "md:col-span-2" }, 
  // { id: 'c7', name: "Super Mario", image: "https://images.unsplash.com/photo-1612404730960-5c71579fca2c?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1" },
  // { id: 'c8', name: "Demon Slayer", image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1" },
  // { id: 'c9', name: "Harry Potter", image: "https://images.unsplash.com/photo-1618944847023-38aa001235f0?q=80&w=800&auto=format&fit=crop", span: "md:col-span-2" },
  // { id: 'c10', name: "Doraemon", image: "https://images.unsplash.com/photo-1606660265514-358ebbadc80d?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1" },
  // { id: 'c11', name: "Pirates", image: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=800&auto=format&fit=crop", span: "md:col-span-1" },
  { id: 'c12', name: "One Piece", image: "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&auto=format&fit=crop", span: "md:col-span-2" },
  { id: 'c13', name: "Disney", image: "https://images.unsplash.com/photo-1615413250263-bb04cc0a3988?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", span: "md:col-span-2 md:row-span-2" },
  { id: 'c14', name: "Jujutsu Kaisen", image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800&auto=format&fit=crop", span: "md:col-span-1" },
  { id: 'c15', name: "Pokemon", image: "https://images.unsplash.com/photo-1542779283-429940ce8336?w=800&auto=format&fit=crop", span: "md:col-span-1" },
];

export const STACK_SECTIONS = [
  {
    id: 's1',
    title: 'The Infinity Saga',
    buttonText: 'Assemble',
    image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=1920&auto=format&fit=crop', 
    align: 'left'
  },
  {
    id: 's2',
    title: 'Straw Hat Crew',
    buttonText: 'Set Sail',
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=1920&auto=format&fit=crop',
    align: 'right'
  },
  {
    id: 's3',
    title: 'Gotham City',
    buttonText: 'Save the City',
    image: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=1920&auto=format&fit=crop',
    align: 'center' 
  },
  {
    id: 's4',
    title: 'Jujutsu Kaisen',
    buttonText: 'Domain Expansion',
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=1920&auto=format&fit=crop', 
    align: 'left'
  },
  {
    id: 's5',
    title: 'Star Wars',
    buttonText: 'Galaxy Edge',
    image: 'https://images.unsplash.com/photo-1635046944389-594cc96aa692?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    align: 'right'
  },
  {
    id: 's6',
    title: 'Cyberpunk',
    buttonText: 'Future Tech',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&auto=format&fit=crop',
    align: 'center'
  }
];