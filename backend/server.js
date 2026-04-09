const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { Pool } = require("pg");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "";
const DEFAULT_RENDER_FRONTEND_URL = "https://facebooklike.onrender.com";
const databaseUrl = process.env.DATABASE_URL || "";
const isLocalDatabase =
  databaseUrl.includes("@localhost:") || databaseUrl.includes("@127.0.0.1:");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalDatabase
    ? false
    : {
        rejectUnauthorized: false,
      },
});
let messagesRequiresConversationId = false;

const isBcryptHash = (value) =>
  typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);

const ensureUsersSchemaCompatibility = async () => {
  const tableCheck = await pool.query(
    "SELECT to_regclass('public.users') AS users_table",
  );
  if (!tableCheck.rows[0]?.users_table) {
    return;
  }

  const columnsResult = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'users'`,
  );
  const columns = new Set(columnsResult.rows.map((row) => row.column_name));

  const safeRenameColumn = async (from, to) => {
    if (columns.has(from) && !columns.has(to)) {
      await pool.query(`ALTER TABLE users RENAME COLUMN ${from} TO ${to}`);
      columns.delete(from);
      columns.add(to);
    }
  };

  await safeRenameColumn("id_user", "id");
  await safeRenameColumn("prenom", "first_name");
  await safeRenameColumn("nom", "last_name");
  await safeRenameColumn("password", "password_hash");
  await safeRenameColumn("username", "user_name");

  if (!columns.has("first_name")) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN first_name TEXT NOT NULL DEFAULT ''",
    );
    columns.add("first_name");
  }

  if (!columns.has("last_name")) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN last_name TEXT NOT NULL DEFAULT ''",
    );
    columns.add("last_name");
  }

  if (!columns.has("user_name")) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN user_name TEXT NOT NULL DEFAULT ''",
    );
    columns.add("user_name");
  }

  if (!columns.has("password_hash")) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''",
    );
    columns.add("password_hash");
  }

  if (!columns.has("birth_date")) {
    await pool.query("ALTER TABLE users ADD COLUMN birth_date DATE");
    columns.add("birth_date");
  }

  if (!columns.has("gender")) {
    await pool.query("ALTER TABLE users ADD COLUMN gender TEXT");
    columns.add("gender");
  }

  if (!columns.has("avatar")) {
    await pool.query("ALTER TABLE users ADD COLUMN avatar TEXT");
    columns.add("avatar");
  }

  if (!columns.has("online")) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN online BOOLEAN NOT NULL DEFAULT FALSE",
    );
    columns.add("online");
  }

  if (!columns.has("created_at")) {
    await pool.query(
      "ALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    );
    columns.add("created_at");
  }
};

const ensureMessagesSchemaCompatibility = async () => {
  const tableCheck = await pool.query(
    "SELECT to_regclass('public.messages') AS messages_table",
  );
  if (!tableCheck.rows[0]?.messages_table) {
    return;
  }

  const columnsResult = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'messages'`,
  );
  const columns = new Set(columnsResult.rows.map((row) => row.column_name));
  const columnInfoResult = await pool.query(
    `SELECT column_name, is_nullable
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'messages'`,
  );
  const isNullableByColumn = new Map(
    columnInfoResult.rows.map((row) => [row.column_name, row.is_nullable]),
  );

  const safeRenameColumn = async (from, to) => {
    if (columns.has(from) && !columns.has(to)) {
      await pool.query(`ALTER TABLE messages RENAME COLUMN ${from} TO ${to}`);
      columns.delete(from);
      columns.add(to);
    }
  };

  await safeRenameColumn("id_message", "id");
  await safeRenameColumn("id_sender", "sender_id");
  await safeRenameColumn("id_receiver", "receiver_id");
  await safeRenameColumn("senderid", "sender_id");
  await safeRenameColumn("receiverid", "receiver_id");
  await safeRenameColumn("sender_id_user", "sender_id");
  await safeRenameColumn("receiver_id_user", "receiver_id");
  await safeRenameColumn("message", "content");
  await safeRenameColumn("text", "content");
  await safeRenameColumn("date_envoi", "created_at");
  await safeRenameColumn("date_sent", "created_at");
  await safeRenameColumn("createdat", "created_at");

  if (!columns.has("id")) {
    await pool.query("ALTER TABLE messages ADD COLUMN id BIGSERIAL");
    columns.add("id");
  }

  if (!columns.has("sender_id")) {
    await pool.query("ALTER TABLE messages ADD COLUMN sender_id INTEGER");
    columns.add("sender_id");
  }

  if (!columns.has("receiver_id")) {
    await pool.query("ALTER TABLE messages ADD COLUMN receiver_id INTEGER");
    columns.add("receiver_id");
  }

  if (!columns.has("content")) {
    await pool.query(
      "ALTER TABLE messages ADD COLUMN content TEXT NOT NULL DEFAULT ''",
    );
    columns.add("content");
  }

  if (!columns.has("created_at")) {
    await pool.query(
      "ALTER TABLE messages ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    );
    columns.add("created_at");
  }

  const pkResult = await pool.query(
    `SELECT 1
     FROM pg_constraint
     WHERE conrelid = 'public.messages'::regclass
       AND contype = 'p'
     LIMIT 1`,
  );
  if (pkResult.rowCount === 0) {
    await pool.query("ALTER TABLE messages ADD PRIMARY KEY (id)");
  }

  messagesRequiresConversationId =
    columns.has("conversation_id") &&
    isNullableByColumn.get("conversation_id") === "NO";
};

const ensureSchema = async () => {
  await ensureUsersSchemaCompatibility();
  await ensureMessagesSchemaCompatibility();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      user_name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      birth_date DATE,
      gender TEXT,
      avatar TEXT,
      online BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  DEFAULT_RENDER_FRONTEND_URL,
]);

FRONTEND_URL.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .forEach((origin) => allowedOrigins.add(origin));

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  return allowedOrigins.has(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS origin not allowed"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const mapMessageRow = (row) => ({
  id: Number(row.id),
  senderId: Number(row.sender_id),
  receiverId: Number(row.receiver_id),
  content: row.content,
  createdAt: row.created_at,
});

const isPositiveInt = (value) =>
  Number.isInteger(Number(value)) && Number(value) > 0;

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "connected" });
  } catch (_error) {
    res.status(500).json({ ok: false, db: "disconnected" });
  }
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, birthDate, gender } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    const existingUser = await pool.query(
      "SELECT 1 FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rowCount > 0) {
      return res.status(400).json({ message: "Email deja utilise" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, birth_date, gender)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        birthDate || null,
        gender || null,
      ],
    );

    return res.status(201).json({ message: "Compte cree avec succes" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, user_name, email, birth_date, avatar, password_hash
       FROM users
       WHERE email = $1`,
      [email],
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Utilisateur introuvable" });
    }

    const user = result.rows[0];
    let valid = false;

    if (isBcryptHash(user.password_hash)) {
      valid = await bcrypt.compare(password, user.password_hash);
    } else {
      valid = password === user.password_hash;
      if (valid) {
        const upgradedHash = await bcrypt.hash(password, 10);
        await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
          upgradedHash,
          user.id,
        ]);
      }
    }

    if (!valid) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    await pool.query("UPDATE users SET online = TRUE WHERE id = $1", [user.id]);

    return res.json({
      message: "Connexion reussie",
      user: {
        id: Number(user.id),
        firstName: user.first_name,
        lastName: user.last_name,
        userName: user.user_name || "",
        email: user.email,
        birthDate: user.birth_date || null,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/users", async (req, res) => {
  const excludeUserId = Number(req.query.excludeUserId);

  try {
    const result = Number.isInteger(excludeUserId)
      ? await pool.query(
          `SELECT id, first_name, last_name, user_name, email, birth_date, avatar, online
           FROM users
           WHERE id <> $1
           ORDER BY first_name ASC, last_name ASC`,
          [excludeUserId],
        )
      : await pool.query(
          `SELECT id, first_name, last_name, user_name, email, birth_date, avatar, online
           FROM users
           ORDER BY first_name ASC, last_name ASC`,
        );

    const users = result.rows.map((row) => ({
      id: Number(row.id),
      firstName: row.first_name,
      lastName: row.last_name,
      userName: row.user_name || "",
      email: row.email,
      birthDate: row.birth_date || null,
      avatar: row.avatar || "",
      online: Boolean(row.online),
    }));

    return res.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/users/:id", async (req, res) => {
  const userId = Number(req.params.id);
  if (!isPositiveInt(userId)) {
    return res.status(400).json({ message: "id utilisateur invalide" });
  }

  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, user_name, email, birth_date, avatar, online
       FROM users
       WHERE id = $1`,
      [userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const row = result.rows[0];
    return res.json({
      user: {
        id: Number(row.id),
        firstName: row.first_name,
        lastName: row.last_name,
        userName: row.user_name || "",
        email: row.email,
        birthDate: row.birth_date || null,
        avatar: row.avatar || "",
        online: Boolean(row.online),
      },
    });
  } catch (error) {
    console.error("Get user by id error:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.patch("/users/:id/avatar", async (req, res) => {
  const userId = Number(req.params.id);
  const avatar = typeof req.body?.avatar === "string" ? req.body.avatar.trim() : "";
  const isHttpUrl = /^https?:\/\/\S+$/i.test(avatar);

  if (!isPositiveInt(userId) || !avatar || !isHttpUrl) {
    return res.status(400).json({ message: "id utilisateur ou avatar invalide" });
  }

  try {
    const updateResult = await pool.query(
      `UPDATE users
       SET avatar = $1
       WHERE id = $2
       RETURNING id, first_name, last_name, user_name, email, birth_date, avatar, online`,
      [avatar, userId],
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const row = updateResult.rows[0];
    return res.json({
      message: "Avatar mis a jour",
      user: {
        id: Number(row.id),
        firstName: row.first_name,
        lastName: row.last_name,
        userName: row.user_name || "",
        email: row.email,
        birthDate: row.birth_date || null,
        avatar: row.avatar || "",
        online: Boolean(row.online),
      },
    });
  } catch (error) {
    console.error("Update avatar error:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.patch("/users/:id/profile", async (req, res) => {
  const userId = Number(req.params.id);
  const userName =
    typeof req.body?.userName === "string" ? req.body.userName.trim() : "";
  const birthDate =
    typeof req.body?.birthDate === "string" ? req.body.birthDate.trim() : "";
  const isBirthDateValid = /^\d{4}-\d{2}-\d{2}$/.test(birthDate);

  if (!isPositiveInt(userId) || !userName || !isBirthDateValid) {
    return res
      .status(400)
      .json({ message: "id utilisateur, user_name ou birth_date invalide" });
  }

  try {
    const updateResult = await pool.query(
      `UPDATE users
       SET user_name = $1, birth_date = $2
       WHERE id = $3
       RETURNING id, first_name, last_name, user_name, email, birth_date, avatar, online`,
      [userName, birthDate, userId],
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const row = updateResult.rows[0];
    return res.json({
      message: "Profil mis a jour",
      user: {
        id: Number(row.id),
        firstName: row.first_name,
        lastName: row.last_name,
        userName: row.user_name || "",
        email: row.email,
        birthDate: row.birth_date || null,
        avatar: row.avatar || "",
        online: Boolean(row.online),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

app.get("/messages/:otherUserId", async (req, res) => {
  const otherUserId = Number(req.params.otherUserId);
  const currentUserId = Number(req.query.userId);

  if (!Number.isInteger(otherUserId) || !Number.isInteger(currentUserId)) {
    return res
      .status(400)
      .json({ message: "userId et otherUserId doivent etre numeriques" });
  }

  try {
    const result = await pool.query(
      `SELECT id, sender_id, receiver_id, content, created_at
       FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [currentUserId, otherUserId],
    );

    return res.json({ messages: result.rows.map(mapMessageRow) });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Socket CORS origin not allowed"));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connecte: ${socket.id}`);

  socket.on("join", ({ userId } = {}) => {
    const parsedUserId = Number(userId);

    if (!isPositiveInt(parsedUserId)) {
      socket.emit("socket_error", { message: "userId invalide pour join" });
      return;
    }

    socket.data.userId = parsedUserId;
    socket.join(`user:${parsedUserId}`);
  });

  socket.on("get_messages", async ({ withUserId } = {}) => {
    const currentUserId = socket.data.userId;
    const otherUserId = Number(withUserId);

    if (!isPositiveInt(currentUserId) || !isPositiveInt(otherUserId)) {
      socket.emit("socket_error", {
        message: "get_messages requiert un userId valide",
      });
      return;
    }

    try {
      const result = await pool.query(
        `SELECT id, sender_id, receiver_id, content, created_at
         FROM messages
         WHERE (sender_id = $1 AND receiver_id = $2)
            OR (sender_id = $2 AND receiver_id = $1)
         ORDER BY created_at ASC`,
        [currentUserId, otherUserId],
      );

      socket.emit("messages_history", result.rows.map(mapMessageRow));
    } catch (error) {
      console.error("Socket get_messages error:", error);
      const code = String(error?.code || "NO_CODE");
      const detail = String(
        error?.detail || error?.message || "Unknown get_messages error",
      );
      socket.emit("socket_error", {
        message: "Erreur serveur get_messages",
        code,
        detail,
      });
    }
  });

  socket.on("send_message", async (data = {}) => {
    const senderId = Number(data?.senderId ?? socket.data.userId);
    const receiverId = Number(data?.receiverId);
    const content =
      typeof data?.content === "string" ? data.content.trim() : "";
    const currentUserId = Number(socket.data.userId);

    if (
      !isPositiveInt(senderId) ||
      !isPositiveInt(receiverId) ||
      !isPositiveInt(currentUserId) ||
      senderId !== currentUserId ||
      !content
    ) {
      socket.emit("socket_error", {
        message: "send_message requiert senderId, receiverId et content",
      });
      return;
    }

    try {
      const usersExistResult = await pool.query(
        "SELECT id FROM users WHERE id = ANY($1::int[])",
        [[senderId, receiverId]],
      );
      if (usersExistResult.rowCount < 2) {
        socket.emit("socket_error", {
          message: "send_message: senderId ou receiverId introuvable",
        });
        return;
      }

      let insertResult;
      if (messagesRequiresConversationId) {
        const conversationResult = await pool.query(
          "INSERT INTO conversations DEFAULT VALUES RETURNING id_conversation",
        );
        const conversationId = Number(
          conversationResult.rows[0]?.id_conversation,
        );
        if (!isPositiveInt(conversationId)) {
          socket.emit("socket_error", {
            message: "send_message: conversation_id invalide",
          });
          return;
        }
        insertResult = await pool.query(
          `INSERT INTO messages (conversation_id, sender_id, receiver_id, content)
           VALUES ($1, $2, $3, $4)
           RETURNING id, sender_id, receiver_id, content, created_at`,
          [conversationId, senderId, receiverId, content],
        );
      } else {
        insertResult = await pool.query(
          `INSERT INTO messages (sender_id, receiver_id, content)
           VALUES ($1, $2, $3)
           RETURNING id, sender_id, receiver_id, content, created_at`,
          [senderId, receiverId, content],
        );
      }

      const savedMessage = mapMessageRow(insertResult.rows[0]);
      io.to(`user:${senderId}`).emit("receive_message", savedMessage);
      io.to(`user:${receiverId}`).emit("receive_message", savedMessage);
    } catch (error) {
      console.error("Socket send_message error:", error);
      const code = String(error?.code || "NO_CODE");
      const detail = String(
        error?.detail || error?.message || "Unknown send_message error",
      );
      socket.emit("socket_error", {
        message: "Erreur serveur send_message",
        code,
        detail,
      });
    }
  });

  socket.on("delete_message", async ({ messageId } = {}) => {
    const currentUserId = socket.data.userId;
    const parsedMessageId = Number(messageId);

    if (!isPositiveInt(currentUserId) || !isPositiveInt(parsedMessageId)) {
      socket.emit("socket_error", {
        message: "delete_message requiert un messageId valide",
      });
      return;
    }

    try {
      const deleteResult = await pool.query(
        `DELETE FROM messages
         WHERE id = $1 AND sender_id = $2
         RETURNING id, sender_id, receiver_id`,
        [parsedMessageId, currentUserId],
      );

      if (deleteResult.rowCount === 0) {
        socket.emit("socket_error", {
          message: "Message introuvable ou suppression non autorisee",
        });
        return;
      }

      const deleted = deleteResult.rows[0];
      io.to(`user:${Number(deleted.sender_id)}`).emit("message_deleted", {
        messageId: Number(deleted.id),
      });
      io.to(`user:${Number(deleted.receiver_id)}`).emit("message_deleted", {
        messageId: Number(deleted.id),
      });
    } catch (error) {
      console.error("Socket delete_message error:", error);
      socket.emit("socket_error", { message: "Erreur serveur delete_message" });
    }
  });

  socket.on("disconnect", () => {
    const currentUserId = Number(socket.data.userId);
    if (Number.isInteger(currentUserId)) {
      pool
        .query("UPDATE users SET online = FALSE WHERE id = $1", [currentUserId])
        .catch((error) => console.error("Socket disconnect online update error:", error));
    }
    console.log(`Socket deconnecte: ${socket.id}`);
  });
});

const startServer = async () => {
  try {
    await ensureSchema();
    console.log("Schema DB verifie (users/messages).");
  } catch (error) {
    console.error("Erreur initialisation DB:", error);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`Serveur local: http://localhost:${PORT}`);
  });
};

startServer();
