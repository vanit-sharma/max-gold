const express = require("express");
const router = express.Router();
const punter = require("../models/Punter");
const BtMatchSs = require("../models/BtMatchSS");
const auth = require("../middleware/auth");

router.use(auth);
router.post("/get-sessionPL", async (req, res) => {
  try {
  const { eid, mid, rname } = req.body;
  if (!eid || !mid || !rname) {
    return res.status(400).json({ error: "Missing parameters" });
  }
  const user_id = req.user._id;

  const stc = await BtMatchSs.aggregate([
    {
      $lookup: {
        from: "bz_bt_punter",
        localField: "user_id",
        foreignField: "_id",
        as: "punterDetails",
      },
    },
    {
      $unwind: "$punterDetails",
    },
    {
      $match: {
        mid_mid: mid,
        evt_id: eid,
        b_nam: rname,
        "punterDetails._id": user_id,
      },
    },
  ]);

  if (stc) {
    const st3z = await BtMatchSs.aggregate([
      {
        $lookup: {
          from: "bz_bt_punter",
          localField: "user_id",
          foreignField: "_id",
          as: "punterDetails",
        },
      },
      {
        $unwind: "$punterDetails",
      },
      {
        $match: {
          mid_mid: mid,
          evt_id: eid,
          b_nam: rname,
          "punterDetails.full_chain": new RegExp(
            "," + req.user._id.toString() + ","
          ),
        },
      },
      {
        $group: {
          _id: 1,
          minrate: { $min: { $toDouble: "$rnr_nam" } },
          maxrate: { $max: { $toDouble: "$rnr_nam" } },
        },
      },
    ]);

    const min = st3z[0].minrate;
    const max = st3z[0].maxrate;

    const nlocka = {};
    for (let l = min - 1; l <= max + 1; l++) {
      let total = 0;

      const st1z = await BtMatchSs.aggregate([
        {
          $lookup: {
            from: "bz_bt_punter",
            localField: "user_id",
            foreignField: "_id",
            as: "punterDetails",
          },
        },
        {
          $unwind: "$punterDetails",
        },
        {
          $match: {
            mid_mid: mid,
            evt_id: eid,
            b_nam: rname,
            "punterDetails.full_chain": new RegExp(
              "," + req.user._id.toString() + ","
            ),
          },
        },
      ]);

      for (const dr1z of st1z) {
        let ttpp = dr1z.bak > 0 ? "y" : "n";
        let lock = Math.abs(Math.min(dr1z.bak, dr1z.lay));
        let lock1 = Math.max(dr1z.bak, dr1z.lay);

        if (dr1z.bak > 0) ttpp = "y";
        else ttpp = "n";

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

      nlocka[l] = total;
    }

    res.json([nlocka]);
  } else {
    res.json([""]);
  }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
