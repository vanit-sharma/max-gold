const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const moment = require("moment-timezone");
const auth = require("../../middleware/agentAuth");
const Punter = require("../../models/Punter");
const BzBtPunterTransSummary = require("../../models/BzBtPunterTransSummary");
const PunterTransDetails = require("../../models/PunterTransDetails");
const BetfairEvent = require("../../models/BetfairEvent");
const sportsApingRequest = require("../../utils/sportsApingRequest");

router.use(auth);


router.post("/", async (req, res) => {
  
  let master_id = req.user._id;

  let frm = req.body.frm;
  if (frm != "") {
    const date = moment(frm);
    frm = date.format("YYYY-MM-DD");
  } else {
    frm = moment().format("YYYY-MM-DD");
  }

  let til = req.body.til;
  if (til != "") {
    const date = moment(til);
    til = date.format("YYYY-MM-DD");
  } else {
    til = moment().format("YYYY-MM-DD");
  }

  frm = frm + " 00:00:00";
  til = til + " 23:59:59";

// Fetch sponsor info for the master user
const userCheck = await Punter.findOne({ _id: master_id }, { sponser_id: 1, user_role: 1, sponsor: 1 }).lean();
const sponser_id = userCheck.sponser_id;
const sponser_role = userCheck.user_role;
const sponsor_uname = userCheck.sponsor;

		let plus_array = [];
		let minus_array = [];

        const punterIds = await Punter.find(
  {
    full_chain: { $regex: `,${master_id},` },  // LIKE '%,master_id,%'
    _id: { $ne: master_id }                    // sno != master_id
  },
  { _id: 1 }
).distinct("_id");

console.log("punterIds:", punterIds);

let pipeline = [
  {
    $match: {
      type: 1,
      created_date: { $gte: new Date(frm), $lte: new Date(til) },
      user_id: { $in: punterIds }        // subquery result
    }
  },

  {
    $lookup: {
      from: "bz_bt_punter",
      localField: "user_id",
      foreignField: "_id",
      as: "punter"
    }
  },

  { $unwind: "$punter" },

  {
    $group: {
      _id: "$user_id",
      my_share_amount: { $sum: "$amount" },
      user_role: { $first: "$punter.user_role" },
      uname: { $first: "$punter.uname" },
      sponsor: { $first: "$punter.sponsor" }
    }
  },

  {
    $project: {
      _id: 0,
      user_id: "$_id",
      my_share_amount: 1,
      upline_share_amount: { $literal: 0 },
      utype: { $literal: "downline" },
      user_role: 1,
      uname: 1,
      sponsor: 1
    }
  }
];

const downline = await PunterTransDetails.aggregate(pipeline);
console.log("downline:", downline);

pipeline = [
  // Match date, type, and user_id = master_id
  {
    $match: {
      type: 1,
      created_date: { $gte: new Date(frm), $lte: new Date(til) },
      user_id: new mongoose.Types.ObjectId(master_id)
    }
  },

  // JOIN with punter collection
  {
    $lookup: {
      from: "bz_bt_punter",
      localField: "user_id",
      foreignField: "_id",
      as: "punter"
    }
  },

  // Convert lookup array to object (inner join)
  { $unwind: "$punter" },

  // GROUP BY user_id
  {
    $group: {
      _id: "$user_id",
      my_share_amount: { $sum: "$amount" },
      upline_share_amount: { $sum: "$bettor_d" },
      user_role: { $first: "$punter.user_role" },
      uname: { $first: "$punter.uname" },
      sponsor: { $first: "$punter.sponsor" }
    }
  },

  // Final output formatting
  {
    $project: {
      _id: 0,
      user_id: "$_id",
      my_share_amount: 1,
      upline_share_amount: 1,
      utype: { $literal: "current" },
      user_role: 1,
      uname: 1,
      sponsor: 1
    }
  }
];

const current = await PunterTransDetails.aggregate(pipeline);
console.log("current:", current);
/*


		$sql ="select user_id,sum(amount) my_share_amount,0 upline_share_amount,'downline' utype,user_role,p.uname,p.sponsor from bz_bt_punter_trans_details t
		INNER JOIN bz_bt_punter p ON t.user_id = p.sno
		where created_date BETWEEN '$frm' and '$til' and user_id in (select sno from bz_bt_punter where full_chain like '%,$master_id,%' and sno!=$master_id) and t.`type`=1 group by user_id
		UNION
		select user_id,sum(amount) my_share_amount,sum(bettor_d) upline_share_amount,'current' utype,user_role,p.uname,p.sponsor from bz_bt_punter_trans_details t
		INNER JOIN bz_bt_punter p ON t.user_id = p.sno
		where created_date BETWEEN '$frm' and '$til' and user_id in ($master_id) and t.`type`=1 group by user_id";

		$userFullQuery = $this->db->query($sql)->result();
        */
       let userFullQuery = downline.concat(current);
       let totalProfit = 0;
       let totalLoss = 0;
        for (const chain of userFullQuery)
		{
			let user_id = chain.user_id;
			let username = chain.uname;
			let my_share_amount = chain.my_share_amount;
			let upline_share_amount = chain.upline_share_amount;
			let user_role = chain.user_role;
			let utype = chain.utype;
			let sponsor = chain.sponsor;

			let arr = {};
			
			arr.user_id = user_id;
			arr.user_role = user_role;
			arr.uname = username;
			arr.sponsor = sponsor;

			if(user_role==8)
			{
				if(my_share_amount>=0)
				{
					arr.winAmount = parseInt(my_share_amount);
                    totalProfit += parseInt(my_share_amount);
					plus_array.push(arr);
				}
				else
				{
					arr.winAmount = parseInt(my_share_amount);
                    totalLoss += parseInt(my_share_amount);
					minus_array.push(arr);
				}
			}
			else
			{
				if(utype=="current")
				{
					//self details
					if(my_share_amount<0)
					{
						arr.winAmount = Math.abs(parseInt(my_share_amount));
                        totalProfit += Math.abs(parseInt(my_share_amount));
						plus_array.push(arr);
					}
					else
					{
						arr.winAmount = (0 - parseInt(my_share_amount));
                        totalLoss += (0 - parseInt(my_share_amount));
						minus_array.push(arr);
					}

					//sponsor details
					let sponsorArr = {};
					
					sponsorArr.user_id = sponser_id;
					sponsorArr.user_role = sponser_role;
					sponsorArr.uname = sponsor_uname;
					sponsorArr.uname = "BOOK";
					sponsorArr.sponsor = sponsor;

					if(upline_share_amount<0)
					{
						sponsorArr.winAmount = Math.abs(parseInt(upline_share_amount));
                        totalProfit += Math.abs(parseInt(upline_share_amount));
						plus_array.push(sponsorArr);
					}
					else
					{
						sponsorArr.winAmount = (0 - parseInt(upline_share_amount));
                        totalLoss += (0 - parseInt(upline_share_amount));
						minus_array.push(sponsorArr);
					}
				}
				else
				{
					if(my_share_amount<0)
					{
						arr.winAmount = Math.abs(parseInt(my_share_amount));
                        totalProfit += Math.abs(parseInt(my_share_amount));
						plus_array.push(arr);
					}
					else
					{
						arr.winAmount = (0 - parseInt(my_share_amount));
                        totalLoss += (0 - parseInt(my_share_amount));
						minus_array.push(arr);
					}
				}
			}
		}
		
        
  //return res.json(return_array);
  return res.json({ loss_users: minus_array, profit_users: plus_array, totalProfit: totalProfit, totalLoss: totalLoss });
  
 //res.json({ message: "Not implemented yet" });
});

module.exports = router;