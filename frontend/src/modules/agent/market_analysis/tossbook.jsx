import AgentLayout from "../components/AgentLayout";
import "../../../assets/css/style.css";

export default function TossBook() {
    return (
        <AgentLayout>
            <div class="head" style={{ display: "inline-block" }}>
                <div class="main-bar panel-heading-toss">
                    <h3><i class=" fa fa-book"></i>&nbsp;Toss Book
                        <span id="ContentPlaceHolder1_lbl_Match">Dhaka Capitals v Noakhali Express</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="matchbook" class="btn btn-success btn-xs btn-book">Match Book</a>
                    </h3>
                </div>
            </div>

            <div class="section_book">
                <div class="col-lg-3 col-md-3 col-sm-3">
                    <div id="ContentPlaceHolder1_panel_clear" class="addtherepist">
                        <div class="betHistorydata">
                            <div class="panel panel-alert panel-border top" id="sessionHistory" style={{ userSelect: "text" }}>
                                <div class="panel-heading" style={{ userSelect: "text" }}>
                                    <span class="textalign-left no-border-radius setBetSlipHeader no-margin" style={{ fontWeight: "700" }}>Total Points </span>
                                </div>
                            </div>

                            <div class="bidhistorywrp grid_shadow">
                                <table class="tbl_history table-toss">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th style={{ textAlign: "left" }}>Dhaka Capitals</th>
                                            <th>Noakhali Express</th>
                                            <th> </th>
                                        </tr>
                                    </thead>
                                    <tbody class="tblPoints">
                                    </tbody>
                                </table>
                            </div>
                        </div>


                    </div>
                </div>
                <div class="col-lg-5 col-md-5 col-sm-5">
                    <div class="grid_shadow">
                        <table class="table table-bordered table-toss">
                            <thead>
                                <tr>
                                    <th style={{ width: "70px" }}>Match</th>
                                    <th style={{ width: "70px" }}>Winner</th>
                                    <th style={{ width: "70px" }}>Bets</th>
                                    <th style={{ width: "70px" }}>Profit/Loss</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="col-lg-4 col-md-4 col-sm-4">
                    <div class="betHistorydata">

                        <div class="panel panel-alert panel-border top" style={{ userSelect: "text" }}>
                            <div class="panel-heading" style={{ userSelect: "text" }}><span class="textalign-left no-border-radius setBetSlipHeader no-margin" style={{ fontWeight: "700", padding: "10px" }}>Toss Bet</span></div>
                        </div>
                        <div class="bidhistorywrp grid_shadow">
                            <table class="tbl_history table table-toss">
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>User</th>
                                        <th>Odds</th>
                                        <th>Stake</th>
                                        <th>Team</th>
                                        <th>Date</th>
                                    </tr></thead>
                                <tbody class="tblmatchbet"></tbody>

                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}