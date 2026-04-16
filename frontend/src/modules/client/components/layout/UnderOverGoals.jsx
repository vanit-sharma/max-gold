
import React from "react";

const showValue = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return value;
};

const MarketTable = ({ market, setBetSlipDetails }) => {
    const odd = market?.odd || {};
    const underBook = Number(market?.book?.rnr1s || 0);
    const overBook = Number(market?.book?.rnr2s || 0);

    const showBetSlip = ({ bet_type, runnername, sid, odds, price }) => {
        if (!setBetSlipDetails) return;
        setBetSlipDetails({
            bet_type,
            runnername,
            sid,
            odds,
            amount: 0,
            price,
            market_type: "ff",
            childId: market?.cat_mid
        });
    };

    return (
        <div id="scrollChat">
            <div className="mark-head">
                <span style={{ fontWeight: "600" }}>{market?.cat_mname || "Over/Under"}</span>
                <div className="cur-dt ng-binding">
                    <span className="smallmax" style={{ fontWeight: "600" }}>
                        Limit Max: <span style={{ fontWeight: "600" }}>200K</span>
                    </span>
                </div>
            </div>

            <div className="dataTables_wrapper">
                <table className="table table-bordered table_marketData">
                    <thead>
                        <tr>
                            <th className="rowborder">&nbsp;&nbsp;&nbsp;RUNNER</th>
                            <th colSpan="2" className="hidden-sm hidden-xs"></th>
                            <th className="text-center"><span className="tt_theadL tt_thead tt-overlay back">Back all</span></th>
                            <th className="text-center"><span className="tt_theadK tt_thead tt-overlay back">Lay all</span></th>
                            <th colSpan="2" className="hidden-sm hidden-xs"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="rowkh">
                            <td className="text-left">
                                <div className="txt_mtc">
                                    <span style={{ color: "#000", fontWeight: "700" }}>
                                        {market?.cat_rnr1 || "Under"}
                                    </span>
                                    <div className="clearfix"></div>
                                    <div className="statusstack">
                                        <span style={{ fontWeight: "700" }}>
                                            {underBook !== 0 ? underBook : ""}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="hidden-sm hidden-xs ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            showBetSlip({
                                                bet_type: "B",
                                                runnername: market?.runner1,
                                                sid: market?.cat_sid1,
                                                odds: odd.r1b3,
                                                price: odd.rate3
                                            });
                                        }}>
                                        {showValue(odd.r1b3)}
                                    </a>
                                    <span className="backsize_1 laysize">{showValue(odd.rate3)}</span>
                                </div>
                            </td>
                            <td className="hidden-sm hidden-xs ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault(); showBetSlip({
                                                bet_type: "B",
                                                runnername: market?.runner1,
                                                sid: market?.cat_sid1,
                                                odds: odd.r1b2,
                                                price: odd.rate2
                                            });
                                        }}>
                                        {showValue(odd.r1b2)}
                                    </a>
                                    <span className="backsize_1 laysize">{showValue(odd.rate2)}</span>
                                </div>
                            </td>
                            <td className="ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault(); showBetSlip({
                                                bet_type: "B",
                                                runnername: market?.runner1,
                                                sid: market?.cat_sid1,
                                                odds: odd.r1b,
                                                price: odd.rate1
                                            });
                                        }}>
                                        {showValue(odd.r1b)}
                                    </a>
                                    <span className="backsize_1 laysize">{showValue(odd.rate1)}</span>
                                </div>
                            </td>
                            <td className="ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault(); showBetSlip({
                                                bet_type: "L",
                                                runnername: market?.runner1,
                                                sid: market?.cat_sid1,
                                                odds: odd.r1l,
                                                price: odd.rate4
                                            });
                                        }}>
                                        {showValue(odd.r1l)}
                                    </a>
                                    <span className="laysize_1 laysize">{showValue(odd.rate4)}</span>
                                </div>
                            </td>
                            <td className="hidden-sm hidden-xs ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault(); showBetSlip({
                                                bet_type: "L",
                                                runnername: market?.runner1,
                                                sid: market?.cat_sid1,
                                                odds: odd.r1l2,
                                                price: odd.rate5
                                            });
                                        }}>
                                        {showValue(odd.r1l2)}
                                    </a>
                                    <span className="laysize_1 laysize">{showValue(odd.rate5)}</span>
                                </div>
                            </td>
                            <td className="hidden-sm hidden-xs ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault(); showBetSlip({
                                                bet_type: "L",
                                                runnername: market?.runner1,
                                                sid: market?.cat_sid1,
                                                odds: odd.r1l3,
                                                price: odd.rate6
                                            });
                                        }}>
                                        {showValue(odd.r1l3)}
                                    </a>
                                    <span className="laysize_1 laysize">{showValue(odd.rate6)}</span>
                                </div>
                            </td>
                        </tr>
                        <tr className="rowkh">
                            <td className="text-left">
                                <div className="txt_mtc">
                                    <span style={{ color: "#000", fontWeight: "700" }}>
                                        {market?.cat_rnr2 || "Over"}
                                    </span>
                                    <div className="clearfix"></div>
                                    <div className="statusstack">
                                        <span style={{ fontWeight: "700" }}>
                                            {overBook !== 0 ? overBook : ""}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="hidden-sm hidden-xs ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault(); showBetSlip({
                                                bet_type: "B",
                                                runnername: market?.runner2,
                                                sid: market?.cat_sid2,
                                                odds: odd.r2b3,
                                                price: odd.rate9
                                            });
                                        }}
                                    >
                                        {showValue(odd.r2b3)}
                                    </a>
                                    <span className="backsize_1 laysize">{showValue(odd.rate9)}</span>
                                </div>
                            </td>
                            <td className="hidden-sm hidden-xs ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            showBetSlip({
                                                bet_type: "B",
                                                runnername: market?.runner2,
                                                sid: market?.cat_sid2,
                                                odds: odd.r2b2,
                                                price: odd.rate8
                                            });
                                        }}
                                    >
                                        {showValue(odd.r2b2)}
                                    </a>
                                    <span className="backsize_1 laysize">{showValue(odd.rate8)}</span>
                                </div>
                            </td>
                            <td className="ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            showBetSlip({
                                                bet_type: "B",
                                                runnername: market?.runner2,
                                                sid: market?.cat_sid2,
                                                odds: odd.r2b,
                                                price: odd.rate7
                                            });
                                        }}>
                                        {showValue(odd.r2b)}
                                    </a>
                                    <span className="backsize_1 laysize">{showValue(odd.rate7)}</span>
                                </div>
                            </td>
                            <td className="ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            showBetSlip({
                                                bet_type: "L",
                                                runnername: market?.runner2,
                                                sid: market?.cat_sid2,
                                                odds: odd.r2l,
                                                price: odd.rate10
                                            });
                                        }}>
                                        {showValue(odd.r2l)}
                                    </a>
                                    <span className="laysize_1 laysize">{showValue(odd.rate10)}</span>
                                </div>
                            </td>
                            <td className="hidden-sm hidden-xs ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            showBetSlip({
                                                bet_type: "L",
                                                runnername: market?.runner2,
                                                sid: market?.cat_sid2,
                                                odds: odd.r2l2,
                                                price: odd.rate11
                                            });
                                        }}>
                                        {showValue(odd.r2l2)}
                                    </a>
                                    <span className="laysize_1 laysize">{showValue(odd.rate11)}</span>
                                </div>
                            </td>
                            <td className="hidden-sm hidden-xs ratetd">
                                <div className="showpanel">
                                    <a href="#" className="value-market"
                                        onClick={(e) => {
                                            e.preventDefault();

                                            //console.log("MARKET:", market);

                                            showBetSlip({
                                                bet_type: "L",
                                                runnername: market?.runner2,
                                                sid: market?.cat_sid2,
                                                odds: odd.r2l3,
                                                price: odd.rate12
                                            });
                                        }}>
                                        {showValue(odd.r2l3)}
                                    </a>
                                    <span className="laysize_1 laysize">{showValue(odd.rate12)}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UnderOverGoals = ({ footballFancyData, footballFancyBook, setBetSlipDetails }) => {
    const liveMarketList = Array.isArray(footballFancyData)
        ? footballFancyData.map((market) => {
            const book = Array.isArray(footballFancyBook)
                ? footballFancyBook.find((entry) => entry?.cat_mid === market?.cat_mid)
                : null;
            return { ...market, book: book || null };
        })
        : [];
    const fallbackMarkets = [
        {
            cat_mid: "fallback-ou-25",
            cat_mname: "Over/Under 2.5 Goals",
            cat_rnr1: "Under 2.5 Goals",
            cat_rnr2: "Over 2.5 Goals",
            odd: {}
        },
        {
            cat_mid: "fallback-ou-35",
            cat_mname: "Over/Under 3.5 Goals",
            cat_rnr1: "Under 3.5 Goals",
            cat_rnr2: "Over 3.5 Goals",
            odd: {}
        }
    ];
    const marketList = liveMarketList.length > 0 ? liveMarketList : fallbackMarkets;

    return (
        <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8">
                {marketList.map((market) => (
                    <MarketTable
                        key={market?.cat_mid || market?.cat_mname}
                        market={market}
                        setBetSlipDetails={setBetSlipDetails}
                    />
                ))}
            </div>
        </div>
    );
};

export default UnderOverGoals;