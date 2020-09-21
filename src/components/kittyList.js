import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Card,
  Typography,
  Button,
  CardMedia,
  CircularProgress,
  FormControl,
  TextField,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    border: "1px solid #52154e",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    justifyContent: "center",
    width: "90vw",
    backgroundColor: "#f9cff2",
    borderRadius: "10px",
    padding: 0,
  },
  cardContainer: {
    flexFlow: "row wrap",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottom: "1px solid #52154e",
    minHeight: "100px",
    width: "100%",
    overflowY: "scroll",
  },
  card: {
    width: "100px",
    height: "100px",
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    margin: "5px 0",
    justifyContent: "space-around",
    backgroundColor: "#52154E",
  },
  button: {
    width: "50%",
    fontSize: "12px",
    margin: "5px 0",
    backgroundColor: "#52154e",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(82, 21, 78, .5)",
    },
  },
  form: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    width: "45%",
    marginTop: "10px",
  },
  progress: {
    height: "50px",
    width: "50px",
    color: "red",
  },
  image: {
    height: "50px",
    width: "50px",
    paddingTop: "56.25%",
  },
  idText: {
    fontSize: "12px",
    color: "white",
  },
});

function KittyList(props) {
  const {
    web3,
    birthTopic,
    address,
    loading,
    birthData,
    setBirthData,
    setLoading,
  } = props;
  const classes = useStyles();
  const [startingBlock, setStartingBlock] = useState("");
  const [endingBlock, setEndingBlock] = useState("");
  const [errorInput1, setErrorInput1] = useState(false);
  const [helperText1, setHelper1] = useState(false);
  const [errorInput2, setErrorInput2] = useState(false);
  const [helperText2, setHelper2] = useState(false);

  const loadList = async (startingBlock, endingBlock) => {
    const resultArr = [];
    for (let i = startingBlock; i <= endingBlock; i++) {
      console.log(i, resultArr.length);
      try {
        await web3.eth
          .getPastLogs({
            fromBlock: i,
            toBlock: i,
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

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === "startingBlock") {
      setStartingBlock(e.target.value);
      if (isNaN(Number(e.target.value)) && e.target.value !== "") {
        setErrorInput1(true);
        setHelper1("Input must be an integer.");
      } else {
        setErrorInput1(false);
        setHelper1(null);
      }
    }
    if (e.target.name === "endingBlock") {
      setEndingBlock(e.target.value);
      if (isNaN(Number(e.target.value)) && e.target.value !== "") {
        setErrorInput2(true);
        setHelper2("Input must be an integer.");
      } else {
        setErrorInput2(false);
        setHelper2(null);
      }
    }
  };

  return (
    <Container className={classes.container}>
      <Grid container className={classes.cardContainer}>
        {loading === true ? (
          <CircularProgress className={classes.progress} />
        ) : (
          birthData.map((kitty) => (
            <Card className={classes.card} key={kitty.kittyId}>
              <CardMedia
                image={`https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/${kitty.kittyId}.svg`}
                className={classes.image}
              />
              <Link
                to={`https://www.cryptokitties.co/kitty/${kitty.kittyId}`}
                style={{ textDecoration: "underline" }}
              >
                <Typography variant="caption" className={classes.idText}>
                  ID: {kitty.kittyId}
                </Typography>
              </Link>
            </Card>
          ))
        )}
      </Grid>
      <FormControl className={classes.form}>
        <TextField
          variant="outlined"
          inputProps={{
            style: { fontSize: "12px" },
          }}
          InputLabelProps={{
            style: {
              fontSize: "12px",
              color: "black",
            },
          }}
          FormHelperTextProps={{ style: { fontSize: "8px" } }}
          className={classes.input}
          label="Starting Block"
          name="startingBlock"
          placeholder="eg. 6507985"
          value={startingBlock}
          size="small"
          onChange={(e) => handleChange(e)}
          error={errorInput1}
          helperText={helperText1}
        />
        <TextField
          variant="outlined"
          inputProps={{
            style: { fontSize: "12px" },
          }}
          InputLabelProps={{
            style: {
              fontSize: "12px",
              color: "black",
            },
          }}
          FormHelperTextProps={{ style: { fontSize: "8px" } }}
          className={classes.input}
          label="Ending Block"
          name="endingBlock"
          placeholder="eg. 6509440"
          value={endingBlock}
          size="small"
          onChange={(e) => handleChange(e)}
          error={errorInput2}
          helperText={helperText2}
        />
      </FormControl>
      <Button
        className={classes.button}
        onClick={async (e) => {
          e.preventDefault();
          setLoading(true);
          await loadList(startingBlock, endingBlock);
          setLoading(false);
          setStartingBlock("");
          setEndingBlock("");
        }}
      >
        Find Kitties
      </Button>
    </Container>
  );
}

export default KittyList;
