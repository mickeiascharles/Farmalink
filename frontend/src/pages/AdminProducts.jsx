import { useState, useEffect } from "react";
import {
  getAdminProducts,
  getFeaturedPharmacies,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api.js";
import { Trash2, Edit } from "lucide-react";

function ProductForm({ productToEdit, onFormSubmit, clearEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    pharmacy_id: "",
  });
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeaturedPharmacies()
      .then((res) => setPharmacies(res.data))
      .catch((err) => console.error("Erro ao buscar farmácias", err));
  }, []);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price,
        image: productToEdit.image || "",
        pharmacy_id: productToEdit.pharmacy_id,
      });
    } else {
      setFormData({ name: "", price: "", image: "", pharmacy_id: "" });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.name || !formData.price || !formData.pharmacy_id) {
      setError("Nome, Preço e Farmácia são obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, dataToSend);
      } else {
        await createProduct(dataToSend);
      }
      onFormSubmit();
      clearEdit();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError("Erro ao salvar produto. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-2xl font-bold mb-4">
        {productToEdit ? "Editar Produto" : "Adicionar Novo Produto"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome do Produto"
          className="p-3 border rounded-lg"
        />
        <input
          type="number"
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          placeholder="Preço (ex: 29.99)"
          className="p-3 border rounded-lg"
        />
        <select
          name="pharmacy_id"
          value={formData.pharmacy_id}
          onChange={handleChange}
          className="p-3 border rounded-lg bg-white"
        >
          <option value="">Selecione a Farmácia</option>
          {pharmacies.map((pharm) => (
            <option key={pharm.id} value={pharm.id}>
              {pharm.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="URL da Imagem (opcional)"
          className="p-3 border rounded-lg col-span-1 md:col-span-3"
        />
        <div className="md:col-span-3 flex justify-end gap-4">
          {error && <p className="text-red-500">{error}</p>}
          {productToEdit && (
            <button
              type="button"
              onClick={clearEdit}
              className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar Edição
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-farmalink-blue text-white font-semibold py-2 px-6 rounded-lg hover:bg-farmalink-blue-dark transition-colors disabled:bg-gray-400"
          >
            {isLoading
              ? "Salvando..."
              : productToEdit
              ? "Atualizar Produto"
              : "Adicionar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getAdminProducts();
      setProducts(response.data);
    } catch (err) {
      setError("Não foi possível carregar os produtos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setProductToEdit(product);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Tem certeza que deseja remover este produto?")) {
      try {
        await deleteProduct(productId);
        fetchProducts();
      } catch (err) {
        console.error("Erro ao remover produto:", err);
        alert(err.response?.data?.error || "Falha ao remover produto.");
      }
    }
  };

  const handleFormSubmit = () => {
    fetchProducts();
    setProductToEdit(null);
  };

  const clearEdit = () => {
    setProductToEdit(null);
  };

  return (
    <div className="w-full">
      <ProductForm
        productToEdit={productToEdit}
        onFormSubmit={handleFormSubmit}
        clearEdit={clearEdit}
      />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <h3 className="text-2xl font-bold p-6">
          Todos os Produtos ({products.length})
        </h3>
        {isLoading ? (
          <p className="p-8 text-center">A carregar produtos...</p>
        ) : error ? (
          <p className="p-8 text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-farmalink-dark">ID</th>
                <th className="p-4 font-semibold text-farmalink-dark">
                  Produto
                </th>
                <th className="p-4 font-semibold text-farmalink-dark">Preço</th>
                <th className="p-4 font-semibold text-farmalink-dark">
                  Farmácia
                </th>
                <th className="p-4 font-semibold text-farmalink-dark">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-farmalink-gray"
                  >
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b bg-white hover:bg-gray-50"
                  >
                    <td className="p-4 font-mono text-farmalink-gray">
                      {product.id}
                    </td>
                    <td className="p-4 text-farmalink-dark font-medium">
                      {product.name}
                    </td>
                    <td className="p-4 font-semibold">
                      R${Number(product.price).toFixed(2).replace(".", ",")}
                    </td>
                    <td className="p-4 text-farmalink-gray">
                      {product.pharmacy_name}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Remover"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
