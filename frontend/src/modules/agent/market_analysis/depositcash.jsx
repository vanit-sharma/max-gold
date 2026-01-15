import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/style.css";
export default function DepositCash({ isOpen, onClose, client }) {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-header">
                    <h3 style={{ textAlign: "center" }}>Deposit Cash ({client?.name})</h3>
                    <button aria-hidden="true" data-dismiss="modal" class="close" type="button" onClick={onClose}>×</button>
                    {/*<button className="close-btn" onClick={onClose}>×</button>*/}
                </div>
                <div className="modal-body">
                    <div className="form-group" style={{ padding: "15px 10px" }}>
                        <label>Deposit Cash:&nbsp; <input type="text" className="form-control-in" /></label>
                    </div>
                    <table className="table table-bordered table-dep">
                        <colgroup>
                            <col style={{ width: "30%" }} />
                            <col style={{ width: "35%" }} />
                            <col style={{ width: "35%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Distributor</th>
                                <th>Client</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td >Current Chips</td>
                                <td>50000.00</td>
                                <td>{client?.balance}</td>
                            </tr>
                            <tr>
                                <td>New Chips</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><div className="form-group">
                                    <label>Remarks:</label></div></td>
                                <td><textarea className="form-control"></textarea></td>
                                <td><textarea className="form-control"></textarea></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-success">Submit</button>
                </div>
            </div>
        </div>
    );
}
