require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { CompactEncrypt, importJWK } = require("jose");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { jweMiddleware } = require("./middleware/jwe");

const authRoutes = require("./routes/auth");
const eventsRoutes = require("./routes/events");
const marketsRoutes = require("./routes/markets");
const profileRoutes = require("./routes/profile");
const currentPositionRoutes = require("./routes/currentPosition");

const userProfitLoss = require("./routes/userProfitLoss");
const userRoutes = require("./routes/user");
const cryptoRoutes = require("./routes/crypto");
const betsRoutes = require("./routes/bets");
const betfairHoldRoutes = require("./routes/betfairHoldRoutes.js");
const companyRoutes = require("./routes/company");
const transactionsRoutes = require("./routes/transactions");
const accountStatmentRoutes = require("./routes/accountStatment");
const dailyReportRoutes = require("./routes/master/dailyReport");
const bookDetailRoutes = require("./routes/master/bookDetail");
const betDetailRoutes = require("./routes/master/betDetail");
const plbyHierarchicalRoutes = require("./routes/master/plbyHierarchical");
const getMarketPlBreakDownBook2Routes = require("./routes/master/getMarketPlBreakDownBook2");
const getProfitLossReportByDateRoutes = require("./routes/master/getProfitLossReportByDate.js");
const getAllUserProfitLossRoutes = require("./routes/master/getAllUserProfitLoss.js");
const getPlByTypeDailyReportRoutes = require("./routes/master/getPlByTypeDailyReportRoutes.js");
const getFinalSheetDataRoutes = require("./routes/master/getFinalSheetDataRoutes");
const masterAccountStatmentRoutes = require("./routes/master/masterAccountStatment");
const masterBetListRoutes = require("./routes/master/masterBetList");

const masterProfitLossRoutes = require("./routes/master/masterProfitLoss");
const masterAccountCurrentPositionRoutes = require("./routes/master/masterAccountCurrentPosition");
//agent/get-finalsheet-data-test
//get_finalsheetdata_test
const evenOddRoutes = require("./routes/evenOdd");
const casinoRoutes = require("./casino/casino");
const gamesRoutes = require("./routes/games");

const betfairBookBetListRoutes = require("./routes/betfairBookBetListRoutes");
const betfairResultsBetListRoutes = require("./routes/betfairResultsBetListRoutes");
const resultRoutes = require("./routes/result");

const { getMarketData } = require("./utils/function");
const { getBetfairGamesHoldemData } = require("./utils/betfairGamesFunctions");
const {
  getBetfairGamesTurboHoldemData
} = require("./utils/betfairGamesFunctions");
const {
  getBetfairGamesBlackjackData
} = require("./utils/betfairGamesFunctions");
const {
  getBetfairGamesTurboBlackjackData
} = require("./utils/betfairGamesFunctions");
const {
  getBetfairGamesBaccaratData
} = require("./utils/betfairGamesFunctions");
const {
  getBetfairGamesTurboBaccaratData
} = require("./utils/betfairGamesFunctions");
const { getBetfairGamesHiloData } = require("./utils/betfairGamesFunctions");
const {
  getBetfairGamesTurboHiloData
} = require("./utils/betfairGamesFunctions");
const {
  getBetfairGamesOmahaData,
  getBetfairGamesDerbyData,
  getBetfairGamesTurboDerbyData
} = require("./utils/betfairGamesFunctions");

const app = express();
app.use(express.json());
app.set("trust proxy", 1); // if behind a proxy (e.g. Nginx)
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true // allow cookies
  })
);
app.use(jweMiddleware);
app.use(
  session({
    name: "sessid",
    secret: process.env.SESSION_SECRET, // set a strong secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // <-- THIS is the key fix
      collectionName: "sessions", // optional
      ttl: 14 * 24 * 60 * 60 // optional (14 days)
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production"
    }
  })
);

app.use((req, res, next) => {
  res.jwe = async (payload, status = 200) => {
    const jwk = req.session?.publicJwk;
    if (!jwk)
      return res.status(428).json({ message: "Encryption key not registered" });
    const recipKey = await importJWK(jwk, "ECDH-ES+A256KW");
    const pt = new TextEncoder().encode(JSON.stringify(payload));
    const jwe = await new CompactEncrypt(pt)
      .setProtectedHeader({ alg: "ECDH-ES+A256KW", enc: "A256GCM" })
      .encrypt(recipKey);
    res
      .type("application/jose")
      .set("x-encrypted", "1")
      .status(status)
      .send(jwe);
  };
  next();
});

let cat_mid = null;
let type = null;
let mtype = null;

// Socket code starts here
const server = http.createServer(app); // replaces app.listen(*)
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  socket.on("getMarketData", (obj) => {
    cat_mid = obj.marketId;
    type = obj.type;
    mtype = obj.mtype;
  });

  socket.on("disconnect", (reason) =>
    console.log(`client ${socket.id} disconnected (${reason})`)
  );
});

// one shared timer for ALL clients
setInterval(async () => {
  var data = null;
  let payload = {};
  if (mtype == "sports") {
    data = await getMarketData(cat_mid);
    payload = {
      cat_mid: cat_mid,
      data: data,
      type: type,
      mtype: mtype
    };
  } else if (mtype == "bfgames") {
    if (type == "holdem") {
      data = await getBetfairGamesHoldemData();
      //console.log("getBetfairGamesHoldemData->",data)
    }
    if (type == "turbo_holdem") {
      data = await getBetfairGamesTurboHoldemData();
      //console.log("getBetfairGamesTurboHoldemData->", data);
    }
    if (type == "blackjack") {
      data = await getBetfairGamesBlackjackData();
      //console.log("getBetfairGamesBlackjackData->", data);
    }
    if (type == "turbo_blackjack") {
      data = await getBetfairGamesTurboBlackjackData();
      //console.log("getBetfairGamesTurboBlackjackData->", data);
    }
    if (type == "baccarat") {
      data = await getBetfairGamesBaccaratData();
      //console.log("getBetfairGamesBaccaratData->", data);
    }
    if (type == "turbo_baccarat") {
      data = await getBetfairGamesTurboBaccaratData();
      //console.log("getBetfairGamesTurboBaccaratData->", data);
    }
    if (type == "hilo") {
      data = await getBetfairGamesHiloData();
      //console.log("getBetfairGamesHiloData->", data);
    }
    if (type == "turbo_hilo") {
      data = await getBetfairGamesTurboHiloData();
      //console.log("getBetfairGamesTurboHiloData->", data);
    }
    if (type == "omaha") {
      data = await getBetfairGamesOmahaData();
      //console.log("getBetfairGamesOmahaData->", data);
    }
    if (type == "derby") {
      data = await getBetfairGamesDerbyData();
      //console.log("getBetfairGamesOmahaData->", data);
    }
    if (type == "turbo_derby") {
      data = await getBetfairGamesTurboDerbyData();
      //console.log("getBetfairGamesOmahaData->", data);
    }

    payload = {
      data: data,
      mtype: mtype,
      type: type
    };
  }

  io.emit("tick", payload); // broadcast
  //console.log("func",data);
}, 2000);

// Socket code ends here

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/markets", marketsRoutes);
app.use("/profile", profileRoutes);
app.use("/current-position", currentPositionRoutes);

app.use("/profit-loss", userProfitLoss);
app.use("/user", userRoutes);
app.use("/crypto", cryptoRoutes);
app.use("/bets", betsRoutes);
app.use("/betfair-book", betfairBookBetListRoutes);
app.use("/betfair-hold", betfairHoldRoutes);
app.use("/betfair-turbo-hold", betfairHoldRoutes);
app.use("/betfair-blackjack", betfairHoldRoutes);
app.use("/betfair-turbo-blackjack", betfairHoldRoutes);
app.use("/betfair-baccarat", betfairHoldRoutes);
app.use("/betfair-turbo-baccarat", betfairHoldRoutes);
app.use("/betfair-hilo", betfairHoldRoutes);
app.use("/betfair-turbo-hilo", betfairHoldRoutes);
app.use("/betfair-omaha", betfairHoldRoutes);
app.use("/betfair-derby", betfairHoldRoutes);
app.use("/betfair-turbo-derby", betfairHoldRoutes);
app.use("/betfair-results", betfairResultsBetListRoutes);

app.use("/results", resultRoutes);

app.use("/company", companyRoutes);
app.use("/transactions", transactionsRoutes);
app.use("/account-statement", accountStatmentRoutes);
app.use("/even-odd", evenOddRoutes);
//app.use("/last-digit", lastDigitRoutes);
app.use("/games", gamesRoutes);

// Master routes -------------------------------------------
app.use("/master/book-detail", bookDetailRoutes);
app.use("/master/bet-detail", betDetailRoutes);
app.use("/master/plby-hierarchical", plbyHierarchicalRoutes);
app.use("/master/get-market-pl-book2", getMarketPlBreakDownBook2Routes);
app.use("/master/report-by-date", getProfitLossReportByDateRoutes);
app.use("/master/report-by-all-users", getAllUserProfitLossRoutes);
app.use("/master/pl-by-type-daily-report", getPlByTypeDailyReportRoutes);
app.use("/master/pl-by-type-daily-report", getPlByTypeDailyReportRoutes);
app.use("/master/get-finalsheet-data", getFinalSheetDataRoutes);
app.use("/master/account-statement", masterAccountStatmentRoutes);
app.use("/master/betlist", masterBetListRoutes);
app.use("/master/profit-loss", masterProfitLossRoutes);
app.use("/master/account-current-position", masterAccountCurrentPositionRoutes);


// Casino routes -------------------------------------------
app.use("/casino", casinoRoutes);


const testRecordsRoutes = require('./routes/testRecords');
app.use('/test-records', testRecordsRoutes);


app.get("/", (req, res) => {
  res.send("Hello from backend!111");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});