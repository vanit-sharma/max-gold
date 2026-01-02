import { useState } from "react";
import ClientLayout from "../components/layout/ClientLayout";
import "../../../assets/css/style.css";

export default function Statement() {
    return (
        <ClientLayout>
            {/*<h1 style={{ color: "red" }}>TEST PRINT</h1>*/}
            <div style={{ backgroundColor: "rgba(204, 207, 217, 0.50)", minHeight: "100vh" }}>
                <div>
                    <div className="row">
                        <div className="col-md-12 col-xs-12">
                            <div className="title_new_at" >
                                <b>Account Statement</b>
                                <div className="pull-right">
                                    <button className="btn_common" onclick="goBack()" style={{ color: "black", padding: "0px 4px", fontSize: "12px" }}>Back</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12" >
                            <div id="filtrdata" >
                                <div className="block_2">
                                    <select name="ContentPlaceHolder1" id="ContentPlaceHolder1_RadioButtonList1" className="form-statement">
                                        <option selected="selected" value="1">Show All Cash,Credit &amp; Profit/Loss</option>
                                        <option value="2">Show Cash Entry</option>
                                        <option value="3">Show Credit Entry</option>
                                        <option value="4">Market Profit/Loss</option>
                                    </select>
                                </div>

                                <div className="block_2">
                                    <select name="ContentPlaceHolder2" id="ContentPlaceHolder1_ddlsports" className="form-statement">
                                        <option selected="selected" value="0">All</option>
                                        <option value="4">Cricket</option>
                                        <option value="1">Soccer</option>
                                        <option value="2">Tennis</option>
                                        <option value="7522">BasketBall</option>
                                        <option value="5">Teenpatti T20</option>
                                        <option value="6">Teenpatti OneDay</option>
                                        <option value="900">Lucky7</option>
                                        <option value="800">Dragon Tiger</option>
                                        <option value="700">Poker</option>
                                    </select>
                                </div>

                                <div className="block_2">
                                    <input name="ContentPlaceHolder1" type="text" value="12/25/2025" id="ContentPlaceHolder1_txtFrom" class="form-control hasDatepicker" placeholder="From Date" autocomplete="off"></input>
                                </div>
                                <div class="block_2">
                                    <input name="ContentPlaceHolder1" type="text" value="12/26/2025" id="ContentPlaceHolder1_txtTo" className="form-control hasDatepicker" placeholder="To Date" autocomplete="off"></input>
                                </div>
                                <div className="filter-buttons">
                                    <input type="submit" name="ContentPlaceHolder1$btnSearch" value="Filter" id="ContentPlaceHolder1_btnSearch" className="blue_button"></input>&nbsp;&nbsp;
                                    <a href="/ac_statement" className="red_button" >Clear</a>
                                    <br></br>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div id="divLoading"></div>
                            <div className="table-scroll" id="filterdata">
                                <table id="datatables" style={{ backgroundColor: "#fff", border: "solid 1px #ddd", fontSize: "12px", width: "100%", maxWidth: "100%", borderCollapse: "collapse", border: "1px solid #eaeaea" }}>
                                    <thead>
                                        <tr className="headings">
                                            <th class=""><b>S.No. </b></th>
                                            <th class=""><b>Date </b></th>
                                            <th class=""><b>Type </b></th>
                                            <th class=""><b>Description</b> </th>
                                            <th class=""><b>Result </b></th>
                                            <th class="rrig text-right"><b>Credit</b> </th>
                                            <th class="rrig text-right"><b>Debit</b> </th>
                                            <th class="rrig text-right"><b>Balance </b></th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClientLayout >
    );
}



