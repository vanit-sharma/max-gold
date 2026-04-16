import React from "react";
//import { motion } from "framer-motion";
import DisplayOdd from "./DisplayOdd";
import ClientLayout from "./ClientLayout";
import { useState } from "react";

const MatchOdd = ({
    onChildRuleShow,
    eventDetails,
    matchOdds,
    setBetSlipDetails,
    matchOddBook,
}) => {
    const showRules = () => {
        onChildRuleShow();
    };

    let betAccept = true;

    // runner1
    let r1b = 0;
    let r1b2 = 0;
    let r1b3 = 0;
    let r1l = 0;
    let r1l2 = 0;
    let r1l3 = 0;

    let rate1 = 0;
    let rate2 = 0;
    let rate3 = 0;
    let rate4 = 0;
    let rate5 = 0;
    let rate6 = 0;

    // runner2
    let r2b = 0;
    let r2b2 = 0;
    let r2b3 = 0;
    let r2l = 0;
    let r2l2 = 0;
    let r2l3 = 0;

    let rate7 = 0;
    let rate8 = 0;
    let rate9 = 0;
    let rate10 = 0;
    let rate11 = 0;
    let rate12 = 0;

    // runner3
    let r3b = 0;
    let r3b2 = 0;
    let r3b3 = 0;
    let r3l = 0;
    let r3l2 = 0;
    let r3l3 = 0;

    let rate13 = 0;
    let rate14 = 0;
    let rate15 = 0;
    let rate16 = 0;
    let rate17 = 0;
    let rate18 = 0;

    let rnr1s = 0;
    let rnr2s = 0;
    let rnr3s = 0;

    let oddStatus = "OPEN";

    if (matchOddBook !== null && matchOddBook !== undefined) {
        if (matchOddBook.rnr1s !== undefined) {
            rnr1s = parseInt(matchOddBook.rnr1s);
        }

        if (matchOddBook.rnr2s !== undefined) {
            rnr2s = parseInt(matchOddBook.rnr2s);
        }

        if (matchOddBook.rnr3s !== undefined) {
            rnr3s = parseInt(matchOddBook.rnr3s);
        }
    }

    if (matchOdds !== null && matchOdds !== undefined) {
        //debugger;
        // runner1
        r1b = matchOdds.r1b;
        r1b2 = matchOdds.r1b2;
        r1b3 = matchOdds.r1b3;
        r1l = matchOdds.r1l;
        r1l2 = matchOdds.r1l2;
        r1l3 = matchOdds.r1l3;

        rate1 = matchOdds.rate1;
        rate2 = matchOdds.rate2;
        rate3 = matchOdds.rate3;
        rate4 = matchOdds.rate4;
        rate5 = matchOdds.rate5;
        rate6 = matchOdds.rate6;

        //runner2
        r2b = matchOdds.r2b;
        r2b2 = matchOdds.r2b2;
        r2b3 = matchOdds.r2b3;
        r2l = matchOdds.r2l;
        r2l2 = matchOdds.r2l2;
        r2l3 = matchOdds.r2l3;

        rate7 = matchOdds.rate7;
        rate8 = matchOdds.rate8;
        rate9 = matchOdds.rate9;
        rate10 = matchOdds.rate10;
        rate11 = matchOdds.rate11;
        rate12 = matchOdds.rate12;

        // runner3
        r3b = matchOdds.r3b;
        r3b2 = matchOdds.r3b2;
        r3b3 = matchOdds.r3b3;
        r3l = matchOdds.r3l;
        r3l2 = matchOdds.r3l2;
        r3l3 = matchOdds.r3l3;

        rate13 = matchOdds.rate13;
        rate14 = matchOdds.rate14;
        rate15 = matchOdds.rate15;
        rate16 = matchOdds.rate16;
        rate17 = matchOdds.rate17;
        rate18 = matchOdds.rate18;
        oddStatus = matchOdds.status;
    }

    if (eventDetails !== null && eventDetails !== undefined) {
        if (!eventDetails.is_bet_accept || eventDetails.evt_status !== "OPEN") {
            betAccept = false;
        }
    }

    return (
        <>

            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">

                    <div className="panel-heading match-header">
                        <a className="" role="button" data-toggle="collapse">
                            <h3 className="">
                                <span id="ContentPlaceHolder1_lbl_matchname" className="" style={{ fontWeight: "600" }}>{eventDetails?.cat_rnr1} v {eventDetails?.cat_rnr2}</span>
                                <small className="datesmall">
                                    <span id="ContentPlaceHolder1_opendate" className="small">15-Jan-2026 12:00:00</span>
                                </small>
                            </h3>
                        </a>
                    </div>


                    <div id="collapseOnes" className="" role="tabpanel" aria-labelledby="headingOne">
                        <iframe src="https://scapi.betproex.com/home/sc2/35140092" id="ContentPlaceHolder1_cricketframe" style={{ width: "100%" }} className="sc-dUjcNx eLUYUT" />
                    </div>


                    <div className="" id="scrollChat">
                        <div className="">
                            <div className="mark-head">
                                <span id="ContentPlaceHolder1_Mtype" style={{ fontWeight: "600" }}>Match Odds</span>
                                <div className="cur-dt ng-binding">

                                    <span className="smallmax" style={{ fontWeight: "600" }}>Limit Min:
                                        <span id="ContentPlaceHolder1_lblMMinBet" style={{ fontWeight: "600" }}>500</span>
                                        /  Max:
                                        <span id="ContentPlaceHolder1_lblMMaxBet" style={{ fontWeight: "600" }}>300000</span>
                                    </span>
                                    <a href="#" id="liveclick1" className="pull-right">
                                        <img src="https://betmax.gold/images/stream.png" width="16" />
                                    </a>
                                </div>
                            </div>
                            <div className="dataTables_wrapper">
                                <div className="csslayer" id="divmarketoverlayer" style={{ display: "none" }}>Market Suspended</div>
                                <table className="table table-bordered table_marketData ">
                                    <thead>
                                        <tr>
                                            <th className="rowborder">&nbsp;&nbsp;&nbsp;RUNNER</th>
                                            <th colspan="2" className="hidden-sm hidden-xs"></th>
                                            <th className="text-center">
                                                <span className="tt_theadL tt_thead tt-overlay back">Back all</span>
                                            </th>
                                            <th className="text-center">
                                                <span className="tt_theadK tt_thead tt-overlay back">Lay all</span>
                                            </th>
                                            <th colspan="2" className="hidden-sm hidden-xs"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="rowkh" id="row1">
                                            <td className="text-left ">
                                                <div className="txt_mtc">
                                                    <span id="ContentPlaceHolder1_team01" style={{ color: "#000", fontWeight: "700" }}>{eventDetails.cat_rnr1}
                                                    </span>
                                                    <div className="clearfix"></div>
                                                    <div className="statusstack">
                                                        <span id="lbl_point1" data-value="0" style={{ fontWeight: "700" }}>{rnr1s !== 0 ? <span>{rnr1s}</span> : ""}</span>
                                                        <span className="adv-book" id="run1"></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        className="betpricelive value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "B",
                                                                runnername: eventDetails?.cat_rnr1,
                                                                odds: parseFloat(r1b3),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r1b3}
                                                    </a>
                                                    <span className="backsize_1 laysize">{rate3}</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        className=" value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "B",
                                                                runnername: eventDetails?.cat_rnr1,
                                                                odds: parseFloat(r1b2),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r1b2}
                                                    </a>
                                                    <span id="FTRate_KS2" className="backsize_1 laysize"> {rate2}</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        className="value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "B",
                                                                runnername: eventDetails?.cat_rnr1,
                                                                odds: parseFloat(r1b),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r1b}
                                                    </a>
                                                    <span id="FTRate_LS1" className="backsize_1 laysize">{rate1}</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        className="value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "L",
                                                                runnername: eventDetails?.cat_rnr1,
                                                                odds: parseFloat(r1l),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r1l}{" "}
                                                    </a>
                                                    <span id="FTRate_KS1" className="laysize_1 laysize">{rate4}</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel" >
                                                    <a
                                                        href="#"
                                                        className="value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "L",
                                                                runnername: eventDetails?.cat_rnr1,
                                                                odds: parseFloat(r1l2),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r1l2}
                                                    </a>
                                                    <span className="laysize_1 laysize">{rate5}</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        id="FTRate_L3"
                                                        className="value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "L",
                                                                runnername: eventDetails?.cat_rnr1,
                                                                odds: parseFloat(r1l3),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r1l3}
                                                    </a>
                                                    <span id="FTRate_LS3" className="laysize_1 laysize">{rate6}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="rowkh" id="row1">
                                            <td className="text-left ">
                                                <div className="txt_mtc">
                                                    <span id="ContentPlaceHolder1_team01" style={{ color: "#000", fontWeight: "700" }}>{eventDetails.cat_rnr2}
                                                    </span>
                                                    <div className="clearfix"></div>
                                                    <div className="statusstack">
                                                        <span id="lbl_point1" data-value="0" style={{ fontWeight: "700" }}>{rnr2s !== 0 ? <span>{{ rnr2s }}</span> : ""}</span>
                                                        <span className="adv-book" id="run1"></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        className="betpricelive value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "B",
                                                                runnername: eventDetails?.cat_rnr2,
                                                                odds: parseFloat(r2b3),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r2b3}
                                                    </a>
                                                    <span className="backsize_1 laysize">{rate9}</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        className=" value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "B",
                                                                runnername: eventDetails?.cat_rnr2,
                                                                odds: parseFloat(r2b2),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r2b2}
                                                    </a>
                                                    <span id="FTRate_KS2" className="backsize_1 laysize"> {rate8}</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        className="value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "B",
                                                                runnername: eventDetails?.cat_rnr2,
                                                                odds: parseFloat(r2b),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r2b}
                                                    </a>
                                                    <span id="FTRate_LS1" className="backsize_1 laysize">{rate7}</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        className="value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "L",
                                                                runnername: eventDetails?.cat_rnr2,
                                                                odds: parseFloat(r2l),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r2l}{" "}
                                                    </a>
                                                    <span id="FTRate_KS1" className="laysize_1 laysize">{rate10}</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel" >
                                                    <a
                                                        href="#"
                                                        className="value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "L",
                                                                runnername: eventDetails?.cat_rnr2,
                                                                odds: parseFloat(r2l2),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r2l2}
                                                    </a>
                                                    <span className="laysize_1 laysize">{rate11}</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a
                                                        href="#"
                                                        id="FTRate_L3"
                                                        className="value-market"
                                                        onClick={(e) => {
                                                            e.preventDefault();

                                                            setBetSlipDetails({
                                                                bet_type: "L",
                                                                runnername: eventDetails?.cat_rnr2,
                                                                odds: parseFloat(r2l3),
                                                                sid: 1,
                                                                market_type: "m",
                                                            });
                                                        }}
                                                    >
                                                        {r2l3}
                                                    </a>
                                                    <span id="FTRate_LS3" className="laysize_1 laysize">{rate12}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/*<div className="grid_shadow mt10" id="toWinToss">
                            <table className="table table-bordered table_marketData tbl_mrktData">
                                <thead>
                                    <tr style={{ height: "36px" }}>
                                        <th className="rowborder">&nbsp;&nbsp;&nbsp;TO WIN THE TOSS</th>
                                        <th colspan="2" className="hidden-sm hidden-xs"></th>
                                        <th className="text-center">
                                            <span className="tt_theadL tt_thead tt-overlay back">Chattogram Royals</span>
                                        </th>
                                        <th className="text-center">
                                            <span className="tt_theadL tt_thead tt-overlay back">Noakhali Express</span>
                                        </th>
                                        <th colspan="2" className="hidden-sm hidden-xs">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="sessiondata">
                                    <tr>
                                        <td style={{ color: "#000" }}>TOSS_CHATTOGRAM ROYALS V NOAKHALI EXPRESS</td>
                                        <td colspan="2" className="hidden-sm hidden-xs ratetd bg-none">
                                            <span className="OPEN" style={{ marginLeft: "60px" }}>OPEN</span>
                                        </td>
                                        <td className="session back ">
                                            <a className="back" href="#" >1.9
                                                <span className="laysize">100</span>
                                            </a>
                                        </td>
                                        <td id="t_lay35140092" className="session back">
                                            <a className="back" href="#" >1.9
                                                <span className="laysize">100</span>
                                            </a>
                                        </td>
                                        <td colspan="2" className="hidden-sm hidden-xs ratetd bg-none"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>*/}
                        <div className="clearfix"></div>
                        <div className="grid_shadow mt10">
                            <table id="fancyoverlay" className="table table-bordered table_marketData tbl_mrktData">
                                <thead>
                                    <tr className="rowmatchcol">
                                        <th className="rowborder">&nbsp;&nbsp;&nbsp;FANCY
                                            &nbsp;&nbsp;
                                            <a id="ContentPlaceHolder1_btnResult" className="btn btn-xs btn-success" href="#">Result</a>
                                            <a id="ContentPlaceHolder1_btnRefresh" title="Refresh" className="btn btn-xs btn-default" href="#">Refresh</a>
                                            <span className="smallmax">Limit Min:
                                                <span id="ContentPlaceHolder1_lblsMin">500</span>
                                                /  Max:<span id="ContentPlaceHolder1_lblsMax">300000</span>
                                            </span>
                                        </th>
                                        <th colspan="2" className="hidden-sm hidden-xs"></th>
                                        <th className="text-center"><span className="tt_theadK tt_thead">Not</span></th>
                                        <th className="text-center"><span className="tt_theadL tt_thead">Yes</span></th>
                                        <th colspan="2" className="hidden-sm hidden-xs"><span></span></th>
                                    </tr>
                                </thead>
                                <tbody className="sessiondata" id="sData">

                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>


            </div>







        </>
    );
};
export default MatchOdd;
