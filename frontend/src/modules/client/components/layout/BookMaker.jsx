import React from "react";
const Bookmaker = ({ onChildRuleShow, eventDetails, bookmakerOdds, setBetSlipDetails, bookmakerBook }) => {

    const showRules = () => {
        onChildRuleShow();
    };

    const showBetSlip = (betType, teamName, sid, rate, sr) => {
        setBetSlipDetails({ bet_type: betType, runnername: teamName, sid: sid, odds: rate, amount: 0, market_type: 'bm', sr: sr });
    };

    // runner1
    let r1b = 0;
    let r1l = 0;
    let t2Size = 0;
    let t3Size = 0;
    let status1 = "SUSPENDED";

    // runner2
    let r2b = 0;
    let r2l = 0;
    let t4Size = 0;
    let t5Size = 0;
    let status2 = "SUSPENDED";

    // runner3
    let r3b = 0;
    let r3l = 0;

    let t6Size = 0;
    let t7Size = 0;
    let status3 = "SUSPENDED";

    let rnr1s = 0;
    let rnr2s = 0;
    let rnr3s = 0;

    if (bookmakerBook !== null && bookmakerBook !== undefined) {
        rnr1s = parseInt(bookmakerBook.rnr1s);
        rnr2s = parseInt(bookmakerBook.rnr2s);
        rnr3s = parseInt(bookmakerBook.rnr3s);
    }


    if (bookmakerOdds !== null && bookmakerOdds !== undefined && bookmakerOdds !== "") {
        //debugger;
        // runner1 
        r1b = bookmakerOdds.r1b;
        r1l = bookmakerOdds.r1l;
        t2Size = bookmakerOdds.t2Size;
        t3Size = bookmakerOdds.t3Size;
        status1 = bookmakerOdds.s1;

        //runner2
        r2b = bookmakerOdds.r2b;
        r2l = bookmakerOdds.r2l;
        t4Size = bookmakerOdds.t4Size;
        t5Size = bookmakerOdds.t5Size;
        status2 = bookmakerOdds.s2;

        // runner3
        r3b = bookmakerOdds.r3b;
        r3l = bookmakerOdds.r3l;
        t6Size = bookmakerOdds.t6Size;
        t7Size = bookmakerOdds.t7Size;
        status3 = bookmakerOdds.s3;

    }

    return (
        <>

            <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-8">
                    <div className="" id="scrollChat">
                        <div className="">
                            <div className="mark-head">
                                <span id="ContentPlaceHolder1_Mtype" style={{ fontWeight: "600" }}>Book Maker</span>
                                <div className="cur-dt ng-binding">

                                    <span className="smallmax" style={{ fontWeight: "600" }}>Limit Min:
                                        <span id="ContentPlaceHolder1_lblMMinBet" style={{ fontWeight: "600" }}>500</span>
                                        /  Max:
                                        <span id="ContentPlaceHolder1_lblMMaxBet" style={{ fontWeight: "600" }}>200000</span>
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
                                                    <a href="#" className="betpricelive value-market">{ }</a>
                                                    <span className="backsize_1 laysize">{ }</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className=" value-market">{ }</a>
                                                    <span id="FTRate_KS2" className="backsize_1 laysize"> { }</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className="value-market">{r1b}</a>
                                                    <span id="FTRate_LS1" className="backsize_1 laysize">{t2Size}</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className="value-market">{r1l} </a>
                                                    <span id="FTRate_KS1" className="laysize_1 laysize">{t3Size}</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel" >
                                                    <a href="#" className="value-market">{ }</a>
                                                    <span className="laysize_1 laysize">{ }</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a href="#" id="FTRate_L3" className="value-market">{ }</a>
                                                    <span id="FTRate_LS3" className="laysize_1 laysize">{ }</span>
                                                </div>
                                            </td>
                                            {/*<div className="suspended-overlap" style={{ display: status2 === "SUSPENDED" ? "" : "none" }}>
                                                Suspended
                                            </div>*/}
                                        </tr>
                                        <tr className="rowkh" id="row1">
                                            <td className="text-left ">
                                                <div className="txt_mtc">
                                                    <span id="ContentPlaceHolder1_team01" style={{ color: "#000", fontWeight: "700" }}>{eventDetails.cat_rnr2}
                                                    </span>
                                                    <div className="clearfix"></div>
                                                    <div className="statusstack">
                                                        <span id="lbl_point1" data-value="0" style={{ fontWeight: "700" }}>{rnr2s !== 0 ? <span>{rnr2s}</span> : ""}</span>
                                                        <span className="adv-book" id="run1"></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className="betpricelive value-market">{ }</a>
                                                    <span className="backsize_1 laysize">{ }</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className=" value-market">{ }</a>
                                                    <span id="FTRate_KS2" className="backsize_1 laysize"> { }</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className="value-market">{r2b}</a>
                                                    <span id="FTRate_LS1" className="backsize_1 laysize">{t4Size}</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className="value-market">{r2l} </a>
                                                    <span id="FTRate_KS1" className="laysize_1 laysize">{t5Size}</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel" >
                                                    <a href="#" className="value-market">{ }</a>
                                                    <span className="laysize_1 laysize">{ }</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a href="#" id="FTRate_L3" className="value-market">{ }</a>
                                                    <span id="FTRate_LS3" className="laysize_1 laysize">{ }</span>
                                                </div>
                                            </td>
                                            {/*<div className="suspended-overlap" style={{ display: status2 === "SUSPENDED" ? "" : "none" }}>
                                                Suspended
                                            </div>*/}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Bookmaker;