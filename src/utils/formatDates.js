import dayjs from "dayjs";

export function formatDicomDate(str) {
    // Extraemos los valores de día, mes y año del string
    const year = str.slice(0, 4);
    const month = str.slice(4, 6);
    const day = str.slice(6, 8);
  
    // Construimos el string en formato "DD-MM-YYYY"
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
  }


export function formatDate(str) {
  return dayjs(str, "YYYY-MM-DD").format("DD-MM-YYYY");
}

export function formatTime(str) {
  return dayjs(str, "HH:mm:ss").format("HH:mm");;
}