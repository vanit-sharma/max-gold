import AgentLayout from "./components/AgentLayout";
import "../../assets/css/style.css";

export default function MarketProfitLoss() {
    return (
        <AgentLayout>
            <div class="head" style={{ display: "inline-block" }}>
                <div class="main-bar"><h3 style={{ color: "#696969", fontWeight: "600", fontSize: "23px" }}><i class=" fa fa-book"></i>&nbsp;Profit/Loss </h3></div>
            </div>
            <div id="ContentPlaceHolder1_UpdateProgress1" style={{ display: "none", role: "status", ariaHidden: "true" }}>
                <div class="modalload">
                    <div class="center">
                        <img alt="" src="/images/loader.gif" />
                    </div>
                </div>
            </div>

            <div class="scrollbar">
                <div class="grid-table table-responsive">
                    <div class="row market-row">
                        <div class="col-md-2 col-sm-6">
                            <div class="form-group formgroup-market">
                                <label for="sports" class="control-label">Sports:</label>
                                <select name="ctl00$ContentPlaceHolder1$ddlsports" id="ContentPlaceHolder1_ddlsports" class="form-control box-market">
                                    <option selected="selected" value="0">all</option>
                                    <option value="4">Cricket</option>
                                    <option value="1">Soccer</option>
                                    <option value="2">Tennis</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 col-sm-6">
                                <div class="form-group formgroup-market">
                                    <label for="email" class="control-label">From:</label>
                                    <input name="ctl00$ContentPlaceHolder1$txtFrom" type="text" value="1/7/2026" id="ContentPlaceHolder1_txtFrom" class="form-control hasDatepicker box-market" />
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-6">
                                <div class="form-group formgroup-market">
                                    <label for="email" class="control-label">To:</label>
                                    <input name="ctl00$ContentPlaceHolder1$txtTo" type="text" value="1/14/2026" id="ContentPlaceHolder1_txtTo" class="form-control hasDatepicker box-market" />
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-6 ">
                                <div class=" formgroup-market">
                                    <div class=" no-margin-bottom">
                                        <div class="col-md-3 col-sm-6 btn-col-market">
                                            <input type="submit" name="ctl00$ContentPlaceHolder1$btnSearch" value="Submit" id="ContentPlaceHolder1_btnSearch" class="btn btn-primary btn-sub-market" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div id="ContentPlaceHolder1_upPanaelnew">
                        <div id="ContentPlaceHolder1_Panel1">
                            <table class="table table-bordered table-hover table-market">
                                <thead>
                                    <tr class="text-uppercase">
                                        <th class="text-left">Match</th>
                                        <th class="text-center total">Net Amount</th>
                                        <th class="text-center">DL</th>
                                        <th class="text-center">MDL</th>
                                        <th class="text-center">Match Comm.</th>
                                        <th class="text-center">Session Comm.</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr class="gtotal">
                                        <th class="text-uppercase text-left">GRAND TOTAL</th>
                                        <th class="text-center total"><span id="ContentPlaceHolder1_lblTOTAL"></span></th>
                                        <th class="text-center"><span id="ContentPlaceHolder1_lblDL"></span></th>
                                        <th class="text-center"><span id="ContentPlaceHolder1_lblMDL"></span></th>
                                        <th class="text-center"><span id="ContentPlaceHolder1_lblMCOM"></span></th>
                                        <th class="text-center"><span id="ContentPlaceHolder1_lblSCOM"></span></th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id="content_holder" class="popbox0">
                <div class="popdetails">
                    <a class="closePrefHelp">X</a>
                    <iframe id="contentFrame" name="contentFrame" style={{ border: "none", width: "100%", height: "470px" }}></iframe>
                </div>
            </div>
            <div id="opaque"></div>


        </AgentLayout >
    );
}


