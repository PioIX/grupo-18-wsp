// Página de login
// Incluye: hooks, fetch, renderizado condicional, manejo de estado
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import Title from "../componentes/Title/Title";
import Button from "../componentes/Button/Button";
import styles from "./login.module.css";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // elige los pesos que necesites
});

export default function LoginPage() {
  // useRouter: para redireccionar después del login
  const router = useRouter();
  const [email, setEmail] = useState(""); // "": valor inicial vacío, email: valor actual, setEmail: función para actualizar el valor
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Función que maneja el login al hacer click en el botón
  function handleLogin() {
    setError("");

    // Validación simple de campos vacíos
    if (email.trim() === "" || password.trim() === "") {
      setError("Debes ingresar un email y contraseña válidos.");
      return;
    }

  // fetch: envía email y password al backend para autenticar
  fetch("http://localhost:4000/usuarioLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json()) // Convierte la respuesta a JSON
      .then((data) => {
        // Si login ok, guarda id en localStorage y redirige
        if (data.ok) {
          localStorage.setItem("idLoggued", data.usuario.id_usuario);
          router.push("/chats");
        } else {
          // Si error, muestra mensaje
          setError(data.mensaje || "Usuario o contraseña incorrectos");
        }
      })
      .catch((err) => {
        // Si fetch falla, muestra error de conexión
        console.error("Error en fetch login:", err);
        setError("Error de conexión con el servidor");
      });
  }

  return (
    <div className={`${styles.container} ${poppins.className}`}>
      <div className={styles.card}>
        <Title text="INICIO DE SESIÓN" />

  {/* Renderizado condicional: muestra error si existe */}
  {error && <p className={styles.error}>{error}</p>}

        <div className={styles.fields}>
          {/* Input de email controlado */}
          <input
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className={styles.passwordWrapper}>
            {/* Input de password controlado con botón para mostrar/ocultar */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🚫" : "👁"}
            </span>
          </div>
        </div>

        <Button text="ENTRAR" onClick={handleLogin} variant="primary" />

        <p className={styles.footer}>
          ¿No tienes cuenta?{" "}
          <span
            className={styles.link}
            onClick={() => router.push("/register")}
          >
            REGÍSTRATE
          </span>
        </p>
      </div>
    </div>
  );
}
