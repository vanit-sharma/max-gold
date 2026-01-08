import AgentLayout from "../components/AgentLayout";
import "../../../assets/css/style.css";

export default function MaxLimit() {
    return (
        <AgentLayout>
            <div class="head" style={{ display: "inline-block" }}>
                <div class="main-bar-max">
                    <h3><i class="fa fa-user"></i>&nbsp; Settings</h3>
                </div>
            </div>
            <div class="scrool">
                <div class="settings-form">
                    <div id="collapse2" class="body">
                        <div class="row">

                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>Match Max Bet</label>
                                    <input type="text" class="form-control form-control-limit" value="0" style={{ color: "#0b0b0b", fontWeight: "600" }} />
                                </div>
                            </div>

                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>Match Min Bet</label>
                                    <input type="number" class="form-control form-control-limit" value="0" style={{ color: "#0b0b0b", fontWeight: "600" }} />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>Session Max Bet</label>
                                    <input type="text" class="form-control form-control-limit" value="0" style={{ color: "#0b0b0b", fontWeight: "600" }} />
                                </div>
                            </div>

                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>Session Min Bet</label>
                                    <input type="number" class="form-control form-control-limit" style={{ color: "#0b0b0b", fontWeight: "600" }} value="0" />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <input type="submit" class="btn btn-default btn-limit" style={{ width: "80px", letterSpacing: "none" }} value="Submit" />
                                </div>
                            </div>

                            <div class="col-sm-6"></div>
                        </div>
                        <div class="row">

                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>Button 1 Value</label>
                                    <input type="text" class="form-control form-control-limit" value="250" style={{ color: "#0b0b0b", fontWeight: "600" }} />
                                </div>
                            </div>

                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label>Button 2 Value</label>
                                    <input type="text" class="form-control form-control-limit" value="500" style={{ color: "#0b0b0b", fontWeight: "600" }} />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label class="control-label">Button 3 Value</label>
                                    <input name="ctl00$ContentPlaceHolder1$txt2" type="text" value="500" id="ContentPlaceHolder1_txt2" class="form-control form-control-limit" required="" onkeypress="return NumValidate(event)" style={{ color: "#0b0b0b", fontWeight: "600" }} />
                                </div>
                            </div>

                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label class="control-label">Button 4 Value</label>
                                    <input name="ctl00$ContentPlaceHolder1$txt4" type="text" value="2000" id="ContentPlaceHolder1_txt4" class="form-control form-control-limit" required="" onkeypress="return NumValidate(event)" style={{ color: "#0b0b0b", fontWeight: "600" }} />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label class="control-label">Button 5 Value</label>
                                    <input name="ctl00$ContentPlaceHolder1$txt5" type="text" value="5000" id="ContentPlaceHolder1_txt5" class="form-control form-control-limit" required="" onkeypress="return NumValidate(event)" style={{ color: "#0b0b0b", fontWeight: "600" }} />
                                </div>
                            </div>

                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label class="control-label">Button 6 Value</label>
                                    <input name="ctl00$ContentPlaceHolder1$txt6" type="text" value="50000" id="ContentPlaceHolder1_txt6" class="form-control form-control-limit" required="" onkeypress="return NumValidate(event)" style={{ color: "#0b0b0b", fontWeight: "600" }} />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <a id="ContentPlaceHolder1_Button1" class="btn btn-default btn-limit" href="javascript:__doPostBack('ctl00$ContentPlaceHolder1$Button1','')">Save</a>

                                </div>
                            </div>



                        </div>

                    </div>
                </div>
            </div>
        </AgentLayout >
    );
}
