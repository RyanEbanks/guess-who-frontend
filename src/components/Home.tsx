import React, { useState } from 'react';
import '../index';
import Footer from './Footer';

const characters = [
  { id: 1, name: 'Crocodile', emoji: '/images/characters/crocodile.png', color: '#4F46E5' },
  { id: 2, name: 'Tiger', emoji: '/images/characters/tiger.png', color: '#EF4444' },
  { id: 3, name: 'Duck', emoji: '/images/characters/duck.png', color: '#8B5CF6' },
  { id: 4, name: 'Bear', emoji: '/images/characters/bear.png', color: '#10B981' },
  { id: 5, name: 'Rhino', emoji: '/images/characters/rhino.png', color: '#F59E0B' },
  { id: 6, name: 'Frog', emoji: '/images/characters/frog.png', color: '#06B6D4' },
  { id: 7, name: 'Elephant', emoji: '/images/characters/elephant.png', color: '#06B6D4' },
  { id: 8, name: 'Lion', emoji: '/images/characters/lion.png', color: '#06B6D4' },
  { id: 9, name: 'Dinosaur', emoji: '/images/characters/dinosaur.png', color: '#06B6D4' },
  { id: 10, name: 'Penguin', emoji: '/images/characters/penguin.png', color: '#06B6D4' },
  { id: 11, name: 'Zebra', emoji: '/images/characters/zebra.png', color: '#06B6D4' },
  { id: 12, name: 'Hippo', emoji: '/images/characters/hippo.png', color: '#06B6D4' },
  { id: 13, name: 'Mouse', emoji: '/images/characters/mouse.png', color: '#06B6D4' },
]

const Home = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [refreshArrow, setRefreshArrow] = useState(0);

  const nextCharacter = () => {
   let nextArrow = refreshArrow + 1;

   if(nextArrow >= characters.length) {
    nextArrow = 0;
   }

   setRefreshArrow(nextArrow);
   setSelectedCharacter(characters[nextArrow]);
  }

  return (
    <div className='game-container'>
      {/* Main Content Card */}
        {/* Logo Section */}
        <div className='logo-section'>
          <div className='logo-container'>
            <img src='/transparent_logo.png' alt='Guess Who Logo' className='logo-image' />
          </div>
        </div>
      <div className='main-card'>

        {/* Welcome Text */}
        <div className='welcome-section'>
          <p className='game-subtitle'>Choose your character and start playing!</p>
        </div>

        {/* Character Selection */}
        <div className='character-section'>
          <h2 className='section-title'>Pick a Character</h2>
          <div className='character-grid'>
              <div
                className='character-card'
                // style={{ '--character-color': character.color } as React.CSSProperties}
              >
                <img className='character-emoji' src={selectedCharacter.emoji} />
                <span className='character-name'>{selectedCharacter.name}</span>
              </div>
              <button onClick={nextCharacter} className='refresh-button'>
                <span className='button-icon'>↻</span>
                </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='action-section'>
          <input className='play-input' placeholder='Enter Nickname' />
          <button className='private-button'>
            <span className='button-icon'>+</span>
            CREATE PRIVATE ROOM
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home;