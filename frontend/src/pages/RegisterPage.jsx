import { useState } from "react";
import { registerUser } from "../api.js";

export function RegisterPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As passwords não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(email, password);
      setSuccess(response.data.message);
      setIsLoading(false);

      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        onNavigate("login");
      }, 2000);
    } catch (err) {
      console.error("Erro no registo:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erro ao tentar registar. Tente novamente.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-farmalink-body items-center justify-center p-8">
      <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold text-farmalink-blue text-center mb-4">
          FarmaLink
        </h1>
        <h2 className="text-3xl font-bold text-farmalink-dark text-center mb-8">
          Criar nova conta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-farmalink-gray mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Coloque seu email"
              className="w-full p-4 rounded-lg border border-farmalink-gray-light text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-farmalink-blue"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-farmalink-gray mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
              className="w-full p-4 rounded-lg border border-farmalink-gray-light text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-farmalink-blue"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-farmalink-gray mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              className="w-full p-4 rounded-lg border border-farmalink-gray-light text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-farmalink-blue"
            />
          </div>

          {/* Exibição de Erro */}
          {error && (
            <div className="bg-red-500/80 text-white p-3 rounded-lg text-center font-semibold">
              {error}
            </div>
          )}

          {/* Exibição de Sucesso */}
          {success && (
            <div className="bg-green-500/80 text-white p-3 rounded-lg text-center font-semibold">
              {success} A redirecionar para o login...
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-farmalink-blue text-white text-xl font-bold py-4 rounded-lg shadow-lg hover:bg-farmalink-blue-dark transition-colors duration-300 disabled:bg-gray-400"
          >
            {isLoading ? "A registar..." : "Registar"}
          </button>
        </form>

        <p className="text-center text-farmalink-gray mt-8">
          Já tem uma conta?{" "}
          <a
            href="#"
            onClick={() => onNavigate("login")}
            className="font-bold text-farmalink-blue hover:underline"
          >
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}
