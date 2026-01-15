import "../../../assets/css/style.css";

export default function Totalbook({ isOpen, onClose, matchId }) {
    if (!isOpen) return null;
    return (
        <>

            <div className="modal-overlay">
                <div className="modal-box modal-large modal-total">
                    <div className="modal-header">
                        <div class="grid-shadow">
                            <table class="table table-total">
                                <thead>
                                    <tr>
                                        <th colspan="2" class=" totalbook-title-cell ">Total Book-
                                            Toss&nbsp;( <span id="Toss" data-value="0">0</span> ) +
                                            Match&nbsp;( <span id="Match" data-value="0">0</span> ) +
                                            Session&nbsp;( <span id="Sessn" data-value="0">0</span> )
                                        </th>
                                        <th style={{ borderLeft: "1px solid #eaeaea" }} class="totalbook-title-cell"><span id="Total">0</span>
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        {/*<button className="modal-close" onClick={onClose}>X</button>*/}
                    </div>

                    <div class="popdetails">
                        <a onClick={onClose} className="closePrefHelp">X</a>
                        <iframe id="contentFrame" name="contentFrame" style={{ border: "none", width: "100%", height: "400px" }} ></iframe>
                    </div >

                </div>
            </div>


        </>
    );
}