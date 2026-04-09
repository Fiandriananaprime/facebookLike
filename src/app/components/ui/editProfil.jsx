import { useEffect, useState } from "react";
import { API_BASE_URL, getApiHeaders } from "../network";
import { Button } from "./button";
import { Card } from "./card";
import { Input } from "./input";
import { Label } from "./label";

const defaultCoverPhotos = [
  "https://picsum.photos/1200/400?random=1",
  "https://picsum.photos/1200/400?random=2",
  "https://picsum.photos/1200/400?random=3",
  "https://picsum.photos/1200/400?random=4",
  "https://picsum.photos/1200/400?random=5",
  "https://picsum.photos/1200/400?random=6",
  "https://picsum.photos/1200/400?random=7",
  "https://picsum.photos/1200/400?random=8",
  "https://picsum.photos/1200/400?random=9",
  "https://picsum.photos/1200/400?random=10",
];

function editImage(currentCover = "") {
  const choices = defaultCoverPhotos.filter((url) => url !== currentCover);
  const source = choices.length > 0 ? choices : defaultCoverPhotos;
  const index = Math.floor(Math.random() * source.length);
  return source[index];
}

function EditProfil() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userData") || "null"),
  );
  const [userName, setUserName] = useState(user?.userName || "");
  const [birthDate, setBirthDate] = useState(
    typeof user?.birthDate === "string" ? user.birthDate.slice(0, 10) : "",
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const syncUser = () => {
      const latestUser = JSON.parse(localStorage.getItem("userData") || "null");
      setUser(latestUser);
      setUserName(latestUser?.userName || "");
      setBirthDate(
        typeof latestUser?.birthDate === "string"
          ? latestUser.birthDate.slice(0, 10)
          : "",
      );
    };

    window.addEventListener("userDataUpdated", syncUser);
    return () => window.removeEventListener("userDataUpdated", syncUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    const userId = Number(user?.id);
    const cleanUserName = userName.trim();

    if (!Number.isInteger(userId) || userId <= 0) {
      setError("Utilisateur invalide.");
      return;
    }

    if (!cleanUserName || !birthDate) {
      setError("Renseigne user_name et date de naissance.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: "PATCH",
        headers: getApiHeaders({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
        body: JSON.stringify({
          userName: cleanUserName,
          birthDate,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.user) {
        throw new Error(data?.message || "Impossible de mettre a jour le profil");
      }

      setUser(data.user);
      localStorage.setItem("userData", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userDataUpdated"));
      setStatus("Profil mis a jour.");
    } catch (submitError) {
      console.error("Update profile form error:", submitError);
      setError("Echec de la mise a jour.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-4 bg-white">
      <h3 className="text-lg font-semibold mb-3">Modifier le profil</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="user_name">user_name</Label>
          <Input
            id="user_name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ton user_name"
            disabled={saving}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="birth_date">Date de naissance</Label>
          <Input
            id="birth_date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            disabled={saving}
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {status ? <p className="text-sm text-green-600">{status}</p> : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </form>
    </Card>
  );
}

export default EditProfil;
export { editImage };
