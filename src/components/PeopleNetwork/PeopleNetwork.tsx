import { peopleNetworkStyles } from "../../styles/peoplenetwork";
import { Icon, Menu, Segment } from "semantic-ui-react";
import Connect from "./Connect";
import Friends from "./Friends";
import Chat from "./Chat";
import ProfileSettings from "./ProfileSettings";
import PendingRequests from "./PendingRequests";
import { useState } from "react";
import TokenExpiryChecker from "../TokenExpiryChecker";
import localStorageService from "../../services/localStorageService";
import { platformStyles } from "../../styles/platform";

interface IPeopleNetwork{
    sessionId : string | undefined
}

export default function PeopleNetwork({ sessionId } : IPeopleNetwork){

    const currentActive = localStorageService.get("activeTab") ?? "";
    const [activeTabIndex, setactiveTabIndex] = useState<number>(currentActive ? Number(currentActive) : 0);

    const handleTabChange = (_ : any,item : any) => {
        localStorageService.set("activeTab", item.index);
        setactiveTabIndex(item.index);
    }

    const getElement = (activeTabIndex : number) => {
        switch(activeTabIndex){
            case 0:
                return <Connect />;

            case 1:
                return <PendingRequests />;

            case 2:
                return <Friends />;

            case 3:
                return <Chat />;

            case 4:
                return <ProfileSettings />;

            default:
                return <></>;
        }
    }

    return (
        <div style={platformStyles.ContentWrapper}>
            <Menu inverted>
                <Menu.Menu position="left">
                    <div style={peopleNetworkStyles.Banner}>
                        <div style={{ fontWeight : "700", fontSize: "1.5em", color : "#fff" }}>
                            <Icon name="wechat" />
                            WeTalk
                        </div>
                        <div style={{ fontSize : "0.8em", background: "#fff", 
                            padding: "0.2em 0.5em", borderRadius: "0.4em", fontWeight: "600" }}>
                            Chat session id : { sessionId ?? "undefined" }
                        </div>
                    </div>
                </Menu.Menu>
                <Menu.Menu position="right">
                    <Menu.Item
                        name='Connect'
                        index={0}
                        active={activeTabIndex == 0}
                        onClick={handleTabChange}
                    />
                    <Menu.Item
                        name='Pending Requests'
                        index={1}
                        active={activeTabIndex == 1}
                        onClick={handleTabChange}
                    />
                    <Menu.Item
                        index={2}
                        name='Friends'
                        active={activeTabIndex == 2}
                        onClick={handleTabChange}
                    />
                    <Menu.Item
                        index={3}
                        name='Chat'
                        active={activeTabIndex == 3}
                        onClick={handleTabChange}
                    />
                    <Menu.Item
                        index={4}
                        name='Profile Settings'
                        active={activeTabIndex == 4}
                        onClick={handleTabChange}
                    />
                </Menu.Menu>
            </Menu>
            <Segment style={peopleNetworkStyles.Segment}>
                {
                    getElement(activeTabIndex)
                }
            </Segment>
            
            <TokenExpiryChecker />
        </div>
    )
}