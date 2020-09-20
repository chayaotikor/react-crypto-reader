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
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "50%",
    fontSize: "12px",
  },
  progress: {
    height: '50px',
    width: '50px',
    color: 'red'
  }
});

function App() {
  const classes = useStyles();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false)

  const loadData = async (startingBlock, endingBlock) => {
    const web3 = new Web3(process.env.REACT_APP_URL);
    const birthTopic = web3.utils.sha3(
      "Birth(address,uint256,uint256,uint256,uint256)"
    );
    const address = process.env.REACT_APP_CONTRACT_ADDRESS;
    const resultArr = [];

    for (let i = startingBlock; i <= endingBlock; i += 10001) {
      console.log(i, resultArr.length);
      if (i + 10001 > endingBlock) {
        try {
          await web3.eth
            .getPastLogs({
              fromBlock: i,
              toBlock: endingBlock,
              address: address,
              topics: [birthTopic],
            })
            .then(async (res) => {
              for (let j = 0; j < res.length; j++) {
                resultArr.push(res[j].data)
              }
            });
          console.log("last block success");
        } catch (err) {
          if (
            err.message ===
            "Returned error: query returned more than 10000 results"
          ) {
            console.log("last block err");
          }
        }
        break;
      }
      try {
        await web3.eth
          .getPastLogs({
            fromBlock: i,
            toBlock: i + 10000,
            address: address,
            topics: [birthTopic],
          })
          .then(async (res) => {
              for (let j = 0; j < res.length; j++) {
                resultArr.push(res[j].data);
              }
          });
      } catch (err) {
        if (
          err.message ===
          "Returned error: query returned more than 10000 results"
        ) {
          await web3.eth
            .getPastLogs({
              fromBlock: i,
              toBlock: i + 1000,
              address: address,
              topics: [birthTopic],
            })
            .then(async (res) => {
              for (let j = 0; j < res.length; j++) {
                resultArr.push(res[j].data);
              }
            });
          i -= 9000;
        }
      }
    }
    return resultArr
    // setTransactions((transactions) => [...transactions, resultArr]);
    // console.log(transactions);
  };

  const decodeTransactions = () => {

  }

  return (
    <Container className={classes.container}>
      <Button
        className={classes.button}
        onClick={async (e) => {
          e.preventDefault();
          setLoading(true)
          await loadData(6607985, 7028323);
          setLoading(false);
        }}
      >
        Load Transactions
      </Button>
      {
        loading === true ? <CircularProgress className={classes.progress}/> : <Card className={classes.card}>
        <CardContent>
          <Typography variant="caption" className="text">
            Data
          </Typography>
        </CardContent>
      </Card>
      }

    </Container>
  );
}

export default App;
