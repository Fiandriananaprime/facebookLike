import { Outlet, Link, useLocation } from "react-router";
import { Home, MessageCircle, Video, ShoppingBag, Gamepad2, Bell, Menu, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function RootLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/messenger", icon: MessageCircle, label: "Messenger" },
    { path: "/reels", icon: Video, label: "Reels" },
    { path: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
    { path: "/gaming", icon: Gamepad2, label: "Gaming" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2 flex-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">f</span>
              </div>
            </Link>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search Facebook"
                className="pl-10 w-60 bg-gray-100 border-none"
              />
            </div>
          </div>

          {/* Center Section - Navigation */}
          <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center w-24 h-14 relative group ${
                  isActive(item.path)
                    ? "text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                } rounded-lg transition-colors`}
              >
                <item.icon className="w-6 h-6" />
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
              <Menu className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
              <Bell className="w-5 h-5" />
            </Button>
            <Link to="/profile">
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around h-14 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-center flex-1 h-full ${
              isActive(item.path) ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <item.icon className="w-6 h-6" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
