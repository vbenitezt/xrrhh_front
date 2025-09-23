import moment from "moment";


export const formatTime24Hrs = (value) => {
    let input_time = value;
    let date_a = moment(input_time, "HH:mm");
    return date_a.format("HH:mm");
}