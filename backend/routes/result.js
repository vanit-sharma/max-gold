const express = require("express");
const router = express.Router();
const Punter = require("../models/Punter");
const auth = require("../middleware/auth");
const BetfairEvent = require("../models/BetfairEvent");
const CatEvtsFancy = require("../models/CatEvtsFancy");

const moment = require("moment");

router.use(auth);

router.post("/", auth, async (req, res) => {
  let sports_type = req.body.sports_type;
  let from_date = req.body.fromdate;
  let to_date = req.body.todate;
  let user_id = req.user._id;

  console.log("sports_type->", sports_type);
  console.log("from_date->", from_date);
  console.log("to_date->", to_date);
  console.log("user_id->", user_id);

  const startDate = moment(from_date);
  const endDate = moment(to_date);

  let obj = {};
  let returnObj = [];
  if (sports_type == 6) {
    obj.stld = 1;
    const events_list = await CatEvtsFancy.find(obj)
      .select()
      .sort({ mid_st: -1 })
      .limit();

    //console.log("events_list->", events_list);
    if (events_list != "" && events_list.length > 0) {
      for (let i = 0; i < events_list.length; i++) {
        let obj = events_list[i];
        let objNew = {};

        objNew.match_name = obj.event_name;
        objNew.market_name = obj.mid_nam;
        objNew.result = obj.mid_ir;
        returnObj.push(objNew);
      }
    }
  } else {
    obj.stld = 1;
    obj.game_type = sports_type;
    obj.evt_od = { $gte: startDate, $lte: endDate };
    const events_list = await BetfairEvent.find(obj)
      .select()
      .sort({ evt_od: -1 })
      .limit();

    //console.log("events_list->", events_list);

    if (events_list != "" && events_list.length > 0) {
      for (let i = 0; i < events_list.length; i++) {
        let obj = events_list[i];
        let objNew = {};
        if (sports_type == 2) {
          if (obj.parent_cat_mid != "") {
            objNew.match_name = obj.cat_mname;
            objNew.market_name = obj.evt_evt;
          } else {
            objNew.match_name = obj.evt_evt;
            objNew.market_name = obj.cat_mname;
          }
        } else {
          objNew.match_name = obj.evt_evt;
          objNew.market_name = obj.cat_mname;
        }

        objNew.market_date = obj.evt_od;
        if (obj.stat1 == "WINNER") {
          objNew.result = obj.cat_rnr1;
        } else if (obj.stat2 == "WINNER") {
          objNew.result = obj.cat_rnr2;
        } else if (obj.stat3 == "WINNER") {
          objNew.result = obj.cat_rnr3;
        } else {
          objNew.result = "-";
        }

        returnObj.push(objNew);
      }
    }
  }
  res.json({ list: returnObj });
});

module.exports = router;
