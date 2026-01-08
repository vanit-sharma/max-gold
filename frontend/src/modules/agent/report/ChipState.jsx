import AgentLayout from "../components/AgentLayout";
import "../../../assets/css/style.css";

export default function ChipState() {
    return (
        <AgentLayout>
            <div class="head-chip">
                <h3><i class=" fa fa-stack-exchange"></i>&nbsp;Chip Statement</h3>
            </div>
            <div class="homepage_conte_wrp">
                <div class="profile-body">
                    <div class="row">
                        <div class="col-sm-3 col-xs-4">
                            <div class="form-group from-label">
                                <label for="email">From:</label>
                                <input name="ctl00$ContentPlaceHolder1$txtfdate" type="text" value="12/8/2025" readonly="readonly" id="ContentPlaceHolder1_txtfdate" class="form-control hasDatepicker box-market" />
                            </div>
                        </div>
                        <div class="col-sm-3 col-xs-4">
                            <div class="form-group from-label">
                                <label for="email">To:</label>
                                <input name="ctl00$ContentPlaceHolder1$txttodate" type="text" value="1/7/2026" readonly="readonly" id="ContentPlaceHolder1_txttodate" class="form-control hasDatepicker box-market" />
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
                            <div class="dataTables_length" id="myTable_length" style={{ color: "#9b9b9b", fontSize: "12px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "400" }}>Show
                                    <select name="myTable_length" aria-controls="myTable" >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                    entries</label>
                            </div>
                            <div id="myTable_filter" class="dataTables_filter" style={{ float: "right", fontSize: "12px", color: "#696969" }}>
                                <label style={{ fontWeight: "normal" }}>Search:&nbsp;
                                    <input type="search" class="" placeholder="" aria-controls="myTable" />
                                </label>
                            </div>
                            <table id="myTable" class="account_table table-condensed dataTable no-footer " role="grid" aria-describedby="myTable_info" style={{ width: "1472px" }}>
                                <thead>
                                    <tr role="row">
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending" style={{ width: "140px" }}>
                                            Date
                                        </th>
                                        <th class="sorting_desc" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-sort="descending" aria-label="Ref ID: activate to sort column ascending" style={{ width: "140px" }}>
                                            Ref ID
                                        </th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="User: activate to sort column ascending" style={{ width: "140px" }}>
                                            User
                                        </th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="UserType: activate to sort column ascending" style={{ width: "140px" }}>
                                            UserType
                                        </th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Type: activate to sort column ascending" style={{ width: "140px" }}>
                                            Type
                                        </th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="CR: activate to sort column ascending" style={{ width: "140px" }}>
                                            CR
                                        </th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="DR: activate to sort column ascending" style={{ width: "140px" }}>
                                            DR
                                        </th>
                                        <th class="sorting" tabindex="0" aria-controls="myTable" rowspan="1" colspan="1" aria-label="Balance: activate to sort column ascending" style={{ width: "140px" }}>
                                            Balance
                                        </th>
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
                                    <tr class="odd">
                                        <td valign="top" colspan="8" class="dataTables_empty">No data available in table</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="dataTables_info" id="myTable_info" role="status" aria-live="polite">Showing 0 to 0 of 0 entries</div>
                            <div class="dataTables_paginate paging_simple_numbers" id="myTable_paginate">
                                <a class="paginate_button previous " aria-controls="myTable" data-dt-idx="0" tabindex="0" id="myTable_previous" style={{ opacity: "0.6" }}>Previous</a>
                                <span></span>
                                <a class="paginate_button next " aria-controls="myTable" data-dt-idx="1" tabindex="0" id="myTable_next" style={{ opacity: "0.6" }}>Next</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
        </AgentLayout >
    );
}
{/* 
    
    
                    .....



            
    */}