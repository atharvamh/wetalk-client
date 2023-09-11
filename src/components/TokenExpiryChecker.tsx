import { Modal, Icon, Loader } from "semantic-ui-react";
import { peopleNetworkStyles } from "../styles/peoplenetwork";
import { useEffect, useState } from "react";
import authService from "../services/authService";
import localStorageService from "../services/localStorageService";
import toast from "react-hot-toast";

export default function TokenExpiryChecker(){

    const [showTimeout, setshowTimeout] = useState<boolean>(false);

    const updateShowTimeout = () => {
        setshowTimeout(true);
        const uid = localStorageService.get("_uid") ?? "";

        setTimeout(async () => {
            const response = await authService.logout(uid);

            if(response.isSuccess){
                toast.success(response.message);
                setTimeout(() => authService.removeCredentials(), 1000);
                return;
            }

            toast.error(response.message);
        },2000)
    }

    useEffect(() => {

        // call this initially during component mount
        authService.checkTokenExpiry(updateShowTimeout)

        // then set a 1 min interval to call the token expiry check.
        const checkInterval = 60000;
        const tokenCheckTimer = setInterval(() => authService.checkTokenExpiry(updateShowTimeout), checkInterval);

        return () => {
            clearInterval(tokenCheckTimer);
        }
    }, [])

    return (
        showTimeout ? 
        <Modal
            basic
            open={true}
            size='small'
        >
            <Modal.Content>
                <div style={peopleNetworkStyles.FlexColumnRowGap}>
                    <h2><Icon name="clock" />Session Timeout</h2>
                    <h4>
                        Your session has expired. Please login again to use the application.
                    </h4>
                    <h4>
                        <Loader active inline />
                        <span style={{ marginLeft : "12px" }}>Logging you out...</span>
                    </h4>
                </div>
            </Modal.Content>
        </Modal>
        : <></>
        
    );
}