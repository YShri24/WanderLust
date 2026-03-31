const User = require("../models/user.js");

// ---------------- GET SIGNUP ----------------
module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

// ---------------- POST SIGNUP ----------------
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust!");

      // 🔥 FIXED REDIRECT
      const redirectUrl = req.session.redirectUrl || "/listings";
      delete req.session.redirectUrl;

      res.redirect(redirectUrl);
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// ---------------- GET LOGIN ----------------
module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

// ---------------- POST LOGIN ----------------
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");

  // 🔥 FIXED REDIRECT
  const redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl;

  res.redirect(redirectUrl);
};

// ---------------- LOGOUT ----------------
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};