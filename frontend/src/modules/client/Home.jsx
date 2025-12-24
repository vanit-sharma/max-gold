import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";

import ClientLayout from "./components/layout/ClientLayout";
 import { useSelector } from "react-redux";
 

export default function Home() {
  //const eventsFromParent = useSelector((state) => state.event);
    

  return (
    <ClientLayout>
        <div class="row">
            
            <div class="col-lg-12 col-md-12 col-sm-12">
                <div class="bannerinner">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="banner">
                            
                                <div class="box-heading grid_shadow">
                                    <div class="clearfix ng-binding">
                                        
                                        <span id="ContentPlaceHolder1_lbl_Event">Cricket</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-12"> 

                            <div class="clearfix"></div>

                            <div class="table-SportList grid_shadow">
                                <div class="clearfix"></div>
                                <div class="row">
                                    <div class="col-md-7 col-xs-12 hidden-xs" style={{userSelect: "text"}}>
                                    
                                    </div>
                                    <div class="col-md-5 col-xs-12 hidden-xs padding-top-5">
                                        <div class="col-xs-12">
                                            <div class="col-xs-4 text-center text-muted">1</div>
                                            <div class="col-xs-4 text-center text-muted">X</div>
                                            <div class="col-xs-4 text-center text-muted">2</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <div id="showdata">
                                    <div id="ContentPlaceHolder1_UpdatePanel1">
        
                                            
                                                    <div class="market_wrap">
                                                       
                                                        <div class="col-md-7 col-xs-12">
                                                            <a href="https://betmax.gold/Cricket/22/4/17983/35079740" class="markethover">
                                                                <h5 class="text_event"><span class="font-600 font-13">Cricket &gt; MI Emirates v Gulf Giants <small class="text-small">12/23/2025 7:30:00 PM</small></span>
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_MatchStatus_0" class="setinplayBtn ng-hide">In-Play</span>
                                                                </h5>
                                                            </a>
                                                        </div>
                                                        <div class="col-md-5 col-xs-12 no-border padding-top-5">
                                                            
                                                            <div class="col-xs-4 r-overlay">
                                                                <div class="result-x">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_r1_0"></span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate back-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_back1_0">1.82</span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate lay-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_lay1_0">1.83</span></div>
                                                            </div>
                                                            <div class="col-xs-4 r-overlay">
                                                                <div class="result-x">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_r3_0"></span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate back-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_backx_0">-</span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate lay-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_layx_0">-</span></div>
                                                            </div>
                                                            <div class="col-xs-4 r-overlay">
                                                                <div class="result-x">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_r2_0"></span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate back-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_back2_0">2.2</span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate lay-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_lay2_0">2.22</span></div>
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div>
                                                    </div>
                                                
                                                    <div class="market_wrap">
                                                        
                                                        <div class="col-md-7 col-xs-12">
                                                            <a href="https://betmax.gold/Cricket/22/4/20150/35081833" class="markethover">
                                                                <h5 class="text_event"><span class="font-600 font-13">Cricket &gt; Dubai Capitals v Sharjah Warriors <small class="text-small">12/24/2025 7:30:00 PM</small></span>
                                                                    
                                                                </h5>
                                                            </a>
                                                        </div>
                                                        <div class="col-md-5 col-xs-12 no-border padding-top-5">
                                                            
                                                            <div class="col-xs-4 r-overlay">
                                                                <div class="result-x">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_r1_1"></span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate back-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_back1_1">1.78</span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate lay-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_lay1_1">1.81</span></div>
                                                            </div>
                                                            <div class="col-xs-4 r-overlay">
                                                                <div class="result-x">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_r3_1"></span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate back-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_backx_1">-</span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate lay-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_layx_1">-</span></div>
                                                            </div>
                                                            <div class="col-xs-4 r-overlay">
                                                                <div class="result-x">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_r2_1"></span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate back-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_back2_1">2.24</span></div>
                                                                <div class="col-md-6 col-xs-6 no-padding rate lay-rate-color PaddingRate text-center">
                                                                    <span id="ContentPlaceHolder1_Rpt_Multi_Market_lbl_lay2_1">2.62</span></div>
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div>
                                                    </div>
                                                
                                            
                                        
    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3 col-md-3 col-sm-3">
            </div>

        </div> 
   
    </ClientLayout>
  );
}
