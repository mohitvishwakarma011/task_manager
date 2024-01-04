const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { fullName, email, password, repassword } = req.body;
  let errors = [];

  //check for empty
  if (!fullName || !email || !password || !repassword) {
    errors.push({ msg: "All feilds are required!" });
  }
  //check password Match
  if (password != repassword) {
    errors.push({ msg: "password must match!" });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      fullName,
      email,
      password,
      repassword,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          fullName,
          email,
          password,
          repassword,
        });
      } else {
        const newUser = new User({
          fullName,
          email,
          password,
        });

        //Hash
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            //set password to hash
            newUser.password = hash;
            //save to database
            newUser
              .save()
              .then((user) => {
                // console.log(user);
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/task/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle error, for example, logging it or sending an error response
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
});
module.exports = router;
