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

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  });

  const loadTransactions = async () => {
    const web3 = new Web3(process.env.REACT_APP_URL);
    const birthTopic = web3.utils.sha3(
      "Birth(address,uint256,uint256,uint256,uint256)"
    );
    const address = process.env.REACT_APP_CONTRACT_ADDRESS
    const resultArr = []
    
    for (let i = 6607985; i <= 7028323; i += 20001){
      console.log(i, resultArr)
      try {
         resultArr.push(await web3.eth
          .getPastLogs({
            fromBlock: i,
            toBlock: i + 20000,
            address: address,
            topics: [birthTopic],
          }))
      } catch(err){
        if (err.message === 'Returned error: query returned more than 10000 results') {
          resultArr.push(
            await web3.eth.getPastLogs({
              fromBlock: i,
              toBlock: i + 1000,
              address: address,
              topics: [birthTopic],
            })
          );
          i -= 19000
        }
      }
       
        if (i + 20001 > 7028323) {
          console.log("last start", (7028323 - (7028323 - i + 1)));
          
          break;
        }
    }
    setTransactions(transactions => [...transactions, resultArr])
        console.log(transactions);
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

/* Need to map over transation logs to find the address
 */
