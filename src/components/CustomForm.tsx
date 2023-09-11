import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Icon, Label } from "semantic-ui-react";
import { loginUser, registerUser } from "../services/user";
import { toast } from "react-hot-toast";
import localStorageService from "../services/localStorageService";

interface ICustomForm{
    isSignup : boolean;
    setIsSignup : Dispatch<SetStateAction<boolean>>;
}

export default function CustomForm({ isSignup, setIsSignup } : ICustomForm) {

    const token = localStorageService.get("x-token");

    const [email, setemail] = useState<string>("");
    const [password, setpassword] = useState<string>("");
    const [showPass, setshowPass] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        if(token){
            navigate("/home");
        }
    },[])

    const resetFormFields = () => {
        setemail("");
        setpassword("");
        setFirstName("");
        setLastName("");
    }

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(isSignup){
            const payload = { 
                email : email,
                firstName : firstName,
                lastName : lastName,
                password : password
            }

            const response = await registerUser(payload);
            resetFormFields();
            
            if(response.isSuccess){
                toast.success(response.message);
                setIsSignup(false);
            }

            else{
                toast.error(response.message);
            }
        }

        else{
            const payload = {
                email : email,
                password : password
            }

            const response = await loginUser(payload);
            resetFormFields();

            if(response.isSuccess){
                localStorageService.set("_uid", JSON.stringify(response.data._id));
                localStorageService.set("x-token", JSON.stringify(response.data.token));
                toast.success(response.message);
                setTimeout(() => {
                    navigate("/home");
                },1000);
            }

            else{
                toast.error(response.message);
            }
        }
    }

    const enableSubmit = () => {
        if(isSignup)
            return email && firstName && lastName && password
        
        return email && password;
    }

    return (
        <div className="form-wrapper">
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <h2>WeTalk { isSignup ? "Sign up" : "Login" }</h2>
                    <hr />
                </Form.Field>
                {
                    isSignup ?
                    <>
                        <Form.Input
                            label="First Name"
                            placeholder="First Name"
                            type="text"
                            value={firstName}
                            required={true}
                            onChange={(e) => setFirstName(e.currentTarget.value)}
                        />
                        <Form.Input
                            label="Last Name"
                            placeholder="Last Name"
                            type="text"
                            value={lastName}
                            required={true}
                            onChange={(e) => setLastName(e.currentTarget.value)}
                        />
                    </> : <></>
                }
                <Form.Input
                    label="Email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    required={true}
                    onChange={(e) => setemail(e.currentTarget.value)}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    required={true}
                    onChange={(e) => setpassword(e.currentTarget.value)}
                    icon={
                        <Button onClick={(e) => { e.preventDefault(); setshowPass(prev => !prev); }} 
                            style={{ marginLeft: "0.5rem", textAlign: "center"}}>
                            <Icon 
                                name={showPass ? "eye slash" : "eye" } 
                                style={{cursor: "pointer"}}
                            />
                        </Button>
                    }
                />
                {
                    isSignup ? <></> : 
                    <Form.Field>
                        <Label basic color="blue">
                            <span>Forgot your password ? </span>
                            <Link to="/resetpassword">Click here</Link>
                        </Label>
                    </Form.Field>
                }
                <hr />
                <Form.Field>
                    <Button type='submit' disabled={!enableSubmit()}>Submit</Button>
                </Form.Field>
                <Form.Field>
                    <div>
                        <span>{ isSignup ? "Already a registered user ? " : "Not a user yet ? " }</span>
                        <a onClick={() => setIsSignup(prev => !prev)} style={{ cursor : "pointer" }}>
                            { isSignup ? "Login" : "Sign up" }
                        </a>
                    </div>
                </Form.Field>
            </Form>
        </div>
    )
}