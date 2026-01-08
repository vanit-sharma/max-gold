import AgentLayout from "../components/AgentLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/style.css";

export default function AddClients() {
    return (
        <AgentLayout>
            <div id="wrap">
                <div class="head" style={{ display: "inline-block", background: "#eeeeee", color: "#696969" }}>
                    <div class="main-bar">
                        <h3><i class="fa fa-user"></i>&nbsp; Add Client</h3>
                    </div>
                </div>
                <div id="content" class="mt10">
                    <div id="ContentPlaceHolder1_panel_clear" class="addtherepist col-sm-6">

                        <div class="col-sm-6">
                            <label class="control-label">Name</label>
                            <div class="clearfix"></div>
                            <input name="ctl00$ContentPlaceHolder1$txt_name" type="text" id="txt_name" class="form-control" required="required" />
                            <span id="ContentPlaceHolder1_RequiredFieldValidator3" style={{ color: "Red", visibility: "hidden" }}>Enter Name</span>
                        </div>

                        <div class="col-sm-6">
                            <label class="control-label">UserName</label>
                            <div class="clearfix"></div>
                            <input name="ctl00$ContentPlaceHolder1$txt_mobile" type="text" id="txt_mobile" class="form-control" pattern="[a-zA-Z0-9]{4,}" required="required" title="Space Not Allowed/Minimum 4 Character" min="min" onchange="UserAvailability()" />
                            <span id="ContentPlaceHolder1_lblStatus" style={{ fontSize: "13px", marginTop: "-15px" }}></span>
                            <span id="ContentPlaceHolder1_RequiredFieldValidator1" style={{ color: "Red", visibility: "hidden" }}>Enter UserName</span>
                        </div>
                        <div class="col-sm-6">
                            <label class="control-label" >Password</label>
                            <div class="clearfix"></div>
                            <div class="row">
                                <div id="ContentPlaceHolder1_upPanael">

                                    <div class="col-sm-6">
                                        <input name="ctl00$ContentPlaceHolder1$txt_password" type="text" id="ContentPlaceHolder1_txt_password" class="form-control" pattern=".{4,}" required="required" title="4 characters minimum" min="min" />
                                    </div>
                                    <div class="col-sm-4">
                                        <a id="ContentPlaceHolder1_LinkButton1" class="btn btn-default btn-sm btn-custom-submit" href="#" style={{ padding: "3px" }}>Generate Password</a>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="col-sm-12"><span id="ContentPlaceHolder1_RequiredFieldValidator2" style={{ color: "Red", visibility: "hidden" }}>Enter Password</span></div>

                                </div>
                            </div>
                        </div>


                        <div class="col-sm-6">
                            <label class="control-label" >Max Win Limit</label>
                            <div class="clearfix"></div>
                            <input name="ctl00$ContentPlaceHolder1$txt_exposure" type="text" id="txt_exposure" class="form-control" onkeypress="return NumValidate(event)" placeholder="0" />
                            <span id="ContentPlaceHolder1_RequiredFieldValidator7" style={{ color: "Red", visibility: "hidden" }}>Enter Exposure Limit</span>
                        </div>

                        <div class="col-sm-6">
                            <label class="control-label" >Match Commision(%)</label>
                            <div class="clearfix"></div>
                            <input name="ctl00$ContentPlaceHolder1$txtMC" type="text" id="txtMC" class="form-control" min="0" inputmode="numeric" onkeypress="return validateFloatKeyPress(this,event);" />
                            <span id="ContentPlaceHolder1_RequiredFieldValidator5" style={{ color: "Red", visibility: "hidden" }}>Enter Match Commision</span>
                        </div>
                        <div class="col-sm-6">
                            <label class="control-label" >Session Commision(%)</label>
                            <div class="clearfix"></div>
                            <input name="ctl00$ContentPlaceHolder1$txtSC" type="text" value="0" id="txtSC" class="form-control" min="0" inputmode="numeric" onkeypress="return validateFloatKeyPress(this,event);" />
                            <span id="ContentPlaceHolder1_RequiredFieldValidator6" style={{ color: "Red", visibility: "hidden" }}>Enter Session Commision</span>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-actions no-margin-bottom " >
                                <input type="submit" name="ctl00$ContentPlaceHolder1$Button3" value="Submit" onclick="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions(&quot;ctl00$ContentPlaceHolder1$Button3&quot;, &quot;&quot;, true, &quot;admin&quot;, &quot;&quot;, false, false))" id="Button3" className="btn btn-primary btn-custom-submit" />
                            </div>
                        </div>

                    </div>
                </div>
                <div id="Message" class="modal fade" role="dialog">
                    <div class="modal-dialog modal-sm">

                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">×</button>
                            </div>
                            <div class="modal-body form">

                                <div class="message_">
                                    <div class="clearfix"></div>
                                    User Added successfully!
                                </div>
                                <div class="clear"></div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>


        </AgentLayout>
    );
}


{/* 
                
                    




                
*/}








