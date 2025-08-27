"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import "./style2.css"; // importás el css

export default function Registro() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleRegister() {
    // Lógica de registro
    const success = true;
    if (success) {
      alert("Usuario registrado con éxito. Ahora inicia sesión.");
      router.push("/login");
    } else {
      setError("El usuario ya existe");
    }
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Registro</h1>

        {error && <p className="auth__error">{error}</p>}

        <div className="auth__fields">
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

        <button className="auth__btn" onClick={handleRegister}>
          Registrarse
        </button>

        <p className="auth__footer">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="auth__link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
