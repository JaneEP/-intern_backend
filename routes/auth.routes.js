const Router = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const e = require("express");

router.post(
  "/registration",
  [
    check("email", "Поле email должно быть корректно заполнено  ").isEmail(),
    check("password", "Полe password должно быть корректно заполнено").isLength(
      {
        min: 3,
        max: 12,
      }
    ),
  ],
  async (req, res) => {
    try {
      // console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Произошла ошибка : Поля не должны быть пустые" });
      }

      const { email, password, passwordRepiet, name } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `Пользователь с email:  ${email} уже существует` });
      }

      const hashPassword = await bcrypt.hash(password, 8); // степень хеширования пароля
      const user = new User({
        email,
        password: hashPassword,
        passwordRepiet,
        name,
      });
      await user.save();
      return res.json({ message: "User was created" });
    } catch (e) {
      console.log(e);
      res.send({ message: "Server error" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, name } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPassValid = bcrypt.compareSync(password, user.password); //сравниваем пароль, полученный в запросе с тем,что хранится в бд; ф-я compareSync  сравгивает зашифр пароль с незашифр
    if (!isPassValid) {
      // если пароли совпадают, ф-я compareSync вернет true
      return res.status(400).json({ message: "Invalid password" }); // если пароли не совпадают, отправляем ошибку
    }
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
      expiresIn: "12h",
    });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        // passwordRepiet: user.passwordRepiet,
        name: user.name,
        moves: user.historyOfMoves,
      },
    });
  } catch (e) {
    // console.log(e);
    res.send({ message: "Server error" });
  }
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
      expiresIn: "12h",
    });
    console.log(user, token);
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        // passwordRepiet: user.passwordRepiet,
        name: user.name,
        moves: user.historyOfMoves,
      },
    });
  } catch (e) {
    // console.log(e);
    console.log(e.message);
    res.send({ message: "Server error" });
  }
});

// patch - частичный апдейт
router.patch("/savemoves", authMiddleware, async (req, res) => {
  const historyOfMoves = req.body;
  await User.findByIdAndUpdate(req.user.id, historyOfMoves);
  const user = await User.findOne({ _id: req.user.id });
  return res.json({
    moves: user.historyOfMoves,
    message: `${user.name}, ходы сохранены!`,
  });
});

module.exports = router;
