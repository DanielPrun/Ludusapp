const express = require("express");
const router = express.Router();
const FollowContoller = require("../controllers/follow");
const check = require("../middlewares/auth");


router.post("/seguir", check.auth, FollowContoller.seguir);
router.delete("/deseguir/:id", check.auth, FollowContoller.deseguir);
router.get("/seguint/:id?/:pg?", check.auth, FollowContoller.seguint);
router.get("/followers/:id?/:pg?", check.auth, FollowContoller.followers);
router.get("/cerca/seguint/:id", check.auth, FollowContoller.cercadorSeguint);
router.get("/cerca/seguidors/:id", check.auth, FollowContoller.cercadorSeguidors);

module.exports = router;  