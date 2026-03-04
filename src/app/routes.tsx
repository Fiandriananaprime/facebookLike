import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Home } from "./components/pages/Home";
import { Messenger } from "./components/pages/Messenger";
import { Reels } from "./components/pages/Reels";
import { Marketplace } from "./components/pages/Marketplace";
import { Gaming } from "./components/pages/Gaming";
import { Profile } from "./components/pages/Profile";
import { NotFound } from "./components/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "messenger", Component: Messenger },
      { path: "reels", Component: Reels },
      { path: "marketplace", Component: Marketplace },
      { path: "gaming", Component: Gaming },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);
