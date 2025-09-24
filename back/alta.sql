-- TABLA USUARIOS
-- =========================
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  foto_url VARCHAR(255) DEFAULT 'https://ui-avatars.com/api/?name=User&background=cccccc&color=222222',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA CHATS
-- =========================
CREATE TABLE chats (
  id_chat INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) DEFAULT NULL,
  es_grupo TINYINT(1) NOT NULL DEFAULT 0,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA PARTICIPANTES
-- =========================
CREATE TABLE participantes (
  id_participante INT AUTO_INCREMENT PRIMARY KEY,
  id_chat INT NOT NULL,
  id_usuario INT NOT NULL,
  es_admin TINYINT(1) DEFAULT 0,
  fecha_union DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_chat) REFERENCES chats(id_chat) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  UNIQUE KEY uk_chat_usuario (id_chat, id_usuario)
);

-- =========================
-- TABLA MENSAJES
-- =========================
CREATE TABLE mensajes (
  id_mensaje BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_chat INT NOT NULL,
  id_participante INT NOT NULL,
  contenido TEXT,
  fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
  editado TINYINT(1) DEFAULT 0,
  eliminado TINYINT(1) DEFAULT 0,
  FOREIGN KEY (id_chat) REFERENCES chats(id_chat) ON DELETE CASCADE,
  FOREIGN KEY (id_participante) REFERENCES participantes(id_participante) ON DELETE CASCADE,
  INDEX idx_chat_fecha (id_chat, fecha_envio)
);
-- =========================
-- INSERTS
-- =========================

INSERT INTO usuarios (nombre, email, password_hash, foto_url, fecha_creacion) VALUES
('Usuario 1', 'usuario1@example.com', 'clave1', 'https://randomuser.me/api/portraits/men/1.jpg', '2025-01-01 10:00:00'),
('Usuario 2', 'usuario2@example.com', 'clave2', 'https://randomuser.me/api/portraits/women/2.jpg', '2025-01-01 10:05:00'),
('Usuario 3', 'usuario3@example.com', 'clave3', NULL, '2025-01-01 10:10:00'),
('Usuario 4', 'usuario4@example.com', 'clave4', NULL, '2025-01-01 10:15:00'),
('Usuario 5', 'usuario5@example.com', 'clave5', NULL, '2025-01-01 10:20:00');

INSERT INTO chats (titulo, es_grupo, fecha_creacion) VALUES
('Chat 1', 0, '2025-01-02 09:00:00'),
('Chat 2', 0, '2025-01-02 09:05:00'),
('Chat de grupo 1', 1, '2025-01-02 09:10:00'),
('Chat 3', 0, '2025-01-02 09:15:00'),
('Chat de grupo 2', 1, '2025-01-02 09:20:00');

INSERT INTO participantes (id_chat, id_usuario, es_admin, fecha_union) VALUES
(1, 1, 1, '2025-01-03 08:00:00'),
(1, 2, 0, '2025-01-03 08:05:00'),
(2, 3, 1, '2025-01-03 08:10:00'),
(3, 1, 1, '2025-01-03 08:15:00'),
(3, 4, 0, '2025-01-03 08:20:00');

INSERT INTO mensajes (id_chat, id_participante, contenido, fecha_envio) VALUES
(1, 1, 'Hola desde Usuario 1 en Chat 1', '2025-01-04 12:00:00'),
(1, 2, 'Hola Usuario 1, soy Usuario 2', '2025-01-04 12:05:00'),
(2, 3, 'Este es un mensaje en el Chat 2', '2025-01-04 12:10:00'),
(3, 1, 'Bienvenidos al grupo!', '2025-01-04 12:15:00'),
(3, 4, 'Gracias por invitarme', '2025-01-04 12:20:00');