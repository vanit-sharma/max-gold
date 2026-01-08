import AgentLayout from "../components/AgentLayout";
import "../../../assets/css/style.css";

export default function ChipSum() {
    return (
        <AgentLayout>
            <br></br>
            <div class="text-center-sum">
                Chip Summary-
                <span id="ContentPlaceHolder1_lblDLName" class="text-center-sum">Asaddd</span>
            </div>
            <br></br>
            <div class="ChipSummery">
                <div class="">
                    <div class="grid-table table-responsive">
                        <div class="col-sm-12 col-md-6  ">
                            <div class="table-header cursor-pointer table-header-sum">
                                <div class="table-caption-sum">
                                    Client in Plus (Profit)
                                </div>
                            </div>
                            <table class="table table-bordered " >
                                <thead >
                                    <tr class="table-sum" >
                                        <th>Name</th>
                                        <th>Profit</th>
                                        <th class="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td class="text-right"><b class="">Cash to Clients</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblCashp" class="pf-text"></span>
                                        </td>
                                        <td class="text-center"><a id="ContentPlaceHolder1_lnkToClient" class="btn btn-xs btn-sum">History</a></td>
                                    </tr>

                                    <tr>
                                        <td class="text-right"><b>DL P &amp; L</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblDLPF"></span></td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td class="text-right"><b>MDL P &amp; L</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblMDLPF" class="pf-text"></span></td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td class="text-right"><b>Cash to MDL</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblCashtoMDL"></span></td>
                                        <td class="text-center"><a id="ContentPlaceHolder1_lnkCashtoMDL" class="btn btn-xs btn-sum" >History</a></td>
                                    </tr>

                                    <tr class=" total_count trfooter-blue">
                                        <td class="text-right" style={{ color: "#ffffff" }}><b>Total</b></td>
                                        <td class=" text-bold">
                                            <span id="ContentPlaceHolder1_lblTotalProfit" class="pf-text"></span></td>
                                        <td></td>
                                    </tr>
                                    <tr class="total-bold">
                                        <td class="text-right"><b>Total DL &amp; MDL P &amp; F</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_total"></span></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>




                        <div class="col-sm-12 col-md-6 ">
                            <div class="table-header cursor-pointer table-header-red">
                                <div class="table-caption-sum">
                                    Client in Minus (Loss)

                                </div>
                            </div>
                            <div id="ContentPlaceHolder1_pnlClientMinus">

                            </div><div id="ContentPlaceHolder1_pnlMDLFrom">

                            </div><table class="table table-bordered table-hover table-loss">
                                <thead>
                                    <tr class="table-loss-head">
                                        <th>Name</th>
                                        <th>Balance</th>
                                        <th class="text-center" style={{ width: "20px" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td class="text-right"><b>Cash from Clients</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblCashFromClients" class="pf-text" style={{ color: "Red" }}></span></td>
                                        <td class="text-center"><a id="ContentPlaceHolder1_btnCFC" class="btn btn-xs btn-sum">History</a></td>
                                    </tr>


                                    <tr>
                                        <td class="text-right"><b class="">Commission From Clients</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblCLIENTCOM" class="pf-text" style={{ color: "Red" }}></span></td>
                                        <td class="text-center"><a id="ContentPlaceHolder1_lnkCLIENTCOM" class="btn btn-xs btn-sum" >History</a></td>
                                    </tr>



                                    <tr>
                                        <td class="text-right"><b>Cash From MDL</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblCashFromMDL" style={{ color: "Red" }}></span></td>
                                        <td class="text-center"><a id="ContentPlaceHolder1_lnkCashFromMdl" class="btn btn-xs btn-sum" >History</a></td>
                                    </tr>



                                    <tr class="total_count trfooter-red table-loss-head">
                                        <td class="text-right"><b>Total</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblTotalLoss"></span></td>
                                        <td></td>
                                    </tr>
                                    <tr class="total-bold">
                                        <td class="text-right"><b>Total DL &amp; MDL P &amp; F</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_ltotal"></span></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>






                    </div>
                </div>
            </div>

        </AgentLayout>
    );
}

{/*
    
 
    <div id="ContentPlaceHolder1_UpdatePanel2">
	 
  

  
   

    <div id="addmoney" class="modal fade" role="dialog">
        <div class="modal-dialog modal-sm">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header text-center">
                    <input type="hidden" name="ctl00$ContentPlaceHolder1$dlId" id="ContentPlaceHolder1_dlId">
                    <input type="hidden" name="ctl00$ContentPlaceHolder1$mdlUsername" id="ContentPlaceHolder1_mdlUsername">
                    <input type="hidden" name="ctl00$ContentPlaceHolder1$ttype" id="ContentPlaceHolder1_ttype">
                    <input type="hidden" name="ctl00$ContentPlaceHolder1$HiddenField4" id="ContentPlaceHolder1_HiddenField4">
                    <span id="ContentPlaceHolder1_lblUser"></span>
                    <button type="button" class="close" data-dismiss="modal">×</button>
                </div>
                <div class="modal-body form">
                    <div id="ContentPlaceHolder1_panel_addmoney" class="addtherepist">
		

                        <div class="clearfix"></div>
                        <input type="hidden" name="ctl00$ContentPlaceHolder1$amountval" id="ContentPlaceHolder1_amountval">


                        <span id="task_message"></span>
                        <div class="clearfix"></div>
                        <div class="form-group">
                            <div>

                                <div class="col-sm-12">
                                    <label class="control-label">Amount</label>
                                    <input name="ctl00$ContentPlaceHolder1$txtAmount" type="text" id="txtAmount" class="form-control" min="0" inputmode="numeric" onkeypress="return validateFloatKeyPress(this,event);">
                                    <span id="ContentPlaceHolder1_RequiredFieldValidator5" style="color:Red;visibility:hidden;">*Add Amount</span>
                                </div>
                                <div class="col-sm-12">
                                    <label class="control-label">Current Balance</label>
                                    <input name="ctl00$ContentPlaceHolder1$txtCbal" type="text" readonly="readonly" id="ContentPlaceHolder1_txtCbal" class="form-control">

                                </div>

                                <div class="col-sm-12">
                                    <label class="control-label">Remark</label>
                                    <textarea name="ctl00$ContentPlaceHolder1$txtRemark" rows="2" cols="20" id="txtRemark" class="form-control"></textarea>
                                </div>




                                <div class="col-sm-3">
                                    <div class="form-actions no-margin-bottom">
                                        <br>
                                        <input type="submit" name="ctl00$ContentPlaceHolder1$btn_add_money" value="Submit" onclick="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$ContentPlaceHolder1$btn_add_money&quot;, &quot;&quot;, true, &quot;adminn&quot;, &quot;&quot;, false, false))" id="ContentPlaceHolder1_btn_add_money" class="btn btn-primary" style="margin-left: 15px;">
                                    </div>
                                    <div class="clearfix"></div>
                                </div>

                                </div>
                            </div>
                                <div class="clearfix"></div>
                    
	</div>
                    <div class="clearfix"></div>
                </div>

            </div>
            <div class="clearfix"></div>
        </div>
    </div>

 
                 
</div>

        <div id="taskMsg" class="modal fade" role="dialog">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">×</button>
                </div>
                <div class="modal-body form">
                    <div class="message_">
                       <div class="warning"><span class="" id="alert"></span></div>

                    </div>
                    <div class="clearfix"></div>
                </div>

            </div>

        </div>
    </div>

        </div>
    */}