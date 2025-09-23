import { Typography } from "antd";
import dayjs from "dayjs";

const {Text} = Typography;

export const localeEsDayjs = () => {
  return dayjs.locale('es', {
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
    monthsParseExact: true,
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom_lun_mar_mié_jue_vie_sáb'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD/MM/YYYY',
      LL: 'D MMMM YYYY',
      LLL: 'D MMMM YYYY HH:mm',
      LLLL: 'dddd D MMMM YYYY HH:mm',
    },
    calendar: {
      sameDay: '[Hoy a] LT',
      nextDay: '[Mañana a] LT',
      nextWeek: 'dddd [a] LT',
      lastDay: '[Ayer a] LT',
      lastWeek: 'dddd [pasado a] LT',
      sameElse: 'L',
    },
    relativeTime: {
      future: 'en %s',
      past: 'hace %s',
      s: 'unos segundos',
      m: 'un minuto',
      mm: '%d minutos',
      h: 'una hora',
      hh: '%d horas',
      d: 'un día',
      dd: '%d días',
      M: 'un mes',
      MM: '%d meses',
      y: 'un año',
      yy: '%d años',
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|o)/,
    ordinal: function (number) {
      return number + (number === 1 ? 'er' : 'o');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
      return input.charAt(0) === 'M';
    },
    meridiem: function (hours, minutes, isLower) {
      return hours < 12 ? 'PD' : 'MD';
    },
    week: {
      dow: 1, // Lunes es el primer día de la semana.
      doy: 4, // Se usa para determinar la primera semana del año.
    },
  });
};


export const localeEsDatepicker = () => {
    return {
        lang: {
          locale: 'es_ES',
          placeholder: 'Seleccionar fecha',
          rangePlaceholder: ['Desde', 'Hasta'],
          today: 'Hoy',
          now: <Text className="text-gray-900">Now</Text>,
          backToToday: 'Volver a hoy',
          ok: <Text className="text-gray-900">Ok</Text>,
          clear: 'Limpiar',
          month: 'Mes',
          year: 'Año',
          timeSelect: 'Seleccionar hora',
          dateSelect: 'Seleccionar fecha',
          monthSelect: 'Elegir mes',
          yearSelect: 'Elegir año',
          decadeSelect: 'Elegir década',
          yearFormat: 'YYYY',
          dateFormat: 'D/M/YYYY',
          dayFormat: 'D',
          dateTimeFormat: 'D/M/YYYY HH:mm:ss',
          monthFormat: 'MMMM',
          monthBeforeYear: true,
          previousMonth: 'Mes anterior (PageUp)',
          nextMonth: 'Siguiente mes (PageDown)',
          previousYear: 'Año anterior (Control + izquierda)',
          nextYear: 'Siguiente año (Control + derecha)',
          previousDecade: 'Década anterior',
          nextDecade: 'Siguiente década',
          previousCentury: 'Siglo anterior',
          nextCentury: 'Siguiente siglo',
          shortWeekDays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiempre', 'Octubre', 'Noviembre', 'Diciembre'],
          shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        },
        timePickerLocale: {
          placeholder: 'Seleccionar hora',
        },
        dateFormat: 'YYYY-MM-DD',
        dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
        weekFormat: 'YYYY-semana',
        monthFormat: 'YYYY-MM',
      }
}