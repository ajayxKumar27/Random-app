import { FaAppStoreIos, FaUser, FaGamepad, FaComments } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";

export const HomePageItems = [
  {
    id: 1,
    title: "Social Hub",
    icon: FaComments,
    route: "/social",
    subCategory: [
      {
        id: 2,
        title: "Chat Room",
        description: "Real-time group and private messaging.",
        icon: IoChatbubblesOutline,
        route: "/social/chat",
      }
    ],
  },
  {
    id: 2,
    title: "Games & Fun",
    icon: FaGamepad,
    route: "/games",
    subCategory: [
      {
        id: 1,
        title: "2048 Puzzle",
        description: "Swipe, merge, and reach 2048 in this addictive logic game.",
        icon: FaAppStoreIos,
        route: "/games/2048",
      },
      {
        id: 2,
        title: "Tic Tac Toe",
        description: "Classic X and O challenge for two players.",
        icon: FaAppStoreIos,
        route: "/games/tictactoe",
      },
    ]
  },
];

export const themeClasses = {
  teal: {
    bg: "from-teal-100 via-teal-200 to-white",
    text: "text-teal-900",
    btn: "bg-teal-500",
    border: "border-teal-300",
    gradientBtn: "from-teal-400 via-teal-500 to-teal-600",
    shadow: "text-teal-600",
    info: "text-teal-800",
  },
  blue: {
    bg: "from-blue-100 via-blue-200 to-white",
    text: "text-blue-900",
    btn: "bg-blue-500",
    border: "border-blue-300",
    gradientBtn: "from-blue-400 via-blue-500 to-blue-600",
    shadow: "text-blue-600",
    info: "text-blue-800",
  },
  purple: {
    bg: "from-purple-100 via-purple-200 to-white",
    text: "text-purple-900",
    btn: "bg-purple-500",
    border: "border-purple-300",
    gradientBtn: "from-purple-400 via-purple-500 to-purple-600",
    shadow: "text-purple-600",
    info: "text-purple-800",
  },
  violet: {
    bg: "from-violet-100 via-violet-200 to-white",
    text: "text-violet-900",
    btn: "bg-violet-500",
    border: "border-violet-300",
    gradientBtn: "from-violet-400 via-violet-500 to-violet-600",
    shadow: "text-violet-600",
    info: "text-violet-800",
  },
};