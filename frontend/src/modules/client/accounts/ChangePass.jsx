import ClientLayout from "../components/layout/ClientLayout";
import "../../../assets/css/style.css";

export default function ChangePass() {
    return (
        <ClientLayout>

            <div class="">

                <div class="col-xs-12">
                    <div class="sec-wrap change-passwordwpr">
                        <h2>Change your password</h2>

                        <div id="demo-form2" class="form-horizontal form-label-left" style={{ width: "100%", height: "40px", marginTop: "0px" }}>
                            <div class="form-group">
                                <label class="control-label col-md-4 col-sm-4 col-xs-12" for="first-name" style={{ fontSize: "15px" }}>
                                    <b>Old Password</b>
                                </label>
                                <div class="col-md-8 col-sm-8 col-xs-12">
                                    <input name="oldpassword" type="password" id="ContentPlaceHolder1_txt_oldpassword" class="form-control col-md-7 col-xs-12" style={{ width: "500px" }} />
                                    <span class="required">
                                        <span id="ContentPlaceHolder1_RequiredFieldValidator1" class="txt-required" style={{ color: "red", display: "none" }}> Required</span>
                                    </span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-4 col-sm-4 col-xs-12" for="first-name" style={{ fontSize: "15px" }}>
                                    <b> New Password</b></label>
                                <div class="col-md-8 col-sm-8 col-xs-12">
                                    <input name="newpassword" type="password" id="ContentPlaceHolder1_txt_newpassword" class="form-control col-md-7 col-xs-12" style={{ width: "500px" }} />
                                    <span class="required">
                                        <span id="ContentPlaceHolder1_RequiredFieldValidator3" class="txt-required" style={{ color: "red", display: "none" }}>Required</span>
                                    </span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-4 col-sm-4 col-xs-12" for="first-name" style={{ fontSize: "15px" }}>
                                    <b>Confirm Password</b>
                                </label>
                                <div class="col-md-8 col-sm-12 col-xs-12">
                                    <input name="cfpassword" type="password" id="ContentPlaceHolder1_txt_cppassword" class="form-control col-md-7 col-xs-12" style={{ width: "500px" }} />
                                    <span class="required">
                                        <span id="ContentPlaceHolder1_RequiredFieldValidator2" class="txt-required" style={{ color: "red", display: "none" }}>Required</span></span>
                                    <span class="required">
                                        <span id="ContentPlaceHolder1_CompareValidator2" class="txt-required" style={{ color: "red", width: "240px", textAlign: "left", visibility: "hidden" }}>Password does not match.</span>
                                    </span>
                                </div>
                            </div>

                            <div class="ln_solid"></div>
                            <div class="form-group">
                                <div class="col-md-6 col-sm-6 col-xs-12 col-sm-offset-4">
                                    <input type="submit" name="ctl00$ContentPlaceHolder1$btn_submit" value="Submit" id="ContentPlaceHolder1_btn_submit" class="btn btn-primary" style={{ width: "110px" }} />
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
