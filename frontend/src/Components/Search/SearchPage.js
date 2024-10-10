import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../Footer/Footer";
import NavBar from "../NavBar/NavBar";
import SearchListComponent from "./SearchComponentList";
import { API } from "../../backend";

function SearchPage() {
  const { state } = useLocation();
  const [currencyvalue, setcurrencyValue] = useState("USD");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    let isSubscribed = true;

    let fetchSearchResults = async () => {
      let responseSearch = await axios.get(API + "/item/search", {
        params: {
          searchWord: state,
        },
      });
      setSearchList(responseSearch.data);
      //   console.log(responseSearch.data);
    };
    if (isSubscribed) {
      fetchSearchResults().catch(console.error());
    }

    return () => {
      isSubscribed = false;
    };
  }, [state]);

  return (
    <div>
      <div className="content-container">
        <NavBar>New navigation</NavBar>
        <div className="container">
          <div className="d-flex flex-column">
            <div className="p-2">
              <h3>Search Results</h3>
            </div>
            {searchList.length > 0 && (
              <div className="p-2">
                <SearchListComponent data={searchList} />
              </div>
            )}
            {searchList.length === 0 && (
              <div className="d-flex justify-content-center">
                <h3>No Items Found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="footer--pin">
        <Footer setcurrencyValue={setcurrencyValue} />
      </div>
    </div>
  );
}

export default SearchPage;
