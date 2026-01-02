import { useState } from "react";
import ClientLayout from "../components/layout/ClientLayout";
import "../../../assets/css/style.css";

export default function Rules() {
    const [showBox, setShowBox] = useState(true);
    return (
        <ClientLayout>
            <div className="modal-dialog agreement-modal" role="document">
                <div class="modal-content">
                    {showBox && (
                        <>
                            <div class="modal-header" style={{ backgroundColor: "#e7e8e8", padding: "7px", justifyContent: "flex-start", letterSpacing: "-0.5px" }}>
                                <h5 class="modal-title" id="exampleModalLabel" style={{ color: "#333", backgroundColor: "#e7e8e8", fontSize: "18px", marginBottom: "0px" }}><b>Betting Agreement</b></h5>
                            </div>

                            <div class="modal-body" style={{ position: "relative", padding: "15px" }} >
                                <ol style={{ fontSize: "15px", padding: "10px", letterSpacing: "-0.5px", marginTop: "0px", lineHeight: "1.2" }}>

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

                            </div>

                            <div class="modal-footer"><button type="button" class="btn btn-default" style={{ width: "95px", marginTop: "0px" }} onClick={() => setShowBox(false)}>Close</button>
                            </div>
                        </>
                    )}


                    <div class="clearfix"></div>
                </div>
            </div>
        </ClientLayout >
    );
}

{/* 
    <div class="modal-dialog" role="document">
                <div class="modal-content">
                     <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Betting Agreement</h5>
                    </div>
                    <div class="modal-body">
                     <ol style="font-size: 14px;padding: 10px;">
					 
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

                    </div> 
                    <div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                    <div class="clearfix"></div>
                    </div>
                </div>
    */}