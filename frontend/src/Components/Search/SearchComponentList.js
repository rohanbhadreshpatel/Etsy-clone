import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Favourite from "../Pages/Favourite";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

function SearchListComponent(props) {
  let resultImages = props.data;
  const navigate = useNavigate();
  const reduxState = useSelector((state) => state);

  const [currencyvalue, setcurrencyValue] = useState(reduxState.currency);
  const [filters, setFilters] = useState({
    PriceFilter: "",
    Order: "",
    SortBy: "",
    OutOfStockFlag: false,
  });
  const dynamicSort = (property, order) => {
    var sortOrder = 1;
    if (order === "HighToLow") {
      sortOrder = -1;
    }
    return function (a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  };

  const filteredResult = useMemo(() => {
    if (filters.SortBy === "Price") {
      if (filters.Order === "HighToLow") {
        return resultImages.sort(dynamicSort("Price", "HighToLow"));
      } else {
        return resultImages.sort(dynamicSort("Price", ""));
      }
    } else if (filters.SortBy === "Quantity") {
      if (filters.Order === "HighToLow") {
        return resultImages.sort(dynamicSort("QuantityAvailable", "HighToLow"));
      } else {
        return resultImages.sort(dynamicSort("QuantityAvailable", ""));
      }
    } else if (filters.SortBy === "SalesCount") {
      if (filters.Order === "HighToLow") {
        return resultImages.sort(dynamicSort("QuantitySold", "HighToLow"));
      } else {
        return resultImages.sort(dynamicSort("QuantitySold", ""));
      }
    } else if (filters.PriceFilter === "LessThan15") {
      return resultImages.filter((item) => item.Price <= 15);
    } else if (filters.PriceFilter === "15to50") {
      return resultImages.filter((item) => item.Price > 15 && item.Price <= 50);
    } else if (filters.OutOfStockFlag) {
      return resultImages.filter((item) => item.QuantityAvailable !== 0);
    } else {
      return resultImages;
    }
  }, [
    filters.Order,
    filters.OutOfStockFlag,
    filters.PriceFilter,
    filters.SortBy,
    resultImages,
  ]);

  useEffect(() => {
    setcurrencyValue(reduxState.currency);
  }, [reduxState.currency]);

  const handleFilterChange = (event) => {
    if (event.target.name === "OutOfStockFlag") {
      setFilters({
        ...filters,
        [event.target.name]: event.target.checked,
      });
    } else {
      setFilters({
        ...filters,
        [event.target.name]: event.target.value,
      });
    }

    console.log(filters);
  };

  let currencySymbol = null;
  if (currencyvalue === "USD") {
    currencySymbol = <MonetizationOnIcon />;
  } else if (currencyvalue === "Euro") {
    currencySymbol = <EuroIcon />;
  } else if (currencyvalue === "INR") {
    currencySymbol = <CurrencyRupeeIcon />;
  }

  const imageClickHandler = (event) => {
    navigate("/item", {
      state: event.target.name,
    });
  };

  let resultImagesView = (
    <>
      <ImageList cols={4}>
        {filteredResult.map((item) => (
          <ImageListItem key={item.ItemId}>
            <img
              src={item.ItemImage}
              name={item.ItemId}
              alt={item.ItemName}
              onClick={imageClickHandler}
            />
            <ImageListItemBar
              sx={{ backgroundColor: "transparent" }}
              title={
                <>
                  <h6>{item.ItemName}</h6>
                  <Button
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "40px",
                    }}
                  >
                    {currencySymbol} {item.Price}
                  </Button>
                </>
              }
              actionIcon={<Favourite data={item}></Favourite>}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
  if (filteredResult.length === 0) {
    resultImagesView = <>No Items Left</>;
  }
  return (
    <div>
      <div className="p-2">
        <FormControl sx={{ m: 2, minWidth: 100 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            size="small"
            name="SortBy"
            value={filters.SortBy}
            onChange={handleFilterChange}
            autoWidth
            label="Sort By"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Price">Price</MenuItem>
            <MenuItem value="Quantity">Quantity</MenuItem>
            <MenuItem value="SalesCount">Sales Count</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 2, minWidth: 100 }}>
          <InputLabel>Order</InputLabel>
          <Select
            size="small"
            name="Order"
            value={filters.Order}
            onChange={handleFilterChange}
            autoWidth
            label="Order"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="HighToLow">High To Low</MenuItem>
            <MenuItem value="LowToHigh">Low To High</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 2, minWidth: 130 }}>
          <InputLabel>Price Filter</InputLabel>
          <Select
            size="small"
            name="PriceFilter"
            value={filters.PriceFilter}
            onChange={handleFilterChange}
            autoWidth
            label="Price Filter"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="LessThan15">Less than 15</MenuItem>
            <MenuItem value="15to50">15 to 50</MenuItem>
          </Select>
        </FormControl>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.OutOfStockFlag}
                onChange={handleFilterChange}
                name="OutOfStockFlag"
              />
            }
            label="Exclude Out of Stock Items"
          />
        </FormGroup>
      </div>
      <div className="p-2">{resultImagesView} </div>
    </div>
  );
}

export default SearchListComponent;
