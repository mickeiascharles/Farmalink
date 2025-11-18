import { useState, useEffect } from "react";
import { getAdminUsers, deleteUser } from "../api.js";
import { Trash2, ShieldCheck, User } from "lucide-react";

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAdminUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Erro ao buscar utilizadores:", err);
      setError("Não foi possível carregar os utilizadores.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover este utilizador? Esta ação é permanente."
      )
    ) {
      try {
        await deleteUser(userId);
        fetchUsers();
        alert("Utilizador removido com sucesso!");
      } catch (err) {
        console.error("Erro ao remover utilizador:", err);
        alert(err.response?.data?.error || "Falha ao remover utilizador.");
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {isLoading ? (
        <p className="p-8 text-center">A carregar utilizadores...</p>
      ) : error ? (
        <p className="p-8 text-center text-red-500">{error}</p>
      ) : (
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold text-farmalink-dark">ID</th>
              <th className="p-4 font-semibold text-farmalink-dark">Email</th>
              <th className="p-4 font-semibold text-farmalink-dark">Tipo</th>
              <th className="p-4 font-semibold text-farmalink-dark">
                Registado em
              </th>
              <th className="p-4 font-semibold text-farmalink-dark">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-farmalink-gray">
                  Nenhum outro utilizador encontrado.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const formattedDate = new Date(
                  user.created_at
                ).toLocaleDateString("pt-PT");
                return (
                  <tr
                    key={user.id}
                    className="border-b bg-white hover:bg-gray-50"
                  >
                    <td className="p-4 font-mono text-farmalink-gray">
                      {user.id}
                    </td>
                    <td className="p-4 text-farmalink-dark font-medium">
                      {user.email}
                    </td>
                    <td className="p-4">
                      {user.isAdmin === 1 ? (
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <ShieldCheck size={16} /> Admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-farmalink-gray">
                          <User size={16} /> Cliente
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-farmalink-gray">{formattedDate}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Remover Utilizador"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
