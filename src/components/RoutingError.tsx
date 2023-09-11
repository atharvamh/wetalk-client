import { Grid, GridRow } from "semantic-ui-react";
import DeadEndImage from "../assets/deadend.svg";

export default function RouteError(){
    return (
        <Grid>
            <GridRow textAlign="center" verticalAlign="middle" centered>
                <img src={DeadEndImage} width={200} alt="Dead-end" style={{ borderRadius : "50%" }}/>
            </GridRow>
            <GridRow centered textAlign="center">
                <h2 style={{ color: "#fff"}}>
                    Sorry, you've hit a dead end.
                </h2>
            </GridRow>
        </Grid>
    )
}