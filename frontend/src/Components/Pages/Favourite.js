import { CollectionsBookmarkOutlined } from "@material-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Heart from "react-animated-heart";
import "../Home/home.css";
import cookie from "react-cookies";
import { API } from "../../backend";

function Favourite(props) {
  // console.log(props);
  const [isFavourite, setFavourite] = useState(false);
  const ProfileId = cookie.load("cookie");

  useEffect(() => {
    let isSubscribed = true;
    const fetchFavourites = async () => {
      let responseData = await axios.get(API + "/favourites", {
        params: {
          ProfileId: ProfileId,
        },
      });
      // console.log("TEEESSSTTT: " + responseData.data);
      for (let obj of responseData.data) {
        // console.log("sdfvsdv: " + typeof obj.ItemId);
        if (obj.ItemId == props.data.ItemId) {
          setFavourite(true);
        }
      }
    };

    if (isSubscribed) {
      fetchFavourites().catch(console.error);
    }
    return () => {
      isSubscribed = false;
    };
  }, [props.data.ItemId, ProfileId]);

  const handleClick = () => {
    if (cookie.load("cookie")) {
      if (isFavourite) {
        setFavourite(false);
        var data = {
          ProfileId: ProfileId,
          Item: props.data,
          isDelete: true,
        };
        axios.post(API + "/set-remove-favourite", data);
      } else {
        setFavourite(true);
        data = {
          ProfileId: ProfileId,
          Item: props.data,
          isDelete: false,
        };
        axios.post(API + "/set-remove-favourite", data);
      }
    } else {
      alert("Sign in to Add Favourites");
    }
  };

  return (
    <>
      {
        <div class="scaled">
          <Heart isClick={isFavourite} onClick={handleClick} />
        </div>
      }
    </>
  );
}

export default Favourite;
