import React from "react";
const BetfairFancy = ({ eventDetails, betfairFancyData, setBetSlipDetails }) => {
    const showBetSlip = (betType, teamName, sid, rate, price, sectionId) => {
        setBetSlipDetails({ bet_type: betType, runnername: teamName, sid: sid, odds: rate, amount: 0, price: price, market_type: 'betfairfancy', sectionId: sectionId });
    };
    return (
        <>
            <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-8">
                    <div className="" id="scrollChat">
                        <div className="">
                            <div className="mark-head">
                                <span id="ContentPlaceHolder1_Mtype" style={{ fontWeight: "600" }}>BetFair Fancy</span>
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
                                        {Array.isArray(betfairFancyData) &&
                                            betfairFancyData.map((fancy, index) => (
                                                <tr className="rowkh" id="row1" key={index}>
                                                    <td className="text-left ">
                                                        <div className="txt_mtc">
                                                            <span id="ContentPlaceHolder1_team01" style={{ color: "#000", fontWeight: "700" }}>{fancy.market}
                                                            </span>
                                                            <div className="clearfix"></div>
                                                            <div className="statusstack">
                                                                <span id="lbl_point1" data-value="0" style={{ fontWeight: "700" }}>{fancy.market}</span>
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
                                                            <a href="#" className="value-market">{fancy.bak}</a>
                                                            <span id="FTRate_LS1" className="backsize_1 laysize">{fancy.bakrate}</span>
                                                        </div>
                                                    </td>
                                                    <td className="ratetd">
                                                        <div className="showpanel">
                                                            <a href="#" className="value-market">{fancy.lay} </a>
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
                                                    {/*<div className="suspended-overlap" style={{ display: fancy.status === "OPEN" ? "" : "none" }}>
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
            </div >


            {/*<div style={{ display: "block" }}>
                <div className="table-box-body">
                    <div className="tb-content">
                        <div className="market-titlebar">
                            <p className="market-name">
                                <span className="market-name-badge">
                                    <i className="market-name-icon">
                                        <img
                                            src="/assets/images/time-img.png"
                                            style={{
                                                filter: "invert(100%)",
                                                marginTop: "-8px",
                                                marginLeft: "-1px"
                                            }}
                                        />
                                    </i>
                                    <span>
                                        Betfair Fancy Bet{" "}
                                        <span style={{ textTransform: "initial" }}>
                                            (MaxBet: 200K)
                                        </span>
                                    </span>{" "}
                                    <span style={{ textTransform: "initial" }}></span>
                                </span>
                                <span className="rules-badge">
                                    <i className="fa fa-info-circle"></i>
                                </span>
                            </p>
                            <div className="market-overarround">
                                <span></span>
                                <strong>BACK</strong>
                            </div>
                            <div className="market-overarround market-overarround-lay">
                                <strong>LAY</strong>
                            </div>
                        </div>
                        <div className="market-runners">
                            {betfairFancyData !== null &&
                                betfairFancyData !== undefined &&
                                betfairFancyData !== "" &&
                                betfairFancyData.map((fancy) => (
                                    <div className="runner-runner">
                                        <h3 className="runner-name">
                                            <div className="runner-info">
                                                <span className="clippable runner-display-name">
                                                    <h4
                                                        className="clippable-spacer"
                                                        style={{
                                                            fontWeight: "normal",
                                                            textTransform: "capitalize",
                                                            wordWrap: "break-word",
                                                            whiteSpace: "break-spaces",
                                                            lineHeight: "21px",
                                                            fontSize: "15px",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        {fancy.market}
                                                    </h4>
                                                </span>
                                            </div>
                                        </h3>

                                        <div className="price-row-box-new">
                                            <a
                                                className="price-price price-lay"
                                                style={{ background: "#e8f6fc" }}
                                            >
                                                &nbsp;
                                            </a>
                                            <a
                                                className="price-price price-lay mr-4"
                                                style={{ background: "#e8f6fc" }}
                                            >
                                                &nbsp;
                                            </a>

                                            <a
                                                onClick={() =>
                                                    showBetSlip(
                                                        "B",
                                                        fancy.market,
                                                        fancy.marketid,
                                                        fancy.bak,
                                                        fancy.bakrate,
                                                        fancy.sectionId
                                                    )
                                                }
                                                className="price-price price-back mb-show"
                                                style={{
                                                    backgroundColor: "rgb(141, 210, 240)",
                                                    textDecoration: "none",
                                                    color: "black"
                                                }}
                                            >
                                                <div>
                                                    <span className="price-odd">{fancy.bak}</span>
                                                    <span className="price-amount">{fancy.bakrate}</span>
                                                </div>
                                            </a>
                                            <a
                                                className="price-price price-lay mb-show ml-4"
                                                style={{
                                                    backgroundColor: "rgb(254, 175, 178)",
                                                    textDecoration: "none",
                                                    color: "black"
                                                }}
                                                onClick={() =>
                                                    showBetSlip(
                                                        "L",
                                                        fancy.market,
                                                        fancy.marketid,
                                                        fancy.lay,
                                                        fancy.layrate,
                                                        fancy.sectionId
                                                    )
                                                }
                                            >
                                                <div>
                                                    <span className="price-odd">{fancy.lay}</span>
                                                    <span className="price-amount">{fancy.layrate}</span>
                                                </div>
                                            </a>
                                            <a
                                                className="price-price price-back"
                                                style={{ background: "#fce3e4" }}
                                            >
                                                &nbsp;
                                            </a>
                                            <a
                                                className="price-price price-back"
                                                style={{ background: "#fce3e4" }}
                                            >
                                                &nbsp;
                                            </a>

                                            <div
                                                className="suspended-overlap"
                                                style={{
                                                    display: fancy.status === "OPEN" ? "" : "none"
                                                }}
                                            >
                                                Suspended
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>*/}
        </>
    );

};
export default BetfairFancy;