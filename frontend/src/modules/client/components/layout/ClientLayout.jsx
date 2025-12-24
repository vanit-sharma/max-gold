import { useRef, useEffect, useState } from "react";
import { logout } from "../../../../utils/auth";
import "../../../../assets/css/style.css";
import "../../../../assets/css/bootstrap.css";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  setEventData,
  setEventLoading,
  setEventError,
} from "../../../../store/eventSlice";
import axiosInstance from "../../../../utils/axiosInstance";

const ClientLayout = ({ children }) => {
  const [displaySidebar, setDisplaySidebar] = useState(false);
  const [displaySubMenu, setDisplaySubMenu] = useState(false);
  const [displayTopRightMenu, setDisplayTopRightMenu] = useState(false);
  const isloader = false;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEvents = async () => {
      //console.log("Fetching events...");
      try {
        const response = await axiosInstance.get("/events");

        if (response.data.result !== "") {
          dispatch(setEventData(response.data))
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const topRightMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Function to handle clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        topRightMenuRef.current &&
        !topRightMenuRef.current.contains(event.target)
      ) {
        setDisplayTopRightMenu(false); // Or update any value/state you want
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [topRightMenuRef]);

  return (
      
<div class="page_wrappper">
    <header class="header_wrp">
    <div class="container"> 
        <div class="row">
        <div class="col-sm-5 col-xs-4">
            <div class="logo text-logo"><a href="https://betmax.gold/home?eventType=4" class="pull-left">
                <img id="Image111" class="img-responsive" alt="Logo" src="assets/images/betmax.gold.png"/></a>
                <span id="LiveTime"></span>
            </div>
        </div>
        <div class="col-sm-7 col-xs-8">
            <div class="top_drop">
                <ul class="dropdown-menu n__list" role="menu">
                   
                 <li class="dropdown"><a href="javascript:void(0)"  class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        <img src="./betmax.gold_files/wallet.png" width="24" class="iconnav"/>&nbsp; 
                        <span id="lbl_Wallet" class="wallet">0</span><span class="caret"></span></a>
                        <ul class="dropdown-menu dash__m" role="menu">
                            <li><a href="javascript:void(0)">
                                <span class="pull-left wallet">Cr. Limit:</span>
                                <span id="limit" class="wallet pull-right"></span>
                            </a></li>
                            <li><a href="https://betmax.gold/profit-loss">
                                <span class="pull-left">P/L:</span>
                                <span id="cash" class="wallet pull-right"></span>
                            </a></li>
                            <li><a href="https://betmax.gold/liability">
                                <span class="pull-left">Liability:</span>
                                <span id="liability" class="wallet pull-right"></span>
                            </a></li>

                            <li><a href="javascript:void(0)">
                                <span class="pull-left">Max Win:</span>
                                <span id="exposure" class="wallet pull-right"></span>
                            </a></li>
                        </ul>
                    </li>
                    <li class="dropdown"><a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        <img src="./betmax.gold_files/usericon.png" width="24" class="iconnav"/>&nbsp;<span id="lbl_username">pkr007</span><span class="caret"></span></a><ul class="dropdown-menu dash__m" role="menu">

                            <li><a href="https://betmax.gold/chipsummery">Account Statement</a></li>
							<li><a href="https://betmax.gold/casinoresults">Casino Report History</a></li>
                            <li><a href="https://betmax.gold/profit-loss">Profit Loss</a></li>							
                            <li><a href="https://betmax.gold/liability">Bet History</a></li>
                            <li><a href="https://betmax.gold/editstake">Set Button value</a></li>
                            <li><a href="https://betmax.gold/chngpswd">Change Password</a></li>
							  <li><a href="javascript:void(0)" onclick="ShowPopup()">Rules</a></li>
                            <li><a href="https://betmax.gold/logout.aspx">Signout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div> 
            </div>
</div>
    </header>

    <div class="topnav" id="myTopnav">
            <Link
                  to="/home"
                  style={{
                    WebkitTextDecoration: "none",
                    textDecoration: "none",
                  }}
                >
                  InPlay
                </Link>  

                <Link
                  to="/cricket"
                  style={{
                    WebkitTextDecoration: "none",
                    textDecoration: "none",
                  }}
                >
                  Cricket
                </Link> 
        
        

        <a href="https://betmax.gold/home?eventType=1">Soccer</a> 
        <a href="https://betmax.gold/home?eventType=2">Tennis</a>     
        <a href="https://betmax.gold/home?eventType=7522">Basketball</a>
        <a href="https://betmax.gold/teenpatti" class="rainbow">Live Cards</a>   
        <a href="javascript:void(0);" style={{fontSize:"15px"}} class="icon">☰</a>
    </div>

    <div class="notification"> <div class="notifybtn">News</div>
        <marquee hspace="0" scrollamount="5" behavior="SCROLL" class="notifymark">
            <p id="shownews"></p></marquee>
    </div> 
    <div class=""> 
   
     {children}
    </div>  
</div> 
  );
};

export default ClientLayout;
