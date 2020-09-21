import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from "./abi";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  CardMedia,
  CircularProgress,
  LinearProgress,
} from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    border: "1px solid red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "pink",
    width: "200px",
    height: "200px",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "90%",
    fontSize: "12px",
  },
  progress: {
    height: "50px",
    width: "50px",
    color: "red",
  },
  image: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
});

function KittyList(props) {
  const { web3, birthTopic, address, loading, birthData, setBirthData } = props;
  const classes = useStyles();
  const [startingBlock, setStartingBlock] = useState(null);
  const [endingBlock, setEndingBlock] = useState(null);

  const loadList = async (startingBlock, endingBlock) => {
    const resultArr = [];
    for (let i = startingBlock; i <= endingBlock; i++) {
      try {
        await web3.eth
          .getPastLogs({
            fromBlock: i,
            toBlock: i + 1,
            address: address,
            topics: [birthTopic],
          })
          .then(async (res) => {
            for (let j = 0; j < res.length; j++) {
              let result = await web3.eth.abi.decodeLog(
                [
                  { indexed: false, name: "owner", type: "address" },
                  { indexed: false, name: "kittyId", type: "uint256" },
                  { indexed: false, name: "matronId", type: "uint256" },
                  { indexed: false, name: "sireId", type: "uint256" },
                  { indexed: false, name: "genes", type: "uint256" },
                ],
                res[j].data,
                [birthTopic]
              );
              resultArr.push(result);
            }
          });
      } catch (err) {
        throw new Error(err);
      }
    }
    setBirthData((birthData) => [...birthData, ...resultArr]);
  };

  return (
    <Container className={classes.container}>
      {loading === true ? (
        <CircularProgress className={classes.progress} />
      ) : (
        birthData.map((kitty) => {
          <Card className={classes.card}>
            <CardContent>
              <CardMedia
                src={`https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/${kitty.id}.svg`}
              />
            </CardContent>
          </Card>;
        })
      )}
      <Button
        className={classes.button}
        onClick={async (e) => {
          e.preventDefault();
          setLoading(true);
          await loadList(6607985, 66078085);
          setLoading(false);
        }}
      >
        Find Kitties
      </Button>
    </Container>
  );
}

export default App;
