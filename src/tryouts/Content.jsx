import React from "react";
import CoffeeCard from "./CoffeeCard";
import { Grid } from "@material-ui/core";
import { machinesList } from "./constants";

const Content = () => {
  const getCoffeMakerCard = (coffeMakerObj) => {
    return (
      <Grid item xs={12} sm={4}>
        <CoffeeCard {...coffeMakerObj} />
      </Grid>
    );
  };

  return (
    // spacing comes from Theme in MaterialUI
    <Grid container spacing={4}>
      {machinesList.map((coffeMakerObj) => getCoffeMakerCard(coffeMakerObj))}
    </Grid>
  );
};

export default Content;
