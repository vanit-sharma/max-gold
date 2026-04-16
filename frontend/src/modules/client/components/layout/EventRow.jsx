import React from "react";
import { useNavigate, Link } from "react-router-dom";


export default function EventRow({ eventList, tabName, sendDataToParent }) {
    if (eventList === null || eventList === undefined) {
        //console.error("eventList is null or undefined");
        return;
    } else {
        //console.log("EventRow component rendered with eventList:", eventList);
    }

    const eventNewList = [];
    const sortList = [];
    let inplayCount = 0;
    let cricketCount = 0;
    let footballCount = 0;
    let tennisCount = 0;

    if (
        eventList !== null &&
        eventList !== undefined &&
        eventList.result !== undefined &&
        eventList.result.length > 0
    ) {
        let resultEventList = eventList.result;
        for (let i = 0; i < resultEventList.length; i++) {
            if (tabName === "cricket" && resultEventList[i].sports_type === 1) {
                eventNewList.push(resultEventList[i]);
                cricketCount++;
            }

            if (tabName === "football" && resultEventList[i].sports_type === 2) {
                eventNewList.push(resultEventList[i]);
                footballCount++;
            }

            if (tabName === "tennis" && resultEventList[i].sports_type === 3) {
                eventNewList.push(resultEventList[i]);
                tennisCount++;
            }

            if (
                tabName === "inplay_cricket" &&
                resultEventList[i].sports_type === 1 &&
                resultEventList[i].inplay === 1
            ) {
                eventNewList.push(resultEventList[i]);
                inplayCount++;
            }

            if (
                tabName === "inplay_football" &&
                resultEventList[i].sports_type === 2 &&
                resultEventList[i].inplay === 1
            ) {
                eventNewList.push(resultEventList[i]);
                inplayCount++;
            }

            if (
                tabName === "inplay_tennis" &&
                resultEventList[i].sports_type === 3 &&
                resultEventList[i].inplay === 1
            ) {
                eventNewList.push(resultEventList[i]);
                inplayCount++;
            }
        }
    }

    const sortedByList = [...eventNewList].sort((a, b) => b.inplay - a.inplay);

    const mappedChildren = sortedByList.map((eventData) => (
        <div class="market_wrap padding-all" style={{ fontWeight: "700" }}>

            <div class="col-md-7 col-xs-12">
                <Link to={`/market/${eventData.cat_mid}`} class="markethover">
                    <h5 class="text_event"><span class="font-600 font-13 padding-table-all">{eventData.name} <small class="text-small">{eventData.date}{eventData.time}</small></span>

                        <span className={eventData.inplay == 1 ? "setinplayBtn" : "setinplayBtn hide"}>In-Play
                        </span>
                    </h5>
                </Link>
            </div>
            <div class="col-md-5 col-xs-12 no-border padding-top-5">
                <div class="col-xs-4 r-overlay">
                    <div class="result-x">
                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_r1_0"></span></div>
                    <div class="col-md-6 col-xs-6 no-padding rate back-rate-color padding-table-all text-center">
                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_back1_0" className="padding-table-all">{eventData.odds.r1b != 0 ? eventData.odds.r1b : "0"}</span></div>
                    <div class="col-md-6 col-xs-6 no-padding rate lay-rate-color padding-table-all text-center">
                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_lay1_0" className="padding-table-all">{eventData.odds.r1l != 0 ? eventData.odds.r1l : "0"}</span></div>
                </div>
                <div class="col-xs-4 r-overlay">
                    <div class="result-x">
                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_r3_0"></span></div>
                    <div class="col-md-6 col-xs-6 no-padding rate back-rate-color padding-table-all text-center">
                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_backx_0" className="padding-table-all">{eventData.odds.r3b != 0 ? eventData.odds.r3b : "-"}</span></div>
                    <div class="col-md-6 col-xs-6 no-padding rate lay-rate-color padding-table-all text-center">
                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_layx_0" className="padding-table-all">{eventData.odds.r3l != 0 ? eventData.odds.r3l : "-"}</span></div>
                </div>
                <div class="col-xs-4 r-overlay">
                    <div class="result-x">
                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_r2_0"></span></div>
                    <div class="col-md-6 col-xs-6 no-padding rate back-rate-color padding-table-all text-center">
                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_back2_0" className="padding-table-all">{eventData.odds.r2b != 0 ? eventData.odds.r2b : "0"}</span></div>
                    <div class="col-md-6 col-xs-6 no-padding rate lay-rate-color padding-table-all text-center">
                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_lay2_0" className="padding-table-all">{eventData.odds.r2l != 0 ? eventData.odds.r2l : "0"} </span></div>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    ));
    return mappedChildren;
}