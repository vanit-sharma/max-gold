const mongoose = require("mongoose");
const useragent = require("express-useragent");
const getClientIp = require("../getClientIp");
const getSportsLimit = require("../../lib/getSportsLimit");
const Punter = require("../../models/Punter");
const AdmBetStart = require("../../models/AdmBetStart");
const BetfairEvent = require("../../models/BetfairEvent");
const BetlockByMarket = require("../../models/BetlockByMarket.js");
const BetLock = require("../../models/BetLock.js");
const UserLogs = require("../../models/UserLogs.js");
const CatEvtsFancy = require("../../models/CatEvtsFancy.js");
const CatEvtsFancyRnr = require("../../models/CatEvtsFancyRnr.js");
const BtMatchSSBZ = require("../../models/BtMatchSSBZ.js");
const BtMatchSS = require("../../models/BtMatchSS.js");
const { json } = require("express");
const BtBets = require("../../models/BtBets.js");
const moment = require("moment");
const {
  getUserHierarchy,
  get_user_latest_points_byid,
  UpdateBalance,
  betFairFancy,
  bzFormValue,
  pushExposure,
  getPunterSharing
} = require("../function.js");

const placeBetFairFancyBet = async (req, res) => {
  const currencyRaw = req.user.currency;
  const userId = req.user._id;
  const customRole = req.user.user_role;

  const { bet_type, odds, amount, catmid, sid, delay, eventId, sectionId } =
    req.body;

  const source = req.headers["user-agent"];
  const ua = useragent.parse(source);
  const dvc = JSON.stringify({
    browser: ua.browser,
    os: ua.os,
    platform: ua.platform,
    isMobile: ua.isMobile,
    uaString: ua.source,
    ipAddress:
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress
  });

  //console.log("sectionId->", sectionId);

  if (!userId) {
    return res
      .status(401)
      .json({ status: false, message: "Not authenticated" });
  }

  let master_link = await getUserHierarchy(userId);

  let currency = Number(currencyRaw);

  let mat_mlimit = await getSportsLimit("fancy", userId);
  let min_amount = await getSportsLimit("fancy_min", userId);
  let max_expouser = await getSportsLimit("fancy_exp", userId);

  let maxWinning = currency === 1 || currency === 2 ? 1000000 : 200000;
  let b_nam = "";
  let liverate = 0;
  let liveprice = 0;

  //let ip_address = await getClientIp(req);
  let ip_address =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (String(customRole).toLowerCase() === "admin") {
    return res.json({ status: false, message: "Betting Not allowed!!!" });
  }

  if (
    catmid !== undefined &&
    bet_type !== undefined &&
    odds !== undefined &&
    amount !== undefined &&
    sid !== undefined
  ) {
    const lid = await bzFormValue(req.body.eventId);
    if (lid.length > 20) {
      return res
        .status(403)
        .json({ status: false, message: "EventId length Error." });
    }

    const mid = await bzFormValue(req.body.sid);

    if (mid.length > 70) {
      return res
        .status(403)
        .json({ status: false, message: "Market Id Not Valid" });
    }

    const typ = await bzFormValue(req.body.bet_type);
    if (typ.length > 10) {
      return res
        .status(403)
        .json({ status: false, message: "Bet Type not valid" });
    }

    const rnr = typ === "B" ? "b1" : "l1";
    const rat = await bzFormValue(odds);
    const amt = await bzFormValue(amount);

    const session_size = await bzFormValue(req.body.price);
    const user_bet_rate = rat;

    if (isNaN(amt)) {
      return res.json({ status: false, message: "Amount must be a number" });
    }

    // fetch user controls (SELECT f_enable, c_enble, t_enable FROM bz_bt_punter WHERE uname = '$uid')
    const user_controls = await Punter.findOne({ _id: req.user._id })
      .select("f_enable c_enble t_enable")
      .lean();

    if (!user_controls) {
      return res.json({ status: false, message: "Account not found." });
    }

    if (Number(user_controls.c_enble) === 0) {
      return res.json({
        status: false,
        message: "Bet not allow for your account."
      });
    }

    // min/max checks
    if (amt < Number(min_amount)) {
      return res.json({ status: false, message: `Min Size is: ${min_amount}` });
    }

    if (amt > Number(mat_mlimit)) {
      return res.json({ status: false, message: `Max Size is:${mat_mlimit}` });
    }

    const upt = await bzFormValue(req.user.point); // $_SESSION['point']
    //const uss = bzFormValue(req.session?.user_session_id); // $_SESSION['user_session_id']
    const sid = await bzFormValue(req.body.sid);
    const rte = "s";
    let price = await bzFormValue(req.body.price);
    const r2 = 0;
    let dr;
    let bet_summery_id = 0;
    let drsts;

    const admRow = await AdmBetStart.findOne({ sno: 1 }).lean();
    const isBettingEnable = admRow?.IsBettingStart;

    if (!isBettingEnable) {
      return res.json({
        status: false,
        message: "Betting not open for this match."
      });
    }

    const lock = await BetLock.findOne({ user_id: req.user._id })
      .select("cric_fancy")
      .lean();

    if (lock && Number(lock.cric_fancy) === 0) {
      return res.json({
        status: false,
        message:
          "Your betting is locked for this market. Please contact your upline."
      });
    }
    console.log("EventId: ", lid);
    const ev = await BetfairEvent.findOne({ evt_id: lid })
      .select("fancy inplay fancy_type cat_mid evt_evt")
      .lean();
    console.log("Ev:", ev);
    if (!ev) {
      return res.json({ status: false, message: "Event not found." });
    }
    //console.log(ev);
    const {
      fancy_type,
      cat_mid,
      fancy,
      bf_fancy_on,
      inplay,
      diamond_evt_id,
      evt_evt
    } = ev;

    /** Per-market lock for this user */
    const userRegex = new RegExp(`(^|,)${req.user._id}(,|$)`);
    const sqlLock = await BetlockByMarket.find({
      market_type: 1,
      cat_mid: cat_mid,
      selected_users: {
        $in: userRegex
      }
    }).lean();
    //console.log(sqlLock.length);
    if (sqlLock.length) {
      return res.json({
        status: false,
        message: "Bet not allowed in this market"
      });
    }
    if (bf_fancy_on == 0) {
      return res.json({
        status: false,
        message: "Betfair Fancy not open"
      });
    }

    if (!((inplay === 0 || inplay === 1) && fancy === 1)) {
      return res.json({
        status: false,
        message: "Betting not open for this match."
      });
    }

    /** Fetch fancy market entry */
    console.log("mid:", mid);
    const fancyDoc = await CatEvtsFancy.findOne({
      mid_mid: mid,
      evt_id: lid
    })
      .select("evt_id mid_nam")
      .lean();
    //console.log("fancyDoc:", fancyDoc);
    if (!fancyDoc) {
      return res.json({ status: false, message: "Fancy not found.1" });
    }

    const evt_id = fancyDoc.evt_id;
    const m_nam = fancyDoc.mid_nam;
    const sno = fancyDoc._id;
    const event_name = evt_evt;

    /** Back/Lay consistency check */
    if (!((typ === "B" && rnr === "b1") || (typ === "L" && rnr === "l1"))) {
      return res.json({ status: false, message: "Back/Lay not valid" });
    }

    /** Fetch runners/state rows for the fancy */
    //console.log("mid_mid->",mid,"evt_id->",evt_id);
    const rnrRows = await CatEvtsFancyRnr.find({
      mid_mid: mid,
      evt_id: evt_id
    }).lean();
    if (!rnrRows || rnrRows.length <= 0) {
      return res.json({ status: false, message: "Fancy not found.2" });
    }
    drsts = rnrRows[0];
    //console.log("rnrRows:", rnrRows);
    b_nam = drsts.rnr_nam;
    //console.log("b_nam:", b_nam);

    const userHistoryQuery = await Punter.aggregate([
      {
        $match: { _id: req.user._id }
      },
      {
        $lookup: {
          from: "bz_user_login_history", // the collection name
          localField: "_id", // Punter’s _id
          foreignField: "userAutoId", // history’s userAutoId
          as: "loginHistory" // output array field
        }
      },
      {
        $unwind: {
          path: "$loginHistory",
          preserveNullAndEmptyArrays: true // keeps the user even if no history
        }
      },

      {
        $project: {
          plimit: 1,
          opin_bal: 1,
          bz_balance: 1,
          stat: 1,
          user_role: 1,
          bet_status: 1,
          "loginHistory.logon": 1,
          "loginHistory.ipaddr": 1,
          sponsor: 1,
          sponser_id: 1,
          full_chain: 1,
          "loginHistory.site_toke": 1
        }
      },
      {
        $limit: 1
      }
    ]);
    //console.log("userHistoryQuery:", userHistoryQuery);
    if (userHistoryQuery && evt_id != "") {
      const full_chain = userHistoryQuery[0].full_chain;
      sponsor = userHistoryQuery[0].sponsor;
      sponser_id = userHistoryQuery[0].sponser_id;
      dr = userHistoryQuery[0];

      let punterSharing = await getPunterSharing(req.user._id);
      console.log("punterSharing->", punterSharing);
      if (
        parseInt(userHistoryQuery[0].stat) == 1 &&
        parseInt(userHistoryQuery[0].bet_status) == 1 &&
        parseInt(userHistoryQuery[0].user_role) == 8
      ) {
        // Set default state like PHP's $t0 = "CLOSED";
        let t0 = "CLOSED";

        // choose the id: prefer diamond_evt_id if present, else use lid
        const id =
          diamond_evt_id && String(diamond_evt_id).trim() !== ""
            ? diamond_evt_id
            : lid;

        let jsonds2;

        jsonds2 = await betFairFancy(id);
        //console.log("jsonds2: ", jsonds2);
        //console.log("jsonds2: ", jsonds2.records.length);
        if (
          jsonds2 &&
          jsonds2 != "ER101" &&
          jsonds2.records !== "" &&
          jsonds2.records.length > 0
        ) {
          //console.log("jsonds2: ", jsonds2.records);
          for (const record of jsonds2?.records || []) {
            //console.log("record: ", record);
            let SelectionId = record.SelectionId;
            const mnam = record.RunnerName;
            //console.log("mnam: ", mnam);
            const mnam_ar = mnam.split("Innings");
            let inning = 1;
            inning = mnam_ar[0] ? mnam_ar[0].trim() : "";
            if (inning !== "") {
              inning = inning.replace("st", "").replace("nd", "");
            }

            const mnam_ar1 = mnam_ar[1] ? mnam_ar[1].trim().split(" ") : [];
            let over = "";
            if (
              mnam_ar1.length > 1 &&
              !isNaN(mnam_ar1[0]) &&
              mnam_ar1[1].toLowerCase().endsWith("overs")
            ) {
              over = mnam_ar1[0].trim();
              //console.log("over: ", over);
              if (SelectionId === "" || SelectionId === null) {
                SelectionId = over;
              }
            }
            //console.log("SelectionId: ", SelectionId);
            //console.log("mid: ", mid);
            //console.log("inning:", inning);

            if (
              `${cat_mid}-${SelectionId}-${inning}`.trim() === mid &&
              String(record.GameStatus).trim() === "ACTIVE"
            ) {
              api_response = JSON.stringify(record);
              t0 = "OPEN";
              if (typ === "B") {
                liverate = record.BackPrice1;
                liveprice = 100;
              }
              if (typ === "L") {
                liverate = record.LayPrice1;
                liveprice = 100;
              }
            }
          }
        }

        console.log(
          "liverate:",
          liverate,
          "rat->",
          rat,
          "price->",
          price,
          "liveprice->",
          liveprice,
          "t0->",
          t0,
          "typ->",
          typ
        );
        price = 100;
        let ratok = 0;
        if (t0 == "OPEN") {
          ta = 0;
          tb = 0;
          if (typ == "B") {
            if (rat >= liverate && price == liveprice && liverate != 0) {
              if (!liverate || !liveprice) {
                ratok = 0;
              } else {
                ratok = 1;
                pro = (liveprice * amt) / 100;
                lib = amt;
                if (rnr == "b1") {
                  ta += pro;
                  tb -= lib;
                }
              }
            } else {
              ratok = 0;
            }
          }

          if (typ == "L") {
            if (rat <= liverate && price == liveprice && liverate != 0) {
              if (!liverate || !liveprice) {
                ratok = 0;
              } else {
                ratok = 1;
                pro = amt;
                lib = (liveprice * amt) / 100;
                if (rnr == "l1") {
                  ta -= lib;
                  tb += pro;
                }
              }
            } else {
              ratok = 0;
            }
          }

          if (r2 == 1) {
            inp = "1";
          } else {
            inp = "0";
          }

          if (ratok == 1) {
            //master_link = getUserHierarchy(req.user._id);

            // try {
            pointok = 0;

            if (rte == "s") {
              const stc = await BtMatchSS.findOne({
                mid_mid: mid,
                uname: req.user.uname,
                evt_id: evt_id,
                b_nam: drsts.rnr_nam,
                stld: 0,
                betfair_fancy: 1
              }).lean();

              if (stc) {
                bet_summery_id = stc._id;
                limit = 0;
                let nlocka = [];

                const drz = await BtMatchSS.aggregate([
                  {
                    $match: {
                      mid_mid: mid,
                      uname: req.user.uname,
                      evt_id: evt_id,
                      b_nam: drsts.rnr_nam,
                      stld: 0,
                      betfair_fancy: 1
                    }
                  },
                  // cast rnr_nam (string) -> number like SQL's "*1"
                  {
                    $addFields: {
                      rnr_nam_num: {
                        $convert: {
                          input: "$rnr_nam",
                          to: "double",
                          onError: null,
                          onNull: null
                        }
                      }
                    }
                  },
                  { $match: { rnr_nam_num: { $ne: null } } },
                  {
                    $group: {
                      _id: null,
                      minrate: { $min: "$rnr_nam_num" },
                      maxrate: { $max: "$rnr_nam_num" }
                    }
                  }
                ]);

                min = drz.minrate;
                max = drz.maxrate;

                //New bet
                if (rat < min) min = rat;
                if (rat > max) max = rat;

                for (l = min - 1; l <= max + 1; l++) {
                  // echo l.'<br>';
                  total = 0;

                  const resstr1z = await BtMatchSS.find({
                    mid_mid: mid,
                    uname: req.user.uname,
                    evt_id: evt_id,
                    b_nam: drsts.rnr_nam,
                    stld: 0,
                    betfair_fancy: 1
                  }).lean();

                  for (const dr1z of resstr1z || []) {
                    if (dr1z.bak > 0) {
                      ttpp = "y";
                    } else {
                      ttpp = "n";
                    }
                    if (dr1z.bak > dr1z.lay) {
                      lock = dr1z.lay;
                      lock1 = dr1z.bak;
                    } else {
                      lock = dr1z.bak;
                      lock1 = dr1z.lay;
                    }

                    if (lock < 0) lock = -1 * lock;

                    if (dr1z.rnr_nam <= l) {
                      if (ttpp == "y") total += lock1;
                      else total -= lock;
                    } else {
                      if (ttpp == "y") total -= lock;
                      else total += lock1;
                    }
                  }

                  //New bet
                  if (ta > 0) {
                    ttpp = "y";
                  } else {
                    ttpp = "n";
                  }
                  if (rat <= l) {
                    if (ttpp == "y") {
                      total += pro;
                    } else {
                      total -= lib;
                    }
                  } else {
                    if (ttpp == "y") {
                      total -= lib;
                    } else {
                      total += pro;
                    }
                  }
                  nlocka ??= [];
                  nlocka.push(total);
                }

                let nlock = Math.min(nlocka);
                win_sess_amt = Math.max(nlocka);

                if (win_sess_amt > maxWinning) {
                  return res.json({
                    status: false,
                    message: `Max Winning Limit ${maxWinning}`
                  });
                }

                if (nlock < 0) {
                  nlock = -1 * nlock;
                } else {
                  nlock = 0;
                }

                if (nlock > max_expouser) {
                  return json({
                    status: false,
                    message: `Max Expouser Limit: ${max_expouser}`
                  });
                }

                const doc = await BtMatchSS.findOne({
                  mid_mid: mid,
                  uname: req.user.uname,
                  evt_id: evt_id, // use String(...) if evt_id is a string in Mongo
                  b_nam: drsts.rnr_nam,
                  stld: 0,
                  betfair_fancy: 1
                })
                  .sort({ sno: -1 }) // ORDER BY sno DESC
                  .select("lockamt")
                  .lean();

                const olock = Number(doc.lockamt);
                locka = olock - Number(nlock);

                if (dr.bz_balance + locka >= 0) {
                  const betDoc = await BtMatchSS.create({
                    mid_mid: mid,
                    uname: req.user.uname,
                    rnr_nam: rat,
                    rnr_sid: sectionId, //need to change this
                    bak: ta,
                    lay: tb,
                    lockamt: nlock,
                    b_nam: drsts.rnr_nam,
                    evt_id: evt_id,
                    user_id: req.user._id,
                    cat_mid: cat_mid,
                    betfair_fancy: 1,
                    fancy_bet_type: "bf",
                    mid_stat: "",
                    result_val: "",
                    event_name: event_name,
                    punterSharing: punterSharing
                  });

                  await BtMatchSS.updateOne(
                    { _id: doc._id, betfair_fancy: 1 },
                    { $set: { lockamt: 0 } }
                  );
                  pointok = 1;

                  //redis-book
                  mid_mid = mid;
                  userBook = [];
                  userBook.uname = req.user.uname;
                  userBook.bak = parseInt(ta);
                  userBook.lay = parseInt(tb);
                  userBook.cat_mid = cat_mid;
                  userBook.mid_mid = mid;
                  userBook.lock = parseInt(nlock);
                  userBook.full_chain = full_chain;
                  userBook.sponsor = sponsor;
                  userBook.sponser_id = sponser_id;
                  userBook.market_type = 3;
                  userBook.game_type = 1;
                  userBook.user_id = req.user._id;
                  userBook.master_link = master_link;
                  //$this->redis->setBookData($mid_mid,$userid,json_encode($userBook));
                } else {
                  pointok = 2;
                }
              } else {
                //first bet
                if (lib <= dr.bz_balance) {
                  locka = -lib;
                  nlocka = lib;

                  if (nlocka > max_expouser) {
                    req.json({
                      status: false,
                      message: "Max Expouser Limit:".max_expouser
                    });
                  }

                  if (dr.bz_balance + locka >= 0) {
                    let sti = await BtMatchSS.create({
                      mid_mid: mid,
                      uname: req.user.uname,
                      rnr_nam: rat,
                      rnr_sid: sectionId, //need to change
                      bak: ta,
                      lay: tb,
                      lockamt: nlocka,
                      b_nam: drsts.rnr_nam,
                      evt_id: evt_id,
                      user_id: req.user._id,
                      cat_mid: cat_mid,
                      betfair_fancy: 1,
                      fancy_bet_type: "bf",
                      event_name: event_name,
                      punterSharing: punterSharing
                    });

                    bet_summery_id = sti._id;

                    //redis-book
                    mid_mid = mid;
                    userBook = [];
                    userBook.uname = req.user.uname;
                    userBook.bak = parseInt(ta);
                    userBook.lay = parseInt(tb);
                    userBook.cat_mid = cat_mid;
                    userBook.mid_mid = mid;
                    userBook.lock = parseInt(nlocka);
                    userBook.full_chain = full_chain;
                    userBook.sponsor = sponsor;
                    userBook.sponser_id = sponser_id;
                    userBook.market_type = 3;
                    userBook.game_type = 1;
                    userBook.user_id = req.user._id;
                    userBook.master_link = master_link;
                    // this->redis->setBookData(mid_mid,userid,json_encode(userBook));

                    pointok = 1;
                  } else {
                    pointok = 2;
                  }
                } else {
                  pointok = 0;
                }
              }
            }

            if (pointok == 1) {
              if (typ == "B") ttpp = "Y";
              if (typ == "L") ttpp = "N";

              const inesrtedBetRec = await BtBets.create({
                uname: req.user.uname,
                cat_mid: cat_mid,
                rnr: rnr,
                rate: rat,
                amnt: amt,
                pro: pro,
                lib: lib,
                inplay: inp,
                type: ttpp,
                cla: locka,
                rnrsid: sid,
                m_nam: m_nam,
                bet_type: "bf",
                is_settled: 0,
                is_loss: 0,
                stmp: new Date(),
                section: drsts.rnr_nam ?? "",
                user_id: req.user._id,
                bet_summery_id,
                ip_address: ip_address,
                session_size: price,
                g_type: 1,
                bf_bets: 1,
                api_response: api_response,
                user_bet_rate: user_bet_rate,
                bet_game_type: 1,
                delay: delay,
                bet_device: dvc,
                bet_market_type: 3,
                event_name: event_name,
                b1: "0",
                l1: "0",
                b2: "0",
                l2: "0",
                b3: "0",
                l3: "0",
                book_lock_amount: "0",
                after_bet_balance: "0",
                team1_book: "0",
                team2_book: "0",
                team3_book: "0",
                is_cashout_bet: 0,
                evt_id: evt_id,
                event_name: event_name
              });

              bet_id = inesrtedBetRec._id;
              st2 = await UpdateBalance(req.user._id, locka);
              await pushExposure(req, res, sid, locka, drsts.rnr_nam);

              bet_market_type = 3;
              after_bet_balance = await get_user_latest_points_byid(
                req.user._id
              );
              bt_bets_data = {
                uname: req.user.uname,
                user_id: req.user._id,
                cat_mid: cat_mid,
                rnr: rnr,
                rate: rat,
                amnt: amt,
                pro: pro,
                lib: lib,
                inplay: inp,
                type: ttpp,
                cla: locka,
                rnrsid: sid,
                evt_id: evt_id,
                bet_type: "f",
                bet_summery_id: bet_summery_id,
                section: drsts.rnr_nam,
                session_size: price,
                ip_address: ip_address,
                after_bet_balance: after_bet_balance,
                bet_market_type: bet_market_type,
                g_type: 1,
                delay: delay,
                bet_device: dvc
              };

              bt_bets_data.full_chain = full_chain;
              bt_bets_data.sponsor = sponsor;
              bt_bets_data.sponser_id = sponser_id;
              bt_bets_data.tblname = "bt_bets";
              bt_bets_data.g_type = 1;
              bt_bets_data.master_link = master_link;
              bt_bets_data.bet_auto_id = bet_id;
              bt_bets_data.bet_time = moment().format("YYYY-MM-DD HH:mm:ss");

              if (st2) {
                balance_point = dr.bz_balance + locka;

                dt = moment().format("YYYY-MM-DD HH:mm:ss");
                drpoints = dr.bz_balance + locka;
                dropin_bal = dr.opin_bal;

                const stss270 = await UserLogs.create({
                  page: "livebet_fancy",
                  linkid: bet_id,
                  ptrans: locka,
                  otrans: "",
                  points: drpoints,
                  obal: dropin_bal,
                  uname: req.user.uname,
                  ptype: "bet",
                  user_id: req.user._id,
                  date: dt
                });

                // Vanit
                // $this->SetSessionBookInRedish(evt_id,mid,drsts.rnr_nam,$master_link);

                return res.json({
                  status: true,
                  message: "Fancy Bet Place Successfully."
                });
              } else {
                //$db->rollBack();
                return res.json({
                  status: false,
                  message: "Bet placement failed."
                });
              }
            } else if (pointok == 2) {
              return res.json({
                status: false,
                message: "LIMIT_EX," + $dr.plimit
              });
            } else {
              return res.json({
                status: false,
                message: "Insufficient Balance"
              });
            }
            /* } catch (err) {
              return res.json({
                status: false,
                message: "There is something wrong to place this bet.",
                err:err
              });
            }*/
          } else {
            return res.json({ status: false, message: "Odd Change" });
          }
        } else {
          return res.json({ status: false, message: "Status not open." });
        }
      } else {
        let errorMessage = "";
        errorMessage +=
          userHistoryQuery[0].stat === 0 ? "Account not active. " : "";
        errorMessage +=
          userHistoryQuery[0].bet_status === 0
            ? "Bet is not allowed for your account. "
            : "";
        errorMessage +=
          userHistoryQuery[0].user - role !== "8"
            ? "Bet is not active for this account. "
            : "";

        errorMessage +=
          amt > Number(userHistoryQuery[0].bz_balance)
            ? "You don't have enough Balance to place this bet. "
            : "";

        return res.json({ status: false, message: errorMessage.trim() });
      }
    } else {
      return res.status(401).json({
        status: false,
        message: "Session not valid to place this bet"
      });
    }

    return res.json({ status: false, message: "Reached end" });
  } else {
    if (currency == 1) {
      return res.status(400).json({
        status: false,
        message: `One Time Maximum bet amount ${mat_mlimit}`
      });
    } else if (currency == 2) {
      return res.status(400).json({
        status: false,
        message: `One Time Maximum bet amount ${mat_mlimit}`
      });
    }
  }
};

module.exports = placeBetFairFancyBet;
