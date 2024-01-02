const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("From Users Route");
});

router.get("/:id", (req, res) => {
  res.send("From :id Route");
});

router.post('/new',(req,res)=>{
    res.send("From /new route");
})

module.exports = router;