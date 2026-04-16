import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import ClientLayout from "../components/layout/ClientLayout";
import "../../../assets/css/style.css";
import DatePickerComponent from "../components/DatePickerComponent";
import axiosInstance from "../../../utils/axiosInstance";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../store/loaderSlice";
import { DataGrid } from "@mui/x-data-grid";

//import Grid, { ColDef, RowDef, SortColDef, TableSortModel } from "@/grid";

export default function ProfitLoss() {
    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth(); // 0-based: 0 = Jan
    const dayOfMonth = today.getDate();
    const [statement, setStatement] = useState([]);
    const loadingRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const todayInputStr = today.toISOString().split("T")[0];
    const todayStart = new Date(year, monthIndex, dayOfMonth, 0, 0, 0, 0);
    const todayEnd = new Date(year, monthIndex, dayOfMonth, 23, 59, 59, 999);
    const [startDateInput, setStartDateInput] = useState(todayInputStr);
    const [endDateInput, setEndDateInput] = useState(todayInputStr);

    const [startDate, setStartDate] = useState(todayStart);
    const [endDate, setEndDate] = useState(todayEnd);
    const startDateSet = (date) => {
        setStartDate(date);
    };

    const endDateSet = (date) => {
        setEndDate(date);
    };
    const dispatch = useDispatch();

    const [selectedFromDate, setSelectedFromDate] = useState(todayStart);
    const [selectedToDate, setSelectedToDate] = useState(todayEnd);
    const [profitLossList, setProfitLossList] = useState([]);

    const [cricektPL, setCricektPL] = useState(0);
    const [fancyPL, setFancyPL] = useState(0);
    const [soccerPL, setSoccerPL] = useState(0);
    const [tennisPL, setTennisPL] = useState(0);
    const [horseRacePL, setHorseRacePL] = useState(0);
    const [grayHoundPL, setGrayHoundPL] = useState(0);
    const [worldCasinoPL, setWorldCasinoPL] = useState(0);
    const [betfairGamesPL, setBetfairGamesPL] = useState(0);
    const [galexyStudioPL, setGalexyStudioPL] = useState(0);
    const [tpStudioPL, setTpStudioPL] = useState(0);
    const [grandTotalPL, setGrandTotalPL] = useState(0);

    const [profitUsers, setProfitUsers] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [showLoader, setShowLoader] = useState(false);
    const [detailsUsername, setDetailsUsername] = useState("");
    let username = "";
    const userInfo = useSelector((state) => state.userStore);
    if (
        userInfo !== null &&
        userInfo !== undefined &&
        userInfo.data !== null &&
        userInfo.data !== undefined
    ) {
        username = userInfo.data.uname;
    }

    function toLocalString(d) {
        const pad = (x) => String(x).padStart(2, "0");
        return (
            `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
            `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        );
    }


    const getProfitLoss = async () => {
        try {
            setProfitLossList([]);
            let resultObj = {};
            await dispatch(setLoader(true));
            let frm = toLocalString(selectedFromDate);
            let til = toLocalString(selectedToDate);

            resultObj.fromdate = frm;
            resultObj.todate = til;

            const response = await axiosInstance.post("/profit-loss", resultObj);
            let results = response.data;
            if (results !== null && results !== undefined) {
                let returnObj = results.returnObj;

                setCricektPL(returnObj.cricket);
                setFancyPL(returnObj.fancy);
                setSoccerPL(returnObj.soccer);
                setTennisPL(returnObj.tennis);
                setHorseRacePL(returnObj.horseRace);
                setGrayHoundPL(returnObj.greyhound);
                setWorldCasinoPL(returnObj.worldCasino);
                setBetfairGamesPL(returnObj.betfairGames);
                setGalexyStudioPL(returnObj.galexyStudio);
                setTpStudioPL(returnObj.tpStudio);
                setGrandTotalPL(returnObj.grandTotal);
                await dispatch(setLoader(false));
            } else {
                await dispatch(setLoader(false));
            }
        } catch (error) {
            await dispatch(setLoader(false));
        }
    };


    const getSportDetail = async (sportsType, marketId) => {
        try {
            let frm = toLocalString(selectedFromDate);
            let til = toLocalString(selectedToDate);

            await dispatch(setLoader(true));
            let resultObj = {};
            resultObj.sportsType = sportsType;
            resultObj.marketId = marketId;
            resultObj.fromdate = frm;
            resultObj.todate = til;

            const response = await axiosInstance.post(
                "/profit-loss/pl-details",
                resultObj
            );
            let results = response.data;
            if (results !== null && results !== undefined) {
                setProfitLossList(results.list);
                await dispatch(setLoader(false));
            } else {
                await dispatch(setLoader(false));
            }
        } catch (error) {
            await dispatch(setLoader(false));
        }
    };

    const openLedgerPopUp = async (id, game_type) => {
        if (game_type == 9) {
            const popup = window.open(
                "/client-virtual-details-view/" + id,
                "",
                "width=700,height=500"
            );
            if (popup) {
                popup.document.title = "BPEXCH";
            }
        } else {
            const popup = window.open(
                "/clinet-bet-details-view/" + id,
                "",
                "width=700,height=500"
            );
            if (popup) {
                popup.document.title = "BPEXCH";
            }
        }
    };

    function escapeHtml(str = "") {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const cols = useMemo(
        () => [
            {
                title: "Name",
                data: "uname",
                responsivePriority: 1,
                render: function (d, type, row) {
                    const safe = escapeHtml(String(d ?? ""));
                    const key = escapeHtml(String(row._dt_key ?? ""));
                    return `<a href="#" class="dt-user-link" data-row-key="${key}" style="color:#00b181;cursor:pointer">${safe}</a>`;
                },
            },
            {
                title: "Amount",
                data: "winAmount",
                render: (d) => `<span>${Math.round(d)}</span>`,
                responsivePriority: 2,
            },
            {
                title: "",
                data: "id",
                visible: false,
                render: (d) => `<span>${d}</span>`,
                responsivePriority: 3,
            },
        ],
        []
    );

    const showBetDetails = async (row) => {
        openLedgerPopUp(row.id, row.game_type);
    };
    const getHistory = useCallback(async () => {

        // Prevent multiple simultaneous requests
        console.log("Trying to fetch account statement");
        dispatch(setLoader(true));
        if (loadingRef.current) return;
        //setIsLoading(true);
        loadingRef.current = true;
        try {
            const tilDate = new Date();
            const frmDate = new Date(tilDate.getTime() - 44 * 24 * 60 * 60 * 1000);

            const frm = toLocalString(frmDate);
            const til = toLocalString(tilDate);

            console.log("FROM:", frm);
            console.log("TILL:", til);
            const response = await axiosInstance.post("/account-statement", { frm, til });
            console.log("FULL RESPONSE:", response.data);

            const normalizedHistory = (response.data.history || []).map((r) => {
                const isCredit = Number(r.amount) > 0;

                return {
                    ...r,
                    credit: isCredit ? r.amount : 0,
                    debit: !isCredit ? Math.abs(r.amount) : 0,
                };
            });

            setStatement(normalizedHistory);
            //dispatch(setStatement(normalizedHistory));
            setIsLoading(false);
            dispatch(setLoader(false));
            loadingRef.current = false;

            console.log("Account Statement Response:", response.data);
            console.log("HISTORY ARRAY:", response.data.history);

        } catch (error) {
            console.error("Error fetching account statement:", error);
            setStatement([]);
            setIsLoading(false);
            dispatch(setLoader(false));
            loadingRef.current = false;

        }

    }, [startDate, endDate])

    useEffect(() => {
        getHistory();
    }, []);

    const getMatchKey = (description = "") => {
        return description.trim();
    };


    const columns = [
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            sortable: true,
            valueGetter: (params) => new Date(params.value)
        },
        {
            field: "description",
            headerName: "Event",
            flex: 1,
            sortable: true
        },
        {
            field: "credit",
            headerName: "Credit",
            type: "number",
            flex: 1
        },
        {
            field: "debit",
            headerName: "Debit",
            type: "number",
            flex: 1
        },
        {
            field: "balance",
            headerName: "Balance",
            type: "number",
            flex: 1
        }
    ];

    const rows = statement.map((row, index) => ({
        id: index,
        ...row
    }));

    function PrintableTable({ data }) {
        return (
            <>
                {data.map((r, i) => (
                    <tr key={i}>
                        <td>{new Date(r.date).toLocaleString()}</td>
                        <td>{r.description || "-"}</td>
                        <td className="text-right" style={{ color: "green" }}>
                            {r.credit}
                        </td>
                        <td className="text-right" style={{ color: r.debit > 0 ? "red" : "green" }}>
                            {r.debit}
                        </td>
                        <td className="text-right" style={{ color: "green" }}>
                            {r.balance}
                        </td>
                    </tr>
                ))}
            </>
        );
    }

    return (
        <ClientLayout>

            <div>
                <div className="panel-heading text-center">
                    <i className=" fa fa-book"></i>&nbsp;Profit/Loss
                </div>
                <div className="scrollbar">
                    <div id="myTable_wrapper" className="dataTables_wrapper no-footer">
                        <div className="dataTables_length" id="myTable_length">
                            <label style={{ fontSize: "15px", color: "black", fontWeight: "500" }}>
                                <b>Show&nbsp;
                                    <select name="myTable_length" aria-controls="myTable">
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>&nbsp;entries</b>
                            </label>
                        </div>
                        <div style={{ float: "right", fontWeight: "700", fontSize: "15px" }}>
                            Search: <input value="" />
                        </div>

                        <table id="myTable" className="table table-bordered tablesorter table-striped dataTable no-footer" role="grid" aria-describedby="myTable_info" style={{ width: "1470px", padding: "90px" }}>
                            <thead>
                                {/*const columns = [
                                {field: "date", headerName: "Date", width: 200 },
                                {field: "description", headerName: "Event", width: 300 },
                                {field: "credit", headerName: "Credit", width: 150, type: "number" },
                                {field: "debit", headerName: "Debit", width: 150, type: "number" },
                                {field: "balance", headerName: "Balance", width: 150, type: "number" },
                                ];*/}

                                <tr>
                                    <th aria-controls="myTable" rowspan="1" colspan="1" style={{ width: "258px", fontSize: "16px", color: "#696969", fontWeight: "500" }}>
                                        <b>Date</b>
                                        <span class="dt-column-order" role="button" aria-label="Name: Activate to sort" tabindex="0"></span>
                                    </th>
                                    <th rowspan="1" colspan="1" style={{ width: "258px", fontSize: "16px", color: "#696969", fontWeight: "500" }}>
                                        <b>Event</b>
                                    </th>
                                    <th rowspan="1" colspan="1" style={{ width: "258px", fontSize: "16px", color: "#696969", fontWeight: "500" }}>
                                        <b>Credit</b>
                                    </th>
                                    <th rowspan="1" colspan="1" style={{ width: "258px", fontSize: "16px", color: "#696969", fontWeight: "500" }}>
                                        <b>Debit</b>
                                    </th>
                                    <th rowspan="1" colspan="1" style={{ width: "258px", fontSize: "16px", color: "#696969", fontWeight: "500", textAlign: "left" }}>
                                        <b>Balance</b>
                                    </th>
                                </tr>
                                <tr>
                                    <th><input type="text" placeholder="Date" className="form-control table-filter-input-profit"></input></th>
                                    <th><input type="text" placeholder="Event" className="form-control table-filter-input-profit"></input></th>
                                    <th><input type="text" placeholder="Credit" className="form-control table-filter-input-profit"></input></th>
                                    <th><input type="text" placeholder="Debit" className="form-control table-filter-input-profit"></input></th>
                                    <th><input type="text" placeholder="Balance" className="form-control table-filter-input-profit"></input></th>
                                </tr>
                            </thead>
                            <tbody>
                                <PrintableTable data={statement} />
                            </tbody>
                        </table>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            autoHeight
                            disableRowSelectionOnClick
                        />
                        {/* <div className="dataTables_info" id="myTable_info" role="status" aria-live="polite" style={{ textAlign: "left", fontSize: "16px", color: "black" }}>
                            Showing 0 to 0 of 0 entries

                            <div className="col-sm-6 text-right">
                            <div className="dataTables_paginate paging_simple_numbers" id="myTable_paginate">
                                <a className="paginate_button previous disabled" aria-controls="myTable" data-dt-idx="0" tabindex="0" id="myTable_previous" style={{ float: "left", paddingTop: "0.755em" }}>Previous</a><span></span>
                                <a class="paginate_button next disabled" aria-controls="myTable" data-dt-idx="1" tabindex="0" id="myTable_next" style={{ float: "left", paddingTop: "0.755em" }}>Next</a>
                            </div>
                        </div>*/}
                        <br></br>
                        <div id="myTable_paginate">
                            <a data-dt-idx="0" tabindex="0" id="myTable_previous" style={{ float: "right", color: "#666", marginTop: "-25px", paddingRight: "65px", fontWeight: "600" }}>Previous</a>
                            <a data-dt-idx="1" tabindex="0" id="myTable_next" style={{ float: "right", color: "#666", marginTop: "-25px", paddingRight: "14px", fontWeight: "600" }}>Next</a>
                        </div>

                    </div>
                </div>
            </div>

            <div className="clearfix"></div>

        </ClientLayout >
    );
}