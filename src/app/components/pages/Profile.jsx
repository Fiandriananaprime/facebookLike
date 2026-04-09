import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { API_BASE_URL, getApiHeaders } from "../network";
import { useEffect, useMemo, useState } from "react";
import EditProfil, { editImage } from "../ui/editProfil";
import {
  Camera,
  Edit,
  MapPin,
  Briefcase,
  Home,
  Heart,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
const defaultProfileAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
];
const profilePosts = [
  {
    id: 1,
    content: "Excited to share my latest photography work! \u{1F4F8}",
    image:
      "https://images.unsplash.com/photo-1729655669048-a667a0b01148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzI2MjU3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    likes: 234,
    comments: 45,
    time: "2 days ago",
  },
  {
    id: 2,
    content: "Living my best life! \u{1F31F}",
    image:
      "https://images.unsplash.com/photo-1491013438744-0aa52aff4020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHBlb3BsZSUyMGZyaWVuZHN8ZW58MXx8fHwxNzcyNjMzMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    likes: 567,
    comments: 89,
    time: "1 week ago",
  },
];
const friends = [
  {
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    mutualFriends: "45 mutual friends",
  },
  {
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    mutualFriends: "32 mutual friends",
  },
  {
    name: "Emma Davis",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    mutualFriends: "28 mutual friends",
  },
  {
    name: "James Wilson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    mutualFriends: "56 mutual friends",
  },
  {
    name: "Lisa Anderson",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    mutualFriends: "23 mutual friends",
  },
  {
    name: "Bob Smith",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    mutualFriends: "67 mutual friends",
  },
];
const photos = [
  "https://images.unsplash.com/photo-1656741349015-3404ed142271?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBsYW5kc2NhcGUlMjBuYXR1cmV8ZW58MXx8fHwxNzcyNTI4NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1594440344184-d59dfc86f8a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBiZWFjaHxlbnwxfHx8fDE3NzI2MzMzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1681567604770-0dc826c870ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGl6emElMjBkZWxpY2lvdXN8ZW58MXx8fHwxNzcyNjIxMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1616386261012-8a328c89d5b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlJTIwb2ZmaWNlfGVufDF8fHx8MTc3MjYzMzMyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1613626201548-3d1864ef9d16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwd29tYW4lMjBmYXNoaW9ufGVufDF8fHx8MTc3MjYzMjQ0OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMHJnYnxlbnwxfHx8fDE3NzI2MDUyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
];
function Profile() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userData") || "null"),
  );
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(
    localStorage.getItem("profileCoverPhoto") || editImage(),
  );

  const userId = Number(user?.id);
  const profileName = useMemo(() => {
    const first = typeof user?.firstName === "string" ? user.firstName.trim() : "";
    const last = typeof user?.lastName === "string" ? user.lastName.trim() : "";
    return `${first} ${last}`.trim() || "Utilisateur";
  }, [user?.firstName, user?.lastName]);

  const profileAvatar = user?.avatar || defaultProfileAvatars[0];
  const initials = profileName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!Number.isInteger(userId) || userId <= 0) return;

    const loadUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: getApiHeaders({ Accept: "application/json" }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.user) return;
        setUser(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
      } catch (error) {
        console.error("Load profile user error:", error);
      }
    };

    loadUser();
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("profileCoverPhoto", coverPhoto);
  }, [coverPhoto]);

  const saveAvatar = async (avatarUrl) => {
    if (!Number.isInteger(userId) || userId <= 0) return;
    setAvatarSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
        method: "PATCH",
        headers: getApiHeaders({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
        body: JSON.stringify({ avatar: avatarUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.user) {
        throw new Error(data?.message || "Impossible de sauvegarder l'avatar");
      }
      setUser(data.user);
      localStorage.setItem("userData", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userDataUpdated"));
      setShowAvatarPicker(false);
    } catch (error) {
      console.error("Save avatar error:", error);
      alert("Impossible de sauvegarder l'avatar");
    } finally {
      setAvatarSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-4">
      {/* Cover Photo */}
      <div className="relative bg-gradient-to-r from-blue-400 to-purple-500 h-56 md:h-72 lg:h-80 overflow-hidden">
        <ImageWithFallback
          src={coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <Button
          variant="secondary"
          className="absolute bottom-4 right-4 gap-2"
          onClick={() => setCoverPhoto((prev) => editImage(prev))}
        >
          <Camera className="w-4 h-4" />
          Edit Cover Photo
        </Button>
      </div>

      <div className="max-w-screen-xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-b-lg shadow-sm pb-4">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 px-4 pt-4">
            {/* Profile Picture */}
            <div className="relative -mt-20 md:-mt-24">
              <Avatar className="w-40 h-40 border-4 border-white">
                <AvatarImage src={profileAvatar} />
                <AvatarFallback>{initials || "U"}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-2 right-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => setShowAvatarPicker((prev) => !prev)}
                disabled={avatarSaving}
              >
                <Camera className="w-4 h-4" />
              </Button>
              {showAvatarPicker && (
                <Card className="absolute top-full left-0 mt-2 p-3 w-64 z-20">
                  <p className="text-sm font-medium mb-2">Choisir un avatar</p>
                  <div className="grid grid-cols-5 gap-2">
                    {defaultProfileAvatars.map((avatarUrl) => (
                      <button
                        key={avatarUrl}
                        type="button"
                        onClick={() => saveAvatar(avatarUrl)}
                        disabled={avatarSaving}
                        className="rounded-full overflow-hidden ring-2 ring-transparent hover:ring-blue-500"
                      >
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-10 h-10 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left md:ml-4 mt-4">
              <h1 className="text-3xl font-bold">{profileName}</h1>
              <p className="text-gray-600">1.2K friends</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                {[...Array(8)].map((_, i) => (
                  <Avatar
                    key={i}
                    className="w-8 h-8 border-2 border-white -ml-2 first:ml-0"
                  >
                    <AvatarImage src={friends[i % friends.length].avatar} />
                  </Avatar>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowEditProfile((prev) => !prev)}
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
              <Button variant="secondary">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>


          {/* Navigation Tabs */}
          <div className="border-t mt-4 px-4">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-none h-auto p-0">
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="friends"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Friends
                </TabsTrigger>
                <TabsTrigger
                  value="photos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                >
                  Photos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {showEditProfile && (
          <div className="mt-4 absolute right-4 top-24 z-30 ">
            <EditProfil />
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
          {/* Left Sidebar - Info */}
          <aside className="md:col-span-5 space-y-4">
            <Card className="bg-white p-4">
              <h3 className="font-bold text-xl mb-4">Intro</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Briefcase className="w-5 h-5" />
                  <span>Works at Tech Company</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Home className="w-5 h-5" />
                  <span>Lives in San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5" />
                  <span>From New York, NY</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Heart className="w-5 h-5" />
                  <span>Single</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5" />
                  <span>Joined March 2020</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full mt-4">
                Edit Details
              </Button>
            </Card>

            <Card className="bg-white p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl">Photos</h3>
                <Button variant="link" className="text-blue-600">
                  See all photos
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <ImageWithFallback
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </Card>

            <Card className="bg-white p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl">Friends</h3>
                <Button variant="link" className="text-blue-600">
                  See all friends
                </Button>
              </div>
              <p className="text-gray-600 mb-4">1,234 friends</p>
              <div className="grid grid-cols-3 gap-3">
                {friends.map((friend, index) => (
                  <div key={index} className="cursor-pointer group">
                    <ImageWithFallback
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full aspect-square object-cover rounded-lg group-hover:brightness-95 transition-all"
                    />
                    <p className="text-sm font-medium mt-1 truncate">
                      {friend.name}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </aside>

          {/* Main Content - Posts */}
          <main className="md:col-span-7 space-y-4">
            {profilePosts.map((post) => (
              <Card key={post.id} className="bg-white overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={profileAvatar} />
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{profileName}</p>
                    <p className="text-sm text-gray-500">{post.time}</p>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <p>{post.content}</p>
                </div>

                <ImageWithFallback
                  src={post.image}
                  alt={post.content}
                  className="w-full max-h-[500px] object-cover"
                />

                <div className="p-4 text-gray-600 text-sm">
                  <p>
                    👍 {post.likes} • {post.comments} comments
                  </p>
                </div>
              </Card>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
export { Profile };
