const mongoose = require("mongoose");
const BzBetRatesHighcardVirtual = require("../models/BzBetRatesHighcardVirtual");
const BzUserBetTpHighcardVirtualHistory = require("../models/BzUserBetTpHighcardVirtualHistory");

const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzUserBetTpHighcardVirtual = require("../models/BzUserBetTpHighcardVirtual");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

    async function placeHighCardBet(req)
    {

        const userId = req.user._id;

        if (req.user.user_role != 8) {
            return {
                status: false,
                message: "Betting Not allowed!!!"
            };
        }

        let eid = req.body.catmid; // catmid = 18.220808091932
        let mnam = req.body.teamname.toLowerCase(); // teamname
        let rnr = req.body.bettype; // b = back, l = lay
        let rat = req.body.odds;
        let amt = req.body.amount; // amount
        let result = {};

        const currency = req.user.currency;

	

		let min_amount, maxWinning;
		if(currency==1) /// 1=INR,2=PKR,3=AED,4= BDT
		{
			min_amount = 100;
			maxWinning = 10000;
		}
		else if(currency==2)
		{
			min_amount = 100;
			maxWinning = 100000;
		}else if(currency==3)
		{
			min_amount = 2;
			maxWinning = 1000;
		}else if(currency==4)
		{
			min_amount = 500;
			maxWinning = 100000;
		}
        const limitBet = await BetLimit.findOne({ user_id: userId }).select("casino").lean();

        const limit_bet = limitBet ? limitBet.casino : 0;
        console.log('limit_bet->', limit_bet);
        if (amt > limit_bet) {
            return {
            status: false,
            message: `Bet Limit is min ${min_amount} and max ${limit_bet}`
            };
        }

        if (amt < min_amount) {
            return {
            status: false,
            message: `Bet Limit is min ${min_amount} and max ${limit_bet}`
            };
        }

        if (eid && mnam && rnr && rat && rat > 0 && rat !== "SUSPENDED" && amt >= min_amount && amt <= limit_bet) {
			mid = req.body.catmid; // catmid = 18.220808091932
			typ = req.body.bettype; //b =back , l= lay
			rnr = req.body.bettype;
			rat = req.body.odds;
			amt = req.body.amount;

			if(amt >limit_bet)
			{
				result.status = false;
                result.message = "Bet Limit is min " + min_amount + " and max " + limit_bet;
                return result;
			}

			if(amt < min_amount)
			{
				result.status = false;
                result.message = "Bet Limit is min " + min_amount + " and max " + limit_bet;
                return result;
			}


			uid = req.user.uname;
			upt = req.user.points;

			
console.log('mnam->', mnam);
			if(mnam.length > 35)
			{
				result.status = false;
                result.message = "Runner name not valid";
                return result;
			}

			if(rat.length > 5)
			{
				result.status = false;
                result.message = "Odd not valid";
                return result;
			}

			if(rat > 50)
			{
				result.status = false;
                result.message = "Odd not valid";
                return result;
			}

			if(rnr.length > 20)
			{
				result.status = false;
                result.message = "Odd not valid";
                return result;
			}

			if(mid.length > 40)
			{
				result.status = false;
                result.message = "Mid not valid";
                return result;
			}

			if(typ.length > 10)
			{
				result.status = false;
                result.message = "Type not valid";
                return result;
			}
console.log('checking mnam->', mnam);
		    if(mnam == 'player 1')
		    {
		        if(typ == 'b') {
		            rnr = 'b1';
                }
		        if(typ == 'l') {
		            rnr = 'l1';
                }
                sid = eid + "-1";
		    }else if(mnam == 'player 2')
		    {
		        if(typ == 'b') {
		            rnr = 'b2';
                }
		        if(typ == 'l') {
		            rnr = 'l2';
                }
                sid = eid + "-2";
		    }else if(mnam == 'player 3')
		    {
		        if(typ == 'b') {
		            rnr = 'b3';
                }
		        if(typ == 'l') {
		            rnr = 'l3';
                }
                sid = eid + "-3";
		    }else if(mnam == 'player 4')
		    {
		        if(typ == 'b'){
		            rnr = 'b4';
                }
		        if(typ == 'l') {
		            rnr = 'l4';
                }
                sid = eid + "-4";
		    }else if(mnam == 'player 5')
		    {
		        if(typ == 'b'){
		            rnr = 'b5';
                }
		        if(typ == 'l') {
		            rnr = 'l5';
                }
                sid = eid + "-5";
		    }else if(mnam == 'player 6')
		    {
		        if(typ == 'b'){
		            rnr = 'b6';
                }
		        if(typ == 'l') {
		            rnr = 'l6';
                }
                sid = eid + "-6";
		    }else
			{
			    result.status = false;
                result.message = "Runner name not valid0";
                return result;
			}

            const qdr = await BzBetRatesHighcardVirtual.findOne({
                evt_status: "OPEN",
                cat_mid: mid,
                evt_od: { $lt: new Date() }
            }).lean();

            if (qdr) {
                qdr.difftm = Math.floor((new Date() - new Date(qdr.evt_od)) / 1000); // Calculate time difference in seconds

				stld = qdr.stld;
				match_status = qdr.evt_status;
				//$pending = $qdr[0]['pending'];
				evt_id = qdr.cat_mid;
				cat_sid1 = qdr.cat_sid1;
				cat_sid2 = qdr.cat_sid2;
				cat_sid3 = qdr.cat_sid3;
				cat_sid4 = qdr.cat_sid4;
				cat_sid5 = qdr.cat_sid5;
				cat_sid6 = qdr.cat_sid6;
				timeLeft = qdr.difftm;
			}
			else
			{
				result.status = false;
                result.message = "No Betting Time Up!!!";
                return result;
			}

			
            const ds = await AdmBetStart.findOne({ sno: 1 }).lean();
            const isBettingEnable = ds.virtual_highcard;

			if(isBettingEnable==false)
			{
				result.status = false;
                result.message = "Betting not open for High Card.";
                return result;
			}

			// If event creation time is greater then 56 then stop the event betting.
			if(timeLeft>27)
			{
				result.status = false;
                result.message = "Round closed. Bet not placed";
                return result;
			}

			if((sid == cat_sid1 && (rnr == 'l1' || rnr == 'b1')) || (sid == cat_sid2 && (rnr == 'l2' || rnr == 'b2')) || (sid == cat_sid3 && (rnr == 'l3' || rnr == 'b3')) || (sid == cat_sid4 && (rnr == 'l4' || rnr == 'b4')) || (sid == cat_sid5 && (rnr == 'l5' || rnr == 'b5')) || (sid == cat_sid6 && (rnr == 'l6' || rnr == 'b6')))
			{

			}
			else
			{
			    result.status = false;
                result.message = "Type not valid.";
                return result;
			}

			if((rnr == 'b1' && [5.88].includes(rat)) || (rnr == 'b2' && [5.88].includes(rat)) || (rnr == 'b3' && [5.88].includes(rat)) || (rnr == 'b4' && [5.88].includes(rat)) || (rnr == 'b5' && [5.88].includes(rat)) || (rnr == 'b6' && [5.88].includes(rat)))
			{

			}
			else
			{
			    result.status = false;
                result.message = "Odd not valid";
                return result;
			}

		    if(String(match_status).trim() != 'OPEN' || stld == 1)
		    {
		        result.status = false;
                result.message = "Round status not open";
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
                if (dr && dr.logon == 1) {
                  let return_array = {};
		        return_array.game_name = "highcards";
		        return_array.result = false;
		        json_array =  JSON.stringify(return_array);
		        jsonds =  await BzBetRatesHighCardVirtual.findOne({ cat_mid: eid }).lean();

		        if(jsonds)
		        {
					levt_id = jsonds.cat_mid;
					lcat_mid = levt_id;
			    	lcat_sid1 = lcat_mid+'-1';
		            lcat_sid2 = lcat_mid+'-2';
					lcat_sid3 = lcat_mid+'-3';
		            lcat_sid4 = lcat_mid+'-4';
					lcat_sid5 = lcat_mid+'-5';
		            lcat_sid6 = lcat_mid+'-6';

			        lcat_rnr1_status = jsonds.evt_status;
			        lcat_rnr2_status = jsonds.evt_status;
			        lcat_rnr3_status = jsonds.evt_status;
			       lcat_rnr4_status = jsonds.evt_status;
				   lcat_rnr5_status = jsonds.evt_status;
			       lcat_rnr6_status = jsonds.evt_status;

					if(String(lcat_mid).trim() == String(evt_id).trim())
					{
					    if(lcat_sid1 == sid && lcat_rnr1_status == 'OPEN')
						{
							if(typ == "b")
							{
								liverate = jsonds.b1;
							}
							else if(typ == "l")
							{
								liverate = jsonds.l1;
							}
							else
							{
							    result.status = false;
                                result.message = "Type not valid";
                                return result;
							}
						}
						else if(lcat_sid2 == sid && lcat_rnr2_status == 'OPEN')
						{
							if(typ == "b")
							{
								liverate = jsonds.b2;
							}
							else if(typ == "l")
							{
								liverate = jsonds.l2;
							}
							else
							{
							     result.status = false;
                                result.message = "Type not valid";
                                return result;
							}
						}
						else if(lcat_sid3 == sid && lcat_rnr3_status == 'OPEN')
						{
							if(typ == "b")
							{
								liverate = jsonds.b3;
							}
							else if(typ == "l")
							{
								liverate = jsonds.l3;
							}
							else
							{
							    result.status = false;
                                result.message = "Type not valid";
                                return result;
							}
						}
						else if(lcat_sid4 == sid && lcat_rnr4_status == 'OPEN')
						{
							if(typ == "b")
							{
								liverate = jsonds.b4;
							}
							else if(typ == "l")
							{
								liverate = jsonds.l4;
							}
							else
							{
							    result.status = false;
                                result.message = "Type not valid";
                                return result;
							}
						}
						else if(lcat_sid5 == sid && lcat_rnr5_status == 'OPEN')
						{
							if(typ == "b")
							{
								liverate = jsonds.b5;
							}
							else if(typ == "l")
							{
								liverate = jsonds.l5;
							}
							else
							{
							    result.status = false;
                                result.message = "Type not valid";
                                return result;
							}
						}
						else if(lcat_sid6 == sid && lcat_rnr6_status == 'OPEN')
						{
							if(typ == "b")
							{
								liverate = jsonds.b6;
							}
							else if(typ == "l")
							{
								liverate = jsonds.l6;
							}
							else
							{
							    result.status = false;
                                result.message = "Type not valid";
                                return result;
							}
						}
						else
						{
						     result.status = false;
                            result.message = "Round not open";
                            return result;
						}
					}
				}

			    let ta = 0;
			    let tb = 0;
			    let tc = 0;
			    let td = 0;
				let te = 0;
				let tf = 0;

				
				if(typ == "b" )
				{
					if(rat <= liverate && liverate > 0 && liverate)
					{
						ratok = 1;
						pro = Math.round((rat * amt) - amt);
						lib = amt;
						if(rnr == 'b1') { ta += pro; tb -= lib; tc -= lib; td -= lib; te -= lib; tf -= lib; }
						if(rnr == 'b2') { ta -= lib; tb += pro; tc -= lib; td -= lib; te -= lib; tf -= lib; }
						if(rnr == 'b3') { ta -= lib; tb -= lib; tc += pro; td -= lib; te -= lib; tf -= lib; }
						if(rnr == 'b4') { ta -= lib; tb -= lib; tc -= lib; td += pro; te -= lib; tf -= lib; }
						if(rnr == 'b5') { ta -= lib; tb -= lib; tc -= lib; td -= lib; te += pro; tf -= lib; }
						if(rnr == 'b6') { ta -= lib; tb -= lib; tc -= lib; td -= lib; te -= lib; tf += pro; }
					}
					else
					{
						ratok = 0;
					}
				}
				else if(typ == "l" )
				{
					if(rat >= liverate && liverate > 0 && liverate)
					{
						ratok = 1;
						pro = amt;
						lib = Math.round((rat * amt) - amt);
						if(rnr == 'l1') {  ta -= lib; tb += pro; tc += pro; td += pro; }
						if(rnr == 'l2') {  ta += pro; tb -= lib; tc += pro; td += pro; }
						if(rnr == 'l3') {  ta += pro; tb += pro; tc -= lib; td += pro; }
						if(rnr == 'l4') {  ta += pro; tb += pro; tc += pro; td -= lib; }
					}
					else
					{
						ratok = 0;
					}
				}

				if(ratok == 1)
				{
					// try
					// {
						pointok = 0;

                            const drstc = await BzUserBetTpHighcardVirtual.findOne({ cat_mid: mid, user_id: req.user._id }).lean();
                            if (drstc) {
								$limit = 0;

								$limita = drstc.lockamt + drstc.rnr1s + dr.bz_balance;
								$limitb = drstc.lockamt + drstc.rnr2s + dr.bz_balance;
								$limitc = drstc.lockamt + drstc.rnr3s + dr.bz_balance;
								$limitd = drstc.lockamt + drstc.rnr4s + dr.bz_balance;
								$limite = drstc.lockamt + drstc.rnr5s + dr.bz_balance;
								$limitf = drstc.lockamt + drstc.rnr6s + dr.bz_balance;

								if(rnr == "b1"){ limit = min(limitb, limitc, limitd, limite, limitf); }
								if(rnr == "b2"){ limit = min(limita, limitc, limitd, limite, limitf); }
								if(rnr == "b3"){ limit = min(limitb, limita, limitd, limite, limitf); }
								if(rnr == "b4"){ limit = min(limitb, limitc, limita, limite, limitf); }
								if(rnr == "b5"){ limit = min(limitb, limitc, limita, limitd, limitf); }
								if(rnr == "b6"){ limit = min(limitb, limitc, limita, limitd, limite); }

								if(rnr == "l1"){ limit = limita; }
								if(rnr == "l2"){ limit = limitb; }
								if(rnr == "l3"){ limit = limitc; }
								if(rnr == "l4"){ limit = limitd; }
								if(rnr == "l5"){ limit = limite; }
								if(rnr == "l6"){ limit = limitf; }

								if(lib <= limit)
								{
									//update bt_match_teenpatti
									pla  = drstc.lockamt;
									nla1 = drstc.rnr1s + ta;
									nla2 = drstc.rnr2s + tb;
									nla3 = drstc.rnr3s + tc;
									nla4 = drstc.rnr4s + td;
									nla5 = drstc.rnr5s + te;
									nla6 = drstc.rnr6s + tf;

									if(Math.min(nla1,nla2,nla3,nla4,nla5,nla6) < 0)
										nla = Math.abs(Math.min(nla1,nla2,nla3,nla4,nla5,nla6));
									else
										nla = 0;

									cla = pla - nla;
									pointok = 1;

									maxPL  = Math.max(nla1, nla2, nla3,nla4,nla5,nla6);
									if(maxPL>maxWinning)
									{
										result.status = false;
										result.message = "Max Winning Limit "+maxWinning;
										return result;
									}

									if(dr.bz_balance -  cla >= 0)
									{
									    /*if($nla <= $max_expouser)
		    							{*/
		    								
                                                await BzUserBetTpHighcardVirtual.updateOne(
                                                    { cat_mid: mid, uname: uid },
                                                    {
                                                        $inc: {
                                                            rnr1s: ta,
                                                            rnr2s: tb,
                                                            rnr3s: tc,
                                                            rnr4s: td,
                                                            rnr5s: te,
                                                            rnr6s: tf,
                                                        },
                                                        $set: {
                                                            lockamt: nla
                                                        }
                                                    }
                                                );
		    							/*}
		    							else
		    							    $pointok = 3;*/
									}
									else
									    pointok = 2;
								}
								else
									pointok = 0;
							}
							else
							{
								if(lib <= dr.bz_balance)
								{
                                    const drsts = await BzBetRatesHighcardVirtual.find({ cat_mid: mid }).lean();
									cla = -lib;
									nla = cla2 = lib;

									maxPL  = Math.max(ta, tb, tc, td, te, tf);
									if(maxPL > maxWinning)
									{
										result.status = false;
										result.message = "Max Winning Limit "+maxWinning;
										return result;
									}

									if(drsts.bz_balance + cla >= 0)
									{
									    pla = 0;
									    if(cla2 <= limit_bet)
									    {
                                            await BzUserBetTpHighcardVirtual.create({
                                                cat_mid: mid,
                                                uname: uid,
                                                rnr1: drsts.cat_rnr1,
                                                rnr1s: ta,
                                                rnr2: drsts.cat_rnr2,
                                                rnr2s: tb,
                                                rnr3: drsts.cat_rnr3,
                                                rnr3s: tc,
                                                rnr4: drsts.cat_rnr4,
                                                rnr4s: td,
                                                rnr5: drsts.cat_rnr5,
                                                rnr5s: te,
                                                rnr6: drsts.cat_rnr6,
                                                rnr6s: tf,
                                                lockamt: cla2,
                                                rnr1sid: drsts.cat_sid1,
                                                rnr2sid: drsts.cat_sid2,
                                                rnr3sid: drsts.cat_sid3,
                                                rnr4sid: drsts.cat_sid4,
                                                rnr5sid: drsts.cat_sid5,
                                                rnr6sid: drsts.cat_sid6,
                                                user_id: user_id
                                            });
                                            pointok = 1;
									    }
		    							else
		    							    pointok = 3;
									}
									else
									    pointok = 2;
								}
								else
								{
									pointok = 0;
								}
						    }

						if(pointok == 1)
						{
							///
                            await BzBetRatesHighcardVirtual.updateOne(
                                { evt_id: mid },
                                { $set: { is_bet_place: '1' } }
                            );

                            await BzUserBetTpHighcardVirtualHistory.create({
                                uname: uid,
                                cat_mid: mid,
                                rnr: rnr,
                                rate: rat,
                                amnt: amt,
                                pro: pro,
                                lib: lib,
                                type: typ,
                                cla: cla,
                                rnrsid: sid,
                                user_id: user_id
                            });

							st2 = UpdateBalance(req.user._id,cla);
							await pushExposure(req, res, sid, cla, "Live High cards");

							if(st2)
							{
								balance_point = dr.bz_balance + cla ;
								
                                const dt = new Date().toISOString();

								if(cla>0)
									claVal = dr.bz_balance + cla;
								else
									claVal = dr.bz_balance + cla;

							    //New Logs
                                await UserLogs.create({
                                    page: 'livebet_highcard',
                                    linkid: bet_id,
                                    ptrans: cla,
                                    otrans: '',
                                    points: claVal,
                                    obal: dr.opin_bal,
                                    uname: uid,
                                    date: dt,
                                    ptype: 'bet'
                                });

                                await Notifications.create({
                                    evt_id: 'Live High cards',
                                    user_id: req.user._id,
                                    game_type: '6',
                                    description: `${uid} placed bet on ${mnam} in Live High Cards casino games.`
                                });

                                result.status = true;
                                result.message = "Bet Placed Successfully.";
                                return result;
							}
							else
							{
								//$db->rollBack();
                                result.status = false;
                                result.message = "Bet error while placing bet";
                                return result;
							}
						}
						else if(pointok == 2)
						{
							result.status = false;
                            result.message = "Insufficient balance for placing this bet.";
                            return result;
						}
						else if(pointok == 3)
						{
							result.status = false;
                            result.message = "Insufficient balance for placing this bet.";
                            return result;
						}
						else
						{
							result.status = false;
                            result.message = "Insufficient balance for placing this bet.";
                            return result;
						}
					// }
					// catch(error)
					// {
					// 	//$db->rollBack();
					// 	result.status = false;
                    //     result.message = "Bet Roll back.";
                    //     return result;
					// }
				}
				else
                {
					result.status = false;
                    result.message = "Live Rate Not Matched.";
                    return result;
				}
			}
			else
			{
				result.status = false;
                result.message = "It's showing you are not login to place this bet";
                return result;
			}
		}
		else
		{
			response = { status: false, message: 'Something went wrong.Try again to palce bet.' };
			return response;
		}
	}



module.exports = { placeHighCardBet };