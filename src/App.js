import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Button, CircularProgress, LinearProgress } from "@material-ui/core";

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
    flexFlow: 'column nowrap',
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
});

function App() {
  const classes = useStyles();
  const web3 = new Web3(process.env.REACT_APP_URL);
  const birthTopic = web3.utils.sha3(
    "Birth(address,uint256,uint256,uint256,uint256)"
  );
  const address = process.env.REACT_APP_CONTRACT_ADDRESS;

  const [birthData, setBirthData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async (startingBlock, endingBlock) => {
    const resultArr = [];

    for (let i = startingBlock; i <= endingBlock; i++) {
      console.log(i, resultArr.length);
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

  const findMostBirths = async () => {
    const matronIdCount = {};
    let mostBirthsCount = 0;
    let mostBirths = null;
    for (let i = 0; i < birthData.length; i++) {
      try {
        if (matronIdCount.hasOwnProperty(birthData[i].matronId)) {
          matronIdCount[birthData[i].matronId]++;
        } else {
          matronIdCount[birthData[i].matronId] = 1;
        }
        if (matronIdCount[birthData[i].matronId] > mostBirthsCount) {
          mostBirthsCount = matronIdCount[birthData[i].matronId];
          mostBirths = birthData[i].matronId;
        }
        console.log(matronIdCount, mostBirthsCount, mostBirths);
      } catch (err) {
        throw new Error(err)
      }
    }
  };

  return (
    <Container className={classes.container}>
      <Card className={classes.card}>
        <CardContent>
          {loading === true ? (
            <CircularProgress className={classes.progress} />
          ) : (
            <Typography variant="caption" className="text">
              Data
            </Typography>
          )}
        </CardContent>
        <Button
          className={classes.button}
          onClick={async (e) => {
            e.preventDefault();
            setLoading(true);
            await loadData(6607985, 6608085);
            setLoading(false);
          }}
        >
          Load Data
        </Button>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          {loading === true ? (
            <CircularProgress className={classes.progress} />
          ) : (
            <Typography variant="caption" className="text">
              Data
            </Typography>
            )}
                  </CardContent>
          <Button
            className={classes.button}
            onClick={async (e) => {
              e.preventDefault();
              setLoading(true);
              await findMostBirths();
              setLoading(false);
            }}
          >
            Find Most Births
          </Button>
      </Card>
    </Container>
  );
}

export default App;
