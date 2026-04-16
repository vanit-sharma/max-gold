import ClientLayout from "../components/layout/ClientLayout";
import React, { useEffect, useState, useRef, useMemo, useCallback, } from "react";
import DatePickerComponent from "../components/DatePickerComponent";
import axiosInstance from "../../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import "../../../assets/css/style.css";
import $ from "jquery";
import { setLoader } from "../../../store/loaderSlice";
import { Link } from "react-router-dom";

export default function Statement() {
    const dispatch = useDispatch();
    //const printRef = useRef(null);
    const [uniqueGridKey, setUniqueGridKey] = useState(Date.now());
    const [statement, setStatement] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [pageSize, setPageSize] = useState(10);

    const loadingRef = useRef(false);
    const gridTableRef = useRef(null);
    const defaultExpand = true;


    const cols = useMemo(
        () => [
            {
                title: "#",
                data: null,
                orderable: false,
                responsivePriority: 1,
                render: (data, type, row, meta) => `
          <div class="d-flex align-items-center gap-2">
            <span class="seq-number">${meta.row + 1}</span>
            <button type="button" class="toggle-row toggle-closed">+</button>
          </div>
        `
            },
            {
                title: "Date",
                data: "date",
                order: "asc",
                responsivePriority: 2,
                render: (d, type) => {
                    // For display/filter return formatted date; for sort/order return numeric timestamp
                    if (type === "display" || type === "filter") {
                        return d ? new Date(d).toLocaleString() : "";
                    }
                    // for sort and type === 'sort' or 'order'
                    return d ? new Date(d).getTime() : 0;
                }
            },
            {
                title: "Type",
                data: "type",
                render: (d) => `<span>${d}</span>`
            },
            {
                title: "Description",
                data: "description",
                render: (data, type, row, meta) =>
                    data === "Opening Balance"
                        ? `<span style='color:#04b181;font-weight:semibold;'>${data}</span>`
                        : `<a  href="#" onClick="showBetDetails('${row.id}',${row.game_type},${row.market_type})" class='text-success'>${row.description}</a>`,
                responsivePriority: 3
            },
            {
                title: "Amount",
                data: "amount",
                render: (d) => `<span>${d}</span>`,
                responsivePriority: 4
            },

            {
                title: "Balance",
                data: "balance",
                render: (d) => `<span>${d}</span>`,
                responsivePriority: 5
            },
            {
                title: "",
                data: "id",
                visible: false,
                render: (d) => `<span>${d}</span>`,
                responsivePriority: 6
            },
            {
                title: "game_type",
                data: "game_type",
                render: (d) => `<span>${d}</span>`,
                responsivePriority: 7,
                visible: false
            },
            {
                title: "market_type",
                data: "market_type",
                render: (d) => `<span>${d}</span>`,
                visible: false,
                responsivePriority: 8
            }
        ],
        []
    );


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

    useEffect(() => {
        window.showBetDetails = (id, game_type, market_type) => {
            openLedgerPopUp(id, game_type);
        };

        return () => {
            // clean up when react component unmounts. It will clean it from the memory when we will navigate to other component or page.
            delete window.showBetDetails;
        };
    }, []);


    useEffect(() => {
        // Don't initialize DataTable while loading or if no data
        if (isLoading || !statement.length) return;

        const $table = $(gridTableRef.current);
        if (!$table.length) return;

        // Clean up any existing DataTable properly
        if ($.fn.dataTable.isDataTable($table)) {
            const dt = $table.DataTable();
            // Remove all event listeners first
            $table.off("click", "button.toggle-row");
            dt.off("order.dt search.dt draw.dt");
            dt.off("responsive-resize draw");
            // Destroy the DataTable
            dt.destroy(true);
            $table.empty();
        }

        // Normalize column definitions (support data/title and legacy mData/sTitle)
        const normalizedCols = (cols || []).map((c) => ({
            ...c,
            title: c.title || c.sTitle || "",
            data: c.data || c.mData || c.name || "",
            orderable: typeof c.orderable === "boolean" ? c.orderable : true
        }));

        // Ensure first column (seq/#) is not orderable and has a consistent renderer
        if (normalizedCols[0]) {
            normalizedCols[0].orderable = false;
            // Ensure seq column has a render that places a span.seq-number we can update later
            const originalRender = normalizedCols[0].render;
            normalizedCols[0].render = function (data, type, row, meta) {
                // For ordering/searching we should return numeric value; for display return HTML
                if (type === "display" || type === "filter") {
                    const seqHTML = `<div class="seq-cell d-flex align-items-center gap-1">
            <span class="seq-number">${typeof data === "number" ? data : ""
                        }</span>
            <button type="button" class="toggle-row toggle-closed" style="display:none;">+</button>
          </div>`;
                    // If user provided an original render, respect it for display of the number placeholder
                    return originalRender
                        ? originalRender(data, type, row, meta)
                        : seqHTML;
                }
                // For other types (order/search) return a stable numeric value if available
                return typeof data === "number" ? data : 0;
            };
        }

        // Compute initial order from columns (supports col.order = "asc"|"desc")
        const initialOrder = [];
        normalizedCols.forEach((col, idx) => {
            if (
                col.order &&
                ["asc", "desc"].includes(String(col.order).toLowerCase())
            ) {
                initialOrder.push([idx, col.order]);
            }
        });

        // Build safe statement (only include referenced keys + seq)
        const keys = normalizedCols.map((c) => c.data).filter(Boolean);
        const safeData = (statement || []).map((row, i) => {
            const out = { seq: i + 1 }; // seq is initial placeholder; will be updated after draw
            keys.forEach((k) => {
                if (k in row) out[k] = row[k];
            });
            return out;
        });

        let dt;
        try {
            dt = $table.DataTable({
                data: safeData,
                columns: normalizedCols,
                responsive: { details: false },
                pageLength: pageSize || 10,
                lengthChange: false,
                autoWidth: false,
                ordering: true,
                order: initialOrder,
                columnDefs: [{ targets: 0, orderable: false }], // safeguard
                dom: '<"top d-flex flex-wrap justify-content-between align-items-center" <"dataTables_length"l> <"dt-search"f> <"dt-buttons"> >rt<"bottom d-flex justify-content-between align-items-center"ip><"clear">',

                language: {
                    paginate: { previous: "&laquo;", next: "&raquo;" }
                },
                orderClasses: false,
                rowCallback: function (row, data, index) {
                    // Mobile breakpoint (same as your CSS media query)
                    const isMobile = window.matchMedia("(max-width:640px)").matches;

                    if (isMobile) {
                        // single dark color for every main row on mobile
                        $(row).css({
                            "background-color": "#f7f7f7", // dark row background
                            color: "" // light text
                        });
                    } else {
                        // Desktop: keep zebra striping you had previously
                        $(row).css({
                            "background-color": index % 2 === 0 ? "#f7f7f7" : "#ffffff",
                            color: "" // let default text color apply
                        });
                    }
                }
            });
        } catch (error) {
            console.error("Error initializing DataTable:", error);
            return;
        }

        // Helper: find hidden columns for a row (used for child details)
        const getHiddenColumnsForRow = (tr) => {
            const hiddenCols = [];
            $(tr)
                .find("td")
                .each((i, td) => {
                    if ($(td).css("display") === "none" || $(td).is(":hidden"))
                        hiddenCols.push(i);
                });
            return hiddenCols;
        };

        //mobile view
        // Build hidden row details (same as your previous implementation)

        const buildHiddenDetails = (rowData, tr) => {
            const settings = dt.settings()[0];
            const hiddenCols = getHiddenColumnsForRow(tr);
            if (!hiddenCols.length || hiddenCols.length === normalizedCols.length)
                return "";
            let html = "";

            hiddenCols.forEach((i) => {
                console.log("i:", i);
                const col = dt.column(i);
                console.log("col:", col);
                console.log("Row Data:", rowData);
                console.log("Normalized Cols:", normalizedCols);
                if (!col || !col.header()) return;

                const title = $(col.header()).text();
                const colDef = normalizedCols[i];
                const rawVal = rowData[colDef.data];

                // Using the same render() as parent column
                const rendered = colDef.render
                    ? colDef.render(rawVal, "display", rowData, { row: 0, col: i })
                    : rawVal ?? "";

                console.log("rendered:", rendered);

                html += `
      <tr>
        <td style="width:40%;border-top:0;border-left:0;border-right:0;border-bottom:1px solid #eee;">
          <span style="font-weight:bold;">${title}</span> 
          ${rendered}
        </td>
      </tr>`;
            });
            return html;
        };

        // Update toggle button / child rows as before
        const updateToggleButtons = () => {
            if (!$.fn.dataTable.isDataTable($table)) return;
            dt.rows().every(function () {
                const tr = $(this.node());
                const $btn = tr.find("button.toggle-row");
                const hiddenCols = getHiddenColumnsForRow(tr);
                const anyHidden =
                    hiddenCols.length > 0 && hiddenCols.length < normalizedCols.length;
                if (anyHidden) {
                    $btn.show();
                    if (defaultExpand && !this.child.isShown()) {
                        const details = buildHiddenDetails(this.data(), tr);
                        if (details.trim()) {
                            this.child(
                                `<table class="table table-sm mb-0">${details}</table>`
                            ).show();
                            tr.addClass("shown");
                            $btn
                                .text("−")
                                .removeClass("toggle-closed")
                                .addClass("toggle-open");
                        }
                    } else if (this.child.isShown()) {
                        const newDetails = buildHiddenDetails(this.data(), tr);
                        this.child(
                            `<table class="table table-sm mb-0">${newDetails}</table>`
                        ).show();
                    }
                } else {
                    $btn.hide();
                    if (this.child && this.child.isShown()) {
                        this.child.hide();
                        tr.removeClass("shown");
                    }
                }
            });
        };

        $table.on("click", "button.toggle-row", function () {
            const tr = $(this).closest("tr");
            const row = dt.row(tr);
            const hiddenCols = getHiddenColumnsForRow(tr);
            if (!hiddenCols.length || hiddenCols.length === normalizedCols.length)
                return;
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass("shown");
                $(this).text("+").removeClass("toggle-open").addClass("toggle-closed");
            } else {
                const details = buildHiddenDetails(row.data(), tr);
                if (!details.trim()) return;
                row
                    .child(`<table class="table table-sm mb-0">${details}</table>`)
                    .show();
                tr.addClass("shown");
                $(this).text("−").removeClass("toggle-closed").addClass("toggle-open");
            }
        });

        // --------- Core: renumber seq column on order/search/draw ----------
        const renumberSeq = () => {
            // rows in current ordering (includes all rows, not just current page)
            const nodes = dt.rows({ order: "applied" }).nodes();
            $(nodes).each((index, rowNode) => {
                // update the first cell's .seq-number text
                const $firstCell = $(rowNode).find("td").eq(0);
                const $span = $firstCell.find(".seq-number");
                if ($span.length) {
                    $span.text(index + 1);
                } else {
                    // fallback: if render didn't produce span, set plain text
                    $firstCell.text(index + 1);
                }
            });
        };

        // call renumberSeq after draw/order/search
        dt.on("order.dt search.dt draw.dt", () => {
            try {
                renumberSeq();
                updateToggleButtons();
            } catch (e) {
                // swallow safe errors
                console.warn("Renumber/Toggle update failed:", e);
            }
        });

        // Initial numbering (after initial draw)
        requestAnimationFrame(() => {
            renumberSeq();
            updateToggleButtons();
        });

        const safeRecalc = () => {
            if (!$.fn.dataTable.isDataTable($table)) return;
            clearTimeout(window.__dt_safe_timer);
            window.__dt_safe_timer = setTimeout(() => {
                try {
                    dt.responsive.recalc();
                    requestAnimationFrame(() => updateToggleButtons());
                } catch (err) {
                    console.warn("Resize skip:", err);
                }
            }, 30);
        };

        dt.on("responsive-resize draw", safeRecalc);
        window.addEventListener("resize", safeRecalc);

        return () => {
            window.removeEventListener("resize", safeRecalc);
            clearTimeout(window.__dt_safe_timer);
            $table.off("click", "button.toggle-row");
            if ($.fn.dataTable.isDataTable($table)) {
                try {
                    const dtInstance = $table.DataTable();
                    if (dtInstance) {
                        dtInstance.off("order.dt search.dt draw.dt");
                        dtInstance.off("responsive-resize draw");
                        dtInstance.destroy(true);
                    }
                } catch (error) {
                    console.warn("Error during DataTable cleanup:", error);
                }
            }
        };
    }, [cols, statement, pageSize, defaultExpand, isLoading]);


    const handlePageSizeChange = (event) => {
        let value = event.target.value;
        setPageSize(value);
        getHistory();
    };

    function toLocalString(d) {
        const pad = (x) => String(x).padStart(2, "0");
        return (
            `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
            `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        );
    }

    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth(); // 0-based: 0 = Jan
    const dayOfMonth = today.getDate();

    const todayStart = new Date(year, monthIndex, dayOfMonth, 0, 0, 0, 0);
    const todayEnd = new Date(year, monthIndex, dayOfMonth, 23, 59, 59, 999);

    let todayStartStr = dayOfMonth + "/" + (monthIndex + 1) + "/" + year;

    const todayInputStr = today.toISOString().split("T")[0];

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

    const getHistory = useCallback(async () => {

        // Prevent multiple simultaneous requests
        console.log("Trying to fetch account statement");
        dispatch(setLoader(true));
        if (loadingRef.current) return;
        let frm = toLocalString(startDate);
        let til = toLocalString(endDate);


        //setIsLoading(true);
        loadingRef.current = true;

        try {
            const response = await axiosInstance.post("/account-statement", {
                frm,
                til
            });
            console.log("FULL RESPONSE:", response.data);


            const normalizedHistory = (response.data.history || []).map((r) => {
                let type = "";

                const marketType = Number(r.market_type);
                const isCredit = Number(r.amount) > 0;

                // TYPE logic
                if (marketType === 1) {
                    type = "MATCH";
                } else if (marketType === 2) {
                    type = "BOOK-MAKER";
                } else if (marketType === 3) {
                    type = "SESSION";
                } else {
                    type = "OTHER";
                }

                return {
                    ...r,
                    type,
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
        } catch (error) {
            console.error("Error fetching account statement:", error);
            await dispatch(setLoader(false));
            setIsLoading(false);
            loadingRef.current = false;
            setStatement([]);
        }
    }, [startDate, endDate]);

    const getCurrentDateInput = () => {
        const dateObj = new Date();
        // get the month in 'MM' format (e.g., '04' for April)
        const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        // get the day in 'DD' format
        const day = ("0" + dateObj.getDate()).slice(-2);
        const year = dateObj.getFullYear();
        const shortDate = `${day}/${month}/${year}`;
        return shortDate;
    }

    //Get Event Details By CatMid
    useEffect(() => {
        getHistory();
    }, []); // Empty dependency array



    const getGameName = (game_type) => {
        if (game_type === 1) {
            return "Cricket";
        } else if (game_type === 2) {
            return "Football";
        } else if (game_type === 3) {
            return "Tennis";
        } else {
            return "-";
        }
    };

    const getMatchKey = (description = "") => {
        return description.split("/")[0].trim();
    };


    function PrintableTable({ data }) {
        return (
            <>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Result</th>
                        <th className="text-right">Credit</th>
                        <th className="text-right">Debit</th>
                        <th className="text-right">Balance</th>
                    </tr>
                </thead>

                <tbody className="table-account">
                    {statement.map((r, i) => {
                        const matchKey = getMatchKey(r.description);

                        const matchBets = statement.filter(
                            (s) =>
                                getMatchKey(s.description) === matchKey &&
                                s.game_type === r.game_type
                        );

                        return (
                            <tr key={i}>
                                <td >{i + 1}</td>
                                <td >{new Date(r.date).toLocaleString()}</td>
                                <td>
                                    <span className="MATCH-acc">{r.type}</span>
                                </td>
                                <td >
                                    {getGameName(r.game_type)}/{r.description}&nbsp;&nbsp;&nbsp;
                                    <Link
                                        to="/matchbet"
                                        state={{
                                            match_id: r.match_id
                                        }}
                                        className="btn btn-view"
                                    >
                                        View Market
                                    </Link>

                                    {/*<Link
                                    to="/matchbet"
                                    state={{
                                        description: r.description,
                                        credit: r.credit,
                                        debit: r.debit,
                                        game_type: r.game_type,
                                        date: r.date
                                    }}
                                    className="btn btn-view"
                                >
                                    View Market
                                </Link>*/}
                                </td>
                                <td >{r.result}</td>
                                <td className="text-right" style={{ color: "green" }}>{r.credit}</td>
                                <td className="text-right" style={{ color: (r.debit) > 0 ? "red" : "green" }}>{r.debit}</td>
                                <td className="text-right" style={{ color: "green" }}>{r.balance}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </>
        );
    }

    return (
        <ClientLayout>
            <div class="">
                <div class="row">
                    <div class="col-md-12 col-xs-12">
                        <div class="title_new_at" style={{ fontWeight: "600" }}>
                            Account Statement
                            <div class="pull-right">
                                <button class="btn_common" style={{ color: "#000", padding: "0px 2px", letterSpacing: "0px" }}>Back</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div>
                            <div class="block_2" >
                                <select class="form-control" repeatlayout="Flow" repeatdirection="Horizontal" style={{ height: "30px", fontSize: "16px" }}>
                                    <option selected="selected" value="1"  >Show All Cash,Credit &amp; Profit/Loss</option>
                                    <option value="2">Show Cash Entry</option>
                                    <option value="3">Show Credit Entry</option>
                                    <option value="4">Market Profit/Loss</option>

                                </select>
                            </div>
                            <div class="block_2">
                                <select class="form-control" style={{ height: "30px", fontSize: "16px" }}>
                                    <option selected="selected" value="0">All</option>
                                    <option value="4">Cricket</option>
                                    <option value="1">Soccer</option>
                                    <option value="2">Tennis</option>
                                    <option value="7522">BasketBall</option>
                                    <option value="5">Teenpatti T20</option>
                                    <option value="6">Teenpatti OneDay</option>
                                    <option value="900">Lucky7</option>
                                    <option value="800">Dragon Tiger</option>
                                    <option value="700">Poker</option>

                                </select>
                            </div>
                            <div class="block_2">
                                {/*<DatePickerComponent
                                    defaultDate={startDate}
                                    setSelectedDate={startDateSet}
                                />*/}
                                <input type="date" value={startDate.toISOString().split("T")[0]} class="form-control hasDatepicker" autocomplete="off" onChange={(e) => {
                                    const selectedDate = new Date(e.target.value + "T00:00:00");
                                    setStartDate(selectedDate);
                                }} />

                            </div>
                            <div class="block_2">
                                {/*<DatePickerComponent
                                    defaultDate={endDate}
                                    setSelectedDate={endDateSet}
                                />*/}
                                <input type="date" value={endDate.toISOString().split("T")[0]} class="form-control hasDatepicker" placeholder="To Date" autocomplete="off" onChange={(e) => {
                                    const selectedDate = new Date(e.target.value + "T23:59:59");
                                    setEndDate(selectedDate);
                                }}
                                />

                            </div>
                            <div class="block_2 buttonacount">
                                <input type="submit" value="Filter" onClick={() => getHistory()}
                                    disabled={isLoading} class="blue_button" style={{ fontWeight: "600" }} />
                                &nbsp;&nbsp;
                                <a href="/statement" class="red_button" style={{ fontWeight: "600" }} >Clear</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div></div>
                        <div class="table-scroll" >
                            <table class="table table-bordered table-account table_new_design" id="datatablesss">
                                <PrintableTable data={statement} />
                                {/*<thead>
                                    <tr class="headings">
                                        <th class="">S.No. </th>
                                        <th class="">Date </th>
                                        <th class="">Type </th>
                                        <th class="">Description </th>
                                        <th class="">Result </th>
                                        <th class="rrig text-right">Credit </th>
                                        <th class="rrig text-right">Debit </th>
                                        <th class="rrig text-right">Balance </th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>*/}
                            </table>
                        </div>
                    </div>
                </div>

                <div id="content_holder" class="popbox0">
                    <div class="popdetails">
                        <a class="closePrefHelp">X</a>
                        <iframe id="contentFrame" name="contentFrame" style={{ border: "none", width: "100%", height: "470px" }} />
                    </div>
                </div>
                <div id="opaque"></div>
                <script src="../js/emty.js"></script>

            </div>




        </ClientLayout>
    );
}

