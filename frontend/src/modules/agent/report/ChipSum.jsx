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
                                        <td class="text-center"><a id="ContentPlaceHolder1_lnkToClient" class="btn btn-xs btn-sum" href="cashsum">History</a></td>
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
                                        <td class="text-center"><a id="ContentPlaceHolder1_lnkCashtoMDL" class="btn btn-xs btn-sum" href="cashsum" >History</a></td>
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
                                        <td class="text-center"><a id="ContentPlaceHolder1_btnCFC" class="btn btn-xs btn-sum" href="cashsum">History</a></td>
                                    </tr>


                                    <tr>
                                        <td class="text-right"><b class="">Commission From Clients</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblCLIENTCOM" class="pf-text" style={{ color: "Red" }}></span></td>
                                        <td class="text-center"><a id="ContentPlaceHolder1_lnkCLIENTCOM" class="btn btn-xs btn-sum" href="cashsum">History</a></td>
                                    </tr>



                                    <tr>
                                        <td class="text-right"><b>Cash From MDL</b></td>
                                        <td class="text-bold">
                                            <span id="ContentPlaceHolder1_lblCashFromMDL" style={{ color: "Red" }}></span></td>
                                        <td class="text-center"><a id="ContentPlaceHolder1_lnkCashFromMdl" class="btn btn-xs btn-sum" href="cashsum">History</a></td>
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
