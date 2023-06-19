const database = require("./database");

const getUsers = (req, res) => {
  database
    .query("select * from users")
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query(
      `select id, firstname, lastname, email, city, language from users where id = ?`,
      [id]
    )
    .then(([user]) => {
      if (user.length > 0) {
        res.status(200).json(user);
      } else {
        res.send(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(() => {
      res.send(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};
const updateUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "UPDATE `users` SET `firstname`=?,`lastname`=?,`email`=?,`city`=?,`language`=?,`hashedPassword`=? WHERE `id`=?",
      [
        firstname,
        lastname,
        email,
        city,
        language,
        hashedPassword,
        req.params.id,
      ]
    )
    .then(() => {
      res.send(200);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  database
    .query(`select * from users where email = ?`, [req.body.email])
    .then(([user]) => {
      if (user.length > 0) {
        req.user = user[0];
        next();
      } else {
        res.send(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(401).send(401);
    });
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  postUser,
  getUserByEmailWithPasswordAndPassToNext,
};
