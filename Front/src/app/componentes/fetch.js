
// USUARIOS
// Función para registrar un nuevo usuario en el backend
async function usuarios(datos) {
    try {
        // Realiza una petición POST al endpoint de registro de usuario
        const response = await fetch(`http://localhost:4000/usuarioRegistro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: datos.nombre,
                email: datos.email,
                password: datos.password
            })
        });

        // Espera la respuesta y la convierte a JSON
        const result = await response.json();
        console.log(result);
        // Devuelve true si el registro fue exitoso
        return result.ok;
    } catch (error) {
        // Maneja errores de red o del backend
        console.error("Error al registrar usuario:", error);
        return false;
    }
}


// Obtiene la lista de usuarios registrados
async function tablaUsuarios() {
    let response = await fetch('http://localhost:4000/usuarioRegistro', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let usuarios = await response.json();
    console.log("Usuarios:", usuarios);
}


// CHATS
// Función para crear un nuevo chat
async function chats(datosC) {
    try {
        // Realiza una petición POST al endpoint de creación de chat
        const response = await fetch(`http://localhost:4000/chats`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                titulo: datosC.titulo,
                es_grupo: datosC.es_grupo,
                fecha_creacion: new Date().toISOString()
            })
        });
        let result = await response.json();
        console.log(result);
    } catch (error) {
        // Muestra un mensaje si falla la creación
        alert("No se pudo crear el chat");
        console.log(error);
    }
}

// Obtiene la lista de chats
async function tablaChats() {
    let response = await fetch('http://localhost:4000/chats', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let chats = await response.json();
    console.log("Chats:", chats);
}

// PARTICIPANTES
async function participantes(datosP) {
    try {
        const response = await fetch(`http://localhost:4000/participantes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_chat: datosP.chat_id,
                id_usuario: datosP.usuario_id,
                es_admin: datosP.es_admin,
                fecha_union: new Date().toISOString()
            })
        });
        let result = await response.json();
        console.log(result);
    } catch (error) {
        alert("No se pudo agregar el participante");
        console.log(error);
    }
}

async function tablaParticipantes() {
    let response = await fetch('http://localhost:4000/participantes', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let participantes = await response.json();
    console.log("Participantes:", participantes);
}

// MENSAJES
async function mensajes(datosM) {
    try {
        const response = await fetch(`http://localhost:4000/mensajes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_chat: datosM.chat_id,
                id_participante: datosM.participante_id,
                contenido: datosM.contenido,
                fecha_envio: new Date().toISOString()
            })
        });
        let result = await response.json();
        console.log(result);
    } catch (error) {
        alert("No se pudo enviar el mensaje");
        console.log(error);
    }
}

async function tablaMensajes() {
    let response = await fetch('http://localhost:4000/mensajes', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let mensajes = await response.json();
    console.log("Mensajes:", mensajes);
}