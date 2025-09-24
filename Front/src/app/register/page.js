// Página de registro
// Incluye: hooks, fetch, manejo de estado, renderizado condicional
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Poppins } from "next/font/google";
import Title from "../componentes/Title/Title";
import Button from "../componentes/Button/Button";
import styles from "./register.module.css";

// Tipografía solo para esta página
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Registro() {
  // useRouter: para redireccionar después del registro
  const router = useRouter();
  // useState: para manejar el estado de los campos y errores
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Función que maneja el registro al hacer click en el botón
  async function handleRegister() {
    setError("");

    try {
      // Genera la fecha de creación en formato SQL
      const fecha_creacion = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

  // fetch: envía los datos al backend para registrar el usuario
  const res = await fetch("http://localhost:4000/usuarioRegistro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, fecha_creacion }),
      });

  // Convierte la respuesta a JSON
  const data = await res.json();

      // Si registro ok, muestra alerta y redirige
      if (data.ok) {
        alert("Usuario registrado con éxito. Ahora inicia sesión.");
        router.push("/login");
      } else {
        // Si error, muestra mensaje
        setError(data.mensaje || "Error al registrar usuario");
      }
    } catch (err) {
  // Si fetch falla, muestra error de conexión
  console.error("Error en el registro:", err);
  setError("Error de conexión con el servidor");
    }
  }

  return (
    <div className={`${styles.container} ${poppins.className}`}>
      <div className={styles.card}>
        <Title text="REGISTRO" />

  {/* Renderizado condicional: muestra error si existe */}
  {error && <p className={styles.error}>{error}</p>}

        <div className={styles.fields}>
          {/* Inputs controlados para nombre, email y password */}
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button text="CREAR UNA CUENTA" onClick={handleRegister} variant="primary" />

        <p className={styles.footer}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className={styles.link}>
            INICIA SESIÓN
          </Link>
        </p>
      </div>
    </div>
  );
}
