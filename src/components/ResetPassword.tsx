import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Icon } from "semantic-ui-react";
import { requestPasswordReset, resetPassword } from "../services/user";
import toast from "react-hot-toast";
import jwtDecode from "jwt-decode";
import MessageContainer from "./MessageContainer";

export default function ResetPassword() {

    const [hasToken, setHasToken] = useState<boolean>(false);
    const [linkValid, setLinkValid] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");
    const [newpass, setNewPass] = useState<string>("");
    const [retypedNewPass, setRetypedNewPass] = useState<string>("");
    const [showAllPasswords, setShowAllPasswords] = useState<boolean>(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenVal = params.get("token");

        if(tokenVal){
            setHasToken(true);
            try {
                const decoded : any = jwtDecode(tokenVal);
                const expiryTime = decoded.exp * 1000;

                if(Date.now() > expiryTime){
                    setLinkValid(false);
                }

            } catch (error) {
                setLinkValid(false);
            }            
        }
    },[]);

    const handlePasswordReset = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(location.search);
        const tokenVal = params.get("token");

        const payload = {
            password : newpass,
            token : tokenVal
        }

        setNewPass("");
        setRetypedNewPass("");

        const response = await resetPassword(JSON.stringify(payload));

        if(response.isSuccess){
            toast.success(response.message);
            return;
        }

        toast.error(response.message);
    }

    const handleRequestLink = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = { email : email };
        const response = await requestPasswordReset(JSON.stringify(payload));
        setEmail("");

        if(response.isSuccess){
            toast.success(response.message);
            return;
        }

        toast.error(response.message);

    }

    return (
        <div className="form-wrapper">
            {
                !hasToken ? 
                <Form style={{ width : "100%" }} onSubmit={handleRequestLink}>
                    <Form.Field>
                        <h2>Enter your email</h2>
                        <hr />
                    </Form.Field>
                    <Form.Input
                        label="Email"
                        placeholder="Email"
                        type={"email"}
                        required={true}
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                    <Form.Field>
                        <p>
                            A link to reset your password will be sent to this email address.
                        </p>
                    </Form.Field>
                    <Form.Field>
                        <Button primary type='submit' disabled={!email?.trim().length}>
                            Get password reset link
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Link to="/">Go to login</Link>
                    </Form.Field>
                </Form> : 
                linkValid ?
                <Form onSubmit={handlePasswordReset} style={{ width : "100%" }}>
                    <Form.Field>
                        <h2>Password Reset</h2>
                        <div style={{ display : "flex", justifyContent : "center", cursor : "pointer" }}
                            onClick={() => setShowAllPasswords(prev => !prev)}>
                            <h4>{ showAllPasswords ? "Hide All" : "Show All" }</h4>
                            <Icon 
                                name={showAllPasswords ? "eye slash" : "eye" } 
                                style={{ marginLeft: "0.25rem"}}
                            />
                        </div>
                        <hr />
                    </Form.Field>
                    <Form.Input
                        label="New Password"
                        placeholder="Enter New Password"
                        type={showAllPasswords ? "text" : "password"}
                        required={true}
                        value={newpass}
                        onChange={(e) => setNewPass(e.currentTarget.value)}
                    />
                    <Form.Input
                        label="Confirm New Password"
                        placeholder="Re-enter New Password"
                        required={true}
                        type={showAllPasswords ? "text" : "password"}
                        value={retypedNewPass}
                        onChange={(e) => setRetypedNewPass(e.currentTarget.value)}
                    />
                    <hr />
                    <Form.Field>
                        <Button 
                            primary 
                            type='submit' 
                            disabled={
                                (!newpass.trim().length || !retypedNewPass.trim().length)
                                || (newpass !== retypedNewPass)
                            }
                        >
                            Reset
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Link to="/">Go to login</Link>
                    </Form.Field>
                </Form> : 
                <MessageContainer message="This link seems to be invalid or expired" />
            }
        </div>
    )
}