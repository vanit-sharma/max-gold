import "../../../assets/css/style.css";

export default function CashSum() {
    return (
        <>
            <div class="row">

                <div class="panel-heading-cash  chip-heading">
                    <h3>Cash Summary</h3>
                </div>

            </div>


            <div id="upPanaelnew">
                <div class="col-sm-12">
                    <label class="control-label"></label>
                    <div class="styled-checkbox" style={{ display: "none" }}>
                        <table id="RadioButtonList1">
                            <tbody>
                                <tr>
                                    <td>
                                        <input id="RadioButtonList1_0" type="radio" name="RadioButtonList1" value="1" checked="checked" />
                                        <label for="RadioButtonList1_0">Cash To Clients</label>
                                    </td>
                                    <td>
                                        <input id="RadioButtonList1_1" type="radio" name="RadioButtonList1" value="2" onclick="#" />
                                        <label for="RadioButtonList1_1">Cash From Clints</label>
                                    </td>
                                    <td>
                                        <input id="RadioButtonList1_2" type="radio" name="RadioButtonList1" value="3" onclick="#" />
                                        <label for="RadioButtonList1_2">Cash To MDL</label>
                                    </td>
                                    <td>
                                        <input id="RadioButtonList1_3" type="radio" name="RadioButtonList1" value="4" onclick="#" />
                                        <label for="RadioButtonList1_3">Cash From Clients</label>
                                    </td>
                                    <td>
                                        <input id="RadioButtonList1_4" type="radio" name="RadioButtonList1" value="5" onclick="#" />
                                        <label for="RadioButtonList1_4">Clients COMM.</label>
                                    </td>
                                    <td>
                                        <input id="RadioButtonList1_5" type="radio" name="RadioButtonList1" value="6" onclick="#" />
                                        <label for="RadioButtonList1_5">DL COMM.</label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="scrool">
                    <div id="pnllist">
                        <div class="table-">
                            <table id="myTable" class="table table-bordered table-heading-cash">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>CR</th>
                                        <th>DR</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
