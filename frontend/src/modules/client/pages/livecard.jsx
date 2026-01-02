import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import moment from "moment";
import "../../../assets/css/livecard.css";

import ClientLayout from "../components/layout/ClientLayout";
import { useSelector } from "react-redux";


export default function Livecard() {
    //const eventsFromParent = useSelector((state) => state.event);
    const [openSport, setOpenSport] = useState(null);
    const [openLeague, setOpenLeague] = useState(null);

    const toggleSport = (sport) => {
        setOpenSport(openSport === sport ? null : sport);
    };
    const toggleLeague = (league) => {
        setOpenLeague(openLeague === league ? null : league);
    };

    return (
        <ClientLayout>
            <div className="livecard-page">
                <div class="homepage_conte_wrp">
                    <div>
                        <div class="matchcrick_wrp">
                            <div class="">

                                <div class="col-lg-2 col-md-2 col-sm-2 hidden-xs">
                                    <div class="hocrickmenu">
                                        <div class="crickbetlist">
                                            <div class="crikbtn_hsow box-heading grid_shadow"><a href="#">
                                                All Sports</a></div>
                                            <section>
                                                <ul class="sidebar-menu">

                                                    <li>
                                                        <div className="menu-title" onClick={() => toggleSport("cricket")}>
                                                            <span>
                                                                <i class="icon-sport cricket-icon"></i>
                                                                Cricket
                                                            </span>
                                                            <span class="match_count">›</span>
                                                        </div>

                                                        {openSport === "cricket" && (
                                                            <ul className="sidebar-submenu">
                                                                <li>
                                                                    <div class="league-title" onClick={() => toggleLeague("ashes")}>
                                                                        The Ashes
                                                                    </div>
                                                                    <ul class="sidebar-submenu">

                                                                        <li>
                                                                            {openLeague === "ashes" && (
                                                                                <ul className="sidebar-submenu">
                                                                                    <li>
                                                                                        <a href="javascript:void(0)">
                                                                                            Australia v England
                                                                                        </a>
                                                                                    </li>
                                                                                </ul>
                                                                            )}

                                                                        </li>

                                                                    </ul>
                                                                </li>

                                                                <li>
                                                                    <div class="league-title" onClick={() => toggleLeague("leaguet20")}>
                                                                        International League T20
                                                                    </div>

                                                                    <ul class="sidebar-submenu">
                                                                        <li>
                                                                            {openLeague === "leaguet20" && (
                                                                                <ul className="sidebar-submenu">
                                                                                    <li>
                                                                                        <a href="javascript:void(0)">
                                                                                            Dubai Capitals v Sharjah Warriors
                                                                                        </a>
                                                                                    </li>
                                                                                </ul>
                                                                            )}

                                                                        </li>
                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        )}
                                                    </li>







                                                    <li>
                                                        <div className="menu-title" onClick={() => toggleSport("soccer")}>
                                                            <span>
                                                                <i class="icon-sport soccer-icon"></i>
                                                                Soccer
                                                            </span>

                                                            <span class="match_count">›</span>
                                                        </div>

                                                        {openSport === "soccer" && (
                                                            <ul className="sidebar-submenu">
                                                                <li><a href="#">Turkish Cup </a>

                                                                    <ul class="sidebar-submenu">
                                                                        <li>
                                                                            <div class="league-title" onClick={() => toggleLeague("leaguet20")}>
                                                                                International League T20
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </li>

                                                                <li><a href="javascript:void(0)">Africa Cup of Nations</a>

                                                                    <ul class="sidebar-submenu">

                                                                        <li><a href="javascript:void(0)">Dubai Capitals v Sharjah Warriors <span class="caret pull-right"></span></a>

                                                                        </li>

                                                                    </ul>
                                                                </li>
                                                                <li><a href="javascript:void(0)">Egyptian League Cup</a>

                                                                    <ul class="sidebar-submenu">

                                                                        <li><a href="javascript:void(0)">Dubai Capitals v Sharjah Warriors <span class="caret pull-right"></span></a>
                                                                        </li>

                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        )}
                                                    </li>





                                                    <li>
                                                        <div className="menu-title" onClick={() => toggleSport("tennis")}>
                                                            <span>
                                                                <i class="icon-sport tennis-icon"></i>
                                                                Tennis
                                                            </span><span class="match_count">›</span>
                                                        </div>

                                                        {openSport === "tennis" && (
                                                            <ul className="sidebar-submenu">
                                                                <li><a href="#">Turkish Cup <span class="caret pull-right"></span></a>

                                                                    <ul class="sidebar-submenu">

                                                                        <li><a href="javascript:void(0)">Australia v England <span class="caret pull-right"></span></a>



                                                                            <ul class="sidebar-submenu">

                                                                                <li><a href="/Cricket/33/4/21351/35076739"><i class="fa fa-circle-o"></i>ODDS</a></li>
                                                                            </ul>

                                                                        </li>

                                                                    </ul>
                                                                </li>

                                                                <li><a href="javascript:void(0)">Africa Cup of Nations <span class="caret pull-right"></span></a>

                                                                    <ul class="sidebar-submenu">

                                                                        <li><a href="javascript:void(0)">Dubai Capitals v Sharjah Warriors <span class="caret pull-right"></span></a>



                                                                            <ul class="sidebar-submenu">

                                                                                <li><a href="/Cricket/22/4/20150/35081833"><i class="fa fa-circle-o"></i>ODDS</a></li>
                                                                            </ul>

                                                                        </li>

                                                                    </ul>
                                                                </li>
                                                                <li><a href="javascript:void(0)">Egyptian League Cup <span class="caret pull-right"></span></a>

                                                                    <ul class="sidebar-submenu">

                                                                        <li><a href="javascript:void(0)">Dubai Capitals v Sharjah Warriors <span class="caret pull-right"></span></a>



                                                                            <ul class="sidebar-submenu">

                                                                                <li><a href="/Cricket/22/4/20150/35081833"><i class="fa fa-circle-o"></i>ODDS</a></li>
                                                                            </ul>

                                                                        </li>

                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        )}
                                                    </li>





                                                    <li><a href="/teenpatti"><i class="icon-sport teenpatti-icon"></i>
                                                        <span id="ContentPlaceHolder1_sidebarmenu_lbl_sport" style={{ color: "#696969" }}>Teenpatti</span><span class="match_count">›</span></a>
                                                    </li>
                                                </ul>
                                            </section>
                                        </div>
                                    </div>

                                </div>

                                <div class="col-lg-10 col-md-10 col-sm-10 hidden-xs">
                                    <div class="">

                                        <div class="table-responsive">
                                            <table class="table-tp">
                                                <thead>
                                                    <tr>
                                                        <th style={{ textAlign: "left" }}>Match</th>
                                                        <th class="text-center hidden-xs" colspan="2"><span class="">1</span></th>
                                                        <th class="text-center hidden-xs" colspan="2"><span class="">x</span></th>
                                                        <th class="text-center hidden-xs" colspan="2"><span class="">2</span></th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr class="rowkh">

                                                        <td class="text-left game-name"><div class="txt_mtc"><a href="/casino/5/teen20">Live Teenpatti 20-20</a>&nbsp;
                                                            <span id="56767">In-Play</span></div>
                                                        </td><td class="ratetd back"><a class="betlink"><span id="76776_L1" class="betpricelive">1.98</span></a></td>
                                                        <td class="ratetd lay"><a class="betlink"><span id="76776_K1" class="betpricelive">1.44</span></a></td>
                                                        <td class="ratetd back"><a class="betlink"><span class="betpricelive">-</span></a></td>
                                                        <td class="ratetd lay"><a class="betlink"><span class="betpricelive">-</span></a></td>
                                                        <td class="ratetd back"><a class="betlink"><span id="76776_L2">1.45</span></a></td>
                                                        <td class="ratetd lay"><a class="betlink"><span id="76776_L3">1.46</span></a></td>
                                                    </tr>

                                                    <tr class="rowkh">
                                                        <td class="text-left game-name"><div class="txt_mtc" style={{ color: '#696969' }}><a href="/casino/6/teen">Live Teenpatti OneDay</a>&nbsp;
                                                            <span id="56767">In-Play</span></div>
                                                        </td><td class="hidden-xs ratetd back"><a class="betlink"><span id="76776_L1" class="betpricelive">1.98</span></a></td>
                                                        <td class="hidden-xs ratetd lay"><a class="betlink"><span id="76776_K1" class="betpricelive">1.44</span></a></td>
                                                        <td class="hidden-xs ratetd back"><a class="betlink"><span class="betpricelive">-</span></a></td>
                                                        <td class="hidden-xs ratetd lay"><a class="betlink"><span class="betpricelive">-</span></a></td>
                                                        <td class="hidden-xs ratetd back"><a class="betlink"><span id="76776_L2">1.45</span></a></td>
                                                        <td class="hidden-xs ratetd lay"><a class="betlink"><span id="76776_L3">1.46</span></a></td>
                                                    </tr>
                                                    <tr class="rowkh">
                                                        <td class="text-left game-name"><div class="txt_mtc"><a href="/casino/500/dt20">Dragon Tiger 20</a>&nbsp;
                                                            <span id="56767"></span></div>
                                                        </td><td class="hidden-xs ratetd back"><a class="betlink"><span id="76776_L1" class="betpricelive">1.98</span></a></td>
                                                        <td class="hidden-xs ratetd lay"><a class="betlink"><span id="76776_K1" class="betpricelive"></span></a></td>
                                                        <td class="hidden-xs ratetd back"><a class="betlink"><span class="betpricelive">-</span></a></td>
                                                        <td class="hidden-xs ratetd lay"><a class="betlink"><span class="betpricelive">-</span></a></td>
                                                        <td class="hidden-xs ratetd back"><a class="betlink"><span id="76776_L2"></span></a></td>
                                                        <td class="hidden-xs ratetd lay"><a class="betlink"><span id="76776_L3"></span></a></td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div >
                    </div >
                </div >
            </div>
        </ClientLayout >
    );
}
