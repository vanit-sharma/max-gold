import { useState } from "react";
import ClientLayout from "../components/layout/ClientLayout";
import "../../../assets/css/style.css";

export default function ProfitLoss() {
    return (
        <ClientLayout>
            <div>
                <div className="panel-heading text-center">
                    <i className=" fa fa-book"></i>&nbsp;Profit/Loss
                </div>
                <div className="scrollbar">
                    <div id="myTable_wrapper" className="dataTables_wrapper no-footer">
                        <div className="dataTables_length" id="myTable_length">
                            <label style={{ fontSize: "17px", color: "black" }}>
                                <b>Show
                                    <select name="myTable_length" aria-controls="myTable">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>entries</b>
                            </label>
                        </div>
                        <table id="myTable" className="table table-bordered tablesorter table-striped dataTable no-footer" role="grid" aria-describedby="myTable_info" style={{ width: "1470px", padding: "90px" }}>
                            <thead>
                                <tr>
                                    <th className="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending" style={{ width: "258px", fontSize: "18px" }}><b>Date</b></th>
                                    <th className="sorting_desc" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-sort="descending" aria-label="Event: activate to sort column ascending" style={{ width: "258px", fontSize: "18px" }}><b>Event</b></th>
                                    <th className="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Credit: activate to sort column ascending" style={{ width: "258px", fontSize: "18px" }}><b>Credit</b></th>
                                    <th className="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Debit: activate to sort column ascending" style={{ width: "258px", fontSize: "18px" }}><b>Debit</b></th>
                                    <th className="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Balance: activate to sort column ascending" style={{ width: "258px", fontSize: "18px" }}><b>Balance</b></th>
                                </tr>
                                <tr>
                                    <th rowspan="1" colspan="1" style={{ fontSize: "16px" }}><input type="text" placeholder="Date" /></th>
                                    <th rowspan="1" colspan="1" style={{ fontSize: "16px" }}><input type="text" placeholder="Event" /></th>
                                    <th rowspan="1" colspan="1" style={{ fontSize: "16px" }}><input type="text" placeholder="Credit" /></th>
                                    <th rowspan="1" colspan="1" style={{ fontSize: "16px" }}><input type="text" placeholder="Debit" /></th>
                                    <th rowspan="1" colspan="1" style={{ fontSize: "16px" }}><input type="text" placeholder="Balance" /></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td valign="top" colspan="5" style={{ textAlign: "center", fontSize: "18px" }}>No data available in table</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="dataTables_info" id="myTable_info" role="status" aria-live="polite" style={{ textAlign: "left", fontSize: "16px", color: "black" }}>
                            Showing 0 to 0 of 0 entries

                            {/*<div className="col-sm-6 text-right">
                            <div className="dataTables_paginate paging_simple_numbers" id="myTable_paginate">
                                <a className="paginate_button previous disabled" aria-controls="myTable" data-dt-idx="0" tabindex="0" id="myTable_previous" style={{ float: "left", paddingTop: "0.755em" }}>Previous</a><span></span>
                                <a class="paginate_button next disabled" aria-controls="myTable" data-dt-idx="1" tabindex="0" id="myTable_next" style={{ float: "left", paddingTop: "0.755em" }}>Next</a>
                            </div>
                        </div>*/}

                            <div id="myTable_paginate">
                                <a data-dt-idx="0" tabindex="0" id="myTable_previous" style={{ float: "right", color: "#666", marginTop: "-25px", paddingRight: "65px" }}>Previous</a>
                                <a data-dt-idx="1" tabindex="0" id="myTable_next" style={{ float: "right", color: "#666", marginTop: "-25px", paddingRight: "14px" }}>Next</a>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
            </div>
        </ClientLayout >
    );
}