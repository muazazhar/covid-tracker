import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1000,
    margin: "0 auto",
    marginTop: 50,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    color: "#3f51b5",
    textTransform: "uppercase",
  },
}));

let globalData = [];
let dataD = {};
let countryData;
let timeline;
let caseDates = [];
let caseInfo = [];
let deathInfo = [];
let recInfo = [];

const barData = {
  labels: ["Deaths", "Recovered", "Active", "Critical"],
  datasets: [
    {
      label: "Status",
      data: globalData,
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const barOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};
const data = {
  labels: caseDates,
  datasets: [
    {
      label: "Infected",
      data: caseInfo,
      fill: false,
      backgroundColor: "#c99238",
      borderColor: "#f5b042",
      yAxisID: "y-axis-1",
    },
    {
      label: "Deaths",
      data: deathInfo,
      fill: false,
      backgroundColor: "#f70021",
      borderColor: "#f70021",
      yAxisID: "y-axis-1",
    },
    {
      label: "Recovered",
      data: recInfo,
      fill: false,
      backgroundColor: "#02d409",
      borderColor: "#02d409",
      yAxisID: "y-axis-2",
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
      },
      {
        type: "linear",
        display: true,
        position: "right",
        id: "y-axis-2",
        gridLines: {
          drawOnArea: false,
        },
      },
    ],
  },
};

export default function Chart({ screen }) {
  const [Data, setData] = useState();

  useEffect(() => {
    async function getData() {
      const response = await fetch("https://disease.sh/v3/covid-19/all");
      let data = await response.json();
      dataD = data;
      setData(data);
      Object.keys(data).map((v, i) => {
        if (
          v == "active" ||
          v == "deaths" ||
          v == "recovered" ||
          v == "critical"
        ) {
          globalData.push(data[v]);
        }
      });
      const result = await fetch(
        "https://disease.sh/v3/covid-19/historical/pakistan?lastdays=30"
      );
      countryData = await result.json();
      console.log(countryData, "countryData");
      timeline = countryData.timeline;
      Object.keys(timeline.cases).map((v, i) => {
        caseDates.push(v);
      });
      Object.values(timeline.cases).map((v, i) => {
        caseInfo.push(v);
      });
      Object.values(timeline.deaths).map((v, i) => {
        deathInfo.push(v);
      });
      Object.values(timeline.recovered).map((v, i) => {
        recInfo.push(v);
      });
    }
    getData();
  }, []);

  const classes = useStyles();

  if (screen == "global") {
    return (
      <>
        <div className="header">
          <h1 className="title">Covid-19 Status Globally</h1>
        </div>
        <Bar data={barData} options={barOptions} />
      </>
    );
  } else if (screen == "country") {
    return (
      <>
        <div className="header">
          <h1 className="title">Covid-19 Status of Pakistan</h1>
        </div>
        <Line data={data} options={options} />
      </>
    );
  } else {
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          {Object.keys(dataD).map((v, i) => {
            return (
              <Grid item xs={12} sm={4} key={i}>
                <Paper className={classes.paper} elevation={3}>
                  <h3 className={classes.title}>{v}</h3>
                  <h3>{dataD[v]}</h3>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}
