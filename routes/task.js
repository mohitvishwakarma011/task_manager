const router = require("express").Router();
const ensureAuthenticated = require("../config/auth");
const Task = require("../models/task");

router.get("/dashboard",ensureAuthenticated, (req, res) => {
  const userId = req.user._id;

  Task.find({ user: userId })
    .then((tasks) => {
      // console.log(tasks);
      if (tasks) {
        res.render("dashboard", { tasks: tasks });
      } else {
        res.render("dashboard");
      }
    })
    .catch((err) => {
      console.log(err);
      req.flash("error_msg", "Internal Server error");
    });
});

router.get("/new",ensureAuthenticated, (req, res) => {
  res.render("newtask");
});

router.post("/new",ensureAuthenticated, (req, res) => {
  const { title, description, duedate } = req.body;
  const errors = [];

  //check for empty
  if (!title || !description || !duedate) {
    errors.push({ msg: "Please fill in all fields!" });
    res.render("newtask", {
      errors,
      title,
      description,
      duedate,
    });
  } else {
    const newTask = new Task({
      title,
      description,
      duedate,
      user: req.user._id,
    });

    newTask
      .save()
      .then((task) => {
        req.flash("success_msg", "Task created successfully!");
        res.redirect("/task/new");
      })
      .catch((err) => {
        console.log(errr);
        req.flash("error_msg", "Internal Server error");
        res.redirect("/task/new");
      });
  }
});

router.post("/:id/delete",ensureAuthenticated, async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find the task by ID and remove it
    await Task.findByIdAndDelete(taskId);

    // Redirect to the task list after deleting the task
    req.flash("success_msg", "Task deleted successfully!");
    res.redirect('/task/dashboard');

  } catch (error) {
    // Handle errors, perhaps render an error page or log the error
    console.error(error);
    req.flash("error_msg", "Internal Server error");
    res.redirect('/task/dashboard');
  }
});

router.get('/:id/edit',ensureAuthenticated,(req,res)=>{
  const taskId = req.params.id;

  Task.findById(taskId)
  .then((task)=>{
    res.render('edittask',{task});
  })
  .catch((err)=>
  {
    console.log(err);
    req.flash("error_msg", "Internal Server error!");
    res.redirect('/task/dashboard');
  })
})

router.post('/:id/edit',ensureAuthenticated,(req,res)=>{
  const taskId = req.params.id;
  const {title,description,duedate} = req.body;

  Task.findByIdAndUpdate(taskId,{title,description,duedate})
  .then((task)=>{

    req.flash("success_msg", "Task edited successfully!");
    res.redirect('/task/dashboard');

  })
  .catch(err=>{

    console.log(err);
    req.flash("error_msg", "Internal Server error!");
    res.redirect('/task/dashboard');

  })
})

module.exports = router;
