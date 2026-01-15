import { useState } from "react";
import AgentLayout from "../components/AgentLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import DepositModal from "../market_analysis/depositchips";
import Withdraw from "../market_analysis/withdrawchips";
import DepositCash from "../market_analysis/depositcash";
import WithdrawCash from "../market_analysis/withdrawcash";


export default function ClientList() {
    const [status, setStatus] = useState(true);

    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showDepositCash, setShowDepositCash] = useState(false);
    const [showWithdrawCash, setShowWithdrawCash] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const openDepositModal = (client) => {
        setSelectedClient(client);
        setShowDeposit(true);
    };
    const closeDepositModal = () => {
        setShowDeposit(false);
        setSelectedClient(null);
    };

    const openWithdrawModal = (client) => {
        setSelectedClient(client);
        setShowWithdraw(true);
    };
    const closeWithdrawModal = () => {
        setShowWithdraw(false);
        setSelectedClient(null);
    };

    const openDepositCashModal = (client) => {
        setSelectedClient(client);
        setShowDepositCash(true);
    };
    const closeDepositCashModal = () => {
        setShowDepositCash(false);
        setSelectedClient(null);
    };

    const openWithdrawCashModal = (client) => {
        setSelectedClient(client);
        setShowWithdrawCash(true);
    };
    const closeWithdrawCashModal = () => {
        setShowWithdrawCash(false);
        setSelectedClient(null);
    };
    return (
        <AgentLayout>
            <div class="" id="wrap">
                <div class="">
                    <div class="col-sm-6 panel-heading-client">List Of Clients</div><br></br>
                    <div class="col-sm-6">
                        <div class="pull-right">
                            <a href="/agent/addclients" class="btn btn-sm-client btn-success" style={{ fontSize: "12px", marginTop: "-11px" }}><i class="fa fa-user"></i> New</a>&nbsp;
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
                                                    <input id="ContentPlaceHolder1_rdogroup_0" type="radio" name="status" value="true" checked={status === "true"} onChange={() => setStatus("true")} /><label for="ContentPlaceHolder1_rdogroup_0" style={{ color: "#696969" }}>Active</label>
                                                </td>
                                                <td>
                                                    <input id="ContentPlaceHolder1_rdogroup_1" type="radio" name="status" value="False" checked={status === "false"} onChange={() => setStatus("false")} /><label for="ContentPlaceHolder1_rdogroup_1" style={{ color: "#696969" }}>In-Active</label>
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
                                            </td>
                                            <td>25290</td>
                                            <td style={{ width: "200px" }}>
                                                <a id="ContentPlaceHolder1_dataTable_dlname_0" href="#">Chakar90[Chakar90]</a>
                                            </td>
                                            <td>0.00</td>
                                            <td style={{ width: "80px" }}>
                                                <span id="ContentPlaceHolder1_dataTable_lblcradit_0" dataformatstring="{0:N2}" data-value="0.00">0.00</span>
                                            </td>
                                            <td align="right">0.00</td>
                                            <td style={{ width: "80px" }}>
                                                <a id="ContentPlaceHolder1_dataTable_btnLiability_0" dataformatstring="{0:N2}" href="#">0.00</a>
                                            </td>
                                            <td style={{ width: "70px" }}>2</td>
                                            <td style={{ width: "70px" }}>0</td>
                                            <td style={{ width: "70px" }}>1000.00</td><td style={{ width: "170px" }}>
                                                <div class="text-white-space">
                                                    <a href="#" target="_blank" data-toggle="tooltip" data-placement="top" title="Log" class="btn btn-green btn-xs-client LRPad2" onClick={(e) => { e.preventDefault(); window.open("/agent/clientacc", "_blank", "noopener,noreferrer,width=1500,height=500"); }} > Log</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25290" data-name="Chakar90" data-balance="0.00" data-title="Deposit Chips" data-type="CreditIn" data-toggle="tooltip" data-placement="top" title="Deposit Chips" class="btn btn-warning btn-xs-client popup LRPad2" style={{ backgroundColor: "#f4b04f", borderColor: "#f19a1f #f19a1f #e38b0e", color: "white" }} onClick={(e) => {
                                                        e.preventDefault();
                                                        openDepositModal({
                                                            id: 25290,
                                                            name: "Chakar90",
                                                            balance: "0.00"
                                                        });
                                                    }}>D</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25290" data-name="Chakar90" data-balance="0.00" data-title="Withdraw Chips" onclick="CheckActiveUser(25290,this)" data-type="CreditOut" data-toggle="tooltip" data-placement="top" title="Withdraw Chips" class="btn btn-info btn-xs-client popup LRPad2" style={{ borderColor: "#46b8da #46b8da #2caed5", backgroundColor: "#5bc0de", color: "white" }} onClick={(e) => {
                                                        e.preventDefault();
                                                        openWithdrawModal({
                                                            id: 25290,
                                                            name: "Chakar90",
                                                            balance: 0.0
                                                        });
                                                    }}>W</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25290" data-name="Chakar90" data-balance="0.00" data-title="Deposit Cash" onclick="CheckActiveUser(25290,this)" data-type="CashIn" data-toggle="tooltip" data-placement="top" title="Deposit Cash" class="btn btn-warning btn-xs-client popup LRPad2" style={{ backgroundColor: "#f4b04f", borderColor: "#f19a1f #f19a1f #e38b0e", color: "white" }} onClick={(e) => {
                                                        e.preventDefault();
                                                        openDepositCashModal({
                                                            id: 25290,
                                                            name: "Chakar90",
                                                            balance: 0.0
                                                        });
                                                    }}>CD</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25290" data-name="Chakar90" data-balance="0.00" data-title="Withdraw Cash" onclick="CheckActiveUser(25290,this)" data-type="CashOut" data-toggle="tooltip" data-placement="top" title="Withdraw Cash" class="btn btn-info btn-xs-client popup LRPad2" style={{ borderColor: "#46b8da #46b8da #2caed5", backgroundColor: "#5bc0de", color: "white" }} onClick={(e) => {
                                                        e.preventDefault();
                                                        openWithdrawCashModal({
                                                            id: 25290,
                                                            name: "Chakar90",
                                                            balance: 0.0
                                                        });
                                                    }}>CW</a>
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
                                                    <a href="../include/ClientChipStatement.aspx?I1rHMvyeHbr87IntkJKBoXXgPfvpnjhv" id="ContentPlaceHolder1_dataTable_btn_wallet_1" target="_blank" data-toggle="tooltip" data-placement="top" title="Log" class="btn btn-green btn-xs-client LRPad2" onClick={(e) => { e.preventDefault(); window.open("/agent/clientacc", "_blank", "noopener,noreferrer,width=1500,height=500"); }}>Log</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25337" data-name="pkr007" data-balance="0.00" data-title="Deposit Chips" onclick="CheckActiveUser(25337,this)" data-type="CreditIn" data-toggle="tooltip" data-placement="top" title="Deposit Chips" class="btn btn-warning btn-xs-client popup LRPad2" style={{ backgroundColor: "#f4b04f", borderColor: "#f19a1f #f19a1f #e38b0e", color: "white" }} onClick={(e) => {
                                                        e.preventDefault();
                                                        openDepositModal({
                                                            id: 25337,
                                                            name: "pkr007",
                                                            balance: "0.00"
                                                        });
                                                    }}>D</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25337" data-name="pkr007" data-balance="0.00" data-title="Withdraw Chips" onclick="CheckActiveUser(25337,this)" data-type="CreditOut" data-toggle="tooltip" data-placement="top" title="Withdraw Chips" class="btn btn-info btn-xs-client popup LRPad2" style={{ borderColor: "#46b8da #46b8da #2caed5", backgroundColor: "#5bc0de", color: "white" }} onClick={(e) => {
                                                        e.preventDefault();
                                                        openWithdrawModal({
                                                            id: 25337,
                                                            name: "pkr007",
                                                            balance: 0.0
                                                        });
                                                    }}>W</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25337" data-name="pkr007" data-balance="0.00" data-title="Deposit Cash" onclick="CheckActiveUser(25337,this)" data-type="CashIn" data-toggle="tooltip" data-placement="top" title="Deposit Cash" class="btn btn-warning btn-xs-client popup LRPad2" style={{ backgroundColor: "#f4b04f", borderColor: "#f19a1f #f19a1f #e38b0e", color: "white" }} onClick={(e) => {
                                                        e.preventDefault();
                                                        openDepositCashModal({
                                                            id: 25337,
                                                            name: "pkr007",
                                                            balance: 0.0
                                                        });
                                                    }}>CD</a>
                                                    &nbsp;
                                                    <a href="#" data-id="25337" data-name="pkr007" data-balance="0.00" data-title="Withdraw Cash" onclick="CheckActiveUser(25337,this)" data-type="CashOut" data-toggle="tooltip" data-placement="top" title="Withdraw Cash" class="btn btn-info btn-xs-client popup LRPad2" style={{ borderColor: "#46b8da #46b8da #2caed5", backgroundColor: "#5bc0de", color: "white" }} onClick={(e) => {
                                                        e.preventDefault();
                                                        openWithdrawCashModal({
                                                            id: 25337,
                                                            name: "pkr007",
                                                            balance: 0.0
                                                        });
                                                    }}>CW</a>
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
            <DepositModal
                isOpen={showDeposit}
                onClose={closeDepositModal}
                client={selectedClient}
            />
            <Withdraw
                isOpen={showWithdraw}
                onClose={closeWithdrawModal}
                client={selectedClient}
            />
            <DepositCash
                isOpen={showDepositCash}
                onClose={closeDepositCashModal}
                client={selectedClient}
            />
            <WithdrawCash
                isOpen={showWithdrawCash}
                onClose={closeWithdrawCashModal}
                client={selectedClient}
            />

        </AgentLayout >
    );
}
