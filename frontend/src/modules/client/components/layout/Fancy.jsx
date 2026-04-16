import { React, useState, useRef, useEffect } from "react";
import axiosInstance from "../../../../utils/axiosInstance";
//import { db, getAllSession } from "../../../db";

const Fancy = ({
    eventDetails,
    fancyData,
    setBetSlipDetails,
    getBetPlaceSessionList
}) => {
    const [showSessionPlPopup, setShowSessionPlPopup] = useState(false);

    const [sessionPLList, setSessionPLList] = useState({});
    const [sessionName, setSessionName] = useState("");

    //console.log("getBetPlaceSessionList->", getBetPlaceSessionList);

    const fancyRows =
        Array.isArray(fancyData) && fancyData.length > 0
            ? [...fancyData].sort((a, b) => (a.sort || 0) - (b.sort || 0))
            : fancyData;

    const showBetSlip = (betType, teamName, sid, rate, price, sectionId) => {
        setBetSlipDetails({
            bet_type: betType,
            runnername: teamName,
            sid: sid,
            odds: rate,
            amount: 0,
            price: price,
            market_type: "f",
            sectionId: sectionId
        });
    };

    const ShowBook = async (teamName, sid, evt_id) => {
        let betObj = {};
        betObj.eid = evt_id;
        betObj.mid = sid;
        betObj.rname = teamName;
        setSessionName(teamName);

        const savedData = getBetPlaceSessionList;
        if (savedData !== null && savedData.length > 0) {
            for (let i = 0; i < savedData.length; i++) {
                let obj = savedData[i];
                let key = obj.key;

                if (key !== undefined && key !== null && key === sid) {
                    let values = obj.value;

                    setSessionPLList(values);
                    setShowSessionPlPopup(true);
                }
            }
        }
    };

    const getColor = (amount) => {
        if (amount < 0) {
            return "position-minus";
        } else {
            return "position-plus";
        }
    };

    const getSessionBook = (marketid) => {
        let returnArr = "";
        const savedData = getBetPlaceSessionList;

        if (savedData !== null && savedData.length > 0) {
            let bookAmt = [];
            for (let i = 0; i < savedData.length; i++) {
                let obj = savedData[i];
                let key = obj.key;

                if (key !== undefined && key !== null && key === marketid) {
                    let values = obj.value;
                    Object.values(values).map((value) => bookAmt.push(value));
                    const min = Math.min(...bookAmt);
                    const max = Math.max(...bookAmt);
                    returnArr = (
                        <span>
                            <span
                                style={{
                                    color: "#f00",
                                    fontWeight: "bold",
                                    paddingLeft: "0px",
                                    fontSize: "15px"
                                }}
                            >
                                {min}
                            </span>
                            <span
                                style={{
                                    color: "#00b181",
                                    fontWeight: "bold",
                                    paddingLeft: "8px",
                                    fontSize: "15px"
                                }}
                            >
                                {max}
                            </span>
                        </span>
                    );
                }
            }
        }
        return returnArr;
    };

    const closeSessionPlSlip = () => {
        setShowSessionPlPopup(false);
    };

    return (
        <>
            <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-8">
                    <div className="" id="scrollChat">
                        <div className="">
                            {/*<div className="mark-head">
                                <span id="ContentPlaceHolder1_Mtype" style={{ fontWeight: "600" }}>Fancy</span>
                                <div className="cur-dt ng-binding">

                                    <span className="smallmax" style={{ fontWeight: "600" }}>Limit Min:
                                        <span id="ContentPlaceHolder1_lblMMinBet" style={{ fontWeight: "600" }}>500</span>
                                        /  Max:
                                        <span id="ContentPlaceHolder1_lblMMaxBet" style={{ fontWeight: "600" }}>200K</span>
                                    </span>
                                    <a href="#" id="liveclick1" className="pull-right">
                                        <img src="https://betmax.gold/images/stream.png" width="16" />
                                    </a>
                                </div>
                            </div>*/}
                            <div className="dataTables_wrapper">
                                <div className="csslayer" id="divmarketoverlayer" style={{ display: "none" }}>Market Suspended</div>
                                <table className="table table-bordered table_marketData ">
                                    <thead>
                                        <tr>
                                            <th className="rowborder" style={{ fontSize: "16px", fontWeight: "600" }}> Fancy
                                                &nbsp;&nbsp;&nbsp;
                                                <a class="btn btn-success" style={{ width: "60px", fontSize: "10px" }}>Result</a>&nbsp;
                                                <a title="Refresh" class="btn btn-default" style={{ width: "60px" }}>Refresh</a>
                                                <span className="smallmax" style={{ fontWeight: "600" }}>Limit Min:
                                                    <span style={{ fontWeight: "600" }}>500</span>
                                                    /  Max:
                                                    <span style={{ fontWeight: "600" }}>200K</span>
                                                </span>
                                            </th>
                                            <th colspan="2" className="hidden-sm hidden-xs"></th>
                                            <th className="text-center">
                                                <span className="tt_theadL tt_thead tt-overlay back">Back All</span>
                                            </th>
                                            <th className="text-center">
                                                <span className="tt_theadK tt_thead tt-overlay back">Lay All</span>
                                            </th>
                                            <th colspan="2" className="hidden-sm hidden-xs"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(fancyRows) &&
                                            fancyRows.map((fancy, index) => (
                                                <tr className="rowkh" id="row1" key={fancy?.marketid || fancy?.sid || index}>
                                                    <td className="text-left ">
                                                        <div className="txt_mtc">
                                                            <span id="ContentPlaceHolder1_team01" style={{ color: "#000", fontWeight: "700" }}>{fancy.market}
                                                            </span>
                                                            <div className="clearfix"></div>

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
                                                            <a
                                                                href="#"
                                                                className="value-market"
                                                                onClick={(e) => {
                                                                    e.preventDefault();

                                                                    showBetSlip({
                                                                        bet_type: "B",
                                                                        runnername: fancy.market,
                                                                        sid: fancy.marketid || fancy.sid,
                                                                        odds: fancy.bak,
                                                                        price: fancy.bakrate,
                                                                        sectionId: fancy.sectionId,
                                                                    });
                                                                }}
                                                            >
                                                                {fancy.bak}
                                                            </a>
                                                            <span id="FTRate_LS1" className="backsize_1 laysize">{fancy.bakrate}</span>
                                                        </div>
                                                    </td>
                                                    <td className="ratetd">
                                                        <div className="showpanel">
                                                            <a
                                                                href="#"
                                                                className="value-market"
                                                                onClick={(e) => {
                                                                    e.preventDefault();

                                                                    showBetSlip({
                                                                        bet_type: "L",
                                                                        runnername: fancy.market,
                                                                        sid: fancy.marketid || fancy.sid,
                                                                        odds: fancy.lay,
                                                                        price: fancy.layrate,
                                                                        sectionId: fancy.sectionId,
                                                                    });
                                                                }}
                                                            >
                                                                {fancy.lay}{" "}
                                                            </a>
                                                            <span id="FTRate_KS1" className="laysize_1 laysize">{fancy.layrate}</span>
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
                                            ))}
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
export default Fancy;
