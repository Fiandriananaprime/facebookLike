import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Volume2,
  MoreVertical,
} from "lucide-react";
const mockReels = [
  {
    id: 1,
    author: "Fashion_Style",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1613626201548-3d1864ef9d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwd29tYW4lMjBmYXNoaW9ufGVufDF8fHx8MTc3MjYzMjQ0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Summer Fashion Trends 2026 \u2728",
    likes: "234K",
    comments: "1.2K",
  },
  {
    id: 2,
    author: "DanceLife",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1760201029704-9fea0ed289e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZXIlMjBtb3ZlbWVudCUyMHVyYmFufGVufDF8fHx8MTc3MjYzMzM4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Urban Dance Moves \u{1F525}",
    likes: "567K",
    comments: "3.4K",
  },
  {
    id: 3,
    author: "FitLife",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwd29ya291dCUyMGd5bXxlbnwxfHx8fDE3NzI2MTU5MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Quick 5-Minute Workout \u{1F4AA}",
    likes: "892K",
    comments: "5.6K",
  },
  {
    id: 4,
    author: "Chef_Delights",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1592498546551-222538011a27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2hlZiUyMGtpdGNoZW58ZW58MXx8fHwxNzcyNTczNzk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Perfect Pasta Recipe \u{1F35D}",
    likes: "445K",
    comments: "2.1K",
  },
];
function Reels() {
  return (
    <div className="h-[calc(100vh-3.5rem)] bg-black">
      <div className="max-w-screen-xl mx-auto h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
        {mockReels.map((reel) => (
          <div
            key={reel.id}
            className="relative group cursor-pointer overflow-hidden bg-gray-900"
          >
            {/* Reel Thumbnail */}
            <ImageWithFallback
              src={reel.thumbnail}
              alt={reel.title}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="bg-black/20 text-white hover:bg-black/40 rounded-full"
              >
                <Volume2 className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="bg-black/20 text-white hover:bg-black/40 rounded-full"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={reel.avatar} />
                  <AvatarFallback>{reel.author[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{reel.author}</span>
                <Button
                  size="sm"
                  className="ml-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                >
                  Follow
                </Button>
              </div>

              <p className="mb-4 line-clamp-2">{reel.title}</p>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm">{reel.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{reel.comments}</span>
                </div>
                <Share2 className="w-5 h-5 ml-auto" />
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
export { Reels };
