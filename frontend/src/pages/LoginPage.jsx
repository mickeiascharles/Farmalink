import { useState } from "react";
import { loginUser } from "../api.js";

const GoogleIcon = (props) => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,36.626,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);
const FacebookIcon = (props) => (
  <svg
    className="w-5 h-5"
    fill="#1877F2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M22,12c0-5.523-4.477-10-10-10S2,6.477,2,12c0,4.99,3.657,9.128,8.438,9.878V14.89h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238.195,2.238.195v2.46h-1.26c-1.243,0-1.63.771-1.63,1.562V12h2.773l-.443,2.89h-2.33v7.028C18.343,21.128,22,16.99,22,12Z" />
  </svg>
);

export function LoginPage({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Email e password são obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(email, password);
      const user = response.data.user;

      onLoginSuccess(user);

      if (user.isAdmin) {
        onNavigate("adminDashboard");
      } else {
        onNavigate("home");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Erro ao tentar fazer login. Tente novamente.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Coluna Esquerda (Logo) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white">
        <img
          src="/logo-farmalink.png"
          alt="FarmaLink Logo"
          className="w-auto h-20"
        />
      </div>

      {/* Coluna Direita (Formulário) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-farmalink-blue p-8">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-bold text-white text-center mb-10">
            Entre em sua conta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Coloque seu email aqui"
                className="w-full p-4 rounded-lg border-none text-gray-800 placeholder-gray-500 bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/50"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-white mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Coloque sua senha aqui"
                className="w-full p-4 rounded-lg border-none text-gray-800 placeholder-gray-500 bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/50"
              />
              <a
                href="#"
                onClick={() => onNavigate("register")}
                className="text-sm text-white/80 hover:text-white hover:underline mt-2 block text-right"
              >
                Esqueceu sua senha?
              </a>
            </div>

            {/* Exibição de Erro */}
            {error && (
              <div className="bg-red-500/80 text-white p-3 rounded-lg text-center font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-farmalink-blue-dark text-white text-xl font-bold py-4 rounded-lg shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-500"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="flex items-center justify-center my-6">
            <span className="h-px w-full bg-white/30"></span>
            <span className="px-4 text-sm text-white/80">OU</span>
            <span className="h-px w-full bg-white/30"></span>
          </div>

          {/* Botões Sociais - (Espaçamento gap-3) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-white/90 text-gray-800 p-3 rounded-lg flex items-center justify-center gap-3 hover:bg-white transition-colors">
              <GoogleIcon />
              Entrar com Google
            </button>
            <button className="flex-1 bg-white/90 text-gray-800 p-3 rounded-lg flex items-center justify-center gap-3 hover:bg-white transition-colors">
              <FacebookIcon />
              Entrar com Facebook
            </button>
          </div>

          <p className="text-center text-white/80 mt-8">
            Não tem uma conta?{" "}
            <a
              href="#"
              onClick={() => onNavigate("register")}
              className="font-bold text-white hover:underline"
            >
              Registe-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
