import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import moment from "moment";

import ClientLayout from "../components/layout/ClientLayout";
import { useSelector } from "react-redux";
import EventRow from "../components/layout/EventRow";


export default function Tennis() {
    const eventsFromParent = useSelector((state) => state.event);
    const [activeEventList, setActiveEventslist] = useState([]);
    const getEvents = (events) => {
        setActiveEventslist(events);
    }
    useEffect(() => {
        const getEventsNew = async () => {
            if (eventsFromParent !== "" && eventsFromParent.data !== null) {
                await getEvents(eventsFromParent.data);
            } else {
            }
        };
        getEventsNew();
    }, [eventsFromParent]);
    //const eventsFromParent = useSelector((state) => state.event);


    return (
        <ClientLayout>
            <div class="row">

                <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="bannerinner">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="banner">

                                    <div class="box-heading grid_shadow">
                                        <div class="clearfix ng-binding">

                                            <span id="ContentPlaceHolder1_lbl_Event">Tennis</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12">
                                <div class="clearfix"></div>

                                <div class="table-SportList grid_shadow">
                                    <div class="clearfix"></div>
                                    <div class="row">
                                        <div class="col-md-7 col-xs-12 hidden-xs" style={{ userSelect: "text" }}>

                                        </div>
                                        <div class="col-md-5">
                                            <div class="row">
                                                <div class="col-xs-4 text-center text-muted" style={{ fontSize: "13px" }}>1</div>
                                                <div class="col-xs-3 text-center text-muted" style={{ fontSize: "13px" }}>X</div>
                                                <div class="col-xs-4 text-center text-muted" style={{ fontSize: "13px" }}>2</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div id="showdata">
                                        <div id="ContentPlaceHolder1_UpdatePanel1">
                                            <div class="market_wrap">

                                                <div class="col-md-12 col-xs-12" style={{ padding: "unset" }}>
                                                    <table className="market-table" >
                                                        <thead></thead>
                                                        <tbody>
                                                            <EventRow
                                                                eventList={activeEventList}
                                                                tabName="tennis"
                                                            />
                                                        </tbody>
                                                    </table>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-3 col-sm-3">
                </div>

            </div>

        </ClientLayout>
    );
}
