import Calendar from "../../../components/Calendar/Calendar";

const GenericCalendar = ({ events, title, title_plural }) => {

    return (
        <Calendar 
          events={events} 
          title={title}
          openInModal={true}  // false = useNavigate (rutas internas), true = window.open (nuevas pestañas)
        />
    )
}


export default GenericMaster;