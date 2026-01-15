import { useState } from "react";
import AgentLayout from "../components/AgentLayout";
import "../../../assets/css/style.css";
import Totalbook from "../market_analysis/totalbook";

export default function MatchMain() {
    const [matchStatus, setMatchStatus] = useState("running");
    const [matchOpen, setMatchOpen] = useState(false);
    const [sessionOpen, setSessionOpen] = useState(false);
    const [showTotalBook, setShowTotalBook] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState(null);


    {/*const openTotalBook = (url) => {
        document.getElementById("totalBookFrame").src = url;
        window.$("#totalBookModal").modal("show"); // Bootstrap modal
    };*/}

    const openTotalBook = (mid) => {
        setSelectedMatchId(mid);
        setShowTotalBook(true);
    };
    const closeTotalBook = () => {
        setShowTotalBook(false);
        setSelectedMatchId(null);
    };
    return (
        <AgentLayout>
            <div class="head" style={{ display: "inline-block" }}>
                <div class="main-bar">
                    <h3 style={{ color: "#696969", fontSize: "23px" }}><i class="fa fa-shield"></i>&nbsp; <b>All Matches</b></h3>
                </div>
            </div>
            <br></br>
            <div class="col-sm-12">
                <div id="vtab" class="order-tabs">
                    <ul>
                        <li><a href="Match.aspx?eventType=4" ><span> <img src="https://betmax.gold/images/cricket.png" class="spicons" /> Cricket</span></a></li>
                        <li><a href="Match.aspx?eventType=1"><span><img src="https://betmax.gold/images/football.png" class="spicons" /> Soccer</span></a></li>
                        <li><a href="Match.aspx?eventType=2"><span><img src="https://betmax.gold/images/tennis.png" class="spicons" /> Tennis</span></a></li>
                        <li><a href="Match.aspx?eventType=7522"><span><img src="../images/basketball.png" class="spicons" /> BasketBall</span></a></li>
                        <li><a href="Match.aspx?eventType=5"><span>T20</span></a></li>
                        <li><a href="Match.aspx?eventType=6"><span>OneDay</span></a></li>
                        <li><a href="Match.aspx?eventType=900"><span> Lucky7</span></a></li>
                        <li><a href="Match.aspx?eventType=500"><span> DT</span></a></li>
                        <li><a href="Match.aspx?eventType=700"><span> Poker</span></a></li>
                    </ul>
                </div>
            </div>
            <div id="content">
                <div class="outer">
                    <div class="inner bg-light lter">
                        <div class="box">

                            <div class="col-sm-12">
                                <div class="styled-checkbox wrapcheck">
                                    <table id="ContentPlaceHolder1_RadioButtonList1">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input id="running" type="radio" name="matchStatus" value="running" checked={matchStatus === "running"} onChange={(e) => setMatchStatus(e.target.value)} /><label htmlFor="running">Running Matches</label>
                                                </td>
                                                <td>
                                                    <input id="suspended" type="radio" name="matchStatus" value="suspended" checked={matchStatus === "suspended"} onChange={(e) => setMatchStatus(e.target.value)} /><label htmlFor="suspended">Suspended Matches</label>
                                                </td>
                                                <td>
                                                    <input id="completed" type="radio" name="matchStatus" value="completed" checked={matchStatus === "completed"} onChange={(e) => setMatchStatus(e.target.value)} /><label htmlFor="completed">Completed Matches</label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="scrool">
                                <div id="collapse2" class="body">
                                    <div>
                                        <table class="table ss table-bordered table-condensed table-hover table-striped" cellspacing="0" rules="all" border="1" id="ContentPlaceHolder1_dataTable" style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                                            <colgroup>
                                                <col style={{ width: "60px" }} />     {/* Id */}
                                                <col style={{ width: "280px" }} />    {/* Match */}
                                                <col style={{ width: "150px" }} />    {/* OpenDate */}
                                                <col style={{ width: "160px" }} />    {/* Match | Session */}
                                                <col style={{ width: "150px" }} />    {/* Result */}
                                                <col style={{ width: "120px" }} />    {/* Match Book */}
                                                <col style={{ width: "120px" }} />    {/* Toss Book */}
                                                <col style={{ width: "120px" }} />    {/* Total Book */}
                                                <col style={{ width: "160px" }} />    {/* Client P/L */}
                                            </colgroup>
                                            <tbody>
                                                <tr style={{ backgroundColor: "black", color: "white", fontSize: "13px", padding: "3px 5px", fontWeight: "bold", textAlign: "center" }}>
                                                    <th scope="col" style={{ fontWeight: "inherit" }}>Id</th><th scope="col" style={{ fontWeight: "inherit" }}>Match</th><th scope="col" style={{ fontWeight: "inherit" }}>OpenDate</th><th scope="col" style={{ fontWeight: "inherit" }}>Match | Session</th><th scope="col" style={{ fontWeight: "inherit" }}>Result</th><th scope="col" style={{ fontWeight: "inherit" }}>Match Book</th><th scope="col" style={{ fontWeight: "inherit" }}>Toss Book</th><th scope="col" style={{ fontWeight: "inherit" }}>Total Book</th><th scope="col" style={{ fontWeight: "inherit" }}>Client Profit/Loss</th>
                                                </tr>
                                                <tr>
                                                    <td>32125</td>
                                                    <td>
                                                        <span class="font-11 match-text" style={{ overflow: "hidden", display: "block" }}>
                                                            Cricket / MI Emirates v Abu Dhabi Knight Riders / International League T20
                                                        </span>
                                                    </td>
                                                    <td>1/2/2026 7:30:00 PM</td>
                                                    <td className="text-center">
                                                        <span></span>
                                                        <a id="ContentPlaceHolder1_dataTable_lnkmatch_0" class=" btn-success btn-xs" style={{ borderRadius: "2px", borderColor: "#4cae4c" }} onClick={(e) => {
                                                            e.preventDefault(); setMatchOpen(!matchOpen);
                                                        }}><b>{matchOpen ? "Closed" : "Open"}</b></a>
                                                        <a id="ContentPlaceHolder1_dataTable_lnksession_0" class=" btn-success btn-xs" style={{ borderRadius: "2px", borderColor: "#4cae4c" }} onClick={(e) => {
                                                            e.preventDefault(); setSessionOpen(!sessionOpen);
                                                        }}><b>{sessionOpen ? "Closed" : "Open"}</b></a>
                                                    </td>
                                                    <td>
                                                        <span id="ContentPlaceHolder1_dataTable_lbl_result_0" class="red">Match Running</span>
                                                    </td>
                                                    <td>
                                                        <a href="matchbook" class="btn-success btn-xs" style={{ borderRadius: "2px", borderColor: "#4cae4c" }}><b>Match Book</b></a>
                                                    </td>
                                                    <td>
                                                        <a href="tossbook" class=" btn-success btn-xs" style={{ borderRadius: "2px", borderColor: "#4cae4c" }}><b>Toss Book</b></a>
                                                    </td>
                                                    <td>
                                                        <a href="#" class=" btn-success btn-xs" style={{ borderRadius: "2px", borderColor: "#4cae4c" }} onClick={(e) => {
                                                            e.preventDefault(); openTotalBook(32125);
                                                        }}><b>Total Book</b></a>
                                                    </td>
                                                    <td>
                                                        <a href="clientpl" class=" btn-success btn-xs" style={{ borderRadius: "2px", borderColor: "#4cae4c" }}><b>Client Profit Loss</b></a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>



                                        <div class="modal fade" id="totalBookModal" tabindex="-1">
                                            <div class="modal-dialog modal-lg">
                                                <div class="modal-content">

                                                    <div class="modal-header">
                                                        <h4 class="modal-title">Total Book</h4>
                                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                    </div>

                                                    <div class="modal-body" style={{ padding: "0" }}>
                                                        <iframe
                                                            id="totalBookFrame"
                                                            src=""
                                                            style={{ width: "100%", height: "500px", border: "none" }}>
                                                        </iframe>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>




                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Totalbook
                isOpen={showTotalBook}
                onClose={closeTotalBook}
                matchId={selectedMatchId}
            />

        </AgentLayout>
    );
}

