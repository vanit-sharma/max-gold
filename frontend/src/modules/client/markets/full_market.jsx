import "../../../assets/css/style.css";
import ClientLayout from "../components/layout/ClientLayout";

export default function Fullmarket() {
    return (
        <ClientLayout>
            <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-8">
                    <div className="panel-heading match-header">
                        <a className="" role="button" data-toggle="collapse">
                            <h3 className="">
                                <span id="ContentPlaceHolder1_lbl_matchname" className="" style={{ fontWeight: "600" }}>Chattogram Royals v Noakhali Express</span>
                                <small className="datesmall">
                                    <span id="ContentPlaceHolder1_opendate" className="small">15-Jan-2026 12:00:00</span>
                                </small>
                            </h3>
                        </a>
                    </div>


                    {/*<div id="collapseOnes" className="" role="tabpanel" aria-labelledby="headingOne">
                        <iframe src="https://scapi.betproex.com/home/sc2/35140092" id="ContentPlaceHolder1_cricketframe" style={{ width: "100%" }} className="sc-dUjcNx eLUYUT" />
                    </div>*/}


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
                                                    <span id="ContentPlaceHolder1_team01" style={{ color: "#000", fontWeight: "700" }}>Chattogram Royals</span>
                                                    <div className="clearfix"></div>
                                                    <div className="statusstack">
                                                        <span id="lbl_point1" data-value="0" style={{ fontWeight: "700" }}>0</span>
                                                        <span className="adv-book" id="run1"></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className="betpricelive value-market">0</a>
                                                    <span className="backsize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className=" value-market">0</a>
                                                    <span id="FTRate_KS2" className="backsize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className="value-market">0</a>
                                                    <span id="FTRate_LS1" className="backsize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className="value-market">0</a>
                                                    <span id="FTRate_KS1" className="laysize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel" >
                                                    <a href="#" className="value-market">0</a>
                                                    <span className="laysize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a href="#" id="FTRate_L3" className="value-market">0</a>
                                                    <span id="FTRate_LS3" className="laysize_1 laysize">0</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="rowkh" id="row2">
                                            <td className="text-left">
                                                <div className="txt_mtc">
                                                    <span id="ContentPlaceHolder1_team02" style={{ color: "#000", fontWeight: "700" }}>Noakhali Express</span>
                                                    <div className="clearfix"></div>
                                                    <div className="statusstack">
                                                        <span id="lbl_point2" data-value="0" style={{ fontWeight: "700" }}>0</span>
                                                        <span className="adv-book" id="run2"></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel" >
                                                    <a href="#" id="STRate_K3" className="value-market">0</a>
                                                    <span id="STRate_KS3" className="backsize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel" >
                                                    <a href="#" className="value-market">0</a>
                                                    <span className="backsize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel" >
                                                    <a href="#" className="betpricelive value-market">0</a>
                                                    <span className="backsize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="ratetd">
                                                <div className="showpanel" >
                                                    <a href="#" className="betpricelive value-market">0</a>
                                                    <span className="laysize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel" >
                                                    <a href="#" className="value-market">0</a>
                                                    <span className="laysize_1 laysize">0</span>
                                                </div>
                                            </td>
                                            <td className="hidden-sm hidden-xs ratetd">
                                                <div className="showpanel">
                                                    <a href="#" className="value-market">0</a>
                                                    <span className="laysize_1 laysize">0</span>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid_shadow mt10" id="toWinToss">
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
                        </div>
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

                <div class="col-lg-4 col-md-4 col-sm-4">
                    <div class="panel-group " id="accordion2" role="tablist" aria-multiselectable="true" aria-expanded="false">
                        <div class="panel panel-default ">
                            <div class=" ">
                                <h4 class="panel-title live-tv-heading">
                                    <span style={{ marginLeft: "10px", fontWeight: "700" }}>Live TV</span>
                                    <span class="live-tv-toggle">
                                        <label for="toggleLiveTV" class="switch">
                                            <input type="checkbox" id="toggleLiveTV" aria-expanded="false" />
                                            <span class="slider round"></span>
                                        </label>
                                    </span>
                                </h4>
                            </div>
                            <div id="LiveTV" class="panel-collapse collapse">
                                <div class="panel-body">
                                    <input type="hidden" name="ctl00$ContentPlaceHolder1$myFrameURL" id="myFrameURL" value="https://5por-tt1.top/getscore.php?chid=7104" />
                                    <iframe src="../../../../#" id="ContentPlaceHolder1_myFrame1" style={{ width: "100%", height: "250px" }} class="sc-dUjcNx eLUYUT"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="font-16 betslipbox nopadding">
                        <div id="divBet" class="compose">
                            <div class="panel panel-alert panel-border top" id="Betslip" style={{
                                userSelect: "text"
                            }} >
                                <div class="panel-heading">
                                    <a href="#" class="text-left setBetSlipHeader pull-left" style={{ fontWeight: "700" }}>Place Bet</a>
                                    <a class="btn btn-xs btn-default no-margin pull-right " href="#">Change Button Value</a>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div id="ContentPlaceHolder1_UpdateProgress1" style={{ display: "none" }} role="status" aria-hidden="true">

                        <div class="modalload">
                            <div class="center">
                                <img alt="" src="/images/loader.gif" />
                            </div>
                        </div>

                    </div>
                    <div class="font-16 betslipbox nopadding">
                        <div id="divBet" class="compose">
                            <div id="divMarketBetPanel">
                                <div id="MarketBackBetPanel" style={{ display: "none" }}>
                                    <table class="table table-placebet no-margin">
                                        <thead style={{ userSelect: "text" }}>
                                            <tr class="clsBackTr" id="placebet" style={{ userSelect: "text" }}>
                                                <th class="col-md-6 col-xs-6 text-left">
                                                    <span id="bet_Type"></span></th>
                                                <th class="col-md-3 col-xs-3">Odds</th>
                                                <th class="col-md-3 col-xs-3">Stake</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tblBackBetSlip">


                                            <tr class="inputs betDetail" style={{ userSelect: "text" }}>
                                                <td class="col-md-12 col-xs-12"><span class="selectionname elemtnblock" colspan="3">

                                                    <span id="ContentPlaceHolder1_lbl_session" class="txt1 ng-binding"></span></span>
                                                </td>


                                            </tr>
                                            <tr class="inputs betDetail" style={{ userSelect: "text" }}>

                                                <td class="col-md-12 col-xs-12 nopadding" colspan="3">
                                                    <div class="row">
                                                        <div class="col-md-5 col-xs-5 ">
                                                            <div class="input-group incbtn">
                                                                <span class="spnbtincrement pull-left" onclick="decrement()">-</span>
                                                                <input name="ctl00$ContentPlaceHolder1$bet_rate" type="number" id="bet_rate" class="textbox stakeTb betStake form-control pull-left" step="0.001" autocomplete="off" style={{ width: "50px" }} />
                                                                <span class="spnbtincrement pull-left" onclick="increment()">+</span>
                                                                <span id="ContentPlaceHolder1_Size" class="betSize"></span>
                                                            </div>
                                                        </div>

                                                        <div class="col-md-5 col-xs-5">
                                                            <div class="input-group bootstrap-touchspin stake">
                                                                <input name="ctl00$ContentPlaceHolder1$txt_price" type="number" id="txt_price" class="textbox stakeTb betStake form-control" min="0" inputmode="numeric" pattern="[0-9]*" onkeyup="checkStake(this.id);" onkeypress="return NumValidate(event)" autocomplete="off" />
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-2 col-xs-2 text-right pull-right" id="prft">0</div>
                                                    </div>
                                                </td>

                                            </tr>

                                            <tr class="inputs betDetail">
                                                <td colspan="3" class="col-md-12 col-xs-12">
                                                    <div class="bottom-margin-3px">
                                                        <div data-ng-show="showBetslip">
                                                            <div class="total_stake">
                                                                <ul class="quickbid pull-right"><li><a href="javascript:void()" class="apl-btn apl-btn-secondary-alt" onclick="setStake(500)">+500</a></li><li><a href="javascript:void()" class="apl-btn apl-btn-secondary-alt" onclick="setStake(1000)">+1000</a></li><li><a href="javascript:void()" class="apl-btn apl-btn-secondary-alt" onclick="setStake(5000)">+5000</a></li><li><a href="javascript:void()" class="apl-btn apl-btn-secondary-alt" onclick="setStake(10000)">+10000</a></li><li><a href="javascript:void()" class="apl-btn apl-btn-secondary-alt" onclick="setStake(50000)">+50000</a></li><li><a href="javascript:void()" class="apl-btn apl-btn-secondary-alt" onclick="setStake(100000)">+100000</a></li></ul>
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr class="inputs betDetail">
                                                <td colspan="3" class="col-xs-12 col-md-12">
                                                    <div id="ContentPlaceHolder1_upPanaelnew">

                                                        <input type="submit" name="ctl00$ContentPlaceHolder1$btnplacebutton1" value="Place Bet" id="ContentPlaceHolder1_btnplacebutton1" class="btn btn-md btn-success bet_btn inactive pull-right text-uppercase" style={{ marginLeft: "10px" }} />&nbsp;&nbsp;
                                                        <button type="button" id="btnCancel" class="btn btn-md btn-danger pull-right text-uppercase" onclick="return cancelBet();">Cancel</button>&nbsp;&nbsp;

                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                            <div id="ContentPlaceHolder1_UpdatePanel1" class="col-sm-">

                                <div class="betHistorydata">
                                    <div class="panel-group" id="accordion">

                                        <div class="panel panel-default">
                                            <div class="panel-heading"><h4 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Matched Bet</a></h4></div>
                                            <div id="collapseOne" class="panel-collapse collapse in">
                                                <div class="panel-body">

                                                </div>
                                            </div>
                                        </div>
                                        <div class="panel panel-default">
                                            <div class="panel-heading">
                                                <h4 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Fancy Bet</a></h4>
                                            </div>
                                            <div id="collapseTwo" class="panel-collapse collapse in">
                                                <div class="panel-body">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="panel panel-default">
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </ClientLayout >
    );
}

