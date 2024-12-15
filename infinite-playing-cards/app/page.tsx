"use client";

import React from "react";
import { DECKS } from "@/decks";
import { Card } from "@/types/card";
import Image from "next/image";

export default function Home() {
  const [myCard, setMyCard] = React.useState<Card | null>(null);
  const [opponentCard, setOpponentCard] = React.useState<Card | null>(null);
  const [myCards, setMyCards] = React.useState<Card[]>([]);
  const [opponentCards, setOpponentCards] = React.useState<Card[]>([]);
  const [pooledCards, setPooledCards] = React.useState<Card[]>([]);
  const [matchUpCount, setMatchUpCount] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const myCardsRef = React.useRef<Card[]>([]);
  const opponentCardsRef = React.useRef<Card[]>([]);
  const pooledCardsRef = React.useRef<Card[]>([]);
  const matchUpCountRef = React.useRef<number>(0);

  myCardsRef.current = myCards;
  opponentCardsRef.current = opponentCards;
  pooledCardsRef.current = pooledCards;
  matchUpCountRef.current = matchUpCount;

  const initGame = () => {
    const mid = Math.floor(DECKS.length / 2);
    const myDeck = DECKS.slice(0, mid);
    const opponentDeck = DECKS.slice(mid);

    setMyCards(myDeck);
    setOpponentCards(opponentDeck);
    setMatchUpCount(0);
    setIsCompleted(false);
    setMyCard(null);
    setOpponentCard(null);
  };

  const startGame = () => {
    initGame();
    playRound();

    intervalRef.current = setInterval(() => {
      playRound();
    }, 100);
  };

  const getRandomElement = <T,>(array: T[]): number => {
    return Math.floor(Math.random() * array.length);
  };

  const stopGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsCompleted(true);
    setMyCard(null);
    setOpponentCard(null);
  };

  const playRound = () => {
    setMatchUpCount(matchUpCountRef.current + 1);

    const myCardIndex = getRandomElement(myCardsRef.current);
    const opponentCardIndex = getRandomElement(opponentCardsRef.current);
    const myCard = myCardsRef.current[myCardIndex];
    const opponentCard = opponentCardsRef.current[opponentCardIndex];

    setMyCard(myCard);
    setOpponentCard(opponentCard);

    if (!myCard) {
      alert("あなたの勝利!!");
      stopGame();
      return;
    }

    if (!opponentCard) {
      alert("あなたの敗北!!");
      stopGame();
      return;
    }

    if (myCard.value === opponentCard.value) {
      setPooledCards([...pooledCardsRef.current, myCard, opponentCard]);
      setMyCards(myCardsRef.current.filter((_, i) => i !== myCardIndex));
      setOpponentCards(
        opponentCardsRef.current.filter((_, i) => i !== opponentCardIndex)
      );
      return;
    }

    if (myCard.value > opponentCard.value) {
      setTimeout(() => {
        setOpponentCards([
          ...opponentCardsRef.current,
          myCard,
          ...pooledCardsRef.current,
        ]);
        setMyCards(myCardsRef.current.filter((_, i) => i !== myCardIndex));
        setPooledCards([]);
      }, 50);
    } else {
      setTimeout(() => {
        setMyCards([
          ...myCardsRef.current,
          opponentCard,
          ...pooledCardsRef.current,
        ]);
        setOpponentCards(
          opponentCardsRef.current.filter((_, i) => i !== opponentCardIndex)
        );
        setPooledCards([]);
      }, 50);
    }
  };

  React.useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-3xl">
        infinite-playing-card{" "}
        <div className="text-center text-2xl">試行回数:{matchUpCount}</div>
      </div>

      <div className="w-full flex justify-between gap-6">
        <div className="min-w-[300px] max-h-[500px] overflow-y-scroll grid grid-cols-5 gap-2">
          {myCards.map((card, i) => (
            <Image
              key={i}
              src={`/images/${card.suit}_${card.value}.png`}
              alt="myCard"
              width={51}
              height={80}
            />
          ))}
        </div>
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          {myCard && (
            <Image
              src={`/images/${myCard?.suit}_${myCard?.value}.png`}
              alt="myCard"
              width={306}
              height={504}
            />
          )}
          <span className="text-2xl">あなたの枚数:{myCards.length}</span>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
          {opponentCard && (
            <Image
              src={`/images/${opponentCard?.suit}_${opponentCard?.value}.png`}
              alt="myCard"
              width={306}
              height={504}
            />
          )}
          <span className="text-2xl">相手の枚数:{opponentCards.length}</span>
        </div>
        <div className="min-w-[300px] max-h-[500px] overflow-y-scroll grid grid-cols-5 gap-2">
          {opponentCards.map((card, i) => (
            <Image
              key={i}
              src={`/images/${card.suit}_${card.value}.png`}
              alt="myCard"
              width={51}
              height={80}
            />
          ))}
        </div>
      </div>
      {isCompleted ? (
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={initGame}
        >
          リセット
        </button>
      ) : (
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={startGame}
        >
          開始
        </button>
      )}
    </div>
  );
}
