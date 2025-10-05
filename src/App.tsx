import './App.css'
import cardsData from './cards.json'
import { useState } from 'react'

interface Card {
  id: number;
  suit: string;
  rank: string;
  value: number;
  name: string;
  color: string;
}

function App() {
  const cards: Card[] = cardsData.cards;
  const [clickedCards, setClickedCards] = useState<Set<number>>(new Set());
  const [hideClickedCards, setHideClickedCards] = useState<boolean>(false);
  const [cardsToHide, setCardsToHide] = useState<Set<number>>(new Set());

  // Sort cards by rank order: A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2
  const getRankOrder = (rank: string): number => {
    switch (rank) {
      case 'A': return 1;
      case 'K': return 2;
      case 'Q': return 3;
      case 'J': return 4;
      case '10': return 5;
      case '9': return 6;
      case '8': return 7;
      case '7': return 8;
      case '6': return 9;
      case '5': return 10;
      case '4': return 11;
      case '3': return 12;
      case '2': return 13;
      default: return 14;
    }
  };

  // Group cards by suit and sort within each suit by rank
  const suitOrder = ['hearts', 'diamonds', 'clubs', 'spades'];
  const groupedCards = suitOrder.map(suit => {
    const suitCards = cards
      .filter(card => card.suit === suit)
      .sort((a, b) => getRankOrder(a.rank) - getRankOrder(b.rank));
    return { suit, cards: suitCards };
  });

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitName = (suit: string) => {
    return suit.charAt(0).toUpperCase() + suit.slice(1);
  };

  const handleCardClick = (cardId: number) => {
    setClickedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId); // If already clicked, remove it (toggle)
      } else {
        newSet.add(cardId); // If not clicked, add it
      }
      return newSet;
    });
  };

  const resetGame = () => {
    setClickedCards(new Set());
    setHideClickedCards(false);
    setCardsToHide(new Set());
  };

  const hideUsedCards = () => {
    // Always hide currently clicked cards
    setCardsToHide(new Set(clickedCards));
    setHideClickedCards(true);
  };

  const isCardClicked = (cardId: number) => clickedCards.has(cardId);

  return (
    <div className="min-h-screen p-3 bg-gray-100 w-full">
      {/* <h1 className="text-center text-gray-800 text-4xl font-bold mb-8 drop-shadow-lg md:text-5xl">
        Playing Cards Deck
      </h1> */}
      
      {groupedCards.map((group) => (
        <div key={group.suit} className="mb-2">
          {/* Suit Heading */}
          <div className="flex items-center mb-2">
            <h2 className={`text-xl font-bold mr-3 ${
              group.cards[0]?.color === 'red' ? 'text-red-600' : 'text-gray-800'
            }`}>
              {getSuitSymbol(group.suit)} {getSuitName(group.suit)}
            </h2>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
          </div>
          
          {/* Cards Grid for this suit */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-2 w-full xl:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] lg:gap-3 md:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:gap-2.5 md:px-2.5 sm:grid-cols-[repeat(auto-fill,minmax(85px,1fr))] sm:gap-2 sm:px-1">
            {group.cards
              .filter(card => hideClickedCards ? !cardsToHide.has(card.id) : true)
              .map((card) => {
              const clicked = isCardClicked(card.id);
              return (
                <div 
                  key={card.id} 
                  onClick={() => handleCardClick(card.id)}
                  className={`rounded-lg border-2 p-1 text-center shadow-lg transition-all duration-200 min-h-[70px] flex flex-col justify-between cursor-pointer md:p-2.5 md:min-h-[120px] sm:p-2 sm:min-h-[100px] ${
                    clicked 
                      ? 'bg-gray-300 border-gray-500 opacity-50 scale-95' 
                      : 'bg-white border-gray-800 hover:-translate-y-1 hover:shadow-xl'
                  }`}
                >
                  <div className={`text-2xl font-bold mb-1 md:text-2xl sm:text-xl ${
                    clicked 
                      ? 'text-gray-500' 
                      : card.color === 'red' ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {card.rank}
                  </div>
                  <div className={`text-2xl my-1 md:text-3xl sm:text-3xl ${
                    clicked 
                      ? 'text-gray-500' 
                      : card.color === 'red' ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {getSuitSymbol(card.suit)}
                  </div>
                  {/* <div className={`text-xs font-medium mt-1 md:text-xs sm:text-xs ${
                    clicked ? 'text-gray-500 opacity-60' : 'opacity-80'
                  }`}>
                    {card.name}
                  </div> */}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Fixed Control Buttons */}
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={hideUsedCards}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 text-sm"
        >
          Hide Cards
        </button>
        <button
          onClick={resetGame}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 text-sm"
        >
          Reset Game
        </button>
      </div>
    </div>
  )
}

export default App
