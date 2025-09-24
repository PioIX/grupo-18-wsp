// Página principal de chats
// Incluye: listado de chats, botón para crear chat, popup, renderizado condicional y hooks

// useState: para manejar el estado de los chats, usuario logueado, etc.
// useEffect: para cargar los chats al montar el componente
"use client"


import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
// Imagen por defecto para grupos
const GROUP_DEFAULT_IMG = "/group-default.png";
// Botón y popup para crear un nuevo chat privado
function NuevoChatButton({ onCreate }) {
  // Estado para controlar apertura del popup
  const [open, setOpen] = useState(false);
  // Estado para mostrar la lista de usuarios
  const [showPopUp, setShowPopUp] = useState(false);
  // Estado para la lista de usuarios
  const [usuarios, setUsuarios] = useState([]);
  // Estado para mostrar loading
  const [loading, setLoading] = useState(false);
  // Estado para mostrar errores
  const [error, setError] = useState("");

  // Función para obtener todos los usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/usuarioRegistro", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      setUsuarios(data);
      setShowPopUp(true);
    } catch (e) {
      setError("Error al cargar usuarios");
    }
    setLoading(false);
  };

  // Al hacer click en Nuevo chat, mostrar la lista de usuarios
  const handleNuevoChatClick = () => {
    setOpen(true);
    fetchUsuarios();
  };

  // Al seleccionar un usuario, crear el chat y cerrar popup
  const handleSelectUsuario = async (usuario) => {
    setLoading(true);
    setError("");
    try {
      await onCreate(usuario);
      setOpen(false);
      setShowPopUp(false);
    } catch (e) {
      setError("Error al crear el chat");
    }
    setLoading(false);
  };

  // Renderiza el botón y el popup condicional
  return (
    <>
      <button onClick={handleNuevoChatClick} style={{marginBottom: 24, padding: "10px 24px", borderRadius: 12, background: "#111", color: "#fff", fontWeight: 600, border: "none", cursor: "pointer", fontSize: 16}}>Nuevo chat</button>
      <Popup open={open && showPopUp} onClose={() => {setOpen(false); setShowPopUp(false);}} modal nested contentStyle={{ background: '#f3f3f3', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: '40px 32px', minWidth: '340px', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className={styles.popupContent}>
          <h2 className={styles.nuevoChatTitle}>Selecciona un usuario</h2>
          {loading && <div style={{marginBottom: 12}}>Cargando...</div>}
          {error && <div className={styles.nuevoChatError}>{error}</div>}
          <div className={styles.usuariosList}>
            {usuarios.length > 0 ? (
              usuarios.map(usuario => (
                <div key={usuario.id_usuario} className={styles.usuarioItem} onClick={() => handleSelectUsuario(usuario)}>
                  <img src={usuario.foto_url || "https://ui-avatars.com/api/?name=User&background=cccccc&color=222222"} alt="avatar" className={styles.usuarioAvatar} />
                  <div className={styles.usuarioInfo}>
                    <span className={styles.usuarioNombre}>{usuario.nombre}</span>
                    <span className={styles.usuarioEmail}>{usuario.email}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{color: '#888'}}>No hay usuarios disponibles</div>
            )}
          </div>
        </div>
      </Popup>
    </>
  );
}
import Title from "@/app/componentes/Title/Title"
import styles from "./chats.module.css"
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Componente para mostrar un chat individual (nombre, descripción, foto)
function Chat({ nombre, description, foto_url }) {
  // Renderiza la tarjeta de chat
  return (
    <div className={styles["chat-card"]}>
      <div className={styles["chat-row"]}>
        <img
          src={foto_url || "https://ui-avatars.com/api/?name=User&background=cccccc&color=222222"}
          alt="avatar"
          className={styles.avatar}
        />
        <div>
          <h3 className={styles["chat-title"]}>{nombre}</h3>
          <p className={styles["chat-desc"]}>{description}</p>
        </div>
      </div>
    </div>
  )
}


// Componente principal de la página de chats
export default function Chats() {
  // Estado para la lista de chats
  const [chat, setChat] = useState([])
  // Estado para el id del usuario logueado
  const [idLoggued, setIdLoggued] = useState(null)
  // Estado para el chat seleccionado
  const [selectedChat, setSelectedChat] = useState(null)

  // useEffect: carga los chats del usuario al montar el componente
  useEffect(() => {
    const id = localStorage.getItem("idLoggued")
    setIdLoggued(id)

  // Función para obtener los chats del usuario desde el backend
  async function chatsperuser(id_usuario) {
      try {
  // fetch: obtiene los chats del usuario
  let result = await fetch("http://localhost:4000/chatsUsuario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id_usuario })
        })

  // Convierte la respuesta a JSON
  let response = await result.json()
        // Si la respuesta es ok, guarda los chats en el estado
        if (response.ok) {
          setChat(response.chats)
        } else {
          // Si hay error, lo muestra en consola
          console.error("Error del backend:", response.mensaje)
        }
      } catch (err) {
        console.error("Error en fetch:", err)
      }
    }

    if (id) chatsperuser(id)
  }, [])

  // Función para crear un nuevo chat privado (llamada desde el popup)
  const handleCreateChat = async (usuarioDestino) => {
    // Lógica para crear el chat en el backend
    try {
      const res = await fetch("http://localhost:4000/crearChatPrivado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario1: idLoggued,
          id_usuario2: usuarioDestino.id_usuario
        })
      });
      const data = await res.json();
      if (data.ok) {
        // Refrescar la lista de chats
        const result = await fetch("http://localhost:4000/chatsUsuario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario: idLoggued })
        });
        const response = await result.json();
        if (response.ok) setChat(response.chats);
      }
    } catch (e) {
      // Manejar error
    }
  };

  // Renderizado principal: lista de chats a la izquierda y chat a la derecha
  return (
    <div className={styles.whatsappContainer + " " + poppins.className}>
      <div className={styles.sidebar}>
        <div className={styles.title}>CHATS</div>
        <NuevoChatButton onCreate={handleCreateChat} />
        <div className={styles["chats-list"]}>
          {chat.length > 0 ? (
            chat.map(element => {
              let contacto = null;
              if (!element.es_grupo && element.participantes) {
                contacto = element.participantes.find(u => String(u.id_usuario) !== String(idLoggued));
              }
              return (
                <div
                  key={element.id_chat}
                  className={
                    styles.chatListItem +
                    (selectedChat && selectedChat.id_chat === element.id_chat ? " " + styles.selected : "")
                  }
                  onClick={() => setSelectedChat(element)}
                >
                  <Chat
                    nombre={contacto ? contacto.nombre : element.nombre}
                    description={element.es_grupo ? "Grupo" : "Chat privado"}
                    foto_url={contacto ? contacto.foto_url : (element.es_grupo ? GROUP_DEFAULT_IMG : undefined)}
                  />
                </div>
              );
            })
          ) : (
            <div className={styles["no-chats"]}>Sin chats</div>
          )}
        </div>
      </div>
      <div className={styles.chatArea}>
        {selectedChat ? (
          <div className={styles.chatContent}>
            <h2>{selectedChat.nombre}</h2>
            <p>{selectedChat.es_grupo ? "Grupo" : "Chat privado"}</p>
            {/* Aquí iría el contenido del chat, mensajes, input, etc. */}
            <div className={styles.chatMessages}>
              <div style={{color: '#888'}}>Aquí se mostrarán los mensajes del chat seleccionado.</div>
            </div>
          </div>
        ) : (
          <div className={styles.chatPlaceholder}>
            <h2>Selecciona un chat</h2>
            <p>Elige un chat de la lista para ver la conversación.</p>
          </div>
        )}
      </div>
    </div>
  );
}
