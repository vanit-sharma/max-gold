import AgentLayout from "../components/AgentLayout";
import "../../../assets/css/style.css";

export default function ReportProLoss() {
    return (
        <AgentLayout>

            <div class="container-fluid">
                <div class="">
                    <input type="hidden" id="hdnVal" value="0" />
                    <div class="panel-heading-proloss text-center">Profit Loss</div>
                    <div>
                        <div class="loading-proloss" style={{ display: "none" }}><i class="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i></div>
                        <div class="row Elements">

                            <div class="col-lg-12 loading-proloss" >
                                <select name="sports" id="sports">
                                    <option value="0">---All---</option>
                                    <option value="1">Soccer</option>
                                    <option value="2">Tennis</option>
                                    <option value="4">Cricket</option>
                                    <option value="5">TeenPatti</option>
                                </select>&nbsp;
                                From&nbsp;
                                <input type="text" class="fromDate" id="txtStartDate" placeholder="Start Date" />&nbsp;
                                To&nbsp;
                                <input type="text" class="toDate" id="txtEndDate" placeholder="End Date" />&nbsp;


                                <a href="javascript:void(0);" class="btn btn-success btn-success-pro" onclick="FilterPL();"><i class="fa fa-search" aria-hidden="true"></i>Filter</a>
                            </div>
                            <div class="col-lg-6"></div>
                        </div>
                    </div>

                    <div class="scrollbar">
                        <div class="grid-table table-responsive">
                            <div>

                                <table class="table table-bordered table-hover table-striped" >
                                    <thead>
                                        <tr class="text-uppercase-pro">
                                            <th>MATCH</th>
                                            <th class="text-center">ODDS</th>
                                            <th class="text-center">SESSION</th>
                                            <th class="text-center">TOSS</th>
                                            <th class="text-center">MATCH COMM.[DL]</th>
                                            <th class="text-center">SESSION COMM.[DL]</th>
                                            <th class="text-center total">COMM. TOTAL[DL]</th>
                                            <th class="text-center total">NET AMOUNT</th>
                                            <th class="text-center">DL</th>
                                            <th class="text-center">MDL</th>
                                        </tr>
                                    </thead>
                                    <tbody class="tblList"></tbody>
                                    <tfoot class="tblTotal" style={{ display: "none" }}>
                                        <tr class="gtotal">
                                            <th class="text-uppercase">TOTAL</th>
                                            <th class="text-center">
                                                <span id="lblMPF" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="lblSPF" data-value="0.00">0.00</span>
                                            </th>
                                            <th class="text-center">
                                                <span id="lblTPF" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="lblMCOM" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="lblSCOM" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="lblCOMTOTAL" data-value="0.00">0.00</span></th>
                                            <th class="text-center total">
                                                <span id="lblTOTAL" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="lblDL" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="lblMDL" data-value="0.00">0.00</span></th>

                                        </tr>
                                        <tr class="gtotal">
                                            <th class="text-uppercase">GRAND TOTAL</th>
                                            <th class="text-center">
                                                <span id="GMPF" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="GSPF" data-value="0.00">0.00</span>
                                            </th>
                                            <th class="text-center">
                                                <span id="GTPF" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="GMCOM" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="GSCOM" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="GCOMTOTAL" data-value="0.00">0.00</span></th>
                                            <th class="text-center total">
                                                <span id="GTOTAL" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="GDL" data-value="0.00">0.00</span></th>
                                            <th class="text-center">
                                                <span id="GMDL" data-value="0.00">0.00</span></th>

                                        </tr>
                                    </tfoot>
                                </table>

                            </div>


                        </div>
                    </div>


                    <div class="row">
                        <div class="col-sm-12">
                            <ul id="pagination-demo" class="pagination-sm pagination"></ul>
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

            </div>


        </AgentLayout >
    );
}




{/*
    

        
    */}