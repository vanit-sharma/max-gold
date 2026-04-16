import ClientLayout from "../components/layout/ClientLayout";
import "../../../assets/css/style.css";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";

export default function ButtonValue() {

    const [stakes, setStakes] = useState([10, 20, 50, 100, 500, 1000]);
    const handleStakeChange = (index, value) => {
        const updatedStakes = [...stakes];
        updatedStakes[index] = value;
        setStakes(updatedStakes);
    };
    const handleSaveStakes = async () => {
        await axiosInstance.post("/profile", {
            stake1: stakes[0],
            stake2: stakes[1],
            stake3: stakes[2],
            stake4: stakes[3],
            stake5: stakes[4],
            stake6: stakes[5],
        });
    };


    useEffect(() => {
        const fetchStakes = async () => {
            const response = await axiosInstance.get("/profile");
            const values = Object.keys(response.data).sort().map((key) => response.data[key]);
            setStakes(values);
        };
        fetchStakes();
    }, []);


    return (
        <ClientLayout>
            <div class="stacklistWrp">
                <div class="title pull-left col-xs-12">
                    <h2 class="page-title" style={{ fontSize: "100%", fontWeight: "600", fontSize: "17px", margin: "0px" }}><b>Edit Stake</b></h2>
                </div>
                <div class="col-sm-3 col-xs-12" style={{ padding: "0px 9px", fontSize: "15px" }}>
                    <div class="form-group">
                        <div class="stake-input">
                            <input value={stakes[0]} onChange={(e) => handleStakeChange(0, e.target.value)} pattern="^(0|[1-9][0-9]*)$" autocomplete="off" class="text-input text-input-md" />
                        </div>
                        <div class="stake-input">
                            <input value={stakes[1]} onChange={(e) => handleStakeChange(1, e.target.value)} pattern="^(0|[1-9][0-9]*)$" class="text-input text-input-md" />
                        </div>
                        <div class="stake-input">
                            <input value={stakes[2]} onChange={(e) => handleStakeChange(2, e.target.value)} pattern="^(0|[1-9][0-9]*)$" class="text-input text-input-md" />

                        </div>
                    </div>
                </div>

                <div class="col-sm-3 col-xs-12" style={{ padding: "0px 9px", fontSize: "15px" }}>
                    <div class="form-group">
                        <div class="stake-input">
                            <input value={stakes[3]} onChange={(e) => handleStakeChange(3, e.target.value)} pattern="^(0|[1-9][0-9]*)$" class="text-input text-input-md" autocorrect="off" focusable="" onkeypress="return NumValidate(event)" type="tel" />
                        </div>
                        <div class="stake-input">
                            <input value={stakes[4]} onChange={(e) => handleStakeChange(4, e.target.value)} pattern="^(0|[1-9][0-9]*)$" class="text-input text-input-md" />
                        </div>
                        <div class="stake-input">
                            <input value={stakes[5]} onChange={(e) => handleStakeChange(5, e.target.value)} pattern="^(0|[1-9][0-9]*)$" class="text-input text-input-md" />

                        </div>
                    </div>

                    <div class="clearfix"></div>
                </div>
                <b><input type="submit" value="Save" id="ContentPlaceHolder1_Button1" color="cta-primary" class="button button-md button-default button-default-md button-md-cta-primary" style={{ padding: "0px 12px", fontSize: "15px", marginTop: "40px" }} onClick={handleSaveStakes}></input></b>
            </div>
        </ClientLayout >
    );
}