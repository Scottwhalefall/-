export interface BallColor {
  bg: string;
  shadow: string;
}

export const BALL_COLORS: BallColor[] = [
  { bg: 'bg-red-500', shadow: 'bg-red-600' },
  { bg: 'bg-blue-500', shadow: 'bg-blue-600' },
  { bg: 'bg-green-500', shadow: 'bg-green-600' },
  { bg: 'bg-yellow-400', shadow: 'bg-yellow-500' },
  { bg: 'bg-purple-500', shadow: 'bg-purple-600' },
  { bg: 'bg-pink-500', shadow: 'bg-pink-600' },
  { bg: 'bg-orange-500', shadow: 'bg-orange-600' },
  { bg: 'bg-teal-400', shadow: 'bg-teal-500' },
];

export interface LotteryState {
  currentNumber: number | null;
  history: number[];
  isShaking: boolean;
  isDrawing: boolean;
}