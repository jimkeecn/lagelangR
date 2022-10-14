import express from "express";
import fs from "fs";
import validator from "validator";
import bcrypt from "bcrypt";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
console.log("RootPath", __dirname);
const router = express.Router();

var shipArray = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data.json"), "utf8"),
);
function sortShipArrayByPopularity() {
  shipArray.sort((a, b) => (a.popularity < b.popularity ? 1 : -1));
}
sortShipArrayByPopularity();

router.get("/healthcheck", (req, res) => {
  res.send("OK");
});

router.get("/ships", (req, res) => {
  res.json(shipArray);
});

class Player {
  constructor(content) {
    this.id = content.id;
    this.name = content.name;
    this.warships = [];
    for (let x = 0; x < content.warships.length; x++) {
      this.warships.push(new Warship(content.warships[x]));
    }
  }
}

class Warship {
  constructor(content) {
    if (content) {
      let ship = shipArray.find((x) => x.id == content.id);
      this.id = content.id;
      this.rank = ship.rank;
      this.type = ship.type;
      this.typecn = ship.typecn;
      this.name = ship.name;
      this.shortname = ship.shortname;
      this.points = content.points;
    }
  }
}

const dbPath = path.join(__dirname, "..", "..", "DB", "MainDB");
const mdbPath = path.join(__dirname, "..", "..", "DB", "ManagementDB");
//Create a new log for a guild
var db = new JsonDB(new Config(dbPath, true, false, "/"));
router.post("/data/:id/:id2", async (req, res, next) => {
  try {
    let guild_id = req.params.id;
    let log_id = req.params.id2;
    let content = req.body;
    let password = content.password;

    content.id = validator.escape(content.id);
    content.name = validator.escape(content.name);
    let isValid = logValidator(content);

    if (!isValid) {
      res.status(400).json({ return: "数据不符合规格" });
      return;
    }

    let isPasswordCorrect = await checkOwnGuildCode(guild_id, password);
    if (!isPasswordCorrect) {
      res.status(401).json({ return: "你没有权限" });
      return;
    }

    let isDuplicated = await checkDuplicatedLogId(guild_id, log_id);
    if (isDuplicated) {
      res.status(400).json({ return: "已存在此编号" });
      return;
    }

    let playerInfo = new Player(content);
    let path = `/${guild_id}/${log_id}`;
    await db.push(path, playerInfo);
    res.json(playerInfo);
  } catch (ex) {
    res.json({ return: "error occurs" });
  }
});

router.post("/edit/:id/:id2", async (req, res, next) => {
  try {
    let guild_id = req.params.id;
    let log_id = req.params.id2;
    let content = req.body;
    let password = content.password;

    content.id = validator.escape(content.id);
    content.name = validator.escape(content.name);
    let isValid = logValidator(content);

    if (!isValid) {
      res.status(400).json({ return: "数据不符合规格" });
      return;
    }

    let isPasswordCorrect = await checkOwnGuildCode(guild_id, password);
    if (!isPasswordCorrect) {
      res.status(401).json({ return: "你没有权限" });
      return;
    }

    let Logpath = `/${guild_id}/${log_id}`;
    var playerInfoFromDB = await db.getData(Logpath);

    let playerInfo = new Player(content);
    playerInfo.id = playerInfoFromDB.id;
    let path = `/${guild_id}/${playerInfoFromDB.id}`;
    await db.delete(path);
    await db.push(path, playerInfo);
    res.json(playerInfo);
  } catch (ex) {
    res.json({ return: "发生错误。。" });
    return;
  }
});

router.post("/delete/:id/:id2", async (req, res, next) => {
  try {
    console.log("Start Delete");
    let guild_id = req.params.id;
    let log_id = req.params.id2;
    let content = req.body;
    let password = content.password;

    let isPasswordCorrect = await checkOwnGuildCode(guild_id, password);
    if (!isPasswordCorrect) {
      res.status(401).json({ return: "你没有权限" });
      return;
    }

    let Logpath = `/${guild_id}/${log_id}`;
    await db.delete(Logpath);
    res.json(log_id);
  } catch (ex) {}
});

function logValidator(content) {
  console.log(content);
  if (content.name && content.id && content.warships.length > 0) {
    return true;
  } else {
    return false;
  }
}

//Get All logs from a guild.
router.get("/data/:id", async (req, res, next) => {
  try {
    let guild_id = req.params.id;
    let path = `/${guild_id}`;
    var data = await db.getData(path);
    res.json(data);
  } catch (ex) {
    res.json({ return: "error occurs" });
  }
});

//Get All ship from a guild specific log.
router.get("/data/:id/:id2", async (req, res, next) => {
  try {
    let guild_id = req.params.id;
    let log_id = req.params.id2;
    let path = `/${guild_id}/${log_id}`;
    var data = await db.getData(path);
    res.json(data);
  } catch (ex) {
    res.json({ return: "error occurs" });
  }
});

//management API
var mdb = new JsonDB(new Config(mdbPath, true, false, "/"));
const management_password = "123456789Ab!";

class Guild {
  constructor(content) {
    this.guildId = content.guildId;
    this.guildPassword = content.guildPassword;
    this.guildAccess = content.guildAccess;
  }
}

class Account {
  constructor(content) {
    this.accountId = generateAccountId(content.name, content.birthday);
    this.guildId = "";
    this.password = content.password;
  }
}

router.post("/createAccount", async (req, res, next) => {
  try {
    let content = req.body;
    let isValid = accountValidate(content);
    if (isValid) {
      let account = new Account(content);
      let data = await mdb.getData("/");
      account.guildId = generateGuildCode(Object.keys(data).length);
      let isDuplicated = await checkDuplicateAccountId(account.accountId);
      if (isDuplicated) {
        res.status(400).json({ return: "您的用户名和生日与别人重复了.." });
        return;
      }
      await mdb.push(
        "/counter",
        data ? Object.keys(data).length + 1 : 0,
        false,
      );
      await mdb.push(`/${account.guildId}`, account);
      res.status(201).json({ return: account.guildId });
    } else {
      res.status(400).json({ return: "注册发生错误...请重新检查填写信息" });
      return;
    }
  } catch (ex) {
    res.status(400).json({ return: "注册发生错误...请重新检查填写信息" });
    return;
  }
});

router.post("/loginWithPassword", async (req, res, next) => {
  try {
    let content = req.body;
    let guildId = content.code;
    let password = content.password;
    let data = await mdb.getData(`/${guildId}`);
    if (data.password === password) {
      let hashedPassword = await hashIt(data.password);
      res.status(200).json({ return: "成功登录", password: hashedPassword });
      return;
    } else {
      res.status(400).json({ return: "密码错误" });
      return;
    }
  } catch (ex) {
    res.status(400).json({ return: "登录发生错误" });
    return;
  }
});

router.post("/getGuildCode", async (req, res, next) => {
  try {
    let content = req.body;
    let accountId = generateAccountId(content.name, content.birthday);
    let data = await mdb.getData("/");
    let code = "";
    for (let x in data) {
      if (data[x].hasOwnProperty("accountId")) {
        if (data[x].accountId == accountId) {
          code = data[x].guildId;
        }
      }
    }
    if (code && code.length > 0) {
      res.status(200).json({ return: code });
    } else {
      res.status(400).json({ return: "没有找到对应的口令" });
    }

    return;
  } catch (ex) {
    res.status(400).json({ return: "发生错误" });
    return;
  }
});

async function hashIt(password) {
  const salt = await bcrypt.genSalt(6);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

async function compareIt(password, hashedPassword) {
  const validPassword = await bcrypt.compare(password, hashedPassword);
  return validPassword;
}

function accountValidate(account) {
  if (
    !validator.isDate(new Date(account.birthday)) ||
    account.password.length <= 6
  ) {
    return false;
  }
  return true;
}

function generateAccountId(name, birthday) {
  let name1 = validator.escape(name.replace(" ", ""));
  let dateObj = new Date(birthday);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate();
  return `${name1.trim().toLowerCase()}#${year}${month}${day}`;
}

function generateGuildCode(counter) {
  let initNumber = (Math.floor(Math.random() * 9) + 1) * 100000;
  let guildCode = "";
  if (counter > 0) {
    guildCode = (initNumber + counter + 1).toString();
  } else {
    guildCode = initNumber;
  }
  return guildCode.toString();
}

async function checkDuplicateAccountId(accountId) {
  let data = await mdb.getData("/");
  let isDuplicated = false;
  for (let x in data) {
    if (data[x].hasOwnProperty("accountId")) {
      if (data[x].accountId == accountId) {
        isDuplicated = true;
        break;
      }
    }
  }
  return isDuplicated;
}

async function checkDuplicatedLogId(guildId, logId) {
  let data = await mdb.getData("/" + guildId);
  let isDuplicated = false;
  for (let x in data) {
    if (data[x].hasOwnProperty("id")) {
      if (data[x].id == logId) {
        isDuplicated = true;
        break;
      }
    }
  }
  return isDuplicated;
}

async function checkOwnGuildCode(id, hashedPassword) {
  let data = await mdb.getData("/" + id);
  if (await compareIt(data.password, hashedPassword)) {
    return true;
  } else {
    return false;
  }
}

async function getGuildKey(guildId) {
  try {
    let data = await mdb.getData(`/${guildId}`);
    if (data) {
      return true;
    } else {
      return false;
    }
  } catch (ex) {
    return false;
  }
}

export default router;
