import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";

import AgentLayout from "./components/AgentLayout";
import { useSelector } from "react-redux";


export default function AgentDashboard() {
    //const eventsFromParent = useSelector((state) => state.event);


    return (
        <AgentLayout>
            <div>

                <div class=" text-center panel-dashboard">Dashboard </div>

                <div class="clearfix"></div>
                <div class="bodywrapmain">
                    <div class="">
                        <div class="col-lg-12">

                            <div id="vtab" class="order-tabs">
                                <ul>
                                    <li><a href="dashboard.aspx?eventType=0"><i class="sport-icon apl-icon-custom-play dashboard-icon"></i>In Play</a></li>
                                    <li><a href="dashboard.aspx?eventType=4"><i class="sport-icon apl-icon-sport-cricket"></i>Cricket</a></li>
                                    <li><a href="dashboard.aspx?eventType=1"><i class="sport-icon apl-icon-sport-football"></i>Soccer</a></li>
                                    <li><a href="dashboard.aspx?eventType=2"><i class="sport-icon apl-icon-sport-tennis"></i>Tennis</a></li>
                                    <li><a href="dashboard.aspx?eventType=9"><i class="sport-icon apl-icon-sport-tennis"></i>My Markets</a></li>

                                </ul>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="col-lg-12">


                            <div id="ContentPlaceHolder1_UpdatePanel1">

                                <div class="table-responsive">
                                    <table class="table table-bordered text-center dashboard-table">
                                        <tbody><tr>
                                            <th>Match</th>
                                            <th>Bets</th>

                                            <th>X1</th>
                                            <th>X2</th>
                                            <th>X3</th>

                                        </tr>

                                            <tr>
                                                <td class="text-left">

                                                    <a href="MatchBook.aspx?event=30660" class="markethover">
                                                        <h5>

                                                            Brisbane Heat v Melbourne Stars
                                                            {/*<span id="ContentPlaceHolder1_Rpt_Multi_Market_playIcon_0" class="setinplayBtn">Inplay</span>*/}



                                                            <div class="clearfix"></div><small class="text-small">1/2/2026 1:15:00 PM</small>

                                                        </h5>
                                                    </a>
                                                </td>


                                                <td>
                                                    <div class="betswrap wrapitem">
                                                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblbets_0" class="bets">0</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    Brisbane Heat
                                                    <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr1_0" class="clsred">0</span>
                                                </td>

                                                <td>
                                                    Melbourne Stars <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr2_0" class="clsred">0</span>
                                                </td>

                                                <td>

                                                    <div style={{ display: "none" }}>
                                                        Draw <div class="clearfix"></div>
                                                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr3_0" class="clsred">0</span>
                                                    </div>
                                                </td>


                                            </tr>


                                            <tr>
                                                <td class="text-left">



                                                    <a href="MatchBook.aspx?event=30661" class="markethover">
                                                        <h5>

                                                            Paarl Royals v MI Cape Town




                                                            <div class="clearfix"></div><small class="text-small">1/2/2026 8:30:00 PM</small>

                                                        </h5>
                                                    </a>
                                                </td>


                                                <td>
                                                    <div class="betswrap wrapitem">
                                                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblbets_1" class="bets">0</span>
                                                    </div>
                                                </td>





                                                <td>
                                                    Paarl Royals
                                                    <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr1_1" class="clsred">0</span>
                                                </td>

                                                <td>
                                                    MI Cape Town <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr2_1" class="clsred">0</span>
                                                </td>

                                                <td>

                                                    <div style={{ display: "none" }}>
                                                        Draw <div class="clearfix"></div>
                                                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr3_1" class="clsred">0</span>
                                                    </div>
                                                </td>


                                            </tr>


                                            <tr>
                                                <td class="text-left">


                                                    <a href="MatchBook.aspx?event=30663" class="markethover">
                                                        <h5>

                                                            Dhaka Capital v Chattogram Royals
                                                            {/*<span id="ContentPlaceHolder1_Rpt_Multi_Market_playIcon_2" class="setinplayBtn">Inplay</span>*/}



                                                            <div class="clearfix"></div><small class="text-small">1/2/2026 1:00:00 PM</small>

                                                        </h5>
                                                    </a>
                                                </td>


                                                <td>
                                                    <div class="betswrap wrapitem">
                                                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblbets_2" class="bets">0</span>
                                                    </div>
                                                </td>





                                                <td>
                                                    Dhaka Capital
                                                    <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr1_2" class="clsred">0</span>
                                                </td>

                                                <td>
                                                    Chattogram Royals <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr2_2" class="clsred">0</span>
                                                </td>

                                                <td>

                                                    <div style={{ display: "none" }}>
                                                        Draw <div class="clearfix"></div>
                                                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr3_2" class="clsred">0</span>
                                                    </div>
                                                </td>


                                            </tr>


                                            <tr>
                                                <td class="text-left">


                                                    <a href="MatchBook.aspx?event=30664" class="markethover">
                                                        <h5>

                                                            Sylhet Titans v Rangpur Riders




                                                            <div class="clearfix"></div><small class="text-small">1/2/2026 6:00:00 PM</small>

                                                        </h5>
                                                    </a>
                                                </td>


                                                <td>
                                                    <div class="betswrap wrapitem">
                                                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblbets_3" class="bets">0</span>
                                                    </div>
                                                </td>





                                                <td>
                                                    Sylhet Titans
                                                    <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr1_3" class="clsred">0</span>
                                                </td>

                                                <td>
                                                    Rangpur Riders <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr2_3" class="clsred">0</span>
                                                </td>

                                                <td>

                                                    <div style={{ display: "none" }}>
                                                        Draw <div class="clearfix"></div>
                                                        <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr3_3" class="clsred">0</span>
                                                    </div>
                                                </td>


                                            </tr>



                                        </tbody></table>
                                </div>


                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </AgentLayout>
    );
}
