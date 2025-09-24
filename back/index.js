const { realizarQuery } = require('./modulos/mysql');
const port = process.env.PORT || 4000;

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express(); // Inicializamos Express

// Middlewares
app.use(express.json());
app.use(cors());

const server = app.listen(port, () => {
	console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});;

const io = require('socket.io')(server, {
	cors: {
		// IMPORTANTE: REVISAR PUERTO DEL FRONTEND
		origin: ["http://localhost:3000", "http://localhost:3001"], // Permitir el origen localhost:3000
		methods: ["GET", "POST", "PUT", "DELETE"],  	// Métodos permitidos
		credentials: true                           	// Habilitar el envío de cookies
	}
});

const sessionMiddleware = session({
	//Elegir tu propia key secreta
	secret: "supersarasa",
	resave: false,
	saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
	sessionMiddleware(socket.request, {}, next);
});

/*
	A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
	A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
	A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
*/

io.on("connection", (socket) => {
	const req = socket.request;

	socket.on('joinRoom', data => {
		console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
		if (req.session.room != undefined && req.session.room.length > 0)
			socket.leave(req.session.room);
		req.session.room = data.room;
		socket.join(req.session.room);

		io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
	});

	socket.on('pingAll', data => {
		console.log("PING ALL: ", data);
		io.emit('pingAll', { event: "Ping to all", message: data });
	});

	socket.on('sendMessage', data => {
		io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
	});

	socket.on('disconnect', () => {
		console.log("Disconnect");
	})
});

//===================================pedidos html===================================


// Buscar usuario por email
app.post('/usuarioPorEmail', async (req, res) => {
    const { email } = req.body;
    try {
        const resultado = await realizarQuery(`SELECT * FROM usuarios WHERE email = "${email}"`);
        if (resultado.length === 1) {
            res.json({ ok: true, usuario: resultado[0] });
        } else {
            res.json({ ok: false, mensaje: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    }
});

// Crear chat privado entre dos usuarios (si no existe)
app.post('/crearChatPrivado', async (req, res) => {
    const { id_usuario1, id_usuario2 } = req.body;
    try {
        // Buscar si ya existe un chat privado entre ambos usuarios
        const chatExistente = await realizarQuery(`
            SELECT c.id_chat
            FROM chats c
            INNER JOIN participantes p1 ON c.id_chat = p1.id_chat AND p1.id_usuario = ${id_usuario1}
            INNER JOIN participantes p2 ON c.id_chat = p2.id_chat AND p2.id_usuario = ${id_usuario2}
            WHERE c.es_grupo = 0
            GROUP BY c.id_chat
            HAVING COUNT(*) = 2
        `);
        if (chatExistente.length > 0) {
            return res.json({ ok: true, id_chat: chatExistente[0].id_chat, mensaje: "Ya existe el chat" });
        }
        // Crear el chat
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const insertChat = await realizarQuery(`
            INSERT INTO chats (titulo, es_grupo, fecha_creacion) VALUES (NULL, 0, "${now}")
        `);
        // Obtener el id del nuevo chat correctamente
        const chatIdRes = await realizarQuery(`SELECT MAX(id_chat) as id_chat FROM chats`);
        const id_chat = chatIdRes[0].id_chat;
        // Insertar ambos participantes
        await realizarQuery(`INSERT INTO participantes (id_chat, id_usuario, es_admin, fecha_union) VALUES (${id_chat}, ${id_usuario1}, 0, "${now}")`);
        await realizarQuery(`INSERT INTO participantes (id_chat, id_usuario, es_admin, fecha_union) VALUES (${id_chat}, ${id_usuario2}, 0, "${now}")`);
        res.json({ ok: true, id_chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: "Error al crear el chat" });
    }
});

// ===================== LOGIN =====================
app.post('/usuarioLogin', async (req, res) => {
    
    console.log("POST /usuarioLogin'",req.body )
    const email = req.body.email;
    const password= req.body.password;
    const resultado = await realizarQuery(`
        SELECT * FROM usuarios 
        WHERE email = "${email}" AND password_hash = "${password}"
    `);

    if (resultado.length === 1) {
        res.send({ ok: true, usuario: resultado[0] });
    } else {
        res.send({ ok: false, mensaje: "Usuario o contraseña incorrectos" });
    }
});

// ===================== USUARIOS =====================
app.post('/usuarioRegistro', async (req, res) => {
    const { nombre, email, password, fecha_creacion } = req.body;

    const existe = await realizarQuery(`SELECT * FROM usuarios WHERE email="${email}"`);
    if (existe.length > 0) {
        return res.send({ ok: false, mensaje: "Ya existe un usuario con ese correo" });
    }

    await realizarQuery(`
        INSERT INTO usuarios (nombre, email, password_hash, fecha_creacion)
        VALUES ("${nombre}", "${email}", "${password}", "${fecha_creacion}")
    `);

    res.send({ ok: true, mensaje: "Usuario registrado correctamente" });
});

app.get('/usuarioRegistro', async (req, res) => {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM usuarios WHERE id_usuario=${req.query.id}`);
    } else {
        respuesta = await realizarQuery(`SELECT * FROM usuarios`);
    }
    res.send(respuesta);
});

// ===================== CHATS =====================
app.post('/chats', async (req, res) => {

    const { titulo, es_grupo, fecha_creacion } = req.body;
    console.log("POST /chats'",req.body )
    await realizarQuery(`
        INSERT INTO chats (titulo, es_grupo, fecha_creacion)
        VALUES ("${titulo}", ${es_grupo}, "${fecha_creacion}")
    `);

    res.send({ ok: true, mensaje: "Chat creado correctamente" });
});

app.get('/chats', async (req, res) => {
    let respuesta;
    if (req.query.id != undefined) {
        respuesta = await realizarQuery(`SELECT * FROM chats WHERE id_chat=${req.query.id}`);
    } else {
        respuesta = await realizarQuery(`SELECT * FROM chats`);
    }
    res.send(respuesta);
});

// ===================== PARTICIPANTES =====================
app.post('/participantes', async (req, res) => {
    const { id_chat, id_usuario, es_admin, fecha_union } = req.body;

    const existe = await realizarQuery(`
        SELECT * FROM participantes WHERE id_chat=${id_chat} AND id_usuario=${id_usuario}
    `);
    if (existe.length > 0) {
        return res.send({ ok: false, mensaje: "Este usuario ya es participante del chat" });
    }

    await realizarQuery(`
        INSERT INTO participantes (id_chat, id_usuario, es_admin, fecha_union)
        VALUES (${id_chat}, ${id_usuario}, ${es_admin}, "${fecha_union}")
    `);

    res.send({ ok: true, mensaje: "Participante agregado correctamente" });
});

app.get('/participantes', async (req, res) => {
    let respuesta;
    if (req.query.chat_id != undefined) {
        respuesta = await realizarQuery(`
            SELECT p.*, u.nombre, u.email 
            FROM participantes p
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.id_chat=${req.query.chat_id}
        `);
    } else {
        respuesta = await realizarQuery(`SELECT * FROM participantes`);
    }
    res.send(respuesta);
});

// ===================== MENSAJES =====================
app.post('/mensajes', async (req, res) => {
    const { id_chat, id_participante, contenido, fecha_envio } = req.body;

    await realizarQuery(`
        INSERT INTO mensajes (id_chat, id_participante, contenido, fecha_envio)
        VALUES (${id_chat}, ${id_participante}, "${contenido}", "${fecha_envio}")
    `);

    res.send({ ok: true, mensaje: "Mensaje enviado correctamente" });
});

app.get('/mensajes', async (req, res) => {
    let respuesta;
    if (req.query.chat_id != undefined) {
        respuesta = await realizarQuery(`
            SELECT m.*, u.nombre 
            FROM mensajes m
            INNER JOIN participantes p ON m.id_participante = p.id_participante
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE m.id_chat=${req.query.chat_id}
            ORDER BY m.fecha_envio ASC
        `);
    } else {
        respuesta = await realizarQuery(`SELECT * FROM mensajes`);
    }
    res.send(respuesta);
});

// ===================== CHATS POR USUARIO =====================

app.post("/chatsUsuario", async (req, res) => {
    const { id_usuario } = req.body;

    try {
        // Obtener los chats donde participa el usuario
        const chats = await realizarQuery(`
            SELECT c.id_chat, c.titulo AS nombre, c.es_grupo, c.fecha_creacion
            FROM chats c
            INNER JOIN participantes p ON c.id_chat = p.id_chat
            WHERE p.id_usuario = ${id_usuario}
        `);

        // Para cada chat, obtener los usuarios participantes (nombre y foto_url)
        for (let chat of chats) {
            const participantes = await realizarQuery(`
                SELECT u.id_usuario, u.nombre, u.foto_url
                FROM participantes p
                INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
                WHERE p.id_chat = ${chat.id_chat}
            `);
            chat.participantes = participantes;
        }

        res.json({ ok: true, chats });
    } catch (error) {
        console.error("Error en /chatsUsuario:", error);
        res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
    }
});



