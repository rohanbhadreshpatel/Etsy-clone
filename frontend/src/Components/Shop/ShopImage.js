import React, { useEffect, useState } from "react";

function ShopImage(props) {
  // console.log(JSON.stringify(props));
  const [shopImage, setShopImage] = useState("");

  useEffect(() => {
    setShopImage(props.data);
  }, [props.data]);

  if (!props.data) {
    return (
      <div>
        <img
          style={{ width: 150 }}
          class="shop-icon-external wt-rounded wt-display-block snipcss-Q6mLH snip-img"
          srcset="https://www.etsy.com/images/avatars/default_shop_icon_500x500.png 500w, https://www.etsy.com/images/avatars/default_shop_icon_280x280.png 280w, https://www.etsy.com/images/avatars/default_shop_icon_180x180.png 180w, https://www.etsy.com/images/avatars/default_shop_icon_75x75.png 75w"
          src="https://www.etsy.com/images/avatars/default_shop_icon_180x180.png"
          sizes="(min-width: 900px) 18vw, 30vw"
          alt=""
        />
      </div>
    );
  } else {
    return (
      <div>
        <img
          style={{ width: 150, height: 150 }}
          class="shop-icon-external wt-rounded wt-display-block snipcss-Q6mLH snip-img"
          src={shopImage}
          sizes="(min-width: 900px) 18vw, 30vw"
          alt=""
        />
      </div>
    );
  }
}

export default ShopImage;
