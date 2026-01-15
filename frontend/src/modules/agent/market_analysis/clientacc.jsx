import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/style.css";

export default function ClientAcc() {
    const [selectedOption, setSelectedOption] = useState("1");
    return (
        <>
            <div class="row">
                <div class="panel-heading-acc text-center">
                    <h2>Client Account Statement</h2>
                </div>
            </div>

            <div id="upPanaelnew">

                <div class="col-sm-12">
                    <label class="control-label"></label>
                    <div class="styled-checkbox">
                        <ul id="RadioButtonList1">
                            <li>
                                <input id="RadioButtonList1_0" type="radio" name="RadioButtonList1" value="1" checked={selectedOption === "1"} onChange={() => setSelectedOption("1")} />
                                <label for="RadioButtonList1_0">Show Cash Entry &amp; Market Profit &amp; Loss</label>
                            </li>
                            <li>
                                <input id="RadioButtonList1_1" type="radio" name="RadioButtonList1" value="2" checked={selectedOption === "2"} onChange={() => setSelectedOption("2")} />
                                <label for="RadioButtonList1_1">Show Cash Entry</label>
                            </li>
                            <li>
                                <input id="RadioButtonList1_2" type="radio" name="RadioButtonList1" value="3" checked={selectedOption === "3"} onChange={() => setSelectedOption("3")} />
                                <label for="RadioButtonList1_2">Market Commision</label></li>
                            <li>
                                <input id="RadioButtonList1_3" type="radio" name="RadioButtonList1" value="4" checked={selectedOption === "4"} onChange={() => setSelectedOption("4")} />
                                <label for="RadioButtonList1_3">Session Profit &amp; Loss</label>
                            </li>
                            <li>
                                <input id="RadioButtonList1_4" type="radio" name="RadioButtonList1" value="5" checked={selectedOption === "5"} onChange={() => setSelectedOption("5")} /><label for="RadioButtonList1_4">Toss Profit &amp; Loss</label>
                            </li>
                            <li>
                                <input id="RadioButtonList1_5" type="radio" name="RadioButtonList1" value="6" checked={selectedOption === "6"} onChange={() => setSelectedOption("6")} /><label for="RadioButtonList1_5">Market Profit &amp; Loss</label>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="scrool">



                </div>
            </div>
        </>
    );
}