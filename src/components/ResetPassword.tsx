import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Icon } from "semantic-ui-react";

export default function ResetPassword() {

    const [oldpass, setOldPass] = useState<string>("");
    const [newpass, setNewPass] = useState<string>("");
    const [retypedNewPass, setRetypedNewPass] = useState<string>("");
    const [showAllPasswords, setShowAllPasswords] = useState<boolean>(false);
    

    const handleSubmit = () => {
    }

    return (
        <div className="form-wrapper">
            <Form onSubmit={handleSubmit}>
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
                    label="Old Password"
                    placeholder="Old Password"
                    type={showAllPasswords ? "text" : "password"}
                    required={true}
                    value={oldpass}
                    onChange={(e) => setOldPass(e.currentTarget.value)}
                />
                <Form.Input
                    label="New Password"
                    placeholder="New Password"
                    type={showAllPasswords ? "text" : "password"}
                    required={true}
                    value={newpass}
                    onChange={(e) => setNewPass(e.currentTarget.value)}
                />
                <Form.Input
                    label="Confirm New Password"
                    placeholder="New Password"
                    required={true}
                    type={showAllPasswords ? "text" : "password"}
                    value={retypedNewPass}
                    onChange={(e) => setRetypedNewPass(e.currentTarget.value)}
                />
                <hr />
                <Form.Field>
                    <Button type='submit'>Reset</Button>
                </Form.Field>
                <Form.Field>
                    <Link to="/">Go to login</Link>
                </Form.Field>
            </Form>
        </div>
    )
}