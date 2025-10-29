import { CircleButton } from "../../components/Buttons/CustomButtons";
import { getIconComponent } from "../Master/master.base";


export const makeMasterDetailHeaderExtraButtons = (buttons = [], callApiFunction = () => { }, pkValue = null, isLoading = false) => {
    const extraButtons = buttons.map((button, index) => {
      return (
        <CircleButton
          title={button.title}
          key={`extra-button-${index}`}
          danger={button.danger}
          loading={isLoading}
          icon={getIconComponent(button.icon)}
          onClick={() => callApiFunction({ path: button.path, body: { pk: pkValue } })}
        />
      );
    });
    return extraButtons;
  }