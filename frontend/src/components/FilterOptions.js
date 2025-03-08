import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FilterOptions = ({ filter, setFilter, fetchFilteredData }) => {
  const handleChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    fetchFilteredData(newFilter);
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: 3 }}>
      <InputLabel>Filter</InputLabel>
      <Select value={filter} onChange={handleChange}>
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FilterOptions;