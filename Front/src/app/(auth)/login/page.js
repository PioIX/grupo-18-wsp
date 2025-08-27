"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Forms from "../componentes/Forms";
import Button from "../componentes/Button";
import "./style.css";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    // Simulación de usuarios (puedes importar de db/users)
    const users = [
      { email: "user1@mail.com", password: "1234" },
      { email: "user2@mail.com", password: "abcd" },
    ];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      router.push("/homee?hola=1");
    } else {
      setError("Credenciales incorrectas");
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Forms
        onChangeEmail={(e) => setEmail(e.target.value)}
        onChangePassword={(e) => setPassword(e.target.value)}
        placeholderEmail="Email"
        placeholderPassword="Contraseña"
      />

      <Button type="submit" text="Ingresar" onClick={handleLogin} />


      <p>
        ¿No tienes cuenta?{" "}
        <Link href="/register">
          <span className="register-link">Regístrate</span>
        </Link>
      </p>
    </div>
  );

}
