import { type SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

 async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
  event.preventDefault();

  setErro("");

  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErro(data.error || "Erro ao fazer login");
      return;
    }

    localStorage.setItem("token", data.token);

    navigate("/");
  } catch (error) {
    console.error(error);
    setErro("Não foi possível conectar com a API.");
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-slate-900 p-6"
      >
        <h1 className="text-xl font-semibold text-white">
          Entrar
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg px-4 py-2"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          className="rounded-lg px-4 py-2"
        />

        {erro && (
          <p className="text-sm text-red-400">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}

export default Login;