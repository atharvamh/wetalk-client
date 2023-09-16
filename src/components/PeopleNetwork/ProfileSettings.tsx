import { Button, Form, Icon, Input, Label } from "semantic-ui-react";
import authService from "../../services/authService";
import { useEffect, useState, useCallback } from "react";
import { peopleNetworkStyles } from "../../styles/peoplenetwork";
import localStorageService from "../../services/localStorageService";
import { toast } from "react-hot-toast";
import { getUserDetails, requestUserVerification, updateUserDetails } from "../../services/user";
import socket from "../../services/socket";

const formStyle : React.CSSProperties = {
    padding: "1em",
    border: "1px solid #9ca3af",
    borderRadius: "0.6em",
    margin: "1em 0em",
    width: "40%",
    background: "#e3e8f4"
};

interface IUserInfo{
    firstname: string,
    email: string,
    lastActivity: Date | null,
    lastname: string,
    isVerified: boolean | undefined
}

export default function ProfileSettings(){

    const uid = localStorageService.get("_uid") ?? "";

    const [user, setUser] = useState<IUserInfo>({ firstname : '', lastname : '', 
        isVerified : undefined, email : '', lastActivity : null });

    useEffect(() => {
        if(uid){
            getUserInfo(uid);
        }
    },[uid])

    const getUserInfo = async (uid : string) => {
        const userResult = await getUserDetails(uid);
        setUser(userResult.data);
    }

    const handleInputChange = (target : any) => {
        const { name, value } = target;

        setUser((prev) => {
            return { ...prev, [name] : value }
        });
    }

    const handleVerification = useCallback(async () => {
        const payload = { 
            email : user.email,
            firstName : user.firstname
        }

        const response = await requestUserVerification(JSON.stringify(payload));
        
        if(response.isSuccess){
            toast.success(response.message);
            return;
        }

        toast.error(response.message);
    },[user]);

    const handleLogout = async () => {
        const response = await authService.logout(uid);

        if(response.isSuccess){
            socket.emit("user-logout", {userId : uid});
            toast.success(response.message);
            setTimeout(() => authService.removeCredentials(), 1000);
            return;
        }

        toast.error(response.message);
    }

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        const updateResponse = await updateUserDetails(uid, JSON.stringify(user));

        if(updateResponse.isSuccess){
            setUser(updateResponse.data);
            toast.success(updateResponse.message);
        }
    }

    return (
        <div style={peopleNetworkStyles.FlexColumnRowGap}>
            <Form onSubmit={handleSubmit} style={formStyle}>
                <div>
                    <h2>
                        <Icon name="pencil" />
                        <span>Edit Profile</span>
                    </h2>
                </div>
                <hr />
                <Form.Field>
                    <label>Email (non-editable)</label>
                    <Input
                        disabled
                        type="text"
                        name="email"
                        value={user?.email}
                        style={{ border : "1px solid grey", borderRadius: "0.25em"}}
                    />
                </Form.Field>
                <Form.Field>
                    <label>First Name</label>
                    <Input
                        type="text"
                        name="firstname"
                        value={user?.firstname}
                        onChange={(e) => handleInputChange(e.currentTarget)}
                        style={{ border : "1px solid grey", borderRadius: "0.25em"}}
                        required={true}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Last Name</label>
                    <Input
                        type="text"
                        name="lastname"
                        value={user?.lastname}
                        onChange={(e) => handleInputChange(e.currentTarget)}
                        style={{ border : "1px solid grey", borderRadius: "0.25em"}}
                        required={true}
                    />
                </Form.Field>
                <Form.Field>
                    <span style={{ fontWeight : "500" }}>Last Login : </span>
                    <span>{ user?.lastActivity ? new Date(user.lastActivity).toLocaleString() : "N/A" }</span>
                </Form.Field>
                <Form.Field>
                    <span style={{ fontWeight : "500" }}>Verification Status : </span>
                    <Label color={user.isVerified ? "green" : (user.isVerified === false ? "red" : undefined) }>
                        { user?.isVerified ? "Verified" : (user.isVerified === false ? "Not Verified" : "")}
                    </Label>
                    {
                        user?.isVerified === false ?
                        <Button primary size="mini" type="button" style={{ marginLeft: "1em"}} onClick={handleVerification}>
                            Verify me
                        </Button> : <></>
                    }
                </Form.Field>
                <Button primary type="submit">Update</Button>
            </Form>
            <Button icon primary onClick={handleLogout}>
                <Icon name="log out" /> Logout
            </Button>
        </div>
    )
}