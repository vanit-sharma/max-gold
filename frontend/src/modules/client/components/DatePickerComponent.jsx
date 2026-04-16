import React, { useState } from "react";
import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCalendar } from "@fortawesome/free-solid-svg-icons";

const DatePickerComponent = ({ setSelectedDate, defaultDate }) => {
    const [pickedDate, setPickedDate] = useState(new Date(defaultDate));

    const sendDate = (date) => {
        setSelectedDate(date);
    };

    const CustomInput = React.forwardRef((props, ref) => {
        return (
            <div class="form-group">
                <div class="input-group date">
                    <input
                        class="form-control"
                        type="text"
                        value={props.value}
                        onClick={props.onClick}
                        onChange={props.onChange}
                        ref={ref}
                    />
                    <div class="input-group-addon input-group-append">
                        <div class="input-group-text">
                            <i
                                class="glyphicon glyphicon-calendar fa fa-calendar"
                                onClick={props.onClick}
                            ></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <DatePickerDiv>
            <DatePicker
                selected={pickedDate}
                dateFormat="dd-MM-yyyy hh:mm a"
                onChange={(date) => {
                    setPickedDate(date);
                    sendDate(date);
                }}
                customInput={<CustomInput />}
            />
        </DatePickerDiv>
    );
};

export default DatePickerComponent;

const DatePickerDiv = styled.div`
.react-datepicker__navigation-icon {
  text-indent: -9999px !important;   /* hide the text: "Previous Month"/"Next Month" */
  overflow: hidden !important;
  border-style: solid !important;
  height: 6px !important;
  width: 6px !important;
  border-width: 3px 3px 0 0 !important;
  display: inline-block !important;
  padding: 3px !important;
}
.react-datepicker__navigation-icon--previous {
  transform: rotate(-135deg) !important;
}
.react-datepicker__navigation-icon--next {
  transform: rotate(45deg) !important;
}
.react-datepicker__navigation--previous {
  left: 10px !important;
  top: 2px !important;
}
.react-datepicker__navigation--next {
  right: 10px !important;
  top: 2px !important;
}
.react-datepicker__current-month {
  width:70% !important;
  margin:0 auto !important;  
}
.datepicker__day {
  padding-left:4px;
}

.react-datepicker__day {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 32px !important;
  height: 32px !important;
  margin: 2px !important;
  box-sizing: border-box !important;

  font-size: 0.95rem !important;
  font-weight: 500 !important;
}

.react-datepicker__day--outside-month {
  opacity: 0.5 !important;
}
.react-datepicker__day--selected,
.react-datepicker__day--keyboard-selected {
  background: #2b6cb0 !important;
  color: #fff !important;
  border-radius: 6px !important;

  width: 32px !important;
  height: 32px !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.react-datepicker__day--today {
  border: 1px solid rgba(43,108,176,0.18) !important;
  border-radius: 6px !important;
}

.react-datepicker__week {
  display: flex !important;
  justify-content: space-between !important;
}

.react-datepicker__day-names {
  display: flex !important;
  justify-content: space-between !important;
  padding: 0 8px !important;
}

.react-datepicker__day-name {
  width: 32px !important;
  text-align: center !important;
}
`;