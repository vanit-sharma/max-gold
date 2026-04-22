import ClientLayout from "../components/layout/ClientLayout";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef, useMemo, useCallback, } from "react";
import axiosInstance from "../../../utils/axiosInstance";

export default function ViewMarket() {

    const { state } = useLocation();
    const { match_id } = state || {};

    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    //  const bets = state?.bets ?? [];

    useEffect(() => {
        if (!match_id) return;
        axiosInstance.post("/match-bets", {
            match_id
        }).then(res => {
            setBets(res.data.bets || []);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [match_id]);
    /*if (!state) {
        return <p>No data available</p>;
    }*/

    const getGameName = (game_type) => {
        if (game_type === 1) return "Cricket";
        if (game_type === 2) return "Football";
        if (game_type === 3) return "Tennis";
        return "-";
    };

    //const { description, credit, debit, date } = state;
    console.log("BETS DATA", bets);
    return (
        <ClientLayout>
            <div class="">
                <style>
                    {`
                    *{
                        font-family: Cabin', sans-serif;
                    }
                    .title {
                        color: #696969;
                        font-size: 18px;
                        font-weight: 500;
                    }
                    .btn-back{
                        background-color: #000;
                        color: #f0f0f0;
                        width: 40px;
                        text-align: center;
                        font-size: 14px;
                        padding: 0px;
                        border-radius: 0px;
                    }
                    .table-view th,
                    .table-view th span,
                    .table-view th div {
                        color: #696969 !important; 
                        font-weight: 800 !important;   
                        font-size: 16px !important;
                    }
                    .table.table-view td{
                        font-size: 14px;
                        font-weight: 500;
                        font-family: 'Cabin', sans-serif;
                    }
                `}
                </style>
                <div class="col-md-12">
                    <div class="title">
                        Account Statement &nbsp;
                        <button class="btn btn-back" onclick="goBack()">Back</button>
                    </div>
                </div>
                <br></br>
                <div class="">
                    <div class="row">
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <div class="x_panel">
                                <div id="divLoading"></div>
                                <div class="x_content">
                                    <div class="table-scroll">
                                        <table className="table table-striped table-view">
                                            <thead>
                                                <tr className="headings-view">
                                                    <th class="">S.No. </th>
                                                    <th class="">Description</th>
                                                    <th class=""></th>
                                                    <th>Credit</th>
                                                    <th>Debit </th>
                                                    <th>Commision</th>
                                                    <th class="">P_L </th>
                                                    <th class="">Date</th>
                                                    <th class="">Action </th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ fontSize: "15px" }}>
                                                {bets.map((bet, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{getGameName(bet.game_type)}/{bet.description}</td>
                                                        <td>{bet.type}</td>
                                                        <td style={{ color: "green" }}>{bet.credit}</td>
                                                        <td style={{ color: bet.debit > 0 ? "red" : "green" }}>{bet.debit}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td> {new Date(bet.date).toLocaleString()}</td>
                                                        <td ><a href="#" style={{ color: "#002EF5" }}>Show Bets</a></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </ClientLayout>
    );
}