import ClientLayout from "../components/layout/ClientLayout";
import { React, useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import DatePickerComponent from "../components/DatePickerComponent";
export default function BetHistory() {
    const moment = require("moment");
    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth(); // 0-based: 0 = Jan
    const dayOfMonth = today.getDate();

    const todayStart = new Date(year, monthIndex, dayOfMonth, 0, 0, 0, 0);
    const todayEnd = new Date(year, monthIndex, dayOfMonth, 23, 59, 59, 999);

    const [selectedFromDate, setSelectedFromDate] = useState(todayStart);
    const [selectedToDate, setSelectedToDate] = useState(todayEnd);
    const [sportsType, setSportsType] = useState(0);
    const [betStatus, setBetStatus] = useState(0);
    const [userBetList, setUserBetList] = useState([]);

    const userInfo = useSelector((state) => state.userStore);

    let username = "";
    if (
        userInfo !== null &&
        userInfo !== undefined &&
        userInfo.data !== null &&
        userInfo.data !== undefined
    ) {
        username = userInfo.data.uname;
    }

    // Sample data
    const [data, setData] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 50;

    // Sorting
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig.key !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    // Pagination logic
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = sortedData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(data.length / rowsPerPage);


    const hasMatchOdds = currentData.some(
        (bet) => bet.bet_type === "m" || bet.bet_type === "bm"
    );

    const hasFancy = currentData.some(
        (bet) => bet.bet_type === "f" || bet.bet_type === "eo" || bet.bet_type === "footballfancy"
    );
    // Sort handler
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };


    const fetchUserBetList = async () => {

        let obj = {
            sports_type: sportsType,
            bet_status: betStatus,
        };

        try {
            const response = await axiosInstance.post(
                "/bets/user-betlist/",
                obj
            );

            setData(response.data.bets_list || []);
        } catch (error) {
            console.error("Bet list error:", error);
            setData([]);
        }
    };


    useEffect(() => {
        fetchUserBetList();
    }, [sportsType, betStatus, selectedFromDate, selectedToDate]);



    useEffect(() => {
        if (data.length > 0) {
            console.log("FIRST BET OBJECT:", data[0]);
        }
    }, [data]);




    return (
        <ClientLayout>
            {hasMatchOdds && (
                <>
                    <div className="row" style={{ marginTop: "0%", marginBottom: "3%" }}>
                        <div className="col-12 col-md-12">
                            <div className="card-header">
                                <b style={{ color: "#f0f0f0", fontSize: "15px" }}>Matchodds</b>
                            </div>

                            <div className="card-body">
                                <div style={{ padding: "0px" }}>
                                    <table border="1" cellPadding="8" cellSpacing="0" className="table table-striped table-bordered dataTable no-footer dtr-inline" style={{ borderCollapse: "collapse", width: "100%" }}
                                    >
                                        <thead>
                                            <tr>
                                                <th onClick={() => requestSort("event_name")} style={{ color: "#000" }}>Match</th>
                                                <th onClick={() => requestSort("rate")} style={{ color: "#000" }}>Rate</th>
                                                <th onClick={() => requestSort("section")} style={{ color: "#000" }}>Team</th>
                                                <th style={{ color: "#000" }}>Amount</th>
                                                <th onClick={() => requestSort("stmp")} style={{ color: "#000" }}>Date</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {currentData &&
                                                currentData.map((bet, index) => (
                                                    <tr key={index}>
                                                        {/* EVENT NAME */}
                                                        <td className="text-left">
                                                            {bet.event_name || "-"}
                                                        </td>
                                                        {/* RATE */}
                                                        <td className="text-left">
                                                            {bet.rate || "-"}
                                                        </td>

                                                        {/* SECTION */}
                                                        <td className="text-left">
                                                            {bet.section || "-"}
                                                        </td>

                                                        {/* AMOUNT */}
                                                        <td className="text-left">
                                                            {bet.amnt || "-"}
                                                        </td>

                                                        {/* DATE */}
                                                        <td className="text-left">
                                                            {moment(bet.stmp).format("YYYY-MM-DD")}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {hasFancy && (
                <>
                    <div className="card-header">
                        <b style={{ color: "#f0f0f0", fontSize: "15px" }}>
                            Fancy
                        </b>
                    </div>

                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Match</th>
                                <th>Rate</th>
                                <th>Team</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentData
                                .filter((bet) => bet.bet_type === "f")
                                .map((bet, index) => (
                                    <tr key={index}>
                                        <td>{bet.event_name}</td>
                                        <td>{bet.rate}</td>
                                        <td>{bet.section}</td>
                                        <td>{bet.amnt}</td>
                                        <td>
                                            {moment(bet.stmp).format("YYYY-MM-DD")}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </>
            )}


        </ClientLayout>
    );
}