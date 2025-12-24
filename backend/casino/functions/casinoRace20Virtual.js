const mongoose = require("mongoose");
const BzBetRatesRace20Virtual = require("../models/BzBetRatesRace20Virtual");
const BzUserBetTpRace20VirtualHistory = require("../models/BzUserBetTpRace20VirtualHistory");

const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzUserBetTpRace20Virtual = require("../models/BzUserBetTpRace20Virtual");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

    async function place32CardBet(req)
	{
        
        const user_id = req.user._id;
        if (req.user.user_role != 8) {
            return {
                status: false,
                message: "Betting Not allowed!!!"
            };
        }

        
        const eid = req.body.catmid; // catmid = 18.220808091932
        // const mid = req.body.mid;
        const mnam = req.body.teamname; // teamname
        let rnr = req.body.bettype; // b = back, l = lay
        let rat = req.body.odds;
        let amt = req.body.amount; // amount

        const currency = req.user.currency;


		let min_amount, maxWinning;
        let result = {};
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
        
        const limitBetQuery = await BetLimit.findOne({ user_id: user_id }).select('casino');
        console.log("limitBetQuery->", limitBetQuery);
        const limit_bet = limitBetQuery.casino;

		if(amt > limit_bet)
		{
			result['status'] = false;
			result.message = "Bet Limit is min "+min_amount+ " and max "+limit_bet;
			return result;
		}

		if(amt < min_amount)
		{
			result.status = false;
			result.message = "Bet Limit is min "+min_amount+ " and max "+limit_bet;
			return result;
		}
console.log("EID:", eid, "Mnam:", mnam, "Rnr:", rnr, "Rat:", rat, "Amt:", amt);
console.log("Min Amount:", min_amount, "Limit Bet:", limit_bet);
        if (
            eid &&
            mnam &&
            rnr &&
            rat &&
            rat > 0 &&
            rat !== 'SUSPENDED' &&
            amt &&
            amt >= min_amount &&
            amt <= limit_bet
        ) {
			mid = req.body.catmid; // catmid = 18.220808091932
			typ = req.body.bettype;
			rnr = req.body.bettype;
			rat = req.body.odds;
			amt = req.body.amount;

			if(amt > limit_bet)
			{
				result.status = false;
                result.message = "Bet Limit is min "+min_amount+ " and max "+limit_bet;
                return result;
			}

			if(amt < min_amount)
			{
				result.status = false;
                result.message = "Bet Limit is min "+min_amount+ " and max "+limit_bet;
                return result;
			}


			uid = req.user.uname;
			upt = req.user.user_point;


			if(mnam.length>35)
			{
				result.status = false;
                result.message = "Runner name not valid";
                return result;
			}

			if(rat.length>5)
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

			if(rnr.length>20)
			{
				result.status = false;
                result.message = "Odd not valid";
                return result;
			}

			if(mid.length>40)
			{
				result.status = false;
                result.message = "Mid not valid";
                return result;
			}

			if(typ.length>10)
			{
				result.status = false;
                result.message = "Type not valid";
                return result;
			}

		    if(mnam.toLowerCase() == 'spades')
		    {
		        if(typ == 'b') {
		            rnr = 'b1';
                }
		        if(typ == 'l') {
		            rnr = 'l1';
                }
                sid = eid+"-1";
		    }else if(mnam.toLowerCase() == 'hearts')
		    {
		        if(typ == 'b') {
		            rnr = 'b2';
                }
		        if(typ == 'l') {
		            rnr = 'l2';
                }
                sid = eid+"-2";
		    }else if(mnam.toLowerCase() == 'clubs')
		    {
		        if(typ == 'b') {
		            rnr = 'b3';
                }
		        if(typ == 'l') {
		            rnr = 'l3';
                }
                sid = eid+"-3";
		    }else if(mnam.toLowerCase() == 'diamonds')
		    {
		        if(typ == 'b'){
		            rnr = 'b4';
                }
		        if(typ == 'l') {
		            rnr = 'l4';
                }
                sid = eid+"-4";
		    }else
			{
			    result.status = false;
                result.message = "Runner name not valid";
                return result;
			}

            const qds = await BzBetRatesRace20Virtual.findOne({
                evt_status: 'OPEN',
                cat_mid: mid,
                evt_od: { $lt: new Date() }
            }).lean();

            if (qds) {
                const evt_od = new Date(qdr.evt_od);
                const now = new Date();
                const difftm = Math.floor((now - evt_od) / 1000); // Calculate time difference in seconds
                qdr.difftm = difftm;
                

				stld = qdr.stld;
				match_status = qdr.evt_status;
				evt_id = qdr.cat_mid;
				cat_sid1 = qdr.cat_sid1;
				cat_sid2 = qdr.cat_sid2;
				cat_sid3 = qdr.cat_sid3;
				cat_sid4 = qdr.cat_sid4;
				timeLeft = qdr.difftm;
			}
			else
			{
				result.status = false;
                result.message = "No Betting Time Up!!!";
                return result;
			}

			isBettingEnable = false;
            const ds = await AdmBetStart.findOne({ sno: '1' }).lean();
            const isBettingEnable = ds?.virtual_race20;

            if (!isBettingEnable) {
                result.status = false;
                result.message = "Betting not open for Race 20.";
                return result;
            }

            // If event creation time is greater than 27 seconds, stop the event betting.
            if (timeLeft > 27) {
                result.status = false;
                result.message = "Round closed. Bet not placed.";
                return result;
            }

            if (
                (sid === cat_sid1 && (rnr === 'l1' || rnr === 'b1')) ||
                (sid === cat_sid2 && (rnr === 'l2' || rnr === 'b2')) ||
                (sid === cat_sid3 && (rnr === 'l3' || rnr === 'b3')) ||
                (sid === cat_sid4 && (rnr === 'l4' || rnr === 'b4'))
            ) {
                // Valid type
            } else {
                result.status = false;
                result.message = "Type not valid.";
                return result;
            }

            if (
                (rnr === 'b1' && [3.85].includes(rat)) ||
                (rnr === 'b2' && [3.85].includes(rat)) ||
                (rnr === 'b3' && [3.85].includes(rat)) ||
                (rnr === 'b4' && [3.85].includes(rat)) ||
                (rnr === 'l1' && [4.15].includes(rat)) ||
                (rnr === 'l2' && [4.15].includes(rat)) ||
                (rnr === 'l3' && [4.15].includes(rat)) ||
                (rnr === 'l4' && [4.15].includes(rat))
            ) {
                // Valid odd
            } else {
                result.status = false;
                result.message = "Odd not valid";
                return result;
            }

            if (match_status.trim() !== 'OPEN' || stld === 1) {
                result.status = false;
                result.message = "Round status not open";
                return result;
            }

		

            const userQuery = await Punter.findOne({ uname: uid }).select('plimit opin_bal bz_balance').lean();
            if (!userQuery) {
                result.status = false;
                result.message = "User not found.";
                return result;
            }
            const dr = userQuery;

			/*if($dr[0]['logon'] == 1)
			{*/
			    let return_array = {};
		        return_array.game_name = "race20";
		        return_array.result = false;
		        const json_array = JSON.stringify(return_array);
                const jsonds = await BzBetRatesRace20Virtual.findOne({ cat_mid: eid }).lean();

                if (jsonds) {
                    const levt_id = jsonds.cat_mid;
                    const lcat_mid = levt_id;
                    const lcat_sid1 = `${lcat_mid}-1`;
                    const lcat_sid2 = `${lcat_mid}-2`;
                    const lcat_sid3 = `${lcat_mid}-3`;
                    const lcat_sid4 = `${lcat_mid}-4`;

                    const lcat_rnr1_status = jsonds.evt_status;
                    const lcat_rnr2_status = jsonds.evt_status;
                    const lcat_rnr3_status = jsonds.evt_status;
                    const lcat_rnr4_status = jsonds.evt_status;

                    if (lcat_mid.trim() === evt_id.trim()) {
                        if (lcat_sid1 === sid && lcat_rnr1_status === 'OPEN') {

                            if (typ === "b") {
                                liverate = jsonds.b1;
                            } else if (typ === "l") {
                                liverate = jsonds.l1;
                            } else {
                                result.status = false;
                                result.message = "Type not valid";
                                return result;
                            }
                        } else if (lcat_sid2 === sid && lcat_rnr2_status === 'OPEN') {
                            if (typ === "b") {
                                liverate = jsonds.b2;
                            } else if (typ === "l") {
                                liverate = jsonds.l2;
                            } else {
                                result.status = false;
                                result.message = "Type not valid";
                                return result;
                            }
                        }
                        else if (lcat_sid3 === sid && lcat_rnr3_status === 'OPEN') {
                            if (typ === "b") {
                                liverate = jsonds.b3;
                            } else if (typ === "l") {
                                liverate = jsonds.l3;
                            } else {
                                result.status = false;
                                result.message = "Type not valid";
                                return result;
                            }
                        }
                        else if (lcat_sid4 === sid && lcat_rnr4_status === 'OPEN') {
                            if (typ === "b") {
                                liverate = jsonds.b4;
                            } else if (typ === "l") {
                                liverate = jsonds.l4;
                            } else {
                                if (typ === "b") {
                                    liverate = jsonds.b4;
                                } else if (typ === "l") {
                                    liverate = jsonds.l4;
                                } else {
                                    result.status = false;
                                    result.message = "Type not valid";
                                    return result;
                                }
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

				if (typ === "b") {
					if (rat <= liverate && liverate > 0 && !empty(liverate)) {
						ratok = 1;
						pro = Math.round((rat * amt) - amt);
						lib = amt;
						if (rnr === 'b1') { ta += pro; tb -= lib; tc -= lib; td -= lib; }
						if (rnr === 'b2') { ta -= lib; tb += pro; tc -= lib; td -= lib; }
						if(rnr == 'b3') { ta -= lib; tb -= lib; tc += pro; td -= lib; }
						if(rnr == 'b4') { ta -= lib; tb -= lib; tc -= lib; td += pro; }
					}
					else
					{
						ratok = 0;
					}
				}
				else if (typ === "l") {
					if (rat >= liverate && liverate > 0 && liverate)
					{
						ratok = 1;
						pro = amt;
						lib = Math.round(($rat * $amt) - $amt);
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

							const drstc = await BzUserBetTpRace20Virtual.findOne({ cat_mid: mid, uname: uid }).lean();
							if(drstc)
							{

								limit = 0;

								limita = drstc.lockamt + drstc.rnr1s + dr.bz_balance;
								limitb = drstc.lockamt + drstc.rnr2s + dr.bz_balance;
								limitc = drstc.lockamt + drstc.rnr3s + dr.bz_balance;
								limitd = drstc.lockamt + drstc.rnr4s + dr.bz_balance;

								if(rnr == "b1"){ limit = Math.min(limitb, limitc, limitd); }
								if(rnr == "b2"){ limit = Math.min(limita, limitc, limitd); }
								if(rnr == "b3"){ limit = Math.min(limitb, limita, limitd); }
								if(rnr == "b4"){ limit = Math.min(limitb, limitc, limita); }

								if(rnr == "l1"){ limit = limita; }
								if(rnr == "l2"){ limit = limitb; }
								if(rnr == "l3"){ limit = limitc; }
								if(rnr == "l4"){ limit = limitd; }

								if(lib <= limit)
								{
									//update bt_match_teenpatti
									pla  = drstc.lockamt
									nla1 = drstc.rnr1s + ta;
									nla2 = drstc.rnr2s + tb;
									nla3 = drstc.rnr3s + tc;
									nla4 = drstc.rnr4s + td;

									if(Math.min(nla1,nla2,nla3,nla4) < 0)
										nla  = Math.abs(Math.min(nla1,nla2,nla3,nla4));
									else
										nla = 0;

									cla = pla - nla;
									pointok = 1;

									maxPL  = Math.max(nla1, nla2, nla3, nla4);
									if(maxPL > maxWinning)
									{
										result.status = false;
										result.message = "Max Winning Limit " + maxWinning;
										return result;
									}

									if((dr.bz_balance- $cla) >= 0)
									{
									    
		    								
                                                await BzUserBetTpRace20Virtual.updateOne(
                                                    { cat_mid: mid, uname: uid },
                                                    {
                                                        $inc: {
                                                            rnr1s: ta,
                                                            rnr2s: tb,
                                                            rnr3s: tc,
                                                            rnr4s: td
                                                        },
                                                        $set: {
                                                            lockamt: nla
                                                        }
                                                    }
                                                );
		    							
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
                                    const drsts = await BzBetRatesRace20Virtual.find({ cat_mid: mid }).lean();
                                    const cla = -lib;
                                    const nla = cla2 = lib;

                                    const maxPL = Math.max(ta, tb, tc, td);
                                    if (maxPL > maxWinning) {
                                        result.status = false;
                                        result.message = "Max Winning Limit " + maxWinning;
                                        return result;
                                    }
									if((dr.bz_balance - cla) >= 0)
									{
									    const pla = 0;
									    if(nla <= limit_bet)
									    {
                                            await BzUserBetTpRace20Virtual.create({
                                                cat_mid: mid,
                                                uname: uid,
                                                rnr1: drsts[0].cat_rnr1,
                                                rnr1s: ta,
                                                rnr2: drsts[0].cat_rnr2,
                                                rnr2s: tb,
                                                rnr3: drsts[0].cat_rnr3,
                                                rnr3s: tc,
                                                rnr4: drsts[0].cat_rnr4,
                                                rnr4s: td,
                                                lockamt: cla2,
                                                rnr1sid: drsts[0].cat_sid1,
                                                rnr2sid: drsts[0].cat_sid2,
                                                rnr3sid: drsts[0].cat_sid3,
                                                rnr4sid: drsts[0].cat_sid4,
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
                            await BzBetRatesRace20Virtual.updateOne(
                                { evt_id: mid },
                                { $set: { is_bet_place: '1' } }
                            );

                            await BzUserBetTpRace20VirtualHistory.create({
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
                            await pushExposure(
                              req,
                              res,
                              sid,
                              cla,
                              "Live Race 20"
                            );

							if(st2)
							{
								balance_point = dr.bz_balance + cla ;
								
                                const dt = new Date().toISOString();

								
									claVal = dr.bz_balance + cla;

							    //New Logs
                                await UserLogs.create({
                                    page: 'livebet_race20',
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
                                    evt_id: 'Live Race 20',
                                    user_id: req.session.user_id,
                                    game_type: '6',
                                    description: `${uid} placed bet on ${mnam} in Live Race 20 casino games.`
                                });

                                result.status = true;
								result.message = "Bet Place Successfully.";
                                //$result['message'] = "Your bet has been placed successfully.";
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
                            return $result;
						}
					//}
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
            const response = { status: false, message: "Something went wrong. Try again to place bet." };
            return response;
		}
	}



module.exports = { place32CardBet };