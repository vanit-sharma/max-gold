import AgentLayout from "../components/AgentLayout";
import "../../../assets/css/style.css";

export default function ClientPL() {
    return (
        <AgentLayout>
            <div class="head" style={{ display: "inline-block" }}>
                <div class="main-bar heading-pl">
                    <h3><i class="fa fa-shield"></i>&nbsp; Client Profit/Loss</h3>
                </div>
            </div>
            <div class="grid-table table-responsive">
                <table class="table table-bordered table-hover"><thead>
                    <tr>
                        <th class="text-uppercase">
                            <span class="text-pl">GRAND TOTAL</span></th>
                        <th class="text-center">
                            <span id="ContentPlaceHolder1_lblMPF"></span></th>
                        <th class="text-center"><span id="ContentPlaceHolder1_lblSPF"></span>	</th>
                        <th class="text-center"><span id="ContentPlaceHolder1_lblTPF"></span></th>
                        <th class="text-center total"><span id="ContentPlaceHolder1_lblTOTAL"></span></th>
                        <th class="text-center"><span id="ContentPlaceHolder1_lblMCOM"></span></th>
                        <th class="text-center"><span id="ContentPlaceHolder1_lblSCOM"></span></th>
                        <th class="text-center total"><span id="ContentPlaceHolder1_lblTOTALCOM"></span></th>

                        <th class="text-center"><span id="ContentPlaceHolder1_lblMCOMP"></span></th>
                        <th class="text-center"><span id="ContentPlaceHolder1_lblSCOMP"></span></th>
                        <th class="text-center total"><span id="ContentPlaceHolder1_lblTOTALCOMP"></span></th>

                        <th class="text-center total"><span id="ContentPlaceHolder1_lblNETAMOUNT"></span></th>
                        <th class="text-center"><span id="ContentPlaceHolder1_lblFEES"></span></th>
                        <th class="text-center"><span id="ContentPlaceHolder1_lblDL"></span></th>
                        <th class="text-center"><span id="ContentPlaceHolder1_lblMDL"></span></th>


                    </tr>
                </thead></table>
            </div>
        </AgentLayout>
    );
}