import "./App.css";
import React, { useState } from "react";
import { Button } from "@material-ui/core";
import Chart from "./chart";
function App() {
  const [screen, setScreen] = useState();

  return (
    <div className="App">
      <h1>Covid-19 Tracker</h1>
      <div className="nav">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setScreen("global")}
        >
          Global Stats
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setScreen("country")}
        >
          Country Stats
        </Button>
      </div>
      <div className="container">
        <Chart screen={screen} />
      </div>
    </div>
  );
}

export default App;
