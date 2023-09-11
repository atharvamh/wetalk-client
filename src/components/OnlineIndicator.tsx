import { Icon, Label, SemanticSIZES } from "semantic-ui-react";

interface IOnlineIndicator{
    isOnline: boolean | undefined;
    showIcon?: boolean;
    showText?: boolean;
    userStyle?: any;
    size?: SemanticSIZES;
}

export default function OnlineIndicator({ isOnline, showIcon = false, showText = true, userStyle, size } : IOnlineIndicator){
    return (
        <Label color={isOnline ? 'green' : 'grey'} size={ size ? size : "medium"} style={userStyle}>
            { showIcon ? <Icon name={isOnline ? 'circle' : 'times circle'} /> : <></> }
            { showText ? (isOnline ? "Online" : "Offline") : <></> }
        </Label>
    )
}