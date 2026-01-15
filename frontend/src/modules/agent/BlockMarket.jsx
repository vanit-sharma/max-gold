import AgentLayout from "./components/AgentLayout";
import "../../assets/css/style.css";

export default function BlockMarket() {
    return (
        <AgentLayout>
            <div class="head" style={{ display: "inline-block" }}>
                <div class="main-bar">
                    <h3 style={{ color: "#696969", fontSize: "23px" }}><b>Block Sports</b> </h3>
                </div>
            </div>


            <div class="panel-body">
                <div id="ContentPlaceHolder1_upPanaelnew">
                    <div class="section_book row">
                        <div class="col-lg-12 col-md-12 col-sm-12">
                            <div id="ContentPlaceHolder1_panel_clear" class="addtherepist">
                                <div class="betHistorydata">
                                    <div class="bidhistorywrp grid_shadow">
                                        <div id="myTable_wrapper" class="dataTables_wrapper no-footer">
                                            <div class="dataTables_length" id="myTable_length" style={{ color: "#717171", fontWeight: "normal", fontSize: "13px", padding: "11px 14px" }}>
                                                <label>Show &nbsp;
                                                    <select name="myTable_length" aria-controls="myTable" class="">
                                                        <option value="10">10</option>
                                                        <option value="25">25</option>
                                                        <option value="50">50</option>
                                                        <option value="100">100</option>
                                                    </select>
                                                    &nbsp;entries</label>
                                            </div>
                                            <div id="myTable_filter" class="dataTables_filter" style={{ color: "#717171", fontWeight: "normal", fontSize: "13px", padding: "11px 14px", textAlign: "right" }}>
                                                <label>Search:
                                                    <input type="search" class="" placeholder="" aria-controls="myTable" />
                                                </label>
                                            </div>
                                            <div >
                                                <table id="myTable" class="table dataTable no-footer" role="grid" aria-describedby="myTable_info">
                                                    <thead >
                                                        <tr role="row" style={{ backgroundColor: "#505050" }}>
                                                            <th class="text-left sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Sports: activate to sort column ascending" style={{ width: "1314px" }}>
                                                                Sports
                                                            </th>
                                                            <th style={{ width: "50px" }} class="text-center sorting_desc" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-sort="descending" aria-label="Active: activate to sort column ascending">
                                                                Active
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr role="row" class="odd">
                                                            <td>
                                                                <a id="ContentPlaceHolder1_rpttype_lnksports_0" href="#" >Cricket</a>
                                                            </td>
                                                            <td class="text-center sorting_1">
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl00$hdnstatus" id="ContentPlaceHolder1_rpttype_hdnstatus_0" value="True" />
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl00$hdnspoid" id="ContentPlaceHolder1_rpttype_hdnspoid_0" value="4" />
                                                                <a id="ContentPlaceHolder1_rpttype_lnkbtn_edit_0" href="javascript:__doPostBack('ctl00$ContentPlaceHolder1$rpttype$ctl00$lnkbtn_edit','')">
                                                                    <img class="iconWidthHeight" src="https://betmax.gold/images/active.png" style={{ height: "25px", width: "25px" }} />
                                                                </a>
                                                            </td>
                                                        </tr><tr role="row" class="even">
                                                            <td>
                                                                <a id="ContentPlaceHolder1_rpttype_lnksports_1" href="javascript:__doPostBack('ctl00$ContentPlaceHolder1$rpttype$ctl01$lnksports','')">Soccer</a>
                                                            </td>
                                                            <td class="text-center sorting_1">
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl01$hdnstatus" id="ContentPlaceHolder1_rpttype_hdnstatus_1" value="True" />
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl01$hdnspoid" id="ContentPlaceHolder1_rpttype_hdnspoid_1" value="1" />
                                                                <a id="ContentPlaceHolder1_rpttype_lnkbtn_edit_1" href="javascript:__doPostBack('ctl00$ContentPlaceHolder1$rpttype$ctl01$lnkbtn_edit','')">
                                                                    <img class="iconWidthHeight" src="https://betmax.gold/images/active.png" style={{ height: "25px", width: "25px" }} />
                                                                </a>
                                                            </td>
                                                        </tr><tr role="row" class="odd">
                                                            <td>
                                                                <a id="ContentPlaceHolder1_rpttype_lnksports_2" href="javascript:__doPostBack('ctl00$ContentPlaceHolder1$rpttype$ctl02$lnksports','')">TeenPatti</a>
                                                            </td>
                                                            <td class="text-center sorting_1">
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl02$hdnstatus" id="ContentPlaceHolder1_rpttype_hdnstatus_2" value="True" />
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl02$hdnspoid" id="ContentPlaceHolder1_rpttype_hdnspoid_2" value="5" />
                                                                <a id="ContentPlaceHolder1_rpttype_lnkbtn_edit_2" href="#">
                                                                    <img class="#" src="https://betmax.gold/images/active.png" style={{ height: "25px", width: "25px" }} />
                                                                </a>
                                                            </td>
                                                        </tr><tr role="row" class="even">
                                                            <td>
                                                                <a id="ContentPlaceHolder1_rpttype_lnksports_3" href="#">TeenPatti</a>
                                                            </td>
                                                            <td class="text-center sorting_1">
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl03$hdnstatus" id="ContentPlaceHolder1_rpttype_hdnstatus_3" value="True" />
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl03$hdnspoid" id="ContentPlaceHolder1_rpttype_hdnspoid_3" value="6" />
                                                                <a id="ContentPlaceHolder1_rpttype_lnkbtn_edit_3" href="javascript:__doPostBack('ctl00$ContentPlaceHolder1$rpttype$ctl03$lnkbtn_edit','')">
                                                                    <img class="iconWidthHeight" src="https://betmax.gold/images/active.png" style={{ height: "25px", width: "25px" }} />
                                                                </a>
                                                            </td>
                                                        </tr><tr role="row" class="odd">
                                                            <td>
                                                                <a id="ContentPlaceHolder1_rpttype_lnksports_4" href="javascript:__doPostBack('ctl00$ContentPlaceHolder1$rpttype$ctl04$lnksports','')">Tennis</a>
                                                            </td>
                                                            <td class="text-center sorting_1">
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl04$hdnstatus" id="ContentPlaceHolder1_rpttype_hdnstatus_4" value="True" />
                                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$rpttype$ctl04$hdnspoid" id="ContentPlaceHolder1_rpttype_hdnspoid_4" value="2" />
                                                                <a id="ContentPlaceHolder1_rpttype_lnkbtn_edit_4" href="javascript:__doPostBack('ctl00$ContentPlaceHolder1$rpttype$ctl04$lnkbtn_edit','')">
                                                                    <img class="iconWidthHeight" src="https://betmax.gold/images/active.png" style={{ height: "25px", width: "25px" }} />
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="dataTables_info" id="myTable_info" role="status" aria-live="polite" >
                                                Showing 1 to 5 of 5 entries
                                            </div>
                                            <div class="dataTables_paginate paging_simple_numbers" id="myTable_paginate">
                                                <a class="paginate_button previous disabled" aria-controls="myTable" data-dt-idx="0" tabindex="0" id="myTable_previous">
                                                    Previous</a>
                                                <span>
                                                    <a class="paginate_button current" aria-controls="myTable" data-dt-idx="1" tabindex="0">1</a>
                                                </span>
                                                <a class="paginate_button next disabled" aria-controls="myTable" data-dt-idx="2" tabindex="0" id="myTable_next">Next</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                    </div>


                </div>
            </div>
        </AgentLayout>
    );
}
{/*     float: left, padding-top: 0.755em, clear: both; */ }
