const mongoose = require("mongoose");
const BzBetLucky7VirtualRate = require("../models/BzBetLucky7VirtualRate");
const moment = require("moment");
const AdmBetStart = require("../../models/AdmBetStart");
const BetLimit = require("../../models/BetLimit");
const Punter = require("../../models/Punter");
const Notifications = require("../../models/LiveNotifications");
const BzBetMatchLucky7Virtual = require("../models/BzBetMatchLucky7Virtual");
const BzBetsLucky7VirtualHistory = require("../models/BzBetsLucky7VirtualHistory");
const { UpdateBalance, pushExposure } = require("../../utils/function");
const UserLogs = require("../../models/UserLogs");

 	async function placeLucky7Bet(req, res)
	{
			let currency = req.user.currency;
			let user_id = req.user._id;
            let result = {};

			let min_amount, maxWinning;
			if (currency === 1) {
				min_amount = 100;
				maxWinning = 10000;
			}
			else if (currency === 2) {
				min_amount = 100;
				maxWinning = 100000;
			} else if (currency === 3) {
				min_amount = 2;
				maxWinning = 1000;
			} else if (currency === 4)
			{
				min_amount = 500;
				maxWinning = 100000;
			}
            let limitBetQuery = await BetLimit.findOne({ user_id: user_id }).select('casino');
            let limit_bet = limitBetQuery.casino;
			//$max_expouser = 600;


			
			if (req.user.user_role != 8) {
				result.status = false;
				result.message = "Betting Not allowed!!!";
				return result;
			}

			let eid = req.body.catmid; // catmid = 18.220808091932
			//$mid = $this->input->post('mid');
			let mnam = req.body.teamname; // teamname
			let rnr = req.body.bettype; //b =back , l= lay
			let rat = req.body.odds;
			let amt = req.body.amount; // amount

			if (amt > limit_bet) {
				result.status = false;
				result.message = "min " + min_amount + " and max " + limit_bet + " point bet allow";
				return $result;
			}

			if (amt < min_amount) {
				result.status = false;
				result.message = "min " + min_amount + " and max " + limit_bet + " point bet allow";
				return result;
			}

			if (rat > 50) {
				result.status = false;
				result.message = "Odd not valid";
				return result;
			}

			if (eid && mnam && rnr && rat > 0 && amt >= min_amount && amt <= limit_bet) {
				mid = eid;
				typ = rnr;
				rnr = rnr;

				typ = "b";

				if (mid.length > 40) {
					result.status = false;
					result.message = "Round Not Found";
					return result;
				}
				let rateField = '';
				if (mnam == 'low card') {
					sid = eid + "-1";
					intSid = 1;
					rateField = 'b1';
				}
				else if (mnam == 'high card')
				{
					sid = eid + "-2";
					intSid = 2;
					rateField = 'b2';
				}
				else if (mnam == 'tie card') {
					sid = eid + "-3";
					intSid = 3;
					rateField = 'b3';
				}
				else if (mnam == 'red')
				{
					sid = eid + "-4";
					intSid = 4;
					rateField = 'b4';
				}
				else if (mnam == 'black')
				{
					sid = eid + "-5";
					intSid = 5;
					rateField = 'b5';
				}
				else if (mnam == 'odd')
				{
					sid = eid + "-6";
					intSid = 6;
					rateField = 'b6';
				}
				else if (mnam == 'even')
				{
					sid = eid + "-7";
					intSid = 7;
					rateField = 'b7';
				}
				else if (mnam == 'club')
				{
					sid = eid + "-8";
					intSid = 8;
					rateField = 'b8';
				}
				else if (mnam == 'diamond')
				{
					sid = eid + "-9";
					intSid = 9;
					rateField = 'b9';
				}
				else if (mnam == 'heart')
				{
					sid = eid + "-10";
					intSid = 10;
					rateField = 'b10';
				}
				else if (mnam == 'spade')
				{
					sid = eid + "-11";
					intSid = 11;
					rateField = 'b11';
				}
				
				else
				{
					result.status = false;
                	result.message = "Runner name not valid";
                	return result;
				}

				uid = req.user.uname;
				upt = req.user.point;
				user_id = req.user._id;

				uss = req.sessionID;

				





			    mnam = String(mnam).trim().toLowerCase();
			    if(typ == 'b')
			    {
			        rnr = 'b1';
			    }

                let qds = await BzBetLucky7VirtualRate.findOne({
                    evt_status: 'OPEN',
                    cat_mid: mid,
                    evt_od: { $lt: new Date() }
                }).lean();

                if (qds) {
                    let difftm = Math.floor((new Date() - new Date(qds.evt_od)) / 1000);
                    qds.difftm = difftm;
                }
			    

			    if(qds)
				{
					$stld = qds.stld;
					$match_status = qds.evt_status;
					$evt_id = qds.cat_mid;
					$cat_sid1 = qds.cat_sid1;
					$cat_sid2 = qds.cat_sid2;
					$timeLeft = qds.difftm;
				}
				else
				{
					result.status = false;
                	result.message = "No Betting Time Up!!!";
                	return result;
			    }

			    isBettingEnable = false;
				
                let dr = await AdmBetStart.findOne({ sno: '1' });

			    isBettingEnable = dr.virtual_lucky7;

			    if(isBettingEnable==false)
				{
					result.status = false;
                	result.message = "Betting not open for this casino.";
                	return result;
				}
				if(timeLeft>30)
				{
					result.status = false;
                	result.message = "Bet not placed. Time is up!!";
                	return result;
				}

			    if(String(match_status).trim() != 'OPEN' || stld == 1)
			    {
			         result.status = false;
                	 result.message = "Status not open";
                	 return result;
			    }


                dr = await Punter.findOne({ _id: req.user._id })
                    .select('plimit opin_bal bz_balance')
                    .lean();

			    

			        let return_array = {};
			        return_array.game_name = "lucky7_virtual";
			        return_array.result = false;
                    
			        //$jsonds = get_casino_games_data($json_array);
					let jsonds = await BzBetLucky7VirtualRate.findOne({ cat_mid: eid }).lean();
					let liverate = 0;
					//echo count($jsonds); exit;
			        if(jsonds.length >= 1)
			        {

						lcat_mid = jsonds.cat_mid;
			            levt_id = lcat_mid;
						if(String(lcat_mid).trim() == String(evt_id).trim())
			            {

							t2Array = jsonds;

			                arrlength =  t2Array.length;
			                isMatch = false;
			                if(arrlength > 0)
			                {
			                    for(x = 0; x < arrlength; x++)
			                    {
			                        obj = t2Array;
									if(typ == "b")
									{
										liverate = obj.$rateField;
										isMatch = true;
										break;
									}
			                    }
			                }
			                if(isMatch)
			                {

			                }
			                else
							{
							    result.status = false;
                            	result.message = "Round not open";
                            	return result;
							}
			            }
			        }

			        ta = 0;
				    tb = 0;
				    tc = 0;
			        td = 0;

			        if(typ == "b" )
					{
			            if(rat <= liverate && liverate > 0 && liverate)
						{
							ratok = 1;
                            let pro = Math.round((rat * amt) - amt);
                            let lib = amt;
                            if (rnr === 'b1') { ta += pro; tb -= lib; }

						}
						else
						{
							ratok = 0;
						}
			        }

			        if(ratok == 1)
					{
			            try
						{
			                pointok = 0;

                            let drstc = await BzBetMatchLucky7Virtual.findOne({
                                mid_mid: mid,
                                user_id: req.user._id,
                                rnr_nam: mnam
                            }).lean();
			                if(drstc)
			                {
			                    if(drstc.bz_balance > lib)
			                    {
			                        pointok = 1;

									maxPL  = Math.max(ta,tb);
									if(maxPL>maxWinning)
									{
										result.status = false;
										result.message = "Max Winning Limit "+maxWinning;
										return result;
									}

									let stm = await BzBetMatchLucky7Virtual.updateOne(
										{ mid_mid: mid, user_id: req.user._id, rnr_nam: mnam },
										{ $inc: { bak: ta, lay: tb, lockamt: lib } }
									);
			                    }
			                    else
			                    {
			                       pointok = 0;
			                    }
			                }
			                else
			                {
			                    if(lib <= dr.bz_balance)
								{
                                    let drsts = await BzBetLucky7VirtualRate.findOne({ cat_mid: mid }).lean();
			                        cla = -lib;
			                        nla = cla2 = lib;

									maxPL  = pro;
									if(maxPL>maxWinning)
									{
										result.status = false;
										result.message = "Max Winning Limit "+maxWinning;
										return result;
									}

			                        if((dr.bz_balance - cla) >= 0)
			                        {
			                            pla = 0;
			                            if(cla2 <=  limit_bet)
			                            {
			                                sti = await BzBetMatchLucky7Virtual.create({
			                                    mid_mid: mid,
			                                    uname: uid,
			                                    rnr_nam: mnam,
			                                    rnr_sid: sid,
			                                    bak: pro,
			                                    lay: cla,
			                                    lockamt: cla2,
			                                    evt_id: mid,
			                                    user_id: req.user._id
			                                });
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
			                }

			                if(pointok == 1)
							{
								///
                                await BzBetLucky7VirtualRate.updateOne(
                                    { evt_id: mid },
                                    { $set: { is_bet_place: '1' } }
                                );
								///
								
			                    cla = -lib;
			                    let st = await BzBetsLucky7VirtualHistory.create({
			                        uname: uid,
			                        cat_mid: mid,
			                        rnr: mnam,
			                        rate: rat,
			                        amnt: amt,
			                        pro: pro,
			                        lib: lib,
			                        type: typ,
			                        cla: cla,
			                        rnrsid: sid,
			                        sid: intSid,
			                        user_id: req.user._id
			                    });
			                    let bet_id = st._id;

			                    let st2 = await UpdateBalance(uid, cla);
								await pushExposure(req, res, sid, cla, "Lucky 7 Virtual");

			                    if(st2)
								{
									balance_point = dr.bz_balance + cla;
									
                                    let dt = new Date().toISOString();


										claVal = dr.bz_balance + cla;


								    //New Logs
                                    await UserLogs.create({
                                        page: 'livebet_Lucky7_virtual',
                                        linkid: bet_id,
                                        ptrans: cla,
                                        otrans: '',
                                        points: claVal,
                                        obal: dr.opin_bal,
                                        uname: uid,
                                        user_id: req.user._id,
                                        date: dt,
                                        ptype: 'bet'
                                    });



                                    let notificationsData = {
                                        evt_id: 'Lucky 7 Virtual',
                                        user_id: req.user._id,
                                        game_type: '6',
                                        description: `${uid} placed bet on ${mnam} in Lucky 7 Virtual casino games.`
                                    };
                                    await Notifications.create(notificationsData);

									result.status = true;
                                	result.message = "Bet Placed.";
                                	return result;

								}
								else
								{
									 result.status = false;
									 result.message = "Error while placing bet";
									 return result;
								}
			                }
			               	else if (pointok == 2)
							{
								result.status = false;
								result.message = "Bet limit error";
								return result;
							}
							else if (pointok == 3)
							{
								result.status = false;
								result.message = "Bet limit error";
								return result;
							}
							else
							{
								result.status = false;
								result.message = "Insufficient funds!!";
								return result;
							}
			            }
			            catch(error)
						{
							//$db->rollBack();
							result.status = false;
                        	result.message = "Some error occurred while placing this bet.";
                        	return result;
						}
			        }
			        else
			        {
						result.status = false;
                    	result.message = "Live rate not matched.";
                    	return result;
					}
			    
			}
			else
			{
				result.status = false;
            	result.message = "Some parameters missing. Please try again.";
            	return result;
			}

	}

module.exports = { placeLucky7Bet };
