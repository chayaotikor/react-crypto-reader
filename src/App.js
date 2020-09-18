import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  container: {
    border: "1px solid red",
  },
  card: {
    backgroundColor: "pink",
    width: "200px",
    height: "200px",
  },
});

function App() {
  const classes = useStyles();
  
  let blocks = []
  
  useEffect(() => {
    loadBlocks();
  });
  
  const loadBlocks = async () => {
    const web3 = new Web3(process.env.REACT_APP_URL);
    web3.eth.getBlock(6607985).then((res) => blocks.push(res))
    console.log(blocks)
  };

  return (
    <Container className={classes.container}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="caption" className="text">
            Transaction Number
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
