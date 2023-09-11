import { Icon, SemanticICONS } from "semantic-ui-react";
import { platformStyles } from "../styles/platform";

interface IMessageContainer{
    message: string;
    iconName?: SemanticICONS;
}

export default function MessageContainer({ message, iconName } : IMessageContainer){
    return (
        <div style={platformStyles.MessageContainerWrapper}>
            {
                iconName ? <Icon name={iconName} size="huge"/> : <></>
            }
            <h3>{message}</h3>
        </div>
    )
}