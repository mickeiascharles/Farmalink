const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3001;
const saltRounds = 10;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./farmalink.db", (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite 'farmalink.db'");
    db.serialize(() => {
      createTables();
      seedData();
    });
  }
});

function createTables() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS pharmacies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT,
      is_destaque BOOLEAN DEFAULT 0
    )
  `,
    (err) => {
      if (err) console.error("Erro ao criar tabela 'pharmacies':", err.message);
      else console.log("Tabela 'pharmacies' pronta.");
    }
  );

  db.run(
    `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      pharmacy_id INTEGER,
      tag TEXT, -- ex: 'oferta'
      FOREIGN KEY(pharmacy_id) REFERENCES pharmacies(id)
    )
  `,
    (err) => {
      if (err) console.error("Erro ao criar tabela 'products':", err.message);
      else console.log("Tabela 'products' pronta.");
    }
  );

  db.run(
    `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER, 
      total_price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING', 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `,
    (err) => {
      if (err) console.error("Erro ao criar tabela 'orders':", err.message);
      else console.log("Tabela 'orders' pronta.");
    }
  );

  db.run(
    `
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price_at_time REAL NOT NULL, 
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `,
    (err) => {
      if (err)
        console.error("Erro ao criar tabela 'order_items':", err.message);
      else console.log("Tabela 'order_items' pronta.");
    }
  );

  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      isAdmin BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("Erro ao criar tabela 'users':", err.message);
      else console.log("Tabela 'users' pronta.");
    }
  );
}

function seedData() {
  const pharmaciesData = [
    {
      name: "Farmácia Popular",
      image:
        "https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular/imagens-home/icone-farmacia-popular.png/@@images/3e938037-7e99-4179-b6a2-0fb336b018d5.png",
      is_destaque: 1,
    },
    {
      name: "Droga Raia",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgTCXIGLZDI2CjN11pmnVS1jVaoq6XyHSabA&s",
      is_destaque: 1,
    },
    {
      name: "Pague Menos",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/5/5a/Logo_Farm%C3%A1cias_Pague_Menos.png",
      is_destaque: 1,
    },
    {
      name: "Drogaria SP",
      image: "https://parqueshoppingbarueri.com.br/assets/loja/drogariasp.png",
      is_destaque: 1,
    },
  ];

  db.get("SELECT COUNT(*) as count FROM pharmacies", (err, row) => {
    if (err) {
      console.error("Erro ao checar 'pharmacies':", err.message);
      return;
    }
    if (row && row.count === 0) {
      console.log("Povoando tabela 'pharmacies' com dados de exemplo...");
      const stmt = db.prepare(
        "INSERT INTO pharmacies (name, image, is_destaque) VALUES (?, ?, ?)"
      );
      pharmaciesData.forEach((p) => stmt.run(p.name, p.image, p.is_destaque));
      stmt.finalize();
      console.log("Dados de 'pharmacies' inseridos.");
    } else {
      console.log("Atualizando imagens das farmácias existentes...");
      const stmt = db.prepare("UPDATE pharmacies SET image = ? WHERE name = ?");
      pharmaciesData.forEach((p) => {
        stmt.run(p.image, p.name);
      });
      stmt.finalize();
    }
  });

  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error("Erro ao checar 'products':", err.message);
      return;
    }
    if (row && row.count === 0) {
      console.log("Povoando tabela 'products' com dados de exemplo...");
      const stmt = db.prepare(
        "INSERT INTO products (name, price, image, rating, reviews, pharmacy_id, tag) VALUES (?, ?, ?, ?, ?, ?, ?)"
      );
      const products = [
        {
          name: "Remédio Genérico",
          price: 20.99,
          image:
            "https://www.teuto.com.br/wp-content/uploads/2021/10/capa-medicamentos-genericos.jpg",
          rating: 4.5,
          reviews: 120,
          pharmacy_id: 1,
          tag: "oferta",
        },
        {
          name: "Creme Hidratante",
          price: 45.0,
          image: "https://product-data.raiadrogasil.io/images/12732543.webp",
          rating: 4.8,
          reviews: 90,
          pharmacy_id: 2,
          tag: "oferta",
        },
        {
          name: "Paracetamol 750mg",
          price: 19.9,
          image:
            "https://cdn1.staticpanvel.com.br/produtos/15/156550-15.jpg?ims=424x",
          rating: 4.2,
          reviews: 210,
          pharmacy_id: 1,
          tag: "oferta",
        },
        {
          name: "Vitamina C",
          price: 29.9,
          image:
            "https://images.tcdn.com.br/img/img_prod/740081/vitamina_c_bio_c_1g_30_comprimidos_efervescentes_sem_acucar_71_1_20200724181355.jpg",
          rating: 4.6,
          reviews: 150,
          pharmacy_id: 3,
          tag: "oferta",
        },
        {
          name: "Fraldas Pampers G",
          price: 59.9,
          image: "https://m.media-amazon.com/images/I/81lq-otoZ9L.jpg",
          rating: 4.9,
          reviews: 300,
          pharmacy_id: 2,
          tag: "oferta",
        },
        {
          name: "Protetor Solar FPS 30",
          price: 35.5,
          image: "https://product-data.raiadrogasil.io/images/7407645.webp",
          rating: 4.7,
          reviews: 180,
          pharmacy_id: 1,
          tag: null,
        },
      ];
      products.forEach((p) =>
        stmt.run(
          p.name,
          p.price,
          p.image,
          p.rating,
          p.reviews,
          p.pharmacy_id,
          p.tag
        )
      );
      stmt.finalize();
      console.log("Dados de 'products' inseridos.");
    } else {
      console.log("Tabela 'products' já contém dados.");
    }
  });

  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (err) {
      console.error("Erro ao checar 'users':", err.message);
      return;
    }
    if (row && row.count === 0) {
      console.log("Criando utilizador admin por defeito...");
      const adminPassword = "admin123";
      bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
        if (err) {
          console.error("Erro ao gerar hash da password:", err);
          return;
        }
        const stmt = db.prepare(
          "INSERT INTO users (email, password, isAdmin) VALUES (?, ?, ?)"
        );
        stmt.run("admin@farmalink.com", hash, 1);
        stmt.finalize();
        console.log("Utilizador admin 'admin@farmalink.com' criado.");
      });
    } else {
      console.log("Tabela 'users' já contém dados.");
    }
  });
}

app.get("/api", (req, res) => {
  res.json({ message: "Olá! A API do Farmalink está funcionando!" });
});

app.get("/api/search", (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Termo de busca é obrigatório." });
  }
  const searchTerm = `%${q}%`;
  const sql = `
    SELECT 
      products.*, 
      pharmacies.name as pharmacy_name 
    FROM products 
    JOIN pharmacies ON products.pharmacy_id = pharmacies.id
    WHERE products.name LIKE ?
  `;
  db.all(sql, [searchTerm], (err, rows) => {
    if (err) {
      console.error("Erro na rota /api/search:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/api/pharmacies/destaque", (req, res) => {
  db.all("SELECT * FROM pharmacies WHERE is_destaque = 1", [], (err, rows) => {
    if (err) {
      console.error("Erro na rota /api/pharmacies/destaque:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/api/pharmacies/:id", (req, res) => {
  const { id } = req.params;
  const responseData = {};
  const pharmacySql = "SELECT * FROM pharmacies WHERE id = ?";
  db.get(pharmacySql, [id], (err, pharmacyRow) => {
    if (err) {
      console.error("Erro ao buscar farmácia:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    if (!pharmacyRow) {
      res.status(404).json({ error: "Farmácia não encontrada" });
      return;
    }
    responseData.details = pharmacyRow;
    const productsSql = "SELECT * FROM products WHERE pharmacy_id = ?";
    db.all(productsSql, [id], (err, productRows) => {
      if (err) {
        console.error("Erro ao buscar produtos da farmácia:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      responseData.products = productRows;
      res.json(responseData);
    });
  });
});

app.get("/api/products/ofertas", (req, res) => {
  const sql = `
    SELECT 
      products.*, 
      pharmacies.name as pharmacy_name 
    FROM products 
    JOIN pharmacies ON products.pharmacy_id = pharmacies.id
    WHERE products.tag = 'oferta'
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Erro na rota /api/products/ofertas:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      products.*, 
      pharmacies.name as pharmacy_name 
    FROM products 
    JOIN pharmacies ON products.pharmacy_id = pharmacies.id
    WHERE products.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error("Erro na rota /api/products/:id :", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "Produto não encontrado" });
    }
  });
});

app.get("/api/orders/user/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT 
      o.id as orderId, 
      o.total_price, 
      o.status, 
      o.created_at,
      GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')', '; ') as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error("Erro na rota /api/orders/user/:userId :", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/orders", (req, res) => {
  const { items, totalPrice, userId } = req.body;
  if (!items || items.length === 0 || !totalPrice) {
    return res.status(400).json({ error: "Dados do pedido inválidos." });
  }
  const finalUserId = userId || null;
  const orderSql = `INSERT INTO orders (total_price, status, user_id) VALUES (?, ?, ?)`;

  db.run(orderSql, [totalPrice, "PENDING", finalUserId], function (err) {
    if (err) {
      console.error("Erro ao inserir na tabela 'orders':", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    const orderId = this.lastID;
    const itemsSql = `INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)`;
    const stmt = db.prepare(itemsSql);
    items.forEach((item) => {
      stmt.run(orderId, item.id, item.quantity, item.price);
    });
    stmt.finalize((err) => {
      if (err) {
        console.error("Erro ao inserir em 'order_items':", err.message);
        db.run(`DELETE FROM orders WHERE id = ?`, [orderId]);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log(`Novo pedido #${orderId} criado com ${items.length} itens.`);
      res.status(201).json({ orderId: orderId, status: "PENDING" });
    });
  });
});

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email e password são obrigatórios." });
  }
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.status(400).json({ error: "Este email já está registado." });
    }
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const sql =
        "INSERT INTO users (email, password, isAdmin) VALUES (?, ?, ?)";
      db.run(sql, [email, hash, 0], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          message: "Utilizador registado com sucesso!",
          userId: this.lastID,
        });
      });
    });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email e password são obrigatórios." });
  }
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: "Email ou password inválidos." });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result) {
        const userToReturn = { ...user, password: undefined };
        res.json({ message: "Login bem-sucedido!", user: userToReturn });
      } else {
        res.status(401).json({ error: "Email ou password inválidos." });
      }
    });
  });
});

app.get("/api/admin/orders", (req, res) => {
  const sql = `
    SELECT 
      o.id as orderId, 
      o.total_price, 
      o.status, 
      o.created_at,
      GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')', '; ') as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Erro na rota /api/admin/orders:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put("/api/admin/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status é obrigatório." });
  }
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  db.run(sql, [status, id], function (err) {
    if (err) {
      console.error("Erro ao atualizar pedido:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }
    console.log(`Pedido #${id} atualizado para status: ${status}`);
    res.json({ message: "Status do pedido atualizado com sucesso!" });
  });
});

app.get("/api/admin/products", (req, res) => {
  const sql = `
    SELECT 
      products.*, 
      pharmacies.name as pharmacy_name 
    FROM products 
    JOIN pharmacies ON products.pharmacy_id = pharmacies.id
    ORDER BY products.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Erro na rota /api/admin/products:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/admin/products", (req, res) => {
  const { name, price, image, pharmacy_id } = req.body;
  if (!name || !price || !pharmacy_id) {
    return res
      .status(400)
      .json({ error: "Nome, preço e ID da farmácia são obrigatórios." });
  }
  const sql = `
    INSERT INTO products (name, price, image, pharmacy_id, rating, reviews, tag) 
    VALUES (?, ?, ?, ?, 0, 0, null)
  `;
  db.run(sql, [name, price, image || null, pharmacy_id], function (err) {
    if (err) {
      console.error("Erro ao criar produto:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res
      .status(201)
      .json({ message: "Produto criado com sucesso!", productId: this.lastID });
  });
});

app.put("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, image, pharmacy_id } = req.body;
  if (!name || !price || !pharmacy_id) {
    return res
      .status(400)
      .json({ error: "Nome, preço e ID da farmácia são obrigatórios." });
  }
  const sql = `
    UPDATE products 
    SET name = ?, price = ?, image = ?, pharmacy_id = ?
    WHERE id = ?
  `;
  db.run(sql, [name, price, image || null, pharmacy_id, id], function (err) {
    if (err) {
      console.error("Erro ao atualizar produto:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    res.json({ message: "Produto atualizado com sucesso!" });
  });
});

app.delete("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  db.get(
    "SELECT COUNT(*) as count FROM order_items WHERE product_id = ?",
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row.count > 0) {
        return res.status(400).json({
          error:
            "Não é possível remover. Este produto já faz parte de pedidos existentes.",
        });
      }
      const sql = "DELETE FROM products WHERE id = ?";
      db.run(sql, [id], function (err) {
        if (err) {
          console.error("Erro ao remover produto:", err.message);
          res.status(500).json({ error: err.message });
          return;
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: "Produto não encontrado." });
        }
        res.json({ message: "Produto removido com sucesso!" });
      });
    }
  );
});

app.get("/api/admin/users", (req, res) => {
  const sql = "SELECT id, email, isAdmin, created_at FROM users WHERE id != 1";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Erro na rota /api/admin/users:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  if (id === "1") {
    return res
      .status(403)
      .json({ error: "Não é possível remover o administrador principal." });
  }
  const sql = "DELETE FROM users WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Erro ao remover utilizador:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Utilizador não encontrado." });
    }
    res.json({ message: "Utilizador removido com sucesso!" });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});
