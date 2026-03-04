import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { ThumbsUp, MessageCircle, Share2, Image, Video, Smile, Users, Calendar, Bookmark } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    time: "2h",
    content: "Just had an amazing time with friends! Life is beautiful when you're surrounded by the right people. 🌟",
    image: "https://images.unsplash.com/photo-1491013438744-0aa52aff4020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHBlb3BsZSUyMGZyaWVuZHN8ZW58MXx8fHwxNzcyNjMzMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    likes: 245,
    comments: 18,
    shares: 5,
  },
  {
    id: 2,
    author: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    time: "5h",
    content: "Nature never ceases to amaze me. This sunset was absolutely breathtaking! 🌅",
    image: "https://images.unsplash.com/photo-1656741349015-3404ed142271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBsYW5kc2NhcGUlMjBuYXR1cmV8ZW58MXx8fHwxNzcyNTI4NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    likes: 432,
    comments: 56,
    shares: 23,
  },
  {
    id: 3,
    author: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    time: "8h",
    content: "Pizza night is the best night! Who else is craving pizza right now? 🍕",
    image: "https://images.unsplash.com/photo-1681567604770-0dc826c870ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGl6emElMjBkZWxpY2lvdXN8ZW58MXx8fHwxNzcyNjIxMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    likes: 189,
    comments: 34,
    shares: 7,
  },
  {
    id: 4,
    author: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    time: "12h",
    content: "Paradise found! 🏝️ The beach life is calling and I must go.",
    image: "https://images.unsplash.com/photo-1594440344184-d59dfc86f8a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBiZWFjaHxlbnwxfHx8fDE3NzI2MzMzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    likes: 567,
    comments: 89,
    shares: 45,
  },
];

const sidebarShortcuts = [
  { icon: Users, label: "Friends", color: "text-blue-600" },
  { icon: Calendar, label: "Events", color: "text-red-600" },
  { icon: Bookmark, label: "Saved", color: "text-purple-600" },
  { icon: Users, label: "Groups", color: "text-blue-500" },
];

export function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 p-4 pb-20 md:pb-4">
      {/* Left Sidebar */}
      <aside className="hidden md:block md:col-span-3">
        <div className="sticky top-20">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
              <Avatar className="w-9 h-9">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="font-medium">John Doe</span>
            </div>
            {sidebarShortcuts.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
                <div className={`w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="md:col-span-6 space-y-4">
        {/* Create Post */}
        <Card className="p-4 bg-white">
          <div className="flex gap-3 items-center mb-3">
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Input 
              placeholder="What's on your mind, John?" 
              className="flex-1 bg-gray-100 border-none rounded-full"
            />
          </div>
          <Separator className="mb-3" />
          <div className="flex justify-around">
            <Button variant="ghost" className="flex-1 gap-2 text-gray-600">
              <Video className="w-5 h-5 text-red-500" />
              Live Video
            </Button>
            <Button variant="ghost" className="flex-1 gap-2 text-gray-600">
              <Image className="w-5 h-5 text-green-500" />
              Photo/Video
            </Button>
            <Button variant="ghost" className="flex-1 gap-2 text-gray-600">
              <Smile className="w-5 h-5 text-yellow-500" />
              Feeling
            </Button>
          </div>
        </Card>

        {/* Posts */}
        {mockPosts.map((post) => (
          <Card key={post.id} className="bg-white overflow-hidden">
            {/* Post Header */}
            <div className="p-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.avatar} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-gray-500">{post.time} • 🌎</p>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p>{post.content}</p>
            </div>

            {/* Post Image */}
            <ImageWithFallback 
              src={post.image} 
              alt={post.content}
              className="w-full max-h-[500px] object-cover"
            />

            {/* Post Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-600">
              <span className="cursor-pointer hover:underline">
                👍 {post.likes}
              </span>
              <div className="flex gap-3">
                <span className="cursor-pointer hover:underline">{post.comments} comments</span>
                <span className="cursor-pointer hover:underline">{post.shares} shares</span>
              </div>
            </div>

            <Separator />

            {/* Post Actions */}
            <div className="p-2 flex justify-around">
              <Button variant="ghost" className="flex-1 gap-2 text-gray-600 hover:bg-gray-100">
                <ThumbsUp className="w-5 h-5" />
                Like
              </Button>
              <Button variant="ghost" className="flex-1 gap-2 text-gray-600 hover:bg-gray-100">
                <MessageCircle className="w-5 h-5" />
                Comment
              </Button>
              <Button variant="ghost" className="flex-1 gap-2 text-gray-600 hover:bg-gray-100">
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </div>
          </Card>
        ))}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden md:block md:col-span-3">
        <div className="sticky top-20">
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Sponsored</h3>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex gap-3 cursor-pointer">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1616386261012-8a328c89d5b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlJTIwb2ZmaWNlfGVufDF8fHx8MTc3MjYzMzMyM3ww&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Sponsored"
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium">Tech Solutions</p>
                  <p className="text-sm text-gray-500">techsolutions.com</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Contacts</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "Alice Cooper", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
                { name: "Bob Smith", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
                { name: "Carol White", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" },
                { name: "David Brown", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop" },
                { name: "Eve Johnson", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop" },
              ].map((contact, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="relative">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm">{contact.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </aside>
    </div>
  );
}
