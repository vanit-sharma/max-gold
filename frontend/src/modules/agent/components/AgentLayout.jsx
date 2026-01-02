
import { useRef, useEffect, useState } from "react";
import { logout } from "../../../utils/auth";
import "../../../assets/css/style.css";
import "../../../assets/css/bootstrap.css";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

const AgentLayout = ({ children }) => {

    return (
        <div class="" id="wrap">
            <div class="header-wrap">
                <div class="container">
				<div class="row">
                    <div class="col-sm-4 col-xs-4">
                        <a href="Dashboard.aspx" class="logo_master">
						<img id="Image111" class="img-responsive logo" alt="Logo" src="http://betmax.gold/images/betmax.gold.png" style="filter: invert(100%);width: 100px;"/>
                            
                        </a>
                    </div>
                    

                    <div class="col-sm-8 col-xs-8">
 
                        <div class="top_drop">
                            <ul class="dropdown-menu n__list" role="menu">
                                
                        
                           
                                <li><a href="javascript:void(0)">
                                    
                                    <img src="/images/wallet.png" width="24" class="iconnav">&nbsp;<input type="hidden" name="ctl00$hiddenwallet" id="hiddenwallet">
                                    <span id="lbl_Wallet" class="wallet">50000.00</span></a></li>
                        
                                <li class="dropdown"><a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                    <img src="/images/usericon.png" width="24" class="iconnav">&nbsp;<span id="lbl_username">Asad</span><span class="caret"></span></a>
									<ul class="dropdown-menu dash__m" role="menu">
									<li>
								  
								
								<a href="javascript:void(0)">Share :
                                <span id="myshare" class="">80</span></a></li>
                                <li><a href="javascript:void(0)">
                                    
                                    <input type="hidden" name="ctl00$MShare" id="MShare" value="20">
                                    Agent : <span id="MasterAgent" class="wallet">Ad Khurram</span></a></li>
                                        <li><a href="change-password.aspx">Change Password</a>  </li>
                                        <li><a href="/dl/logout.aspx">Logout</a></li>
                                    </ul>
                                </li>
								 
                   
                                
                            </ul>
                        </div>
						</div>

                    </div>
                </div>
            </div>
            <div id="top" class="nav-master">
                <nav class="navbar navbar-inverse navbar-static-top">
				
                    <div class="col-lg-12">
                        <header class="navbar-header">
                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>

                        </header>
                        <div class="topnav">
                        </div>
                        <div class="collapse navbar-collapse navbar-ex1-collapse">
                            <ul class="nav navbar-nav">
                                <li><a href="Dashboard.aspx">Dashboard</a>  </li>
                                <li><a href="Match.aspx?eventType=4">Match Book</a></li>
                                <li><a href="Blockmarket.aspx">Block Market</a></li>
                             
                                <li class="dropdown">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Clients List<b class="caret"></b></a>
                                    <ul class="dropdown-menu">
                                        <li><a href="addusers.aspx">Add Clients</a>  </li>
                                        <li><a href="users.aspx">Clients List</a> </li>
                                    </ul>
                                </li>
                                 
                                <li class="dropdown ">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Report<b class="caret"></b></a>
                                    <ul class="dropdown-menu">
                                        <li><a href="AccountSummery.aspx">Account Statament</a></li>
										<li><a href="ChipStatement.aspx">Chip Statement</a></li>
                                        <li><a href="ProfitLossNew.aspx">Profit/Loss</a>  </li>
                                        <li><a href="MaxLimit.aspx">Max Limit</a>  </li>
                                        <li><a href="ChipSummary.aspx">Chip Summary</a>  </li>
                                    </ul>
                                </li>
                                 <li><a href="MarketProfitLoss.aspx">Profit/Loss</a>  </li>

                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            

    
    <div class="panel-heading text-center">Dashboard </div>
    <style>
         
 .table-responsive {
    overflow: auto;
    max-height: initial;
}
 table tr:hover{background:#f1f1f1;}

        .setinplayBtn, .text-small {
            font-size: 11px;
        }

        a.markethover h5 {
            vertical-align: -webkit-baseline-middle;
        }

        .text-muted {
            color: #999;
        }

        .market_wrap {
            border-bottom: 1px solid #eaeaea;
        }

            .market_wrap:hover {
                background-color: #EFF2F2;
            }

        .table-SportList .back-rate-color {
            background-color: #72BBEF;
            color: #000 !important;
            cursor: pointer;
        }

        .table-SportList .lay-rate-color {
            background-color: #FAA9BA;
            color: #000;
            cursor: pointer;
        }

        .twrap {
            background-color: #DDDCD6;
        }

        h5.text_event {
            color: #2789CE;
            font-weight: 600;
        }

        /*.icon-in_play {
            margin-right: 5px;
            background-position: -406px -1720px;
            height: 8px;
            width: 8px;
        }

        .icon-no_play {
            margin-right: 5px;
            background-position: -406px -1858px;
            height: 8px;
            width: 8px;
        }*/

        .setinplayBtn {
            float: right; 
            right: 0;
            top: 8px;
            background-color: #339600 !important;
            color: #fff;
            padding: 2px 8px;
        }

       

        .th1 {
            min-width: 100px;
        }

       

        .BlockImgWidthHeight {
            height: 18px;
            width: 18px;
        }

        .game-fancy.in-play {
            overflow: auto;
            padding-left: 0;
        }

        .game-fancy1 {
            background-color: #0A92A5;
           float: right; 
        border-radius: 4px;
    display: inline-block;font-size: 11px;
    color: #fff;
    padding: 2px 8px;
        }

        .game-fancy0 {
            display: none;
        }
    </style>
    <div class="clearfix"></div>
    <div class="bodywrapmain">
        <div class="">
            <div class="col-lg-12">

                <div id="vtab" class="order-tabs">
                    <ul>
                        <li><a href="dashboard.aspx?eventType=0"><i class="sport-icon apl-icon-custom-play"></i>In Play</a></li>
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
                                     <table class="table table-bordered text-center">
                                     <tbody><tr>
                                         <th>Match</th> 
                                         <th>Bets</th>
                                        
                                         <th>X1</th>
                                         <th>X2</th>
                                         <th>X3</th>

                                     </tr>
                                
                                        <tr>
                                            <td class="text-left">
                                     
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl00$hidmarketid" id="ContentPlaceHolder1_Rpt_Multi_Market_hidmarketid_0" value="1.252221973">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl00$hidMType" id="ContentPlaceHolder1_Rpt_Multi_Market_hidMType_0" value="2">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl00$hdnMatchId" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnMatchId_0" value="30660">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl00$hdnEventID" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnEventID_0" value="35100660">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl00$hdnSportsid" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnSportsid_0" value="4">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl00$hdnstatus" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnstatus_0" value="True">
                                           
                                                        
                                                        <a href="MatchBook.aspx?event=30660" class="markethover">
                                                            <h5> 
                                                              
                                                                Brisbane Heat v Melbourne Stars 
                                                                  <span id="ContentPlaceHolder1_Rpt_Multi_Market_playIcon_0" class="setinplayBtn">Inplay</span>
                                                                
                                                                
                                                                
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
                                                    
                                                    <div style="display: none">
                                                    Draw <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr3_0" class="clsred">0</span>
                                                        </div>
                                                </td>

                                            
                                            </tr>

                                    
                                        <tr>
                                            <td class="text-left">
                                     
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl01$hidmarketid" id="ContentPlaceHolder1_Rpt_Multi_Market_hidmarketid_1" value="1.252206629">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl01$hidMType" id="ContentPlaceHolder1_Rpt_Multi_Market_hidMType_1" value="2">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl01$hdnMatchId" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnMatchId_1" value="30661">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl01$hdnEventID" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnEventID_1" value="35100761">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl01$hdnSportsid" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnSportsid_1" value="4">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl01$hdnstatus" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnstatus_1" value="True">
                                           
                                                        
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
                                                    
                                                    <div style="display: none">
                                                    Draw <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr3_1" class="clsred">0</span>
                                                        </div>
                                                </td>

                                            
                                            </tr>

                                    
                                        <tr>
                                            <td class="text-left">
                                     
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl02$hidmarketid" id="ContentPlaceHolder1_Rpt_Multi_Market_hidmarketid_2" value="1.252246171">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl02$hidMType" id="ContentPlaceHolder1_Rpt_Multi_Market_hidMType_2" value="2">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl02$hdnMatchId" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnMatchId_2" value="30663">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl02$hdnEventID" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnEventID_2" value="35105453">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl02$hdnSportsid" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnSportsid_2" value="4">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl02$hdnstatus" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnstatus_2" value="True">
                                           
                                                        
                                                        <a href="MatchBook.aspx?event=30663" class="markethover">
                                                            <h5> 
                                                              
                                                                Dhaka Capital v Chattogram Royals 
                                                                  <span id="ContentPlaceHolder1_Rpt_Multi_Market_playIcon_2" class="setinplayBtn">Inplay</span>
                                                                
                                                                
                                                                
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
                                                    
                                                    <div style="display: none">
                                                    Draw <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr3_2" class="clsred">0</span>
                                                        </div>
                                                </td>

                                            
                                            </tr>

                                    
                                        <tr>
                                            <td class="text-left">
                                     
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl03$hidmarketid" id="ContentPlaceHolder1_Rpt_Multi_Market_hidmarketid_3" value="1.252246098">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl03$hidMType" id="ContentPlaceHolder1_Rpt_Multi_Market_hidMType_3" value="2">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl03$hdnMatchId" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnMatchId_3" value="30664">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl03$hdnEventID" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnEventID_3" value="35105462">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl03$hdnSportsid" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnSportsid_3" value="4">
                                            <input type="hidden" name="ctl00$ContentPlaceHolder1$Rpt_Multi_Market$ctl03$hdnstatus" id="ContentPlaceHolder1_Rpt_Multi_Market_hdnstatus_3" value="True">
                                           
                                                        
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
                                                    
                                                    <div style="display: none">
                                                    Draw <div class="clearfix"></div>
                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lblr3_3" class="clsred">0</span>
                                                        </div>
                                                </td>

                                            
                                            </tr>

                                    

                                </tbody></table>
                                     </div>
                                 <input type="hidden" name="ctl00$ContentPlaceHolder1$HiddenField1" id="ContentPlaceHolder1_HiddenField1">
                                <input type="hidden" name="ctl00$ContentPlaceHolder1$hdnmatchid" id="ContentPlaceHolder1_hdnmatchid">
                               
                            
</div>
                          
                    </div>
                 
        </div>
    </div>
    <script src="../js/activetab.js"></script>

     <script src="../js/emty.js"></script>

    <div id="content_holder" class="popbox0">
        <div class="popdetails">
            <a onclick="document.getElementById('opaque').style.display='none'; document.getElementById('content_holder').style.display='none'" class="closePrefHelp">X</a>
            <iframe id="contentFrame" name="contentFrame" style="border: none; width: 100%; height: 400px;"></iframe>
        </div>
    </div>
    <div id="opaque"></div>

        </div>
    );


}

export default AgentLayout;