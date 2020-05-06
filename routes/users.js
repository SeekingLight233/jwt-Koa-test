const router = require("koa-router")()
const jwt = require("jsonwebtoken")
const util = require("util")
const verify = util.promisify(jwt.verify)
const { SECRET } = require("../conf/constants")
router.prefix("/users")

router.get("/", function (ctx, next) {
  ctx.body = "this is a users response!"
})

router.get("/bar", function (ctx, next) {
  ctx.body = "this is a users/bar response"
})

router.post("/login", async (ctx, next) => {
  const { username, password } = ctx.request.body
  let userInfo
  if (username === "zhangsan" && password === "abc") {
    //登录成功，获取用户信息
    userInfo = {
      userId: 1,
      userName: "zhangsan",
      nickName: "法外狂徒",
      gender: "male",
    }
  }
  //加密userInfo
  let token
  if (userInfo) {
    token = jwt.sign(userInfo, SECRET, {
      expiresIn: "1h",
    })
  }
  if (userInfo == null) {
    ctx.body = {
      errno: -1,
      data: "登录失败",
    }
    return
  }
  ctx.body = {
    errno: 0,
    data: token,
  }
})
//通过token获取用户信息
router.get("/getUserInfo", async (ctx, next) => {
  const token = ctx.header.authorization
  try {
    //传上来的Authorization前面有个Bearer，空格后面的才是token
    const payload = await verify(token.split(" ")[1], SECRET)
    //此时payload就是之前加密的userInfo
    ctx.body = {
      errNO: 0,
      userInfo: payload,
    }
  } catch (error) {
    ctx.body = {
      errno: -1,
      msg: "verify token failed",
    }
  }
})
module.exports = router
