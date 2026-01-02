import ClientLayout from "../components/layout/ClientLayout";
import "../../../assets/css/style.css";

export default function ButtonValue() {
    return (
        <ClientLayout>
            <div class="stacklistWrp">
                <div class="title pull-left col-xs-12">
                    <h2 class="page-title" style={{ fontSize: "100%", fontWeight: "600", fontSize: "17px", margin: "0px" }}><b>Edit Stake</b></h2>
                </div>
                <div class="col-sm-3 col-xs-12" style={{ padding: "0px 9px", fontSize: "15px" }}>
                    <div class="form-group">
                        <div class="stake-input">
                            <input name="ctl00$ContentPlaceHolder1$txt1" value="10" id="ContentPlaceHolder1_txt1" pattern="^(0|[1-9][0-9]*)$" autocomplete="off" placeholder="" min="0" class="text-input text-input-md" autocorrect="off" focusable="" onkeypress="return NumValidate(event)" type="tel" />
                        </div>
                        <div class="stake-input">
                            <input name="ctl00$ContentPlaceHolder1$txt2" value="20" id="ContentPlaceHolder1_txt2" pattern="^(0|[1-9][0-9]*)$" autocomplete="off" placeholder="" min="0" class="text-input text-input-md" autocorrect="off" focusable="" onkeypress="return NumValidate(event)" type="tel" />
                        </div>
                        <div class="stake-input">
                            <input name="ctl00$ContentPlaceHolder1$txt3" value="50" id="ContentPlaceHolder1_txt3" pattern="^(0|[1-9][0-9]*)$" autocomplete="off" placeholder="" min="0" class="text-input text-input-md" autocorrect="off" focusable="" onkeypress="return NumValidate(event)" type="tel" />

                        </div>
                    </div>
                </div>

                <div class="col-sm-3 col-xs-12" style={{ padding: "0px 9px", fontSize: "15px" }}>
                    <div class="form-group">
                        <div class="stake-input">
                            <input name="ctl00$ContentPlaceHolder1$txt4" value="100" id="ContentPlaceHolder1_txt4" pattern="^(0|[1-9][0-9]*)$" autocomplete="off" placeholder="" min="0" class="text-input text-input-md" autocorrect="off" focusable="" onkeypress="return NumValidate(event)" type="tel" />
                        </div>
                        <div class="stake-input">
                            <input name="ctl00$ContentPlaceHolder1$txt5" value="500" id="ContentPlaceHolder1_txt5" pattern="^(0|[1-9][0-9]*)$" autocomplete="off" placeholder="" min="0" class="text-input text-input-md" autocorrect="off" focusable="" onkeypress="return NumValidate(event)" type="tel" />
                        </div>
                        <div class="stake-input">
                            <input name="ctl00$ContentPlaceHolder1$txt6" value="1000" id="ContentPlaceHolder1_txt6" pattern="^(0|[1-9][0-9]*)$" autocomplete="off" placeholder="" min="0" class="text-input text-input-md" autocorrect="off" focusable="" onkeypress="return NumValidate(event)" type="tel" />

                        </div>
                    </div>

                    <div class="clearfix">


                    </div>

                    {/*<div class="modal-body">
                    <ol style={{ fontSize: "14px", padding: "10px" }}>

                        <li>1. If you are placing bet that mean you are accepting our Betting Agreement.</li>
                        <li>2. Cheating Bets Deleted Automatically . No Claims.</li>
                        <li>3. Worng Rate Bets Deleted Automatically in Fancy and ODDS . No Claims.</li>
                        <li>4. cheating and Un-Fair Bets Cancelled Or Corrected Even After SETTELING.</li>
                        <li>5. In All Events Max Back Rate is 100. All Back Bets Chanched To 100. If you More Feeded By You.</li>
                        <li>6. Dead Hit Rule Feeded By Betfair.</li>
                        <li>7. You are only responsible of your account and passwords.</li>
                        <li>8. Local Fancy On Haar Jeet Bassis .</li>
                        <li>9. On Match Canclled, NO Result Abandoned ETC. Completed Sessions Settled.</li>
                        <li>10. On Match Tie, All Completed Sessions Settled.</li>
                        <li>11. If You Not Accept This Agreement Do Not Place Bet.</li>
                        <li>12. Administrator Decision Is Final No Claim On It.</li>
                        <li>13. This Website for Fun Betting Only. No Real Money Involed.</li>
                        <li>14. All Events On Haar Jeet Bassis. If we Are Facing Any Issue On Server End.</li>
                        <li>15. If You Have Any Issue You Can Contact Your Dealer.</li>
                        <li>16. For any commision issue Contact Your Dealer.</li>
                        <li>17. From your winnings, all dealers are responsible to pay you min. x2 of your last deposit amount in every 24hours</li>
                    </ol>

                </div>*/}
                </div>
                <b><input type="submit" name="ctl00$ContentPlaceHolder1$Button1" value="Save" id="ContentPlaceHolder1_Button1" analytics-on="" color="cta-primary" ion-button="" class="button button-md button-default button-default-md button-md-cta-primary" style={{ padding: "0px 12px", fontSize: "15px", marginTop: "40px" }}></input></b>
            </div>
        </ClientLayout >
    );
}