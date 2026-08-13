const pool = require("../config/db");

const findByEmail = async (email) => {
  const [row] = await pool.execute(
    `
        SELECT 
        id,
        email,
        password_hash,
        created_at
        from users
        WHERE email = ?
        LIMIT 1
        `,
    [email],
  );
  return row[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `
        SELECT
        id,
        email,
        created_at
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
    [id],
  );
  return rows[0] || null;
};

const createUser = async (email, passwordHash) => {
  const [result] = await pool.execute(
    `
        INSERT INTO users
        (
        email,
        password_hash
        )
        VALUES (?,?)
        `,
    [email, passwordHash],
  );
  return result.insertId;
};

module.exports = {
  findByEmail,
  findById,
  createUser,
};
