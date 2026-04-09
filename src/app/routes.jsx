import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import { Home } from "./components/pages/Home";
import { Messenger } from "./components/pages/Messenger";
import { Reels } from "./components/pages/Reels";
import { Marketplace } from "./components/pages/Marketplace";
import { Gaming } from "./components/pages/Gaming";
import { Profile } from "./components/pages/Profile";
import { NotFound } from "./components/pages/NotFound";

const router = createBrowserRouter([
  // Routes publiques (login / signup)
  { path: "/", Component: Login },
  { path: "/signup", Component: SignUp },

  // Routes avec RootLayout (navbar)
  {
    path: "/",
    Component: RootLayout,
    children: [
      { path: "home", Component: Home },
      { path: "messenger", Component: Messenger },
      { path: "reels", Component: Reels },
      { path: "marketplace", Component: Marketplace },
      { path: "gaming", Component: Gaming },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);

export { router };
