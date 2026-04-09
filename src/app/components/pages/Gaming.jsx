import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Play, TrendingUp, Users, Clock } from "lucide-react";
const featuredGames = [
  {
    id: 1,
    title: "Competitive Esports Tournament",
    image:
      "https://images.unsplash.com/photo-1759701546851-1d903ac1a2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwY29tcGV0aXRpdmV8ZW58MXx8fHwxNzcyNTA5NDcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Tournament",
    players: "45.2K watching",
    badge: "LIVE",
  },
  {
    id: 2,
    title: "Console Gaming Setup Stream",
    image:
      "https://images.unsplash.com/photo-1687713143171-b1ffd531263d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwY29udHJvbGxlciUyMGNvbnNvbGV8ZW58MXx8fHwxNzcyNjMzNDQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Console",
    players: "23.5K watching",
    badge: "LIVE",
  },
];
const gameCategories = [
  {
    id: 1,
    title: "RGB Gaming Setup Tour",
    image:
      "https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMHJnYnxlbnwxfHx8fDE3NzI2MDUyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "PC Gaming",
    players: "892K players",
  },
  {
    id: 2,
    title: "Mobile Gaming Championships",
    image:
      "https://images.unsplash.com/photo-1661347999665-579bb8f9402d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBnYW1pbmclMjBzbWFydHBob25lfGVufDF8fHx8MTc3MjUzOTY1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Mobile Gaming",
    players: "654K players",
  },
  {
    id: 3,
    title: "Strategy Games Marathon",
    image:
      "https://images.unsplash.com/photo-1759701546851-1d903ac1a2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwY29tcGV0aXRpdmV8ZW58MXx8fHwxNzcyNTA5NDcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Strategy",
    players: "445K players",
  },
  {
    id: 4,
    title: "Racing Simulator League",
    image:
      "https://images.unsplash.com/photo-1687713143171-b1ffd531263d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwY29udHJvbGxlciUyMGNvbnNvbGV8ZW58MXx8fHwxNzcyNjMzNDQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Racing",
    players: "321K players",
  },
];
const trendingGames = [
  { name: "Battle Royale Legends", icon: "\u{1F3AE}", growth: "+45%" },
  { name: "Space Odyssey", icon: "\u{1F680}", growth: "+38%" },
  { name: "Fantasy Quest Online", icon: "\u2694\uFE0F", growth: "+32%" },
  { name: "City Builder Pro", icon: "\u{1F3D9}\uFE0F", growth: "+28%" },
];
function Gaming() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-screen-2xl mx-auto p-4 pb-20 md:pb-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Gaming</h1>
          <p className="text-gray-600">Play games and watch live streams</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Featured Live Streams */}
            <section>
              <h2 className="text-xl font-bold mb-4">Live Now</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredGames.map((game) => (
                  <Card
                    key={game.id}
                    className="bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={game.image}
                        alt={game.title}
                        className="w-full h-64 object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                        {game.badge}
                      </Badge>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            className="w-16 h-16 rounded-full bg-white/90 hover:bg-white"
                          >
                            <Play className="w-8 h-8 text-blue-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{game.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {game.players}
                        </span>
                        <Badge variant="secondary">{game.category}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Game Categories */}
            <section>
              <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameCategories.map((game) => (
                  <Card
                    key={game.id}
                    className="bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-white mb-1">
                          {game.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-200 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {game.players}
                          </span>
                          <Badge className="bg-blue-600">{game.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Trending Games */}
            <Card className="bg-white p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold">Trending Games</h3>
              </div>
              <div className="space-y-3">
                {trendingGames.map((game, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{game.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{game.name}</p>
                        <p className="text-xs text-gray-500">
                          #{index + 1} Trending
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-green-600 bg-green-100"
                    >
                      {game.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white p-4">
              <h3 className="font-bold mb-4">Your Gaming Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24h</p>
                    <p className="text-sm text-gray-500">
                      Time played this week
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-gray-500">Gaming friends</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Level 42</p>
                    <p className="text-sm text-gray-500">Gaming level</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Play Now CTA */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Ready to Play?</h3>
              <p className="text-sm mb-4 text-blue-100">
                Join thousands of players online right now
              </p>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                Browse All Games
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
export { Gaming };
