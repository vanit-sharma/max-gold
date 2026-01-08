import AgentLayout from "../components/AgentLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/style.css";

export default function ClientList() {
    return (
        <AgentLayout>
            <div class="" id="wrap">
                <div class="">
                    <div class="col-sm-6 panel-heading-client">List Of Clients</div><br></br>
                    <div class="col-sm-6">
                        <div class="pull-right">
                            <a href="addusers.aspx" class="btn btn-sm-client btn-success" style={{ fontSize: "12px", marginTop: "-11px" }}><i class="fa fa-user"></i> New</a>&nbsp;
                            <a id="ContentPlaceHolder1_btnTotal" class="btn  btn-sm-client btn-warning" href="#" style={{ width: "170px", color: "white", fontWeight: "700", fontSize: "12px", marginTop: "-11px" }}><i class="fa fa-money"></i>Get Total Credit/Balance</a>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div id="content">

                    <div class="scrool">
                        <div id="collapse4" class="body">
                            <div class="row">
                                <br></br>
                                <div class="col-sm-4 form-group">
                                    <input name="ctl00$ContentPlaceHolder1$txtSearch" type="text" onchange="#)" id="ContentPlaceHolder1_txtSearch" class="form-control" placeholder="Search" style={{ padding: "6px 12px", width: "100%", height: "32px" }} />
                                </div>
                                <div class="col-sm-4 form-group">
                                    <table id="ContentPlaceHolder1_rdogroup">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input id="ContentPlaceHolder1_rdogroup_0" type="radio" name="ctl00$ContentPlaceHolder1$rdogroup" value="true" checked="checked" /><label for="ContentPlaceHolder1_rdogroup_0" style={{ color: "#696969" }}>Active</label>
                                                </td>
                                                <td>
                                                    <input id="ContentPlaceHolder1_rdogroup_1" type="radio" name="ctl00$ContentPlaceHolder1$rdogroup" value="False" /><label for="ContentPlaceHolder1_rdogroup_1" style={{ color: "#696969" }}>In-Active</label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-sm-4 form-group">
                                </div>
                                <div class="clearfix"></div>
                                <div id="ContentPlaceHolder1_pnlmsg" class="msgpnl" style={{ display: "none" }}>
                                    <h3 class="text-center"></h3>
                                </div>
                            </div>


                            <table style={{ marginBottom: "0", border: "0", background: "none" }} class="table table- bordered table-condensed table-hover table-striped">
                                <tbody>
                                    <tr>
                                        <th class=""> <span id="ContentPlaceHolder1_lblTotal" class="text-right"></span></th>
                                        <th><span id="ContentPlaceHolder1_lblCredit"></span></th>
                                        <th><span id="ContentPlaceHolder1_lblCash"></span></th>
                                        <th><span id="ContentPlaceHolder1_lblWallet"></span></th>
                                        <th><span id="ContentPlaceHolder1_lblLiability"></span></th>
                                    </tr>
                                </tbody>
                            </table>


                            <div>
                                <table class="table table-bordered table-condensed table-hover table-striped table-client " cellspacing="0" rules="all" border="1" id="ContentPlaceHolder1_dataTable" style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <tbody>
                                        <tr class="table-header-client" style={{ backgroundColor: "black" }}>
                                            <th scope="col">Edit</th>
                                            <th scope="col"><a href="#" >Id</a></th>
                                            <th scope="col"><a href="#">Name[UserName]</a></th>
                                            <th scope="col"><a href="#">Credit Limit</a></th>
                                            <th scope="col">[Cash]+[P/L]</th>
                                            <th scope="col"><a href="#">Balance</a></th>
                                            <th scope="col"><a href="#">Liability</a></th>
                                            <th scope="col">M Com.(%)</th>
                                            <th scope="col">S Com.(%)</th>
                                            <th scope="col">Max Profit</th>
                                            <th scope="col" style={{ width: "240px" }}>Action</th>
                                            <th scope="col"><a href="#">Active</a></th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a id="ContentPlaceHolder1_dataTable_lnkedit_0" href="#"> <img class="iconWidthHeight" src="https://betmax.gold/images/Icon_edit.png" /> </a>
                                            </td><td>25290</td><td style={{ width: "200px" }}>
                                                <a id="ContentPlaceHolder1_dataTable_dlname_0" href="#">Chakar90[Chakar90]</a>
                                            </td><td>0.00</td><td style={{ width: "80px" }}>
                                                <span id="ContentPlaceHolder1_dataTable_lblcradit_0" dataformatstring="{0:N2}" data-value="0.00">0.00</span>
                                            </td><td align="right">0.00</td><td style={{ width: "80px" }}>
                                                <a id="ContentPlaceHolder1_dataTable_btnLiability_0" dataformatstring="{0:N2}" href="#">0.00</a>
                                            </td><td style={{ width: "70px" }}>2</td><td style={{ width: "70px" }}>0</td><td style={{ width: "70px" }}>1000.00</td><td style={{ width: "170px" }}>
                                                <div class="text-white-space">
                                                    <a href="#" target="_blank" data-toggle="tooltip" data-placement="top" title="Log" class="btn btn-green btn-xs-client LRPad2">Log</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25290" data-name="Chakar90" data-balance="0.00" data-title="Deposit Chips" onclick="CheckActiveUser(25290,this)" data-type="CreditIn" data-toggle="tooltip" data-placement="top" title="Deposit Chips" class="btn btn-warning btn-xs-client popup LRPad2" style={{ backgroundColor: "#f4b04f", borderColor: "#f19a1f #f19a1f #e38b0e", color: "white" }}>D</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25290" data-name="Chakar90" data-balance="0.00" data-title="Withdraw Chips" onclick="CheckActiveUser(25290,this)" data-type="CreditOut" data-toggle="tooltip" data-placement="top" title="Withdraw Chips" class="btn btn-info btn-xs-client popup LRPad2" style={{ borderColor: "#46b8da #46b8da #2caed5", backgroundColor: "#5bc0de", color: "white" }}>W</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25290" data-name="Chakar90" data-balance="0.00" data-title="Deposit Cash" onclick="CheckActiveUser(25290,this)" data-type="CashIn" data-toggle="tooltip" data-placement="top" title="Deposit Cash" class="btn btn-warning btn-xs-client popup LRPad2" style={{ backgroundColor: "#f4b04f", borderColor: "#f19a1f #f19a1f #e38b0e", color: "white" }}>CD</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25290" data-name="Chakar90" data-balance="0.00" data-title="Withdraw Cash" onclick="CheckActiveUser(25290,this)" data-type="CashOut" data-toggle="tooltip" data-placement="top" title="Withdraw Cash" class="btn btn-info btn-xs-client popup LRPad2" style={{ borderColor: "#46b8da #46b8da #2caed5", backgroundColor: "#5bc0de", color: "white" }}>CW</a>
                                                </div>
                                            </td><td style={{ width: "30px" }}>
                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$dataTable$ctl02$hdnstatus" id="ContentPlaceHolder1_dataTable_hdnstatus_0" value="True" />
                                                <a id="ContentPlaceHolder1_dataTable_LinkButton2_0" href="#" >
                                                    <img class="iconWidthHeight img-active-client" src="https://betmax.gold/images/active.png" />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a id="ContentPlaceHolder1_dataTable_lnkedit_1" href="#"> <img class="iconWidthHeight" src="https://betmax.gold/images/Icon_edit.png" /> </a>
                                            </td><td>25337</td><td style={{ width: "200px" }}>
                                                <a id="ContentPlaceHolder1_dataTable_dlname_1" href="#">pkr007[pkr007]</a>
                                            </td><td>0.00</td><td style={{ width: "80px" }}>
                                                <span id="ContentPlaceHolder1_dataTable_lblcradit_1" dataformatstring="{0:N2}" data-value="0.00">0.00</span>
                                            </td><td align="right">0.00</td><td style={{ width: "80px" }}>
                                                <a id="ContentPlaceHolder1_dataTable_btnLiability_1" dataformatstring="{0:N2}" href="#">0.00</a>
                                            </td><td style={{ width: "70px" }}>1</td><td style={{ width: "70px" }}>0</td><td style={{ width: "70px" }}>10000.00</td><td style={{ width: "170px" }}>
                                                <div class="text-white-space">
                                                    <a href="../include/ClientChipStatement.aspx?I1rHMvyeHbr87IntkJKBoXXgPfvpnjhv" id="ContentPlaceHolder1_dataTable_btn_wallet_1" target="_blank" data-toggle="tooltip" data-placement="top" title="Log" class="btn btn-green btn-xs-client LRPad2" >Log</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25337" data-name="pkr007" data-balance="0.00" data-title="Deposit Chips" onclick="CheckActiveUser(25337,this)" data-type="CreditIn" data-toggle="tooltip" data-placement="top" title="Deposit Chips" class="btn btn-warning btn-xs-client popup LRPad2" style={{ backgroundColor: "#f4b04f", borderColor: "#f19a1f #f19a1f #e38b0e", color: "white" }}>D</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25337" data-name="pkr007" data-balance="0.00" data-title="Withdraw Chips" onclick="CheckActiveUser(25337,this)" data-type="CreditOut" data-toggle="tooltip" data-placement="top" title="Withdraw Chips" class="btn btn-info btn-xs-client popup LRPad2" style={{ borderColor: "#46b8da #46b8da #2caed5", backgroundColor: "#5bc0de", color: "white" }}>W</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25337" data-name="pkr007" data-balance="0.00" data-title="Deposit Cash" onclick="CheckActiveUser(25337,this)" data-type="CashIn" data-toggle="tooltip" data-placement="top" title="Deposit Cash" class="btn btn-warning btn-xs-client popup LRPad2" style={{ backgroundColor: "#f4b04f", borderColor: "#f19a1f #f19a1f #e38b0e", color: "white" }}>CD</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25337" data-name="pkr007" data-balance="0.00" data-title="Withdraw Cash" onclick="CheckActiveUser(25337,this)" data-type="CashOut" data-toggle="tooltip" data-placement="top" title="Withdraw Cash" class="btn btn-info btn-xs-client popup LRPad2" style={{ borderColor: "#46b8da #46b8da #2caed5", backgroundColor: "#5bc0de", color: "white" }}>CW</a>
                                                </div>
                                            </td><td style={{ width: "30px" }}>
                                                <input type="hidden" name="ctl00$ContentPlaceHolder1$dataTable$ctl03$hdnstatus" id="ContentPlaceHolder1_dataTable_hdnstatus_1" value="True" />
                                                <a id="ContentPlaceHolder1_dataTable_LinkButton2_1" href="#">
                                                    <img class="iconWidthHeight img-active-client" src="https://betmax.gold/images/active.png" />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td align="right">0.00</td><td align="right">0.00</td><td align="right">0.00</td><td align="right">0.00</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <div class="pagergrid papergrid-client">
                                <a id="lnkPage" class="aspNetDisabled pageFirst">First</a>
                                <a id="lnkPage" class="aspNetDisabled page1">1</a>
                                <a id="lnkPage" class="aspNetDisabled pageLast">Last</a>
                            </div>
                        </div>
                    </div>
                    <div id="ContentPlaceHolder1_panel_addmoney" class="addtherepist">

                        <input name="ctl00$ContentPlaceHolder1$txtuserreadonly" type="text" readonly="readonly" id="txtuserreadonly" class="form-control" />

                    </div>
                </div>
            </div>
        </AgentLayout >
    );
}
{/* 

            

    <div role="dialog" tabindex="-1" class="modal fade" id="FDModal" aria-hidden="false">
        <div class="modal-dialog modal-lg animated modal-sm bounceIn">
            <div class="modal-content">
                <div class="modal-header">
                    <button aria-hidden="true" data-dismiss="modal" class="close" type="button">×</button>
                    <h4 class="modal-title" id="modal-title" style="text-align: center">
                        <label id="apptitle">ss</label>
                        <input type="hidden" name="ctl00$ContentPlaceHolder1$amountval" id="amountval">
                        <input type="hidden" name="ctl00$ContentPlaceHolder1$HiddenField3" id="HiddenField3">
                        <input type="hidden" name="ctl00$ContentPlaceHolder1$HiddenField2" id="HiddenField2">

                    </h4>
                    <div style="display: none">
                        <select name="ctl00$ContentPlaceHolder1$ddl_tranct_type" id="ddl_tranct_type" class="form-control">
	<option value="0">--Select--</option>
	<option value="CreditOut">CreditOut</option>
	<option selected="selected" value="CreditIn">CreditIn</option>
	<option value="CashOut">CashOut</option>
	<option value="CashIn">CashIn</option>

</select>
                    </div>
                </div>
                <br>
                <div class="modal-body table-primary text-center no-padding">
                    <div>
                        <div class="row no-padding no-margin">
                            <div class="col-md-3" style="padding-top: 5px;">
                                <label class="control-label lblhead">Deposit Chips :</label>
                            </div>
                            <div class="col-md-4">
                                <input name="ctl00$ContentPlaceHolder1$txt_addmoney" type="text" id="txt_addmoney" class="form-control" min="0" onkeyup="TotalBalace();" onkeypress="return validateFloatKeyPress(this,event);">
                                <span id="ContentPlaceHolder1_RequiredFieldValidator5" style="color:Red;visibility:hidden;">*add coins</span>

                            </div>
                            <div class="col-sm-2"></div>
                            <div class="col-sm-3" style="padding-top: 5px; display: none">
                                <label class="control-label">Amount to pay :</label></div>
                            <div class="col-sm-2" style="display: none">
                                <label id="lblCommision" style="font-size: medium"></label>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body" style="min-height: 95px">
                        <div>
                            <table class="table table-hover table-bordered">
                                <tbody>
                                    <tr>
                                        <th></th>
                                        <th>
                                            <label style="font-size: medium" id="lblDL">Distributor (ss)</label></th>
                                        <th>
                                            <label style="font-size: medium" id="lblCL">Client (ss)</label></th>
                                    </tr>
                                    <tr>
                                        <td>Current Chips :</td>
                                        <td><b>
                                            <label id="lblYourCurrentBalance" style="font-weight: bold; font-size: medium">0</label></b></td>
                                        <td><b>
                                            <label id="lblCurrentBalance" style="font-weight: bold; font-size: medium">0</label></b></td>
                                    </tr>
                                    <tr>
                                        <td>New Chips :</td>
                                        <td>
                                            <label id="lblYourTotalBalance" style="font-weight: bold; font-size: medium"></label>
                                        </td>
                                        <td>
                                            <label id="lblTotalBalance" style="font-weight: bold; font-size: medium"></label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Remarks :</td>
                                        <td>
                                            <textarea class="form-control textarea" cols="20" id="txtAdminRemark" name="txtAdminRemark" rows="2"></textarea></td>
                                        <td>
                                            <textarea class="form-control textarea" cols="20" id="txtRemark" name="txtRemark" rows="2"></textarea></td>
                                    </tr>
                                    <tr></tr>
                                </tbody>
                            </table>
                            <br>
                        </div>
                    </div>
                    <div class="modal-footer" id="status">
                        <div>
                            <input type="submit" name="ctl00$ContentPlaceHolder1$btn_add_money" value="Submit" onclick="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$ContentPlaceHolder1$btn_add_money&quot;, &quot;&quot;, true, &quot;adminn&quot;, &quot;&quot;, false, false))" id="ContentPlaceHolder1_btn_add_money" class="btn btn-success" style="margin-left: 15px;">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <div id="Message" class="modal fade" role="dialog">
        <div class="modal-dialog modal-sm">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">×</button>
                </div>
                <div class="modal-body form">
                    <div class="message_">
                        <div class="clearfix"></div>
                           <span id="ContentPlaceHolder1_lblMsg">Label</span>
                    </div>
                    <div class="clear"></div>
                </div>

            </div>

        </div>
    </div>


    <div id="addmoney" class="modal fade" role="dialog">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">×</button>
                </div>
                <div class="modal-body form">
                    <div class="message_">
                        <div class="clearfix"></div>
                        <span id="Label3">Label</span>
                    </div>
                    <div class="clearfix"></div>
                </div>

            </div>

        </div>
    </div>


        */}