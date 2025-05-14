export const designTemplates = [
  {
    id: 'birthday',
    name: 'Birthday Special',
    elements: [
      {
        type: 'text',
        options: {
          text: 'Happy Birthday!',
          fontSize: 40,
          fontFamily: 'Arial',
          fill: '#FF1493',
          top: 100,
          left: 100,
          fontWeight: 'bold'
        }
      },
      {
        type: 'image',
        options: {
          src: 'https://res.cloudinary.com/djjm5xvhs/image/upload/v1/images/birthday-cake',
          top: 200,
          left: 150,
          width: 100,
          height: 100
        }
      }
    ]
  },
  {
    id: 'sports',
    name: 'Sports Team',
    elements: [
      {
        type: 'text',
        options: {
          text: 'TEAM',
          fontSize: 50,
          fontFamily: 'Impact',
          fill: '#000080',
          top: 50,
          left: 150,
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        options: {
          text: '#23',
          fontSize: 80,
          fontFamily: 'Arial',
          fill: '#FF0000',
          top: 150,
          left: 180
        }
      }
    ]
  },
  {
    id: 'summer',
    name: 'Summer Vibes',
    elements: [
      {
        type: 'text',
        options: {
          text: 'Summer 2024',
          fontSize: 35,
          fontFamily: 'Helvetica',
          fill: '#FF8C00',
          top: 80,
          left: 120
        }
      },
      {
        type: 'image',
        options: {
          src: 'https://res.cloudinary.com/djjm5xvhs/image/upload/v1/images/palm-tree',
          top: 150,
          left: 100,
          width: 80,
          height: 80
        }
      }
    ]
  },
  {
    id: 'gaming',
    name: 'Gamer Style',
    elements: [
      {
        type: 'text',
        options: {
          text: 'GAME ON',
          fontSize: 45,
          fontFamily: 'Impact',
          fill: '#32CD32',
          top: 100,
          left: 130
        }
      }
    ]
  },
  {
    id: 'workout',
    name: 'Fitness Mode',
    elements: [
      {
        type: 'text',
        options: {
          text: 'NO PAIN\nNO GAIN',
          fontSize: 40,
          fontFamily: 'Arial',
          fill: '#000000',
          top: 90,
          left: 140,
          textAlign: 'center'
        }
      }
    ]
  }
];
