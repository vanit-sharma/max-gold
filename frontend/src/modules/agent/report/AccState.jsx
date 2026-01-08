import AgentLayout from "../components/AgentLayout";
import "../../../assets/css/style.css";

export default function AccState() {
    return (
        <AgentLayout>
            <div class="head" style={{ display: "inline-block" }}>
                <div class="main-bar heading-state">
                    <h3><i class=" fa fa-stack-exchange"></i>&nbsp;Account Statement</h3>
                </div>
            </div>
            <div class="homepage_conte_wrp">
                <div class="profile-body">
                    <div class="row">
                        <div class="col-sm-3 col-xs-4">
                            <div class="form-group from-label">
                                <label for="email">From:</label>
                                <input name="ctl00$ContentPlaceHolder1$txtfdate" type="text" value="12/8/2025" readonly="readonly" id="ContentPlaceHolder1_txtfdate" class="form-control hasDatepicker" />
                            </div>
                        </div>
                        <div class="col-sm-3 col-xs-4">
                            <div class="form-group from-label">
                                <label for="email">To:</label>
                                <input name="ctl00$ContentPlaceHolder1$txttodate" type="text" value="1/7/2026" readonly="readonly" id="ContentPlaceHolder1_txttodate" class="form-control hasDatepicker" />
                            </div>
                        </div>
                        <div class="col-sm-3 col-xs-3">
                            <div class="form-group from-label">
                                <label for="email">&nbsp;</label>
                                <div class="form-actions no-margin-bottom">
                                    <input type="submit" name="ctl00$ContentPlaceHolder1$Button1" value="Submit" id="ContentPlaceHolder1_Button1" class="btn btn-primary btn-sub-market" style={{ marginLeft: "15px" }} />
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                    </div>
                    <div class="matchcrick_wrp table-responsive">
                        <div id="myTable_wrapper" class="dataTables_wrapper no-footer">
                            <div class="dataTables_length" id="myTable_length" style={{ fontSize: "13px", color: "#696969" }}>
                                <label>Show
                                    <select name="myTable_length" aria-controls="myTable" class="">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                    entries</label>
                            </div>
                            <div id="myTable_filter" class="dataTables_filter" style={{ float: "right", fontSize: "13px", color: "#696969" }}>
                                <label>Search:
                                    <input type="search" class="" placeholder="" aria-controls="myTable" />
                                </label>
                            </div>
                            <table id="myTable" class="account_table dataTable no-footer table-state" role="grid" aria-describedby="myTable_info">
                                <thead>
                                    <tr role="row" >
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending" style={{ width: "140px" }}>Date</th>
                                        <th class="sorting_desc" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-sort="descending" aria-label="Ref ID: activate to sort column ascending" style={{ width: "140px" }}>Ref ID</th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="User: activate to sort column ascending" style={{ width: "140px" }}>User</th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="UserType: activate to sort column ascending" style={{ width: "140px" }}>UserType</th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Type: activate to sort column ascending" style={{ width: "140px" }}>Type</th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="CR: activate to sort column ascending" style={{ width: "140px" }}>CR</th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="DR: activate to sort column ascending" style={{ width: "140px" }}>DR</th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Balance: activate to sort column ascending" style={{ width: "140px" }}>Balance</th>
                                    </tr>
                                    <tr role="row">
                                        <th rowspan="1" colspan="1">
                                            <input type="text" placeholder="Date" />
                                        </th>
                                        <th rowspan="1" colspan="1">
                                            <input type="text" placeholder="Ref ID" />
                                        </th>
                                        <th rowspan="1" colspan="1">
                                            <input type="text" placeholder="User" />
                                        </th>
                                        <th rowspan="1" colspan="1">
                                            <input type="text" placeholder="UserType" />
                                        </th>
                                        <th rowspan="1" colspan="1">
                                            <input type="text" placeholder="Type" />
                                        </th>
                                        <th rowspan="1" colspan="1">
                                            <input type="text" placeholder="CR" />
                                        </th>
                                        <th rowspan="1" colspan="1">
                                            <input type="text" placeholder="DR" />
                                        </th>
                                        <th rowspan="1" colspan="1">
                                            <input type="text" placeholder="Balance" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>



                                    <tr data-val="credit" role="row" class="odd">
                                        <td>12/23/2025 12:57:00 PM</td>
                                        <td class="sorting_1">506786</td>
                                        <td>Ad Khurram[ChKhurram]</td>
                                        <td>mdl</td>
                                        <td>credit</td>

                                        <td><span data-val="50000.00">50000.00</span></td>
                                        <td><span data-val="0.00">0.00</span></td>
                                        <td><span data-val="50000.00">50000.00</span></td>

                                    </tr>
                                </tbody>
                            </table>
                            <div class="dataTables_info" id="myTable_info" role="status" aria-live="polite">Showing 1 to 1 of 1 entries</div>
                            <div class="dataTables_paginate paging_simple_numbers" id="myTable_paginate">
                                <a class="paginate_button previous disabled" aria-controls="myTable" data-dt-idx="0" tabindex="0" id="myTable_previous">Previous</a>
                                <span><a class="paginate_button current" aria-controls="myTable" data-dt-idx="1" tabindex="0">1</a></span>
                                <a class="paginate_button next disabled" aria-controls="myTable" data-dt-idx="2" tabindex="0" id="myTable_next">Next</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}