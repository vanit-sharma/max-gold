
import { useRef, useEffect, useState } from "react";
import { logout } from "../../../utils/auth";
import "../../../assets/agent/css/AdminStyle.css";
import "../../../assets/css/bootstrap.css";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const AgentLayout = ({ children }) => {

    return (

        <div class="" id="wrap">
            <style>
                {` 
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
                `}
            </style>
            <div class="header-wrap">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-4 col-xs-4">
                            <a href="#" class="logo_master">
                                <img id="Image111" class="img-responsive logo" alt="Logo" src="../assets/agent/images/betmax.gold.png" />

                            </a>
                        </div>

                        <div class="col-sm-8 col-xs-8">

                            <div class="top_drop">
                                <ul class="dropdown-menu n__list" role="menu">



                                    <li><a href="javascript:void(0)">

                                        <img src="/images/wallet.png" width="24" class="iconnav" />&nbsp;
                                        <span id="lbl_Wallet" class="wallet">50000.00</span></a></li>

                                    <li class="dropdown"><a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                        <img src="/images/usericon.png" width="24" class="iconnav" />&nbsp;<span id="lbl_username">Asad</span><span class="caret"></span></a>
                                        <ul class="dropdown-menu dash__m" role="menu">
                                            <li>


                                                <a href="javascript:void(0)">Share :
                                                    <span id="myshare" class="">80</span></a></li>
                                            <li><a href="javascript:void(0)">


                                                Agent : <span id="MasterAgent" class="wallet">Ad Khurram</span></a></li>
                                            <li><a href="#">Change Password</a>  </li>
                                            <li><a href="#">Logout</a></li>
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

                            <Nav variant="pills" activeKey="1">
                                <Nav.Item>
                                    <Nav.Link eventKey="1">
                                        <Link to="/agent/dashboard">Dashboard</Link>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="2">
                                        <Link to="/agent/matchmain">Match Book</Link>
                                    </Nav.Link>
                                </Nav.Item>

                                <Nav.Item>
                                    <Nav.Link eventKey="3" title="Item">
                                        <Link to="/agent/blockmarket">Block Market</Link>
                                    </Nav.Link>
                                </Nav.Item>
                                <NavDropdown title="Clients List" id="nav-dropdown">
                                    <NavDropdown.Item eventKey="4.1">
                                        <Link to="/agent/addclients">Add Clients</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item eventKey="4.2">
                                        <Link to="/agent/clientlist">Clients List</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Report" id="nav-dropdown">
                                    <NavDropdown.Item eventKey="4.1">
                                        <Link to="/agent/accstate">Account Statament</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item eventKey="4.2">
                                        <Link to="/agent/chipstate"> Chip Statement</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item eventKey="4.2">
                                        <Link to="/agent/reportproloss"> Profit/Loss</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item eventKey="4.2">
                                        <Link to="/agent/maxlimit"> Max Limit</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item eventKey="4.2">
                                        <Link to="/agent/chipsum"> Chip Summary</Link>
                                    </NavDropdown.Item>

                                </NavDropdown>

                                <Nav.Item>
                                    <Nav.Link eventKey="3" title="Item">
                                        <Link to="/agent/marketprofitloss">Profit/Loss</Link>
                                    </Nav.Link>
                                </Nav.Item>


                            </Nav>



                        </div>
                    </div>
                </nav>
            </div>

            <div>
                {children}
            </div>






        </div>
    );


}

export default AgentLayout;