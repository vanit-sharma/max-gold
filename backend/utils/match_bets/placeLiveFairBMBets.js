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
const { json } = require("express");
const BtBets = require("../../models/BtBets.js");
const LiveNotifications = require("../../models/LiveNotifications.js");
const BetfairEventBets = require("../../models/BetfairEventBets.js");
const MatchBz = require("../../models/MatchBz.js");
const moment = require("moment");
const {
  getUserHierarchy,
  get_user_latest_points_byid,
  UpdateBalance,
  fancyLiveApiVirtual,
  bzFormValue,
  pushExposure,
  getPunterSharing
} = require("../function.js");

const callApiRihyanBM = async (eventId) => {
  const FancyUrl = `http://23.106.37.218/cric_api.php?type=bm&evtid=${eventId}`;
  const response = await fetch(FancyUrl);
  const data = await response.json();
  return data;
};

const placeLiveFairBMBets = async (req, res) => {
  let { bet_type, odds, amount, catmid, sid, sr, delay } = req.body;
  const anyOdd = true;
  const runner = 2;
  const uid = req.user.uname;
  const currency = req.user.currency;
  const custom_role = req.user.custom_role;
  const ip_address = getClientIp(req.ip);
  const user_id = req.user._id;
  let stake = amount; //amount
  let is_bet_accept = 0;
  let cat_sid1 = 0;
  let cat_sid2 = 0;
  let cat_sid3 = 0;
  let section = "";
  let rnr = "";
  let evt_id = "";
  let game_type = 0;
  let is_bm_on = 0;
  let event_name = "";
  let rnr1s = 0;
  let rnr2s = 0;
  let user_bet_rate = odds;
  let rnr3s = 0;
  let cla2 = 0;
  let cla = 0;
  let team1_book = 0;
  let team2_book = 0;
  let team3_book = 0;
  let summery_id = "";
  let book_lock_amount = 0;
  let l3 = 0;
  let b3 = 0;
  let l2 = 0;
  let b2 = 0;
  let l1 = 0;
  let b1 = 0;
  let rat = odds;
  let api_response = "";
  let eventName = "";

  var source = req.headers["user-agent"];
  var ua = useragent.parse(source);

  const dvc = JSON.stringify({
    browser: ua.browser,
    os: ua.os,
    platform: ua.platform,
    isMobile: ua.isMobile,
    uaString: ua.source,
    ipAddress:
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress
  });

  if (custom_role == "admin") {
    req.status(403).json({
      status: false,
      message: "Betting Not allowed!!!"
    });
  }

  const mat_mlimit = await getSportsLimit("fancy", user_id);
  const min_amount = await getSportsLimit("fancy_min", user_id);
  const max_expouser = await getSportsLimit("fancy_exp", user_id);

  const maxWinning = currency === 1 || currency === 2 ? 1000000 : 100000;

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

  const admRow = await AdmBetStart.findOne({ sno: 1 }).lean();
  const isBettingEnable = admRow?.IsBettingStart;

  if (!isBettingEnable) {
    return res.json({
      status: false,
      message: "Betting not open for this match."
    });
  }

  const lock = await BetLock.findOne({ user_id: req.user._id })
    .select("cric_matchodd")
    .lean();

  if (lock && Number(lock.cric_matchodd) === 0) {
    return res.json({
      status: false,
      message:
        "Your betting is locked for this market. Please contact your upline."
    });
  }

  const userFilterId = req.user._id.toString();
  const userRegex = new RegExp(`(^|,)${userFilterId}(,|$)`);
  const sqlLock = await BetlockByMarket.find({
    market_type: 1,
    cat_mid: catmid,
    selected_users: {
      $in: userRegex
    }
  }).lean();

  if (sqlLock.length) {
    return res.status(403).json({
      status: false,
      message: "Bet not allowed in this market"
    });
  }

  mid = await bzFormValue(catmid); //match id
  if (mid.length > 20) {
    result["status"] = false;
    result["message"] = "Mid not Valid";
    return result;
  }

  let typ = await bzFormValue(bet_type.toUpperCase()); // Back lay
  if (typ.length > 10) {
    return res.status(403).json({ status: false, message: "Type not Valid" });
  }

  rat = await bzFormValue(odds); // Odds
  if (rat.length > 7) {
    return res.status(403).json({
      status: false,
      message: "We are not accepting bet on this Odds"
    });
  }

  amt = await bzFormValue(amount); // bet amount
  if (amt > mat_mlimit) {
    return res
      .status(403)
      .json({ status: false, message: "Max Size is:".mat_mlimit });
  }

  sid = await bzFormValue(sid); // Team Id
  if (sid.length > 15) {
    result["status"] = false;
    result["message"] = "Team Name Not Valid";
    return result;
    res.status(403).json({
      status: false,
      message: "Team Name Not Valid"
    });
  }

  if (amt < min_amount) {
    return res.status(403).json({
      status: false,
      message: "Min Size is " + min_amount
    });
  }

  rte = "o";
  liverate = "0";

  const drsts = await BetfairEvent.findOne({
    cat_mid: mid
  }).lean();

  if (drsts) {
    drsts.cid = Buffer.from(drsts.cat_mid, "utf8").toString("base64");
  }
  //console.log("drsts->", drsts);
  if (drsts) {
    const match_typ = drsts.match_typ;
    const inplayStatus = drsts.inplay;
    const evt_type = drsts.evt_api_type;
    const match_status = drsts.match_status;
    const pending = drsts.pending;
    cat_sid1 = drsts.cat_sid1;
    cat_sid2 = drsts.cat_sid2;
    cat_sid3 = drsts.cat_sid3;
    const bookmaker_bet_on = drsts.bookmaker_bet_on;
    event_name = drsts.evt_evt;

    const runner1Name = drsts.cat_rnr1;
    const runner2Name = drsts.cat_rnr2;
    const runner3Name = drsts.cat_rnr3;
    const cla = 0;

    evt_id = drsts.evt_id;
    is_bet_accept = drsts.is_bet_accept;
    game_type = drsts.game_type; // 1 => Cricket , 2 => Football , 3 => Tennis
    is_bm_on = drsts.is_bm_on;

    eventName = drsts.evt_evt;
    console.log("eventName->", eventName);

    if (runner3Name !== "NA") {
      runner = 3;
    }

    if (bookmaker_bet_on === 0) {
      return res.json({
        status: false,
        message: "Bet not accept on this market for this event."
      });
    }

    if (game_type === 1) {
      if (user_controls.c_enble === 0) {
        return res.json({
          status: false,
          message: "Bet not allow for your account."
        });
      }
    }

    if (game_type === 2) {
      if (user_controls.f_enable === 0) {
        return res.json({
          status: false,
          message: "Bet not allow for your account."
        });
      }
    }

    if (game_type === 3) {
      if (user_controls.t_enable === 0) {
        return res.json({
          status: false,
          message: "Bet not allow for your account."
        });
      }
    }

    if (typ === "B") {
      if (sid == cat_sid1) {
        rnr = "b1";
        section = runner1Name;
      } else if (sid == cat_sid2) {
        rnr = "b2";
        section = runner2Name;
      } else {
        rnr = "b3";
        section = runner3Name;
      }
    } else {
      if (sid == cat_sid1) {
        rnr = "l1";
        section = runner1Name;
      } else if (sid == cat_sid2) {
        rnr = "l2";
        section = runner2Name;
      } else {
        rnr = "l3";
        section = runner3Name;
      }
    }
  } else {
    return res.json({ status: false, message: "Event Not Open" });
  }

  if (!is_bet_accept) {
    return res.json({
      status: false,
      message: "We are not accepting bet on events."
    });
  }

  //console.log("sid->", sid, "rnr->", rnr);

  if (
    (sid == cat_sid1 && (rnr == "l1" || rnr == "b1")) ||
    (sid == cat_sid2 && (rnr == "l2" || rnr == "b2")) ||
    (sid == cat_sid3 && (rnr == "l3" || rnr == "b3"))
  ) {
  } else {
    return res.json({ status: false, message: "parameter not valid." });
  }

  const drstBetCount = await BtBets.countDocuments({
    uname: uid,
    cat_mid: mid,
    evt_id: evt_id,
    inplay: "1",
    bet_type: "bm"
  });
  if (drstBetCount && game_type === 1) {
    if (drstBetCount > 100) {
      return res.json({
        status: false,
        message: "Bet Limit Exceeded"
      });
    }
  }

  if (game_type === 1) {
    const drstBet = await BtBets.findOne({
      uname: uid,
      cat_mid: mid,
      evt_id: evt_id,
      bet_type: "bm"
    })
      .sort({ stmp: -1 })
      .lean();

    let lastBetMin = null;
    if (drstBet && drstBet.stmp) {
      //lastBetMin = moment().diff(moment(drstBet.stmp), 'seconds');
      lastBetMin = drstBet.lastBetMin;
    }
  }

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

  if (userHistoryQuery && evt_id != "") {
    const dr = userHistoryQuery[0];
    const full_chain = dr["full_chain"];
    const sponsor = dr["sponsor"];
    const sponser_id = dr["sponser_id"];

    let punterSharing = await getPunterSharing(req.user._id);

    let jsonds = "";

    if (dr.stat === 1 && dr.bet_status === 1 && dr.user_role === 8) {
      if (is_bm_on === 1) {
        const return_array = {};
        return_array["evt_id"] = evt_id;
        // let json_array = JSON.stringify(return_array);
        // jsonds = getBookMakerOddProxy(json_array);
        jsonds = await callApiRihyanBM(evt_id);
      }
      console.log("jsonds->", jsonds, "is_bm_on->", is_bm_on);
      let bb1 = 0,
        ll1 = 0;
      api_response = jsonds;

      if (jsonds !== "" && jsonds) {
        if (Array.isArray(jsonds) && jsonds.length > 0) {
          for (const value of jsonds) {
            if (value.sr === 1 && value.s === "ACTIVE" && sr === 1) {
              if (value.b1 !== 0) {
                // bb1 = value.b1;
                bb1 = value.b1 / 100 + 1;
              }
              if (value.l1 !== 0) {
                // ll1 = value.l1;
                ll1 = value.l1 / 100 + 1;
              }
            }

            if (value.sr === 2 && value.s === "ACTIVE" && sr === 2) {
              if (value.b1 !== 0) {
                bb1 = value.b1 / 100 + 1;
              }
              if (value.l1 !== 0) {
                ll1 = value.l1 / 100 + 1;
              }
            }

            if (value.sr === 3 && value.s === "ACTIVE" && sr === 3) {
              if (value.b1 !== 0) {
                bb1 = value.b1 / 100 + 1;
              }
              if (value.l1 !== 0) {
                ll1 = value.l1 / 100 + 1;
              }
            }

            if (typ === "B") {
              liverate = bb1;
            } else if (typ === "L") {
              liverate = ll1;
            } else {
              return { status: false, message: "Odd not match" };
            }
          }
        } else {
          return res.json({ status: false, message: "Odd not valid." });
        }
      } else {
        return res.json({ status: false, message: "Odd not valid.", jsonds });
      }

      let ta = 0,
        tb = 0,
        tc = 0,
        pro = 0,
        lib = 0;
      let t1 = runner;
      let ratok = 0;
      console.log("liverate->", liverate, "rat->", rat);

      if (typ === "B") {
        // if (rat <= liverate && liverate !== 0)
        if (anyOdd === 1 || (rat <= liverate && liverate !== 0)) {
          if (!liverate) {
            ratok = 10;
          } else {
            ratok = 1;
            pro = (liverate - 1) * amt;
            lib = amt;
            if (rnr === "b1") {
              ta += pro;
              tb -= lib;
              tc -= lib;
            }
            if (rnr === "b2") {
              ta -= lib;
              tb += pro;
              tc -= lib;
            }
            if (rnr === "b3") {
              ta -= lib;
              tb -= lib;
              tc += pro;
            }
          }
        } else {
          ratok = 11;
        }
      }

      if (typ === "L") {
        // if (rat >= liverate && liverate !== 0)
        if (anyOdd === 1 || (rat >= liverate && liverate !== 0)) {
          if (!liverate) {
            ratok = 12;
          } else {
            ratok = 1;
            pro = amt;
            lib = (liverate - 1) * amt;

            if (rnr === "l1") {
              ta -= Number(lib);
              tb += Number(pro);
              tc += Number(pro);
            }
            if (rnr === "l2") {
              ta += pro;
              tb -= lib;
              tc += pro;
            }
            if (rnr === "l3") {
              ta += pro;
              tb += pro;
              tc -= lib;
            }
          }
        } else {
          ratok = 13;
        }
      }

      let inp = "1"; // $r2 is always 1, so inp is '1'
      console.log("ratok->", ratok);
      if (ratok === 1) {
        let pointok = 0;
        summery_id = 0;

        if (rte === "o") {
          const drstc = await BetfairEventBets.findOne({
            cat_mid: mid.toString(),
            user_id: req.user._id,
            market_type: 2
          }).lean();

          if (drstc) {
            summery_id = drstc._id;

            let limit = 0;
            if (t1 === 2) {
              const limita = drstc.lockamt + drstc.rnr1s + dr.bz_balance;
              const limitb = drstc.lockamt + drstc.rnr2s + dr.bz_balance;

              if (rnr === "b1") limit = limitb;
              if (rnr === "b2") limit = limita;

              if (rnr === "l1") limit = limita;
              if (rnr === "l2") limit = limitb;
            }

            if (t1 === 3) {
              const limita = drstc.lockamt + drstc.rnr1s + dr.bz_balance;
              const limitb = drstc.lockamt + drstc.rnr2s + dr.bz_balance;
              const limitc = drstc.lockamt + drstc.rnr3s + dr.bz_balance;

              if (rnr === "b1") limit = Math.min(limitb, limitc);
              if (rnr === "b2") limit = Math.min(limita, limitc);
              if (rnr === "b3") limit = Math.min(limita, limitb);

              if (rnr === "l1") limit = limita;
              if (rnr === "l2") limit = limitb;
              if (rnr === "l3") limit = limitc;
            }

            if (lib <= limit) {
              // update bz_betfair_events_bets
              const pla = drstc.lockamt;
              const nla1 = Number(drstc.rnr1s) + Number(ta);
              const nla2 = Number(drstc.rnr2s) + Number(tb);

              let nla = 0;

              if (t1 == 2) {
                nla =
                  Math.min(nla1, nla2) < 0 ? Math.abs(Math.min(nla1, nla2)) : 0;
              }

              let nla3 = 0;
              if (t1 == 3) {
                nla3 = Number(drstc.rnr3s) + Number(tc);
                nla =
                  Math.min(nla1, nla2, nla3) < 0
                    ? Math.abs(Math.min(nla1, nla2, nla3))
                    : 0;
              }

              cla = pla - nla;

              if (nla > max_expouser) {
                return res.json({
                  status: false,
                  message: "Max Expouser Limit:" + max_expouser
                });
              }

              const maxPL =
                t1 === 3 ? Math.max(nla1, nla2, nla3) : Math.max(nla1, nla2);
              if (maxPL > maxWinning) {
                return res.json({
                  status: false,
                  message: "Max Winning Limit Exceded " + maxWinning
                });
              }

              pointok = 1;
              if (dr.bz_balance - cla >= 0) {
                // Prepare update values for rnr1s, rnr2s, rnr3s
                const taVal =
                  ta < 0
                    ? Number(drstc.rnr1s) + Number(ta)
                    : Number(drstc.rnr1s) + Number(ta);
                const rnr2s =
                  tb < 0
                    ? Number(drstc.rnr2s) + Number(tb)
                    : Number(drstc.rnr2s) + Number(tb);
                const rnr3s =
                  tc < 0
                    ? Number(drstc.rnr3s) + Number(tc)
                    : Number(drstc.rnr3s) + Number(tc);

                userid = req.user._id;

                await BetfairEventBets.updateOne(
                  {
                    cat_mid: mid,
                    uname: req.user.uname,
                    user_id: req.user._id,
                    market_type: 2
                  },
                  {
                    $set: {
                      rnr1s: taVal,
                      rnr2s: rnr2s,
                      rnr3s: rnr3s,
                      lockamt: nla
                    }
                  }
                );

                /* const stm = await MatchBz.updateOne(
                  {
                    cat_mid: mid,
                    uname: req.user.uname,
                    user_id: req.user._id,
                    market_type: 2,
                  },
                  {
                    $set: {
                      rnr1s: taVal,
                      rnr2s: rnr2s,
                      rnr3s: rnr3s,
                      lockamt: nla,
                    },
                  }
                );*/

                const drBetBook = await BetfairEventBets.findOne({
                  cat_mid: mid,
                  uname: req.user.uname,
                  user_id: req.user._id,
                  market_type: 2
                }).lean();

                team1_book = drBetBook.rnr1s;
                team2_book = drBetBook.rnr2s;
                team3_book = drBetBook.rnr3s;

                book_lock_amount = nla;

                // redis-book
                const userBook = {
                  uname: uid,
                  rnr1s: parseInt(team1_book, 10),
                  rnr2s: parseInt(team2_book, 10),
                  rnr3s: parseInt(team3_book, 10),
                  mid: mid,
                  lock: parseInt(nla, 10),
                  full_chain: full_chain,
                  sponsor: sponsor,
                  sponser_id: sponser_id,
                  market_type: 2,
                  game_type: game_type,
                  user_id: userid,
                  master_link: await getUserHierarchy(userid)
                };

                // const redis_key = `${userid}_${mid}`;
                // $this->redis->setData($redis_key,17,json_encode($userBook));
                // $this->redis->setBookMakerData($mid,$userid,json_encode($userBook));
              } else {
                pointok = 2;
              }
            } else {
              pointok = 0;
            }
          } else {
            // If drstc not found, fallback logic
            if (lib <= dr.bz_balance) {
              const drsts = await BetfairEvent.findOne({ cat_mid: mid }).lean();
              if (drsts) {
                drsts.cid = Buffer.from(drsts.cat_mid, "utf8").toString(
                  "base64"
                );
              }
              cla = -lib;
              cla2 = lib;

              if (cla2 > max_expouser) {
                return res.json({
                  status: false,
                  message: "Max Expouser Limit:" + max_expouser
                });
              }

              book_lock_amount = cla2;

              if (dr.bz_balance - cla >= 0) {
                const userid = req.user._id;
                const betData = {
                  cat_mid: mid,
                  uname: uid,
                  rnr1: drsts.cat_rnr1,
                  rnr1s: ta,
                  rnr2: drsts.cat_rnr2,
                  rnr2s: tb,
                  rnr3: drsts.cat_rnr3,
                  rnr3s: tc,
                  market_type: 2,
                  bet_game_type: 1,
                  lockamt: cla2,
                  rnr1sid: drsts.cat_sid1,
                  rnr2sid: drsts.cat_sid2,
                  rnr3sid: drsts.cat_sid3,
                  user_id: userid,
                  parent_cat_mid: "",
                  event_name: eventName,
                  punterSharing: punterSharing
                };

                // Insert into BetfairEventBets
                const betfairEventBet = new BetfairEventBets(betData);
                await betfairEventBet.save();
                summery_id = betfairEventBet._id;

                // Insert into MatchBz
                //const matchBzBet = new MatchBz(betData);
                //await matchBzBet.save();

                team1_book = ta;
                team2_book = tb;
                team3_book = tc;

                // redis-book
                const userBook = {
                  uname: uid,
                  rnr1s: parseInt(ta, 10),
                  rnr2s: parseInt(tb, 10),
                  rnr3s: parseInt(tc, 10),
                  mid: mid,
                  lock: parseInt(book_lock_amount, 10),
                  full_chain: full_chain,
                  sponsor: sponsor,
                  sponser_id: sponser_id,
                  market_type: 2,
                  game_type: game_type,
                  user_id: userid,
                  master_link: await getUserHierarchy(userid)
                };

                // $redis_key = $userid."_".$mid;
                //   $this->redis->setData($redis_key,17,json_encode($userBook));
                //   $this->redis->setBookMakerData($mid,$userid,json_encode($userBook));

                pointok = 1;
              } else {
                pointok = 2;
              }
            } else {
              pointok = 0;
            }
          }
        }

        if (pointok === 1) {
          // Update user balance
          const st2 = await UpdateBalance(req.user._id, cla);
          // Inserting exposure here
          await pushExposure(req, res, catmid, cla, event_name);

          const after_bet_balance = await get_user_latest_points_byid(
            req.user._id
          );
          const bet_market_type = 2;

          // Prepare bet data
          const bt_bets_data = {
            uname: uid,
            user_id: req.user._id,
            cat_mid: mid,
            rnr: rnr,
            rate: liverate,
            amnt: amt,
            pro: pro,
            lib: lib,
            inplay: inp,
            type: typ,
            cla: cla,
            rnrsid: sid,
            evt_id: evt_id,
            bet_type: "bm",
            bet_summery_id: summery_id,
            section: section,
            ip_address: ip_address,
            after_bet_balance: after_bet_balance,
            bet_market_type: bet_market_type,
            book_lock_amount: book_lock_amount,
            bet_game_type: 1,
            team1_book: team1_book,
            team2_book: team2_book,
            team3_book: team3_book,
            delay: delay,
            bet_device: dvc,
            event_name: event_name,
            g_type: 1,
            user_bet_rate: user_bet_rate,
            api_response: JSON.stringify(api_response),
            b1: b1,
            l1: l1,
            b2: b2,
            l2: l2,
            b3: b3,
            l3: l3
          };

          // Insert bet into BtBets collection
          const betDoc = new BtBets(bt_bets_data);
          await betDoc.save();
          const bet_id = betDoc._id;

          // Add extra fields for redis-betlist
          bt_bets_data.full_chain = full_chain;
          bt_bets_data.bet_auto_id = bet_id;
          bt_bets_data.bet_time = moment().format("YYYY-MM-DD HH:mm:ss");
          bt_bets_data.sponsor = sponsor;
          bt_bets_data.sponser_id = sponser_id;
          bt_bets_data.g_type = game_type;

          // TODO: Set bet list in redis if needed
          //$this->redis->setBetList($mid,$bet_id,json_encode($bt_bets_data));
          if (st2) {
            const balance_point = dr.bz_balance + cla;
            // TODO: Update session point if needed
            //$this->session->set_userdata('point',$balance_point);

            const dt = moment().format("YYYY-MM-DD HH:mm:ss");

            // New Logs
            const logData = {
              user_id: req.user._id,
              page: "livebet",
              linkid: bet_id,
              ptrans: cla,
              otrans: "",
              points: balance_point,
              obal: dr.opin_bal,
              uname: req.user.uname,
              date: dt,
              ptype: "bet"
            };
            await UserLogs.create(logData);

            const description =
              uid +
              " has placed a new bet #" +
              bet_id +
              " by " +
              stake +
              " to " +
              event_name +
              " with odds " +
              liverate;

            const notificationsData = {
              evt_id: evt_id,
              user_id: req.user._id,
              game_type: game_type,
              description: description
            };

            await LiveNotifications.create(notificationsData);

            return res.json({
              status: true,
              message: "Bookmaker Bet Place Successfully."
            });
          } else {
            return res.json({
              status: false,
              message: "Error updating balance."
            });
          }
        } else if (pointok === 2) {
          return res.json({
            status: false,
            message: "Check your bet limit"
          });
        } else {
          return res.json({
            status: false,
            message: "Insufficient balance"
          });
        }
      } else {
        return res.json({
          status: false,
          message: "Rate not matched."
        });
      }
    } else {
      let errorMessage = "Something wrong happened. Please try again.";

      if (dr.stat == "0") {
        errorMessage = "Account not active. You cannot place bet";
      }

      if (dr.bet_status == "0") {
        errorMessage =
          "Betting is stopped in your account, please contact your upline.";
      }

      if (dr.user_role != "8") {
        errorMessage = "Only User role can place bet. Your role is not user";
      }

      // errorMessage = (stake > dr.bz_balance) ? "You don't have enough Balance to place this bet." : errorMessage;
      return res.json({
        status: false,
        message: errorMessage,
        here: `${dr.stat}-${dr.bet_status}-${dr.user_role}`
      });
    }
  } else {
    return res.json({ msg: "Session not valid to place this bet" });
  }
};

module.exports = placeLiveFairBMBets;
