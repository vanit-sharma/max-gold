const mongoose = require("mongoose");
const BzHeadTailRate = require("../models/BzHeadTailRate.js");
const HeadtailMatch = require("../models/HeadtailMatch.js");

const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const HeadtailBetHistory = require("../models/HeadtailBetHistory.js");
const { UpdateBalance, pushExposure } = require("../../utils/function");

const BzPtRecord = require("../../models/BzPtRecord");
const BzPtLogHistory = require("../../models/BzPtLogHistory");

    async function placeHeadTailGameBet(req){
        

        if(req.user.user_role != 8)
        {
            result.status = false;
            result.message = "Betting Not allowed!!!";
            return result;
        }

        let eid = req.body.catmid; // catmid = 18.220808091932
		let mnam = req.body.teamname; // teamname
		let rnr = req.body.bettype; //b =back , l= lay
		let rat = req.body.odds;
		let amt = req.body.amount; // amount

		let currency = req.user.currency;
		let user_id = req.user._id;
        
        let min_amount = 0;
		if(currency==1) /// 1=INR,2=PKR,3=AED,4= BDT
		{
			min_amount = 100;
		}
		else if(currency==2)
		{
			min_amount = 100;
		}else if(currency==3)
		{
			min_amount = 2;
		}else if(currency==4)
		{
			min_amount = 500;
		}
		let limit_bet = await BetLimit.findOne({ user_id: user_id }).select("casino");

        if(amt > limit_bet)
		{
			result.status = false;
			result.message = "min "+min_amount+ " and max "+limit_bet+" point bet allow";
			return result;
		}

		if(amt < min_amount)
		{
			result.status = false;
			result.message = "min "+min_amount+ " and max "+limit_bet+" point bet allow";
			return result;
		}

        if(eid && mnam && rnr && rat && rat > 0 && rat != 'SUSPENDED' && amt && amt >= min_amount && amt <= limit_bet)
        {

            mid = req.body.catmid; // catmid = 18.220808091932
			typ = req.body.bettype; //b =back , l= lay
            mnam = req.body.teamname; // teamname
			rnr = req.body.bettype;
			rat = req.body.odds;
			amt = req.body.amount;
            gameType = req.body.game_type;

            if(amt > limit_bet)
			{
				result.status = false;
                result.message = "min "+min_amount+ " and max "+limit_bet+" point bet allow";
                return result;
			}

			if(amt < min_amount)
			{
				result.status = false;
                result.message = "min "+min_amount+ " and max "+limit_bet+" point bet allow";
                return result;
			}

			///
			let contract_money = amt;
			let amtPercentage = 0;
			let fee = (amt * amtPercentage) / 100;
			let delivery = amt - fee;
			///
            let uid = req.user.uname;
			let upt = req.user.point;
			let user_id = req.user._id;

            mnam = String(mnam).toLowerCase().trim();
			bet_type = gameType;
			gameRate = rat;
			gameProfit = 0;

            if(mnam== 'head' || mnam== 'tail')
			{
				if(mnam == 'head'){
					new_sid = 1;
				}else if(mnam== 'tail'){
					new_sid = 2;
				}
				
				//$bet_type = $gameType;
	
				
			}
            else
			{
				result.status = false;
				result.message = "Runner name not valid";
				return result;
			}

            intSid = new_sid;
            new_compare_sid = mid+"-"+new_sid;
			sid = new_compare_sid;
			typ = "b";
			uid = req.user.uname;
			upt = req.user.point;
			//$uss = session_id();

			if(typ == 'b')
			{
				rnr = 'b1';
			}

            // Fetch the head/tail rate document for the given event ID and status OPEN
            const qdr = await BzHeadTailRate.aggregate([
                {
                    $match: {
                        evt_status: 'OPEN',
                        evt_id: mid
                    }
                },
                {
                    $addFields: {
                        difftm: {
                            $divide: [
                                { $subtract: [new Date(), "$evt_od"] },
                                1000
                            ]
                        }
                    }
                }
            ]);

            if (qdr.length === 1) {

				stld = qdr.stld;
				match_status = qdr.evt_status;
				evt_id = qdr.evt_id;
				cat_sid1 = qdr.cat_sid1;
				cat_sid2 = qdr.cat_sid2;
				cat_sid3 = qdr.cat_sid3;
				timeLeft = qdr.difftm;
				b1 = qdr.b1;
				b2 = qdr.b2;
				b3 = qdr.b3;

				if(timeLeft > 20)
				{
					result.status = false;
					result.message = "Bet not placed. Time is up!!";
					return result;
				}
			}
			else
			{
				result.status = false;
				result.message = "Round not found";
				return result;
			}

            let isBettingEnable = false;
            const admBetStart = await AdmBetStart.findOne({ sno: 1 }).lean();
            if (admBetStart && admBetStart.head_tail) {
                isBettingEnable = admBetStart.head_tail;
            }

			if(isBettingEnable==false)
			{
				result.status = false;
				result.message = "Betting not open for this game.";
				return result;
			}

            if(match_status.toUpperCase() != 'OPEN' || stld == 1)
			{
					result.status = false;
					result.message = "Status not open";
					return result;
			}

                dr = await Punter.aggregate([
                  {
                    $match: { _id: session._id },
                  },
                  {
                    $lookup: {
                      from: "bz_user_login_history", // the collection name
                      localField: "_id", // Punter’s _id
                      foreignField: "userAutoId", // history’s userAutoId
                      as: "loginHistory", // output array field
                    },
                  },
                  {
                    $unwind: {
                      path: "$loginHistory",
                      preserveNullAndEmptyArrays: true, // keeps the user even if no history
                    },
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
                      "loginHistory.site_toke": 1,
                    },
                  },
                  {
                    $limit: 1,
                  },
                ]);
            
                if (dr && dr[0].logon == 1) {
                    userObal = dr[0]['opin_bal'];
                    liverate = 0;
                    isMatch = false;

				jsonds = await BzHeadTailRate.findOne({ evt_id: mid }).lean();

                if(jsonds)
				{
                    if(($new_sid == 1 || $new_sid == 2) && (jsonds.evt_status=="OPEN" && jsonds.suspend1==0))
                    {
                        if(rat==jsonds.b1){
                            liverate = jsonds.b1;
                            isMatch = true;
                        }
                    }
                }

                if(!isMatch)
                {
                    result.status = false;
                    result.message = "Round not open";
                    return result;
                }


                ta = 0;
				tb = 0;
				tc = 0;

				if(typ == "b" )
				{
					if(rat <= liverate && liverate > 0 && liverate)
					{
						ratok = 1;
						pro = 0;
						lib = amt;
						if(rnr == 'b1') { ta += pro; tb -= lib;  }

					}
					else
					{
						ratok = 0;
					}
				}

                if(ratok == 1)
				{
                    try{

                        pointok = 0;


						if(lib <= dr[0]['bz_balance'])
						{

							cla = -lib;
							nla = cla2 = lib;

							if((dr[0]['bz_balance'] - cla) >= 0)
							{
								pla = 0;
								if(cla2 <= limit_bet)
								{
									newPro = 0;
                                    const newMatch = new HeadtailMatch({
                                        mid_mid: mid,
                                        uname: uid,
                                        rnr_nam: mnam,
                                        rnr_sid: sid,
                                        bak: newPro,
                                        lay: cla,
                                        lockamt: cla2,
                                        evt_id: mid,
                                        fee: fee,
                                        contract_money: contract_money,
                                        delivery: delivery,
                                        bet_type: bet_type,
                                        user_id: user_id,
                                        rate: gameRate
                                    });
                                    const savedMatch = await newMatch.save();
                                    const summary_id = savedMatch._id;
                                    pointok = 1;
								}
								else
								{
									pointok = 3;
								}

							}
							else
							{
								pointok = 2;
							}

						}
						else
						{
							pointok = 0;
						}



						if(pointok == 1)
						{
							///
                            await BzHeadTailRate.updateOne({ evt_id: mid }, { $set: { is_bet_place: '1' } });
							///

							cla = -lib;
							ratRollDIce = 0;
							newPro = 0;
                            const newBetHistory = new HeadtailBetHistory({
                                uname: uid,
                                cat_mid: mid,
                                rnr: mnam,
                                rate: gameRate,
                                amnt: amt,
                                pro: newPro,
                                lib: lib,
                                type: typ,
                                cla: cla,
                                rnrsid: sid,
                                sid: intSid,
                                fee: fee,
                                contract_money: contract_money,
                                delivery: delivery,
                                bet_type: bet_type,
                                user_id: user_id
                            });
                            const savedBetHistory = await newBetHistory.save();
                            const bet_id = savedBetHistory._id;

                            const remark = `Head Tail Game Round ID: ${mid}`;
                            const ptRecord = new BzPtRecord({
                                from: uid,
                                to: "JKADMIN",
                                point: amt,
                                type: "BETHEADTAIL",
                                remark: remark,
                                loginId: user_id,
                                ipadd: req.ip || (req.headers && req.headers['x-forwarded-for']) || "",
                                remark2: bet_id,
                                summary_id: summary_id,
                                bet_place_date: new Date(),
                                is_virtual: 1,
                                virtual_game_name: 3
                            });
                            const savedPtRecord = await ptRecord.save();
                            const lastInsertId = savedPtRecord._id;
                            if(lastInsertId) {
                                // Update user's balance
                                // const st2 = await Punter.updateOne(
                                //     { _id: user_id },
                                //     {
                                //         $inc: { bz_balance: -amt, opin_bal: -amt }
                                //     }
                                // );

                                const st2 = UpdateBalance(uid, cla);
                                await pushExposure(req, res, sid, cla, "Head Tail Game");
                                const drUser = await Punter.findOne({ _id: user_id }).select("opin_bal bz_balance").lean();
                                const opin_bal = drUser.opin_bal;

                                // Insert log history
                                const ptLogHistory = new BzPtLogHistory({
                                    uname: uid,
                                    linkid: lastInsertId,
                                    points: opin_bal,
                                    date: new Date(),
                                    type: "BETHEADTAIL"
                                });
                                await ptLogHistory.save();

							}

							if(st2)
							{
								balance_point = dr[0]['bz_balance'] + cla;
								
                                const notificationsData = {
                                    evt_id: 'Head Tail Game',
                                    user_id: user_id,
                                    game_type: '22',
                                    description: `${uid} placed bet on ${mnam} in Head Tail game.`
                                };
                                await Notifications.create(notificationsData);

                                result.status = true;
                                result.message = "Bet Place Successfully.";
                                return result;
							}
							else
							{
								result.status = false;
								result.message = "Bet error while placing bet";
								return result;
							}

						}
						 else if(pointOk == 2)
						{
							result.status = false;
							result.message = "Check your bet limit";
							return result;
						}
						else if(pointOk == 3)
						{
							result.status = false;
							result.message = "Check your bet limit";
							return result;
						}
						else
						{
							result.status = false;
							result.message = "You do not have enough balance to place this bet";
							return result;
						}

                    }
                    catch(error)
					{
						//$db->rollBack();
						result.status = false;
                        result.message = "Bet Error Roll back.";
                        return result;
					}

                }
                else
				{
					result.status = false;
					result.message = "Odd not matched.";
					return result;
				}
            }
            else
			{
				result.status = false;
				result.message = "Please login again to place this bet";
				return result;
			}

        }
        else
		{
			result.status = false;
			result.message = 'Some information is missing to place this bet.';
			return result;
		}


    }

module.exports = { placeHeadTailGameBet };
