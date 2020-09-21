import React, { useState, useEffect } from "react";
import Web3 from "web3";
import abi from './abi'
import KittyList from './components/KittyList'
import { makeStyles } from "@material-ui/core/styles";
import {Route} from 'react-router-dom'
import {
  Container,
  Card,
  CardContent,
  Button,
  CardMedia,
  CircularProgress,
  Typography,
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

function App() {
  const classes = useStyles();
  const web3 = new Web3(process.env.REACT_APP_URL);
  const birthTopic = web3.utils.sha3(
    "Birth(address,uint256,uint256,uint256,uint256)"
  );
  const address = process.env.REACT_APP_CONTRACT_ADDRESS;
  let contract = new web3.eth.Contract(abi, address)

  const [birthData, setBirthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostBirths, setMostBirths] = useState({id:null})



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
      } catch (err) {
        throw new Error(err)
      }
    }
    console.log(mostBirths)
    let result = await contract.methods.getKitty(mostBirths).call();
    setMostBirths({ id: mostBirths, ...result })
  };

  return (
    <Container className={classes.container}>
      <Route
        exact
        path="/"
        render={(props) => (
          <KittyList setLoading={setLoading} birthData={birthData} web3={web3} birthTopic={birthTopic} address={address} loading={loading} setBirthData={setBirthData} />
        )}
      />
      <Card className={classes.card}>
        <CardContent>
          {loading === true ? (
            <CircularProgress className={classes.progress} />
          ) : (
            <CardMedia
              src={`https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/${mostBirths.id}.svg`}
              className={classes.image}
            ></CardMedia>
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
