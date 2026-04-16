import ClientLayout from "../components/layout/ClientLayout";
import "../../../assets/css/style.css";
import axiosInstance from "../../../utils/axiosInstance";
import React, { useState } from "react";

export default function ChangePass() {
    //const [betObj, setBetSlipDetails] = useState({});
    //const [eventDetails, setEventDetails] = useState({});
    const [old_password, setOldPassword] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState(false);
    const [buttonShowLoaderShow, setButtonShowLoaderShow] = useState(false);
    const [passwordButtonShow, setPasswordButtonShow] = useState(true);
    const [message, setMessage] = useState("");

    const onchangeOldPassword = (event) => {
        // Access the current value using event.target.value
        const newValue = event.target.value;
        // Update the state with the new value
        setOldPassword(newValue);
    }
    const onchangeNewPassword = (event) => {
        const newValue = event.target.value;
        setNewPassword(newValue);
    }
    const onchangeConfirmPassword = (event) => {
        const newValue = event.target.value;
        setConfirmPassword(newValue);
    }

    const handleChangePassword = async () => {
        setMessage("");

        try {
            if (
                old_password === "" ||
                new_password === "" ||
                confirm_password === ""
            ) {
                setPasswordMessage({
                    status: false,
                    message: "All fields are required",
                });
                return;
            }
            if (new_password !== confirm_password) {
                //console.log("PASSWORDS NOT MATCHING");
                setMessage("The new password and confirm password do not match");
                return;
            }
            //betObj.eventId = eventDetails.evt_id;
            //console.log("betObj ->", betObj); 

            const response = await axiosInstance.post("/profile/password", {
                old_password: old_password,
                passpin: new_password,
                confirm_password: confirm_password
            });

            if (response.data.status) {
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setMessage(response.data.message);
            }

            setPasswordMessage({
                status: response.data.status,
                message: response.data.message,
            });

        } catch (error) {

            if (error?.response?.data?.status === false) {
                setMessage(error?.response.data.message);
                setPasswordMessage({
                    status: false,
                    message: error.response.data.message,
                });
            }
        } finally {
            setButtonShowLoaderShow(false);
            setPasswordButtonShow(true);
        }
    }

    return (
        <ClientLayout>
            <div class="">

                <div class="col-xs-12">
                    <div class="sec-wrap change-passwordwpr">
                        <h2>Change your password</h2>
                        <div style={{ color: "red", fontSize: "13px", textAlign: "center" }}>{message}</div>

                        <div class="form-horizontal form-label-left" style={{ width: "100%", height: "40px", marginTop: "0px" }}>
                            <div class="form-group">
                                <label class="control-label col-md-4 col-sm-4 col-xs-12" style={{ fontSize: "15px" }}>
                                    <b>Old Password</b>
                                </label>
                                <div class="col-md-8 col-sm-8 col-xs-12">
                                    <input type="password" class="form-control col-md-7 col-xs-12"
                                        style={{ width: "500px" }} onChange={onchangeOldPassword} />
                                    <span class="required">
                                        <span class="txt-required" style={{ color: "red", display: "none" }}> Required</span>
                                    </span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-4 col-sm-4 col-xs-12" style={{ fontSize: "15px" }}>
                                    <b> New Password</b></label>
                                {/*<div className="col-md-6">
                                    <Field className="form-control" type="password" name="passpin" />
                                    <ErrorMessage name="passpin" component="div" className="text-danger" />
                                </div>*/}
                                <div class="col-md-8 col-sm-8 col-xs-12">
                                    <input type="password" class="form-control col-md-7 col-xs-12" style={{ width: "500px" }} onChange={onchangeNewPassword} />
                                    <span class="required">
                                        <span class="txt-required" style={{ color: "red", display: "none" }}>Required</span>
                                    </span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-md-4 col-sm-4 col-xs-12" style={{ fontSize: "15px" }}>
                                    <b>Confirm Password</b>
                                </label>
                                <div class="col-md-8 col-sm-12 col-xs-12">
                                    <input type="password" class="form-control col-md-7 col-xs-12" style={{ width: "500px" }} onChange={onchangeConfirmPassword} />
                                    <span class="required">
                                        <span class="txt-required" style={{ color: "red", display: "none" }}>Required</span></span>
                                    <span class="required">
                                        <span class="txt-required" style={{ color: "red", width: "240px", textAlign: "left", visibility: "hidden" }}>Password does not match.</span>
                                    </span>
                                </div>
                            </div>

                            <div class="ln_solid"></div>
                            <div class="form-group">
                                <div class="col-md-6 col-sm-6 col-xs-12 col-sm-offset-4">
                                    <button type="button" value="Submit" class="btn btn-primary" style={{ width: "110px", height: "30px", backgroundColor: "#5b4439", borderColor: "#5b4439", fontSize: "14px", color: "#f0f0f0" }} onClick={() => handleChangePassword()}>
                                        Submit
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}
