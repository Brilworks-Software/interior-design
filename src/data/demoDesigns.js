import { rooms } from './rooms'

const brightRoom = rooms.find((r) => r.id === 'bright-spacious')
const openRoom = rooms.find((r) => r.id === 'open-spacious')

export const demoBedroom = {
  selectedRoom: brightRoom,
  roomWallColor: '#EDE9E3',
  roomFloorColor: '#B8956A',
  objects: [
    {
      id: 'demo-bed',
      furnitureId: 'bed',
      position: [0, 0, -3.4],
      rotation: 0,
      scale: 1,
      color: '#FFFFFF',
    },
    {
      id: 'demo-ns-l',
      furnitureId: 'nightstand',
      position: [-4.5, 0, -6],
      rotation: 0,
      scale: 1,
      color: '#2A1A0A',
    },
    {
      id: 'demo-ns-r',
      furnitureId: 'nightstand',
      position: [4.5, 0, -6],
      rotation: 0,
      scale: 1,
      color: '#2A1A0A',
    },
    {
      id: 'demo-lamp-l',
      furnitureId: 'table-lamp',
      position: [-4.5, 2.1, -6],
      rotation: 0,
      scale: 0.8,
      color: '#F5F0E0',
    },
    {
      id: 'demo-lamp-r',
      furnitureId: 'table-lamp',
      position: [4.5, 2.1, -6],
      rotation: 0,
      scale: 0.8,
      color: '#F5F0E0',
    },
    {
      id: 'demo-wardrobe',
      furnitureId: 'wardrobe',
      position: [-9.4, 0, -2],
      rotation: 90,
      scale: 1,
      color: '#FFFFFF',
    },
    {
      id: 'demo-desk',
      furnitureId: 'desk',
      position: [9.15, 0, -4],
      rotation: 270,
      scale: 1,
      color: '#B89060',
    },
    {
      id: 'demo-chair',
      furnitureId: 'office-chair',
      position: [7, 0, -4],
      rotation: 90,
      scale: 0.9,
      color: '#2A2A2A',
    },
    {
      id: 'demo-bookshelf',
      furnitureId: 'bookshelf',
      position: [-9.9, 0, 4],
      rotation: 90,
      scale: 1,
      color: '#A07840',
    },
    {
      id: 'demo-rug',
      furnitureId: 'rug',
      position: [0, 0, 1.5],
      rotation: 0,
      scale: 1.4,
      color: '#8B7060',
    },
    {
      id: 'demo-armchair',
      furnitureId: 'armchair',
      position: [-7, 0, 3.5],
      rotation: 90,
      scale: 1,
      color: '#2F4F4F',
    },
    {
      id: 'demo-side-table',
      furnitureId: 'side-table',
      position: [-5.2, 0, 3.5],
      rotation: 0,
      scale: 0.9,
      color: '#A07840',
    },
    {
      id: 'demo-floor-lamp',
      furnitureId: 'floor-lamp',
      position: [-8.8, 0, 5.5],
      rotation: 0,
      scale: 1,
      color: '#C8B890',
    },
    {
      id: 'demo-plant-r',
      furnitureId: 'plant',
      position: [9, 0, 5.5],
      rotation: 0,
      scale: 1.3,
      color: '#3A7A3A',
    },
    {
      id: 'demo-plant-l',
      furnitureId: 'plant',
      position: [9.2, 0, -1],
      rotation: 0,
      scale: 0.8,
      color: '#4A8A4A',
    },
  ],
}

export const demoLivingRoom = {
  selectedRoom: openRoom,
  roomWallColor: '#FAF8F5',
  roomFloorColor: '#C8A870',
  objects: [
    // === Lounge zone (left side) ===
    // TV stand — against back wall
    {
      id: 'lr-tv',
      furnitureId: 'tv-stand',
      position: [-5, 0, -7.65],
      rotation: 0,
      scale: 1.2,
      color: '#2A2A2A',
    },
    // Sofa — facing TV
    {
      id: 'lr-sofa',
      furnitureId: 'sofa',
      position: [-5, 0, -1.5],
      rotation: 0,
      scale: 1.2,
      color: '#4A4A4A',
    },
    // Coffee table — between sofa and TV
    {
      id: 'lr-coffee',
      furnitureId: 'coffee-table',
      position: [-5, 0, -4.2],
      rotation: 0,
      scale: 1,
      color: '#9B7840',
    },
    // Armchair left — facing right
    {
      id: 'lr-arm-l',
      furnitureId: 'armchair',
      position: [-11.5, 0, -4],
      rotation: 90,
      scale: 1,
      color: '#C4A882',
    },
    // Armchair right — facing left
    {
      id: 'lr-arm-r',
      furnitureId: 'armchair',
      position: [1.5, 0, -4],
      rotation: 270,
      scale: 1,
      color: '#C4A882',
    },
    // Large rug under seating area
    {
      id: 'lr-rug',
      furnitureId: 'rug',
      position: [-5, 0, -4],
      rotation: 0,
      scale: 2.0,
      color: '#1C3A5A',
    },
    // Floor lamp — beside left armchair
    {
      id: 'lr-lamp',
      furnitureId: 'floor-lamp',
      position: [-13, 0, -6.5],
      rotation: 0,
      scale: 1.1,
      color: '#B8860B',
    },
    // Side table — beside sofa
    {
      id: 'lr-side',
      furnitureId: 'side-table',
      position: [1.5, 0, -1],
      rotation: 0,
      scale: 0.9,
      color: '#9B7840',
    },
    // Table lamp on side table
    {
      id: 'lr-tlamp',
      furnitureId: 'table-lamp',
      position: [1.5, 1.71, -1],
      rotation: 0,
      scale: 0.8,
      color: '#F5F0E0',
    },

    // === Dining zone (right side) ===
    // Dining table
    {
      id: 'lr-dtable',
      furnitureId: 'dining-table',
      position: [8, 0, -2],
      rotation: 0,
      scale: 1,
      color: '#8B6914',
    },
    // Chair — back
    {
      id: 'lr-dc1',
      furnitureId: 'dining-chair',
      position: [8, 0, -5],
      rotation: 0,
      scale: 1,
      color: '#D4C4A8',
    },
    // Chair — front
    {
      id: 'lr-dc2',
      furnitureId: 'dining-chair',
      position: [8, 0, 1],
      rotation: 180,
      scale: 1,
      color: '#D4C4A8',
    },
    // Chair — left
    {
      id: 'lr-dc3',
      furnitureId: 'dining-chair',
      position: [4.5, 0, -2],
      rotation: 90,
      scale: 1,
      color: '#D4C4A8',
    },
    // Chair — right
    {
      id: 'lr-dc4',
      furnitureId: 'dining-chair',
      position: [11.5, 0, -2],
      rotation: 270,
      scale: 1,
      color: '#D4C4A8',
    },

    // === Decor ===
    // Bookshelf — left wall
    {
      id: 'lr-books',
      furnitureId: 'bookshelf',
      position: [-13.9, 0, 4.5],
      rotation: 90,
      scale: 1.2,
      color: '#4A3010',
    },
    // Plant — right front corner
    {
      id: 'lr-plant1',
      furnitureId: 'plant',
      position: [13, 0, 7],
      rotation: 0,
      scale: 1.4,
      color: '#3A7A3A',
    },
    // Plant — left front corner
    {
      id: 'lr-plant2',
      furnitureId: 'plant',
      position: [-13, 0, 7],
      rotation: 0,
      scale: 1.1,
      color: '#2A5A2A',
    },
    // Plant — beside TV
    {
      id: 'lr-plant3',
      furnitureId: 'plant',
      position: [-9.5, 0, -7.5],
      rotation: 0,
      scale: 0.9,
      color: '#4A8A4A',
    },
  ],
}
