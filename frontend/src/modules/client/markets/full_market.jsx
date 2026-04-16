import "../../../assets/css/style.css";
import { React, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import useSocket from "../../../hooks/useSocket";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../../store/userSlice";
//import RightSide from "../markets/right-side";
import ClientLayout from "../components/layout/ClientLayout";
import MatchOdd from "../components/layout/MatchOdd";
import Bookmaker from "../components/layout/BookMaker";
import BetfairFancy from "../components/layout/BetfairFancy";
import Fancy from "../components/layout/Fancy";
import UnderOverGoals from "../components/layout/UnderOverGoals";
//import Toss from "../markets/toss";
//import FootballFancy from "../markets/football-fancy";
//import EvenOdd from "../markets/even-odd";
//import CricketScoreBoard from "../markets/cricket-scoreboard"; 
//import FootBallScoreBoard from "../markets/football-scoreboard";
//import TennisScoreBoard from "../markets/tennis-scoreboard";
//import Tie from "../markets/tie";
//import LastDigit from "../markets/last-digit";
//import HrGrMatchOdd from "../markets/hr-gr-match-odd";
//import PopUpBetSlip from "../markets/popup-betslip";
import moment from "moment";
import { isMobile } from 'react-device-detect';
import {
    db,
    addSession,
    getAllSession,
    addEvenOdd,
    getAllEvenOddList,
    deletAllTables,
    addFigure,
    getAllFigureist
} from "../../../db";



export default function Fullmarket() {
    let matchOdds = null;
    let bookmakerOdds = null;
    let tossData = null;
    let fancyData = null;
    let betfairFancyData = null;
    let tieData = null;
    let evenodddata = null;
    let figuredata = null;
    let footballFancy = null;
    let scoreboardData = null;

    let toss = null;
    let inplay = false;
    let is_bm_on = false;
    let fancy = false;
    let tie = false;
    let betfairfancy = false;
    let figure = false;
    let evenodd = false;
    let game_type = 0;
    let tie_cat_mid = "";

    const { marketId } = useParams();
    const { data, isConnected } = useSocket({
        marketId: marketId,
        mtype: "sports",
        type: ""
    });
    //console.log("Socket connected:", isConnected);
    console.log("Socket data:", data);
    //console.log("Socket cat_mid:", data.data);

    const [GameType, setGameType] = useState(0);
    const [activeTab, setActiveTab] = useState("all");
    const [betErrorMessageObj, setBetErrorMessage] = useState({});
    const [showLoader, setShowHideLoader] = useState(false);
    const [eventDetails, setEventDetails] = useState({});
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [betObj, setBetSlipDetails] = useState({});
    const [activeMarketList] = useState([]);
    const [eventStatus, setEventStatus] = useState("");

    const [matchOddBook, setMatchOddBook] = useState({});
    const [tieBook, setTieBook] = useState({});
    const [footballFancyBook, setFootballFancyBook] = useState([]);
    const [bookmakerBook, setBookmakerBook] = useState({});
    const [HRGRBook, setHRGRBook] = useState([]);
    const [betList, setBetList] = useState([]);
    const [stakeList, setStakeList] = useState({});

    const [timeLeft, setTimeLeft] = useState("");

    const [show, setShow] = useState(false);
    const [showDesktopSlip, setDesktopSlip] = useState(false);
    const [slipStake, setSlipStake] = useState("");

    const [betButtonShow, setBetButtonShow] = useState(true);
    const [betButtonShowLoaderShow, setButtonShowLoaderShow] = useState(false);

    const [getBetPlaceSessionList, setBetPlaceSessionList] = useState([]);
    const [getBetPlaceEvenOddList, setBetPlaceEvenOddList] = useState([]);
    const [getBetPlaceFigureList, setBetPlaceFigureList] = useState([]);
    const [getTieCatMid, setTieCatMid] = useState("");
    /** Session fancy rows from REST before/without socket tick (e.g. pre-match). */
    const [restFancyData, setRestFancyData] = useState(null);

    const dispatch = useDispatch();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    const setBetSlipParent = (betObj) => {
        console.log("BET SLIP FUNCTION CALLED", betObj);
        if (isMobile) {
            setBetSlipDetails(betObj);
            setShow(true);
            setDesktopSlip(false);
        } else {
            setDesktopSlip(true);
            setShow(false);
            setBetSlipDetails(betObj);
            scrollToTop();
        }
    };

    const closeBetSlipMobile = () => {
        setShow(false);
        setBetErrorMessage({});
    };

    const ShowHideLoader = (value) => {
        setShowHideLoader(showLoader, value);
    };

    const setPageDisplaySetting = (eventData) => {
        if (eventData !== undefined) {
            setEventDetails(eventData);
            setEventStatus(eventData.evt_status);
            setGameType(eventData.game_type);
            timeRemaining(eventData.evt_od);
            setTieCatMid(eventData.tie_cat_mid);
        }
    };

    const closeBetSlip = () => {
        setBetSlipDetails({});
        //setBetErrorMessage({});
        setDesktopSlip(false);
        setShow(false);
    };

    const clearBetSlip = () => {
        setBetErrorMessage({});
    };

    //place bet code start here....
    const placeBet = async (amount) => {
        setButtonShowLoaderShow(true);
        setBetButtonShow(false);
        betObj.amount = amount;
        betObj.catmid = eventDetails.cat_mid;
        betObj.game_type = eventDetails.game_type;
        betObj.is_virtual = 0;

        if (betObj.market_type === "digit" || betObj.market_type === "toss_fancy") {
            betObj.eventId = eventDetails.evt_id;
            betObj.price = betObj.odds;
        }

        if (
            betObj.market_type === "m" ||
            betObj.market_type === "ff" ||
            betObj.market_type === "evenodd" ||
            betObj.market_type === "digit" ||
            betObj.market_type === "f" ||
            betObj.market_type === "betfairfancy"
        ) {
            betObj.eventId = eventDetails.evt_id;
        }

        console.log("betObj->", betObj);
        //console.log("eventDetails->",eventDetails);
        try {
            const response = await axiosInstance.post("/bets", betObj);

            if (
                response.data !== undefined &&
                response.data !== null &&
                response.data.status !== undefined &&
                response.data.status !== null
            ) {
                let messageObj = {};
                if (response.data.status) {
                    messageObj.status = true;

                    if (betObj.market_type === "f") {
                        let betSid = betObj.sid;
                        await addSession(betSid, response.data.nlocka);
                        let sessionList = await getAllSession();
                        setBetPlaceSessionList(sessionList);
                    }

                    if (betObj.market_type === "evenodd") {
                        let sid = betObj.sid.$oid;
                        await addEvenOdd(sid, response.data.betDetails);
                        let evenOddList = await getAllEvenOddList();
                        setBetPlaceEvenOddList(evenOddList);
                    }

                    if (betObj.market_type === "digit") {
                        let sid = betObj.lastdigitid.$oid;
                        await addFigure(sid, response.data.betDetails);
                        let figureList = await getAllFigureist();
                        setBetPlaceFigureList(figureList);
                    }
                } else {
                    messageObj.status = false;
                }
                messageObj.message = response.data.message;
                setBetErrorMessage(messageObj);

                if (
                    eventDetails !== null &&
                    (Number(eventDetails.game_type) === 4 ||
                        Number(eventDetails.game_type) === 5)
                ) {
                    getHRGRBook(marketId);
                }

                if (
                    eventDetails !== null &&
                    (eventDetails.game_type === 1 ||
                        eventDetails.game_type === 2 ||
                        eventDetails.game_type === 3)
                ) {
                    getUserBookMatchOdd(marketId);
                }

                if (eventDetails !== null && eventDetails.game_type === 1) {
                    getBookForBookMaker(marketId);
                }

                if (
                    eventDetails !== null &&
                    eventDetails.game_type === 1 &&
                    betObj.market_type == "tie"
                ) {
                    getUserBookTie(getTieCatMid);
                }

                if (eventDetails !== null && eventDetails.game_type === 2) {
                    getUserFootballFancyBook(marketId);
                }

                getBetList(eventDetails.cat_mid);
                fetchUserData(); //balance update on top
                setShow(false);
                setButtonShowLoaderShow(false);
                setBetButtonShow(true);
            }
        } catch (error) {
            if (error.response.data !== undefined && error.response.data !== null) {
                if (
                    error.response.data.status !== undefined &&
                    error.response.data.status !== null &&
                    error.response.data.status === false
                ) {
                    let errorMessage = error.response.data.message;
                    let messageObj = {};
                    messageObj.status = false;
                    messageObj.message = errorMessage;
                    setBetErrorMessage(messageObj);
                    setButtonShowLoaderShow(false);
                    setBetButtonShow(true);
                }
            }
        }
    };

    const timeRemaining = (eventDate) => {
        //useEffect(() => {
        const interval = setInterval(() => {
            const startDate = moment(); // current time
            const endDate = moment(eventDate); // your target date

            const duration = moment.duration(endDate.diff(startDate));

            const days = Math.floor(duration.asDays());
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            setTimeLeft(`${hours}:${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(interval); // cleanup on unmount
        // }, []);
    };

    const showRulesPopup = () => { };

    const getBetList = async (marketId) => {
        const response = await axiosInstance.get("/markets/betlist/" + marketId);
        if (
            response.data !== null &&
            response.data.bets_list !== null &&
            response.data.bets_list !== undefined
        ) {
            setBetList(response.data.bets_list);
        }
    };

    const getUserBookMatchOdd = async (marketId) => {
        const response = await axiosInstance.post("/markets/book/" + marketId, {
            market_type: 1
        });
        if (
            response.data !== null &&
            response.data.liveStat !== null &&
            response.data.liveStat !== undefined
        ) {
            let matchOddBook = {};
            matchOddBook.rnr1s = response.data.liveStat?.rnr1s;
            matchOddBook.rnr2s = response.data.liveStat?.rnr2s;
            matchOddBook.rnr3s = response.data.liveStat?.rnr3s;
            setMatchOddBook(matchOddBook);
        }
    };

    const getUserBookTie = async (marketId) => {
        if (marketId != "" && marketId != undefined && marketId != null) {
            const response = await axiosInstance.post("/markets/book/" + marketId, {
                market_type: 5
            });
            if (
                response.data !== null &&
                response.data.liveStat !== null &&
                response.data.liveStat !== undefined
            ) {
                let tieBook = {};
                tieBook.rnr1s = response.data.liveStat?.rnr1s;
                tieBook.rnr2s = response.data.liveStat?.rnr2s;
                setTieBook(tieBook);
            }
        }
    };

    const getUserFootballFancyBook = async (marketId) => {
        const response = await axiosInstance.post("/markets/book/ff/" + marketId, {
            market_type: 6
        });

        if (
            response.data !== null &&
            response.data.lstBook !== null &&
            response.data.lstBook !== undefined
        ) {
            setFootballFancyBook(response.data.lstBook);
        }
    };

    const getBookForBookMaker = async (marketId) => {
        const response = await axiosInstance.post("/markets/book/" + marketId, {
            market_type: 2
        });
        if (
            response.data !== null &&
            response.data.liveStat !== null &&
            response.data.liveStat !== undefined
        ) {
            let bookMakerBook = {};
            bookMakerBook.rnr1s = response.data.liveStat?.rnr1s;
            bookMakerBook.rnr2s = response.data.liveStat?.rnr2s;
            bookMakerBook.rnr3s = response.data.liveStat?.rnr3s;
            setBookmakerBook(bookMakerBook);
        }
    };

    const getHRGRBook = async (marketId) => {
        const response = await axiosInstance.post(
            "/markets/hr-gr-book/" + marketId,
            { market_type: 1 }
        );
        if (
            response.data !== null &&
            response.data.book_list !== null &&
            response.data.book_list !== undefined
        ) {
            setHRGRBook(response.data.book_list);
            let bookMakerBook = {};
            bookMakerBook.rnr1s = response.data.liveStat?.rnr1s;
            bookMakerBook.rnr2s = response.data.liveStat?.rnr2s;
            bookMakerBook.rnr3s = response.data.liveStat?.rnr3s;
            setBookmakerBook(bookMakerBook);
        }
    };

    const getRelatedEvents = async (marketId) => {
        try {
            const response = await axiosInstance.get(
                "/markets/related-events/" + marketId
            );
            if (
                response.data !== null &&
                response.data.relatedEvents !== null &&
                response.data.relatedEvents !== undefined
            ) {
                let relatedEvents = response.data.relatedEvents;
                setRelatedEvents(relatedEvents);
            }
        } catch (error) {
            console.error("Error fetching single event:", error);
        }
    };

    const fetchEventsById = async (marketId) => {
        //console.log("Fetching Single event...");
        try {
            //ShowHideLoader(true);

            const response = await axiosInstance.get("/events/" + marketId);
            if (
                response.data !== null &&
                response.data.event !== null &&
                response.data.event !== undefined
            ) {
                setPageDisplaySetting(response.data.event[0]);

                let eventDetails = response.data.event[0];
                //console.log("eventDetails->",eventDetails);
                if (
                    eventDetails !== null &&
                    (Number(eventDetails.game_type) === 4 ||
                        Number(eventDetails.game_type) === 5)
                ) {
                    getHRGRBook(marketId);
                }

                if (
                    eventDetails !== null &&
                    (eventDetails.game_type == 1 ||
                        eventDetails.game_type == 2 ||
                        eventDetails.game_type == 3)
                ) {
                    getUserBookMatchOdd(marketId);
                }

                if (eventDetails !== null && eventDetails.game_type === 1) {
                    getBookForBookMaker(marketId);
                }

                if (eventDetails !== null && eventDetails.game_type === 1) {
                    getUserBookTie(eventDetails.tie_cat_mid);
                }

                if (eventDetails !== null && eventDetails.game_type === 2) {
                    getUserFootballFancyBook(marketId);
                }

                getBetList(marketId);

                let sessionList = await getAllSession();
                setBetPlaceSessionList(sessionList);

                let evenOddList = await getAllEvenOddList();
                setBetPlaceEvenOddList(evenOddList);

                let getFigureList = await getAllFigureist();
                setBetPlaceFigureList(getFigureList);
            }
            //console.log(response.data); // single event data
        } catch (error) {
            console.error("Error fetching single event:", error);
        }
    };

    const fetchProfile = async () => {
        try {
            const { data } = await axiosInstance.get("/profile");
            setStakeList({
                stake1: data.stake1,
                stake2: data.stake2,
                stake3: data.stake3,
                stake4: data.stake4,
                stake5: data.stake5,
                stake6: data.stake6,
                stake7: data.stake7,
                stake8: data.stake8
            });
        } catch (error) {
            console.error("Failed to load profile data:", error);
        }
    };

    //Get Event Details By CatMid
    useEffect(() => {
        fetchEventsById(marketId);
        getRelatedEvents(marketId);
        fetchProfile();
    }, []); // Empty dependency array

    useEffect(() => {
        if (!marketId) return;
        const loadMarketFancySnapshot = async () => {
            try {
                const marketRes = await axiosInstance.get("/markets/" + marketId);
                if (
                    marketRes.data != null &&
                    marketRes.data.fancy != null &&
                    marketRes.data.fancy !== ""
                ) {
                    setRestFancyData(marketRes.data.fancy);
                }
            } catch (err) {
                console.error("Error fetching market snapshot:", err);
            }
        };
        loadMarketFancySnapshot();
    }, [marketId]);

    const fetchUserData = async () => {
        //console.log("Fetching events...");
        try {
            const response = await axiosInstance.get("/user");
            //console.log("user-response->",response);
            if (response.data !== "") {
                await dispatch(setUserData(response.data));
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    if (data !== null && data.data !== null && data.data !== undefined) {
        if (data.data.odds !== null && data.data.odds !== undefined) {
            //if (data?.odds) {
            matchOdds = data.data.odds;
            //console.log("bf_fancy_on->", matchOdds.bf_fancy_on);
            inplay = matchOdds.inplay;
            is_bm_on = matchOdds.is_bm_on;
            fancy = matchOdds.fancy;
            toss = matchOdds.toss_on;
            tie = matchOdds.tie_on;
            betfairfancy = matchOdds.bf_fancy_on;
            figure = matchOdds.figure;
            evenodd = matchOdds.evenodd;
            game_type = matchOdds.game_type;
            tie_cat_mid = matchOdds.tie_cat_mid;

            //fancy on/off
            if (!fancy) {
                let findFancyIndex = activeMarketList.indexOf("fancy2");
                if (findFancyIndex >= 0) {
                    activeMarketList.splice(findFancyIndex, 1);
                }
            } else {
                let findFancyIndex = activeMarketList.indexOf("fancy2");
                if (findFancyIndex < 0) {
                    activeMarketList.push("fancy2");
                }
            }

            //betfair fancy on/off
            if (!betfairfancy) {
                let findBFFancyIndex = activeMarketList.indexOf("fancy");
                if (findBFFancyIndex >= 0) {
                    activeMarketList.splice(findBFFancyIndex, 1);
                }
            } else {
                let findBFFancyIndex = activeMarketList.indexOf("fancy");
                if (findBFFancyIndex < 0) {
                    activeMarketList.push("fancy");
                }
            }

            //toss on/off
            if (inplay) {
                let findTossIndex = activeMarketList.indexOf("toss");
                if (findTossIndex >= 0) {
                    activeMarketList.splice(findTossIndex, 1);
                }
            } else {
                if (!toss) {
                    let findTossIndex = activeMarketList.indexOf("toss");
                    if (findTossIndex >= 0) {
                        activeMarketList.splice(findTossIndex, 1);
                    }
                } else {
                    let findTossIndex = activeMarketList.indexOf("toss");
                    if (findTossIndex < 0) {
                        activeMarketList.push("toss");
                    }
                }
            }

            //bookmaker on/off
            if (!is_bm_on) {
                let findBookmakerIndex = activeMarketList.indexOf("bookmaker");
                if (findBookmakerIndex >= 0) {
                    activeMarketList.splice(findBookmakerIndex, 1);
                }
            } else {
                let findBookmakerIndex = activeMarketList.indexOf("bookmaker");
                if (findBookmakerIndex < 0) {
                    activeMarketList.push("bookmaker");
                }
            }

            //tie on/off
            if (!tie) {
                let findTieIndex = activeMarketList.indexOf("tie");
                if (findTieIndex >= 0) {
                    activeMarketList.splice(findTieIndex, 1);
                }
            } else {
                let findTieIndex = activeMarketList.indexOf("tie");
                if (findTieIndex < 0) {
                    activeMarketList.push("tie");
                }
            }

            //evenodd
            if (!evenodd) {
                let findEvenOddIndex = activeMarketList.indexOf("even_odd");
                if (findEvenOddIndex >= 0) {
                    activeMarketList.splice(findEvenOddIndex, 1);
                }
            } else {
                let findEvenOddIndex = activeMarketList.indexOf("even_odd");
                if (findEvenOddIndex < 0) {
                    activeMarketList.push("even_odd");
                }
            }

            //figure
            if (!figure) {
                let findFigureIndex = activeMarketList.indexOf("other");
                if (findFigureIndex >= 0) {
                    activeMarketList.splice(findFigureIndex, 1);
                }
            } else {
                let findFigureIndex = activeMarketList.indexOf("other");
                if (findFigureIndex < 0) {
                    activeMarketList.push("other");
                }
            }

            //console.log("activeMarketList->",activeMarketList);
        }

        if (data.data.bookmaker !== null && data.data.bookmaker !== undefined) {
            bookmakerOdds = data.data.bookmaker;
        }

        if (
            data.data.betfairFancy !== null &&
            data.data.betfairFancy !== undefined
        ) {
            betfairFancyData = data.data.betfairFancy;
        }

        if (inplay === 0) {
            if (data.data.toss !== null && data.data.toss !== undefined) {
                tossData = data.data.toss;
            }
        }

        if (data.data.fancy !== null && data.data.fancy !== undefined) {
            fancyData = data.data.fancy;
        }

        if (inplay === 0 || inplay === 1) {
            if (data.data.tiedds !== null && data.data.tiedds !== undefined) {
                tieData = data.data.tiedds;
            } else {
                //console.log("tieData not found....",tieData);
            }

            if (
                data.data.evenodddata !== null &&
                data.data.evenodddata !== undefined
            ) {
                evenodddata = data.data.evenodddata;
            }

            if (data.data.figuredata !== null && data.data.figuredata !== undefined) {
                figuredata = data.data.figuredata;
            }

            if (
                data.data.footballFancy !== null &&
                data.data.footballFancy !== undefined
            ) {
                footballFancy = data.data.footballFancy;
            }

            if (
                data.data.fancyScoreBoard !== null &&
                data.data.fancyScoreBoard !== undefined
            ) {
                scoreboardData = data.data.fancyScoreBoard;
            }
        }
    }

    const fancyDataForUI =
        Array.isArray(fancyData) && fancyData.length > 0
            ? fancyData
            : Array.isArray(restFancyData) && restFancyData.length > 0
                ? restFancyData
                : fancyData;

    const showSessionFancySection =
        GameType === 1 &&
        (activeMarketList.includes("fancy2") ||
            Number(eventDetails?.fancy) > 0 ||
            (Array.isArray(restFancyData) && restFancyData.length > 0));

    const deleteAllTables = async () => {
        //deletAllTables();
        let evenOddList = await getAllEvenOddList();
        let figureList = await getAllFigureist();
        //debugger;
    };

    console.log("FULL matchOdds object:", matchOdds);
    console.log("FULL FANCY object:", fancyData);
    console.log("GAME TYPE:", matchOdds?.game_type);
    console.log("FANCY FLAG:", matchOdds?.fancy);
    console.log("ACTIVE MARKETS:", activeMarketList);

    console.log("isMobile:", isMobile);
    console.log("eventDetails:", eventDetails);

    return (
        <ClientLayout>

            <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-8" style={{ paddingRight: "5px" }}>
                    <div style={{ display: activeTab === "all" && GameType !== 4 && GameType !== 5 ? "block" : "none" }}>
                        {GameType === 1 || GameType === 2 || GameType === 3 ? (
                            <MatchOdd
                                onChildRuleShow={showRulesPopup}
                                eventDetails={eventDetails}
                                matchOdds={matchOdds}
                                setBetSlipDetails={setBetSlipParent}
                                matchOddBook={matchOddBook}
                            ></MatchOdd>
                        ) : (
                            ""
                        )}
                    </div>
                    <div style={{ display: activeMarketList.includes("bookmaker") && GameType === 1 ? "block" : "none" }}>
                        <div className="table-box-body"
                            style={{ display: (activeTab === "all" || activeTab === "bookmaker") && GameType === 1 ? "block" : "none" }}>
                            {GameType === 1 ? (
                                <Bookmaker
                                    onChildRuleShow={showRulesPopup}
                                    eventDetails={eventDetails}
                                    bookmakerOdds={bookmakerOdds}
                                    setBetSlipDetails={setBetSlipParent}
                                    bookmakerBook={bookmakerBook}
                                ></Bookmaker>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    <div style={{ display: activeMarketList.includes("fancy") && GameType === 1 ? "block" : "none" }}>
                        <div className="table-box-body"
                            style={{ display: (activeTab === "all" || activeTab === "fancy") && GameType === 1 ? "block" : "none" }}>
                            {GameType === 1 ? (
                                <BetfairFancy
                                    eventDetails={eventDetails}
                                    betfairFancyData={betfairFancyData}
                                    setBetSlipDetails={setBetSlipParent}
                                ></BetfairFancy>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    <div style={{ display: showSessionFancySection ? "block" : "none" }}>
                        <div className="table-box-body" style={{ display: (activeTab === "all" || activeTab === "fancy2") && GameType === 1 ? "block" : "none" }} >
                            {GameType === 1 ? (
                                <Fancy
                                    eventDetails={eventDetails}
                                    fancyData={fancyDataForUI}
                                    setBetSlipDetails={setBetSlipParent}
                                    getBetPlaceSessionList={getBetPlaceSessionList}
                                ></Fancy>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                    <div style={{ display: activeTab === "all" && GameType === 2 ? "block" : "none" }}>
                        {GameType === 2 ? (
                            <UnderOverGoals
                                footballFancyData={footballFancy}
                                footballFancyBook={footballFancyBook}
                                setBetSlipDetails={setBetSlipParent}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-4">
                    <div className="panel-group " id="accordion2" role="tablist" aria-multiselectable="true" aria-expanded="false">
                        <div className="panel panel-default ">
                            <div className=" ">
                                <h4 className="panel-title live-tv-heading">
                                    <span style={{ marginLeft: "10px", fontWeight: "700" }}>Live TV</span>
                                    <span className="live-tv-toggle">
                                        <label for="toggleLiveTV" className="switch">
                                            <input type="checkbox" id="toggleLiveTV" aria-expanded="false" />
                                            <span className="slider round"></span>
                                        </label>
                                    </span>
                                </h4>
                            </div>
                            <div id="LiveTV" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <input type="hidden" id="myFrameURL" value="https://5por-tt1.top/getscore.php?chid=7104" />
                                    <iframe src="../../../../#" id="ContentPlaceHolder1_myFrame1" style={{ width: "100%", height: "250px" }} className="sc-dUjcNx eLUYUT"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="font-16 betslipbox nopadding">
                        <div id="divBet" className="compose">
                            <div className="panel panel-alert panel-border top" id="Betslip" style={{
                                userSelect: "text"
                            }} >
                                <div className="panel-heading">
                                    <a href="#" className="text-left setBetSlipHeader pull-left" style={{ fontWeight: "700" }}>Place Bet</a>
                                    <a className="btn btn-xs btn-default no-margin pull-right " href="#">Change Button Value</a>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div id="ContentPlaceHolder1_UpdateProgress1" style={{ display: "none" }} role="status" aria-hidden="true">

                        <div className="modalload">
                            <div className="center">
                                <img alt="" src="/images/loader.gif" />
                            </div>
                        </div>

                    </div>
                    <div className="font-16 betslipbox nopadding">
                        <div id="divBet" className="compose">
                            <div id="divMarketBetPanel">
                                <div id="MarketBackBetPanel" style={{ display: Object.keys(betObj).length ? "block" : "none" }}>
                                    <table className="table table-placebet no-margin">
                                        <thead style={{ userSelect: "text" }}>
                                            <tr className="clsBackTr" id="placebet" style={{ userSelect: "text" }}>
                                                <th style={{ width: "50%", textAlign: "left", color: "#000" }}>Bet For</th>
                                                <th style={{ width: "25%", textAlign: "center", color: "#000" }}>Odds</th>
                                                <th style={{ width: "25%", textAlign: "center", color: "#000" }}>Stake</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tblBackBetSlip">

                                            <tr className="inputs betDetail">
                                                {/* Bet For */}
                                                <td style={{ width: "50%", fontWeight: "600" }}>
                                                    {betObj?.bet_type === "B" ? "Back" : "Lay"} : {betObj?.runnername || ""}
                                                </td>

                                                {/* Odds */}
                                                <td style={{ width: "25%", textAlign: "center" }}>
                                                    <input
                                                        value={betObj?.odds || ""}
                                                        readOnly
                                                        className="form-control"
                                                        style={{ width: "70%", margin: "0 auto" }}
                                                    />
                                                </td>

                                                {/* Stake */}
                                                <td style={{ width: "25%", textAlign: "center" }}>
                                                    <input
                                                        value={slipStake}
                                                        onChange={(e) => setSlipStake(e.target.value)}
                                                        className="form-control"
                                                        style={{ width: "70%", margin: "0 auto" }}
                                                    />
                                                </td>
                                            </tr>

                                            <tr className="inputs betDetail">
                                                <td colspan="3" style={{ padding: 0 }}>
                                                    <div className="bottom-margin-3px">
                                                        <div data-ng-show="showBetslip">
                                                            <div className="total_stake">
                                                                <div style={{ width: "100%", padding: 0, margin: 0 }}>
                                                                    <div className="stake-grid" style={{ width: "100%" }}>
                                                                        {[100, 200, 500, 1000].map((amt) => (
                                                                            <button
                                                                                key={amt}
                                                                                onClick={() => setSlipStake(amt)}
                                                                                className="stake-btn"
                                                                            >
                                                                                {amt}
                                                                            </button>
                                                                        ))}

                                                                        {[5000, 10000, 20000, 25000].map((amt) => (
                                                                            <button
                                                                                key={amt}
                                                                                onClick={() => setSlipStake((prev) => Number(prev || 0) + amt)}
                                                                                className="stake-btn"
                                                                            >
                                                                                +{amt}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="inputs betDetail">
                                                <td colSpan="3" className="col-xs-12 col-md-12">
                                                    <div
                                                        id="ContentPlaceHolder1_upPanaelnew"
                                                        style={{
                                                            display: "flex",
                                                            gap: "10px",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <button
                                                            className="btn btn-md btn-success bet_btn text-uppercase"
                                                            onClick={() => {
                                                                const amt = Number(slipStake || 0);
                                                                if (!amt) return;

                                                                placeBet(amt);
                                                                setSlipStake("");
                                                            }}
                                                        >
                                                            Place Bet
                                                        </button>

                                                        <button
                                                            className="btn btn-md btn-danger text-uppercase"
                                                            onClick={() => {
                                                                setBetSlipDetails({});
                                                                setDesktopSlip(false);
                                                                setSlipStake("");
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                            <div id="ContentPlaceHolder1_UpdatePanel1" className="col-sm-">

                                <div className="betHistorydata">
                                    <div className="panel-group" id="accordion">

                                        <div className="panel panel-default">
                                            <div className="panel-heading"><h4 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Matched Bet</a></h4></div>
                                            <div id="collapseOne" className="panel-collapse collapse in">
                                                <div className="panel-body">

                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel panel-default">
                                            <div claclassNamess="panel-heading">
                                                <h4 className="panel-title">
                                                    <a claclassNamess="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Fancy Bet</a>
                                                </h4>
                                            </div>
                                            <div id="collapseTwo" className="panel-collapse collapse in">
                                                <div className="panel-body">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel panel-default">
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                    tr.inputs.betDetail .btn {
                        width: auto !important;
                        border: 2px solid #424242 !important;
                        font-weight: bold;
                        font-size: 14px;
                        border-radius: 5px;
                        float: none !important;
                    }
                        .stake-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-top: 10px;
  }

  .stake-btn {
  width: 100%;
    padding: 10px;
    background: #e5e5e5;
    border: none;
    font-weight: 600;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }

  .stake-btn:hover {
    background: #d0d0d0;
  }
    td {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .stake-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .stake-btn {
    width: 100%;
  }
                `}
            </style>
        </ClientLayout >
    );
}

