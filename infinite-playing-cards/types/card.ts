type Suit = "spade" | "clover" | "dia" | "heart" | "joker";

export interface Card {
  suit: Suit;
  value: number;
}
