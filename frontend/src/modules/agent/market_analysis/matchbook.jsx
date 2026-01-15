import AgentLayout from "../components/AgentLayout";
import "../../../assets/css/style.css";

export default function MatchBook() {
    return (
        <AgentLayout>

            <div class="section_book row">
                <div class="col-sm-12">
                    <div class="panel-heading-matchbook">
                        <span>Chattogram Royals v Rajshahi Warriors</span>
                        &nbsp;&nbsp;&nbsp;
                    </div>
                </div>

                <div class="col-sm-3">
                    <div class="matchbook-wrapper">
                        <div class="top-heading-matchbook">
                            Total Points
                        </div>

                        <table class="tbl_history table-bordered table-striped table-matchbook ">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Chattogram Royals</th>
                                    <th> Rajshahi Warriors</th>
                                    <th>The Draw</th>
                                </tr>
                            </thead>
                            <tbody class="tblPoints">
                                <tr class="stuspointheading header-matchbook">
                                    <td style={{ fontWeight: "700", padding: "2px 6px" }}>Total point</td>
                                    <td class="text-center">
                                        <span id="point1"></span></td>
                                    <td class="text-center">
                                        <span id="point2"></span></td>
                                    <td class="text-center">
                                        <span id="point33"></span></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h5 style={{ color: "#696969" }}>Session Pre-Book</h5>
                        <div class="dvprebook">
                            <div class="accordion md-accordion" id="acprebook" role="tablist" aria-multiselectable="false">
                            </div>
                        </div>
                    </div>
                </div>

                {/**/}
                <div class="col-sm-5">
                    <div class="matchbook-wrapper" >
                        <input type="hidden" name="HiddenFTRate_L1" id="HiddenFTRate_L1" />
                        <input type="hidden" name="HiddenFTRate_K1" id="HiddenFTRate_K1" />
                        <input type="hidden" name="HiddenSTRate_L1" id="HiddenSTRate_L1" />
                        <input type="hidden" name="HiddenSTRate_K1" id="HiddenSTRate_K1" />
                        <div class="">
                            <div class="top-heading-matchbook">
                                Match Odds&nbsp;&nbsp;
                                <div class="cur-dt ng-binding">
                                    <a class="btn btn-xs btn-default btn-refresh" href="">Refresh</a>
                                </div>
                            </div>
                            <iframe src="https://scapi.betproex.com/home/sc2/35128277" style={{ width: "100%" }} class="sc-dUjcNx eLUYUT"></iframe>


                            <div class="box-heading " style={{ display: "none" }}>
                                <div class="clearfix ng-binding ">
                                    <div class="row ">
                                        <div class="col-xs-8 ">
                                            <span id="ContentPlaceHolder1_lbl_Team1">Chattogram Royals</span>
                                            <div class="clearfix"></div>
                                            <span id="ContentPlaceHolder1_lbl_Team2">Rajshahi Warriors</span>
                                        </div>
                                        <div class="col-xs-4">
                                            <span id="scoreA" class="pull-right"></span>
                                            <div class="clearfix"></div>
                                            <span id="scoreB" class="pull-right"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-group" id="accordion2" role="tablist" aria-multiselectable="true">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4 class="panel-title">
                                            <a class="accordion-toggle collapsed " href="#" >Live TV</a>
                                        </h4>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="dataTables_wrapper">
                            <div class="csslayer" id="divmarketoverlayer">Market Suspened</div>
                            <table class="table table-bordered table_marketData tbl_mrktData ">
                                <thead>
                                    <tr class="">
                                        <th class="rowborder" style={{ color: "black" }}>&nbsp;&nbsp;&nbsp;RUNNER</th>
                                        <th colspan="2" class="hidden-sm hidden-xs"></th>
                                        <th class="text-center bakLayTd"><span class="tt_theadL tt_thead">BACK</span></th>
                                        <th class="text-center bakLayTd"><span class="tt_theadK tt_thead">LAY</span></th>
                                        <th colspan="2" class="hidden-sm hidden-xs"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="rowkh">
                                        <td class="text-left ">
                                            <span id="ContentPlaceHolder1_t1" style={{ color: "black", fontWeight: "600", color: "#000", fontSize: "13px" }}>Chattogram Royals</span>
                                            {/*<div class="statusstack">
                                                <span id="ContentPlaceHolder1_Label2" ></span>
                                            </div>
                                            <div class="statusstack">
                                                <span id="ContentPlaceHolder1_tbr1"></span>
                                            </div>*/}
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpanel"><span id="FTRate_K3">0</span><span id="FTRate_KS3" class="backsize_1 laysize">0</span></div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpanel"><span id="FTRate_K2">0</span><span id="FTRate_KS2" class="backsize_1 laysize">0</span></div>
                                        </td>
                                        <td class="ratetd">
                                            <div class="showpanel" style={{ background: "rgb(174, 219, 251)" }}>
                                                <a href="javascript:void(0)" id="FTRate_L1" class="betpricelive">0</a><span id="FTRate_LS1" class="backsize_1 laysize">0</span>
                                            </div>
                                        </td>
                                        <td class="ratetd">
                                            <div class="showpanel" style={{ background: "rgb(255, 202, 213)" }}>
                                                <a href="javascript:void(0)" id="FTRate_K1" class="betpricelive">0</a><span id="FTRate_KS1" class="laysize_1 laysize">0</span>
                                            </div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpanel"><span id="FTRate_L2">0</span><span id="FTRate_LS2" class="laysize_1 laysize">0</span></div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpanel"><span id="FTRate_L3">0</span><span id="FTRate_LS3" class="laysize_1 laysize">0</span></div>
                                        </td>
                                    </tr>
                                    <tr class="rowkh">
                                        <td class="text-left">
                                            <span id="ContentPlaceHolder1_t2" style={{ color: "black", fontWeight: "600", color: "#000", fontSize: "13px" }}>Rajshahi Warriors</span>
                                            <div class="clearfix"></div>
                                            {/*<div class="statusstack">
                                                <span id="ContentPlaceHolder1_Label4"></span>
                                            </div>
                                            <div class="statusstack">
                                                <span id="ContentPlaceHolder1_tbr2"></span>
                                            </div>*/}
                                        </td>

                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpanel"><span id="STRate_K3">0</span><span id="STRate_KS3" class="backsize_1 laysize">0</span></div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpanel"><span id="STRate_K2">0</span><span id="STRate_KS2" class="backsize_1 laysize">0</span></div>
                                        </td>
                                        <td class="ratetd">
                                            <div class="showpanel" style={{ background: "rgb(174, 219, 251)" }}>
                                                <a href="javascript:void(0)" id="STRate_L1" class="betpricelive">0</a><span id="STRate_LS1" class="backsize_1 laysize">0</span>
                                            </div>
                                        </td>
                                        <td class="ratetd">
                                            <div class="showpanel" style={{ background: "rgb(255, 202, 213)" }}><a href="javascript:void(0)" id="STRate_K1" class="betpricelive">0</a><span id="STRate_KS1" class="laysize_1 laysize">0</span></div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpanel"><span id="STRate_L2">0</span><span id="STRate_LS2" class="laysize_1 laysize">0</span></div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpanel"><span id="STRate_L3">0</span><span id="STRate_LS3" class="laysize_1 laysize">0</span></div>
                                        </td>
                                    </tr>
                                    <tr class="rowkh" id="draw" style={{ display: "none" }}>
                                        <td class="text-left">
                                            <div class="txt_mtc">
                                                <span id="ContentPlaceHolder1_team03">Draw</span><div class="clearfix"></div>
                                                <div class="statusstack">
                                                    <span id="ContentPlaceHolder1_lbl_point3"></span></div>
                                            </div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpaneel"><span id="DRate_K3"></span><span id="DRate_KS3" class="backsize_1 laysize"></span></div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpaneel"><span id="DRate_K2"></span><span id="DRate_KS2" class="backsize_1 laysize"></span></div>
                                        </td>
                                        <td class="ratetd">
                                            <div class="showpanel"><a href="javascript:void(0)" id="DRate_K1" class="betpricelive"></a><span id="DRate_KS1" class="backsize_1 laysize"></span></div>
                                        </td>
                                        <td class="ratetd">
                                            <div class="showpanel"><span id="DRate_L1"></span><span id="DRate_LS2" class="laysize_1 laysize"></span></div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpaneel"><a href="javascript:void(0)" id="DRate_L1" class="betpricelive"></a><span id="DRate_KS1" class="laysize_1 laysize"></span></div>
                                        </td>
                                        <td class="hidden-sm hidden-xs ratetd">
                                            <div class="showpaneel"><span id="DRate_L3"></span><span id="DRate_LS3" class="laysize_1 laysize"></span></div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="grid_shadow mt10">
                        <div id="as">
                            <table id="fancyoverlay" class="table table-bordered table_marketData tbl_mrktData">
                                <thead>
                                    <tr class="" style={{ backgroundColor: "#f7f7f7" }}>
                                        <th class="rowborder" style={{ color: "#000" }}>SESSION
                                        </th>
                                        <th colspan="2" class="hidden-sm hidden-xs"></th>
                                        <th class="text-center bakLayTd"><span class="tt_theadK tt_thead">NOT</span></th>
                                        <th class="text-center bakLayTd"><span class="tt_theadL tt_thead">YES</span></th>
                                        <th colspan="2" class="hidden-sm hidden-xs"></th>
                                    </tr>
                                </thead>
                                <tbody class="sessiondata" id="sData">
                                    <tr class="rowkh rowkh-matchbook" id="17overruncr">
                                        <td>17 over run CR</td>
                                        <td colspan="2" class="hidden-sm hidden-xs ratetd bg-none">
                                            <span class=""></span>
                                        </td>
                                        <td class="fancylay" id="fancylay17overruncr">
                                            <a class="lay bidsessionbx" href="javascript:void(0)" id="17overruncr" >105<span class="sizeitem">100</span>
                                            </a>
                                        </td>
                                        <td class="fancyback" id="fancyback17overruncr">
                                            <a class="back bidsessionbx" href="javascript:void(0)" id="17overruncr" line="106" data-matchid="17overruncr" name="17 over run CR" data-status="" size="100" data-type="YES" onclick="setSessionBid(this)">106<span class="sizeitem">100</span>
                                            </a>
                                        </td>
                                        <td colspan="2" class="hidden-sm hidden-xs ratetd bg-none">
                                            <span class="sizeitem"> </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                <div class="col-sm-4">
                    <div class="betHistorydata">

                        <div class="topnelHeding">
                            <div class="top-heading-matchbook" style={{ userSelect: "text" }}>
                                <span class="textalign-left no-border-radius setBetSlipHeader no-margin" style={{ fontWeight: "700" }}>Matched Bet</span>
                                <a style={{ float: "right", textDecoration: "none", color: "black", fontWeight: 700, fontSize: "13px" }} >View All</a>

                            </div>
                        </div>
                        <div class="bidhistorywrp table-responsive">
                            <table class="tbl_history table-bordered table-hover table-striped table-matchbook ">
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Odds</th>
                                        <th>Stake</th>
                                        <th>BetType</th>
                                        <th>Team</th>
                                        <th>User</th>
                                        <th>Date</th>
                                    </tr></thead>
                                <tbody class="tblmatchbet"></tbody>
                            </table>
                        </div>

                        <br></br>
                        <div class="topnelHeding marginTop-18">
                            <div class="top-heading-matchbook" style={{ userSelect: "text" }}>
                                <span class="textalign-left no-border-radius setBetSlipHeader no-margin" style={{ fontWeight: "700" }}>Session Bet</span>
                                <a style={{ float: "right", textDecoration: "none", color: "black", fontWeight: 700, fontSize: "13px" }} >View All</a>

                            </div>
                        </div>
                        <div class="bidhistorywrp table-responsive ">
                            <table class="tbl_history table-bordered table-hover table-striped table-matchbook">
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Session</th>
                                        <th>Rate</th>
                                        <th>Stake</th>
                                        <th>BetType</th>
                                        <th>User</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody class="tblsessionbet"></tbody>
                            </table>

                        </div>


                    </div>

                </div>
            </div>

        </AgentLayout >
    );
}


