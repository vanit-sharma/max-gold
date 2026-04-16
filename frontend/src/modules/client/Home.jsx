import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import EventRow from "./components/layout/EventRow";
import ClientLayout from "./components/layout/ClientLayout";
import { useSelector } from "react-redux";


export default function Home() {
    const eventsFromParent = useSelector((state) => state.event);
    const [activeEventList, setActiveEventslist] = useState([]);
    const getEvents = (events) => {
        let inplayEvent = events.result.filter((event) => event.inplay);
        let cricketEvent = events.result.filter((event) => event.sports_type === 1);
        let footballEvent = events.result.filter((event) => event.sports_type === 2);
        let tennisEvent = events.result.filter((event) => event.sports_type === 3);

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
    return (
        <ClientLayout>
            <div class="row">

                <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="bannerinner">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="banner">

                                    <div class="box-heading grid_shadow box-heading-home">
                                        <div class="clearfix ng-binding">
                                            <span id="ContentPlaceHolder1_lbl_Event">In-Play</span>
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
                                        <div class="col-md-5 col-xs-12 hidden-xs padding-top-5">
                                            <div class="col-xs-12">
                                                <div class="col-xs-4 text-center text-muted" style={{ fontSize: "13px" }}>1</div>
                                                <div class="col-xs-4 text-center text-muted" style={{ fontSize: "13px" }}>X</div>
                                                <div class="col-xs-4 text-center text-muted" style={{ fontSize: "13px" }}>2</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div id="showdata">
                                        <div id="ContentPlaceHolder1_UpdatePanel1">
                                            <div class="market_wrap">
                                                <div>
                                                    <table className="market-table">
                                                        <thead>
                                                            <tr>
                                                                <th><h3></h3></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <EventRow
                                                                eventList={activeEventList}
                                                                tabName="inplay_cricket" />
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <table className="market-table">
                                                    <thead>
                                                        <tr>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <EventRow
                                                            eventList={activeEventList}
                                                            tabName="inplay_football"
                                                        />
                                                    </tbody>
                                                </table>
                                                <table className="market-table">
                                                    <thead>
                                                        <tr>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <EventRow
                                                            eventList={activeEventList}
                                                            tabName="inplay_tennis"
                                                        />


                                                    </tbody>
                                                </table>
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
