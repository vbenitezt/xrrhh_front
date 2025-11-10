import React, { useState, useMemo } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const Calendar = ({ events = [], initialMonth, initialYear, title = 'Calendario', openInModal = false }) => {
  const now = new Date();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? now.getMonth());
  const [currentYear, setCurrentYear] = useState(initialYear ?? now.getFullYear());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Estados para modal de iframe
  const [iframeModalVisible, setIframeModalVisible] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [iframeTitle, setIframeTitle] = useState('');

  // Límite de eventos visibles en el card antes de mostrar "ver más"
  const MAX_VISIBLE_EVENTS = 2;

  // Colores predefinidos para tipos/grupos
  const typeColors = useMemo(() => {
    const colors = [
      { bg: 'bg-blue-100', hover: 'hover:bg-blue-200', border: 'border-blue-500', text: 'text-blue-900', subtext: 'text-blue-700' },
      { bg: 'bg-green-100', hover: 'hover:bg-green-200', border: 'border-green-500', text: 'text-green-900', subtext: 'text-green-700' },
      { bg: 'bg-purple-100', hover: 'hover:bg-purple-200', border: 'border-purple-500', text: 'text-purple-900', subtext: 'text-purple-700' },
      { bg: 'bg-orange-100', hover: 'hover:bg-orange-200', border: 'border-orange-500', text: 'text-orange-900', subtext: 'text-orange-700' },
      { bg: 'bg-pink-100', hover: 'hover:bg-pink-200', border: 'border-pink-500', text: 'text-pink-900', subtext: 'text-pink-700' },
      { bg: 'bg-red-100', hover: 'hover:bg-red-200', border: 'border-red-500', text: 'text-red-900', subtext: 'text-red-700' },
      { bg: 'bg-yellow-100', hover: 'hover:bg-yellow-200', border: 'border-yellow-500', text: 'text-yellow-900', subtext: 'text-yellow-700' },
      { bg: 'bg-indigo-100', hover: 'hover:bg-indigo-200', border: 'border-indigo-500', text: 'text-indigo-900', subtext: 'text-indigo-700' },
      { bg: 'bg-teal-100', hover: 'hover:bg-teal-200', border: 'border-teal-500', text: 'text-teal-900', subtext: 'text-teal-700' },
      { bg: 'bg-cyan-100', hover: 'hover:bg-cyan-200', border: 'border-cyan-500', text: 'text-cyan-900', subtext: 'text-cyan-700' },
    ];
    return colors;
  }, []);

  // Mapa de tipos a colores (se genera automáticamente)
  const typeColorMap = useMemo(() => {
    const map = {};
    const uniqueTypes = [...new Set(events.map(e => e.tipo).filter(Boolean))];
    
    uniqueTypes.forEach((tipo, index) => {
      map[tipo] = typeColors[index % typeColors.length];
    });
    
    // Color por defecto para eventos sin tipo
    map['default'] = typeColors[0];
    
    return map;
  }, [events, typeColors]);

  // Obtener color para un evento
  const getEventColor = (event) => {
    return typeColorMap[event.tipo] || typeColorMap['default'];
  };

  // Nombres de días y meses
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Obtener día de la semana (0 = domingo, ajustar a lunes = 0)
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const daysInMonth = lastDay.getDate();
    const days = [];
    
    // Días del mes anterior para completar la primera semana
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i)
      });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, day)
      });
    }
    
    // Días del siguiente mes para completar la última semana
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          day,
          isCurrentMonth: false,
          date: new Date(currentYear, currentMonth + 1, day)
        });
      }
    }
    
    return days;
  }, [currentMonth, currentYear]);

  // Agrupar eventos por fecha (usando fecha local, no UTC)
  const eventsByDate = useMemo(() => {
    const grouped = {};
    events.forEach(event => {
      // Parsear fecha en formato local para evitar problemas de zona horaria
      const [year, month, day] = event.fecha.split('-').map(Number);
      const dateKey = `${year}-${month - 1}-${day}`;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  // Obtener eventos de un día específico
  const getEventsForDay = (date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return eventsByDate[dateKey] || [];
  };

  // Navegación
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Verificar si es el día actual
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Manejar click en evento
  const handleEventClick = (event) => {
    if (event.api) {
      if (openInModal) {
        // Abrir en modal con iframe (sin layout)
        setIframeUrl(`${event.api}?embedded=true`);
        setIframeTitle(event.titulo);
        setIframeModalVisible(true);
      } else {
        // Navegar internamente en el mismo proyecto
        navigate(event.api);
      }
    }
  };

  // Cerrar modal de iframe
  const handleCloseIframeModal = () => {
    setIframeModalVisible(false);
    setIframeUrl('');
    setIframeTitle('');
  };

  // Manejar click en "ver más"
  const handleViewMore = (date, dayEvents) => {
    setSelectedDate(date);
    setSelectedDayEvents(dayEvents);
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedDayEvents([]);
    setSelectedDate(null);
  };

  // Formatear fecha para el título del modal
  const formatDate = (date) => {
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-gray-600">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Mes anterior"
            >
              <MdChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Mes siguiente"
            >
              <MdChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Nombres de días */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-gray-600 border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7">
          {calendarDays.map((dayInfo, index) => {
            const dayEvents = getEventsForDay(dayInfo.date);
            const isTodayDay = isToday(dayInfo.date);

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                  !dayInfo.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                {/* Número del día */}
                <div className="flex justify-end mb-1">
                  <span
                    className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                      isTodayDay
                        ? 'bg-blue-500 text-white'
                        : dayInfo.isCurrentMonth
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {dayInfo.day}
                  </span>
                </div>

                {/* Eventos del día */}
                <div className="space-y-1">
                  {dayEvents.slice(0, MAX_VISIBLE_EVENTS).map((event) => {
                    const colors = getEventColor(event);
                    return (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`text-xs p-1.5 rounded cursor-pointer transition-all ${
                          event.api ? 'hover:shadow-md' : ''
                        } ${colors.bg} ${colors.hover} border-l-2 ${colors.border}`}
                      >
                        <div className={`font-semibold ${colors.text} truncate`}>
                          {event.titulo}
                        </div>
                        {event.subtitulo && (
                          <div className={`${colors.subtext} truncate`}>
                            {event.subtitulo}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Botón "ver más" si hay más eventos */}
                  {dayEvents.length > MAX_VISIBLE_EVENTS && (
                    <button
                      onClick={() => handleViewMore(dayInfo.date, dayEvents)}
                      className="text-xs w-full p-1.5 rounded text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                    >
                      +{dayEvents.length - MAX_VISIBLE_EVENTS} más
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal con todos los eventos del día */}
      <Modal
        title={selectedDate ? formatDate(selectedDate) : 'Eventos del día'}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {selectedDayEvents.map((event) => {
            const colors = getEventColor(event);
            return (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className={`p-4 rounded-lg border-l-4 ${colors.border} ${colors.bg} ${
                  event.api ? `cursor-pointer ${colors.hover}` : ''
                } transition-colors`}
              >
                <div className={`font-semibold ${colors.text} text-base mb-1`}>
                  {event.titulo}
                </div>
                {event.subtitulo && (
                  <div className={`${colors.subtext} text-sm`}>
                    {event.subtitulo}
                  </div>
                )}
                {event.tipo && (
                  <div className={`text-xs ${colors.subtext} mt-2 font-medium`}>
                    📂 {event.tipo}
                  </div>
                )}
                {event.api && (
                  <div className="text-xs text-gray-500 mt-2">
                    Click para {openInModal ? 'abrir en modal' : 'navegar'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Modal con iframe para mostrar contenido sin layout */}
      <Modal
        title={iframeTitle}
        open={iframeModalVisible}
        onCancel={handleCloseIframeModal}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(90vh - 100px)', padding: 0 }}
      >
        <iframe
          src={iframeUrl}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            borderRadius: '8px'
          }}
          title={iframeTitle}
        />
      </Modal>
    </div>
  );
};

export default Calendar;
