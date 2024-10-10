import axios from "axios";
import React, { useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./Profile.css";
import cookie from "react-cookies";
import { useState } from "react";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { API } from "../../backend";
import { Nav } from "react-bootstrap";
export const Profile = () => {
  const navigate = useNavigate();
  const id = cookie.load("ProfileDetails");
  const [ProfileData, setData] = useState(cookie.load("ProfileDetails"));
  const [currencyvalue, setcurrencyValue] = useState("USD");
  const [formValue, setformValue] = React.useState({
    ProfileId: "",
    Email: "",
    Name: "",
    DOB: "",
    About: "",
    Country: "",
    City: "",
    Address: "",
    Gender: "",
    ProfileImage: "",
    Phonenumber: "",
    ProfileImagePreview: undefined,
  });
  useEffect(() => {
    axios
      .get(API + "/profile", {
        params: {
          ProfileId: id.ProfileId,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(
            "Inside useEffect profile" +
              JSON.stringify(response.data[0].ProfileImage)
          );
          setData(response.data[0]);
          // console.log(response.data);
          var data = response.data[0];
          setformValue({
            ...formValue,
            ProfileId: data.ProfileId,
            Email: data.Email,
            Name: data.Name,
            DOB: data.DOB,
            About: data.About,
            Country: data.Country,
            City: data.City,
            Address: data.Address,
            Gender: data.Gender,
            ProfileImage: data.ProfileImage,
            Phonenumber: data.Phonenumber,
          });
          console.log("Profile Photo Name: ", data.ProfileImage);
        }

        axios
          .get(API + "/download-photo/", {
            params: {
              file: data.ProfileImage,
            },
          })
          .then((response) => {
            console.log("TESSSSTTTTT: fevbsfb: " + response.data);
            let imagePreview = response.data;
            setformValue({
              ...formValue,
              ProfileImagePreview: imagePreview,
            });
            // console.log("preview: " + formValue.ProfileImagePreview);
          });
      });
  }, []);

  //   useEffect(() => {
  //     const local = JSON.parse(localStorage.getItem("user"));
  //     const token = local.user.userdetails.ProfileId;
  //     // const token = local["user"];
  //     console.log("Inside useEffect profile" + local.user.token);
  //     axios
  //       .get( API + "/profile", {
  //         params: {
  //           token: token,
  //         },
  //       })
  //       .then((response) => {
  //         if (response.status === 200) {
  //           console.log("Inside useEffect profile" + response.data);
  //           var data = response.data;
  //           setformValue({
  //             ...formValue,
  //             ProfileId: data.ProfileId,
  //             Email: data.Email,
  //             Name: data.Name,
  //             DOB: data.DOB,
  //             About: data.About,
  //             Country: data.Country,
  //             City: data.City,
  //             Address: data.Address,
  //             Gender: data.Gender,
  //             ProfileImage: data.ProfileImage,
  //             Phonenumber: data.Phonenumber,
  //           });
  //         }
  //         console.log("Profile Photo Name: ", data.ProfileImage);

  //         //Download image

  // }, []);

  const handleChange = (event) => {
    if (event.target.name === "ProfileImage") {
      var profilePhoto = event.target.files[0];
      var data = new FormData();
      data.append("photos", profilePhoto);
      let responseData = axios.post(API + "/upload-photo", data);
      setformValue({
        ...formValue,
        [event.target.name]: profilePhoto.name,
      });
    } else {
      setformValue({
        ...formValue,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSubmit = (event) => {
    var data = {
      ProfileId: cookie.load("cookie"),
      Email: formValue.Email,
      Name: formValue.Name,
      DOB: formValue.DOB,
      About: formValue.About,
      Country: formValue.Country,
      City: formValue.City,
      Address: formValue.Address,
      Gender: formValue.Gender,
      ProfileImage: formValue.ProfileImage,
      Phonenumber: formValue.Phonenumber,
    };
    axios.post(API + "/profile", data).then((response) => {
      if (response.status === 200) {
        console.log("TESTING SUCCESS");
      }
    });
    // navigate("/home");
  };

  let profileImageData = (
    <img
      id="avatar_img"
      src="https://www.etsy.com/images/avatars/default_avatar_400x400.png"
      // src={formValue.ProfileImagePreview}
      alt=""
      class="img-fluid rounded-circle"
    />
  );
  if (formValue.ProfileImagePreview) {
    profileImageData = (
      <img
        id="avatar_img"
        // src="https://www.etsy.com/images/avatars/default_avatar_400x400.png"
        src={formValue.ProfileImagePreview}
        alt=""
        class="img-fluid rounded-circle"
      />
    );
  }
  return (
    <>
      <NavBar />
      <div>
        <div className="content-container">
          {/* <Container fluid> */}
          <div id="content" class="clear " role="main">
            {/* <Row className="justify-content-md-center"> */}
            {/* <Col xs lg="2"> */}
            <div className="grid-child green">
              <div id="content" className="clear " role="main">
                <link
                  rel="stylesheet"
                  href="https://www.etsy.com/ac/primary/css/base.20220304135846.css"
                  type="text/css"
                />
                {/* <link
                rel="stylesheet"
                href="https://www.etsy.com/dac/common/web-toolkit/scoped/scoped_fixed_shared.20220304135846,common/web-toolkit/v1_toolkit_with_v2_footer/fixed-global-nav.20220304135846,common/web-toolkit/a11y_colors/overrides.20220304135846.css"
                type="text/css"
              /> */}
                <link
                  rel="stylesheet"
                  href="https://www.etsy.com/dac/site-chrome/components/components.20220304135846,site-chrome/header/header.20220304135846,site-chrome/footer/footer.20220304135846,gdpr/settings-overlay.20220304135846.css"
                  type="text/css"
                />
                <link
                  rel="stylesheet"
                  href="https://www.etsy.com/dac/your/profile.20210909222603,modules/autosuggest.20210909222603,your-etsy.20220304135846,your/account/settings.20220304135846,modules/forms.20210909222603.css"
                  type="text/css"
                />
              </div>
            </div>

            <div className="container">
              <div className="primary profile-edit">
                <div className="your-etsy-header clear">
                  <h1>&nbsp; Your Public Profile</h1>
                  <p>Everything on this page can be seen by anyone</p>
                  <a className="view-profile btn-secondary small registration-hidden">
                    View Profile
                  </a>
                </div>
                <form class="section-inner" encType="multipart/form-data">
                  <div class="input-group">
                    <label class="label" for="avatar">
                      Profile Picture
                    </label>
                    <div class="change-avatar-content">
                      <input
                        type="file"
                        class="upload-new-avatar"
                        id="avatar"
                        name="ProfileImage"
                        size="15"
                        aria-describedby="changing-avatar-disabled avatar-technical-hint"
                        onChange={handleChange}
                      />

                      <div class="image-wrapper user-avatar-wrapper">
                        {profileImageData}
                      </div>
                    </div>

                    <span class="inline-message" id="avatar-technical-hint">
                      Must be a .jpg, .gif or .png file smaller than 10MB and at
                      least 400px by 400px.
                    </span>
                  </div>
                  <hr />

                  <div class="input-group location-city">
                    <label class="label" for="Phonenumber">
                      Your Name
                    </label>
                    <div class="autosuggest-wrapper">
                      <input
                        aria-describedby="the_reason"
                        type="text"
                        autoComplete="off"
                        name="Name"
                        id="Name"
                        placeholder={ProfileData.Name}
                        value={formValue.Name}
                        onChange={handleChange}
                        class="text"
                      />
                    </div>
                  </div>
                  <hr />
                  <div class="input-group location-city">
                    <label class="label" for="Email">
                      Email
                    </label>
                    <div class="autosuggest-wrapper">
                      <input
                        aria-describedby="the_reason"
                        type="text"
                        autoComplete="off"
                        name="Email"
                        id="Email"
                        placeholder={ProfileData.Email}
                        value={formValue.Email}
                        onChange={handleChange}
                        class="text"
                      />
                    </div>
                  </div>
                  <hr />
                  <div class="input-group location-city">
                    <label class="label" for="Phonenumber">
                      Phone Number
                    </label>
                    <div class="autosuggest-wrapper">
                      <input
                        aria-describedby="the_reason"
                        type="number"
                        autoComplete="off"
                        name="Phonenumber"
                        id="Phonenumber"
                        placeholder={ProfileData.Phonenumber}
                        value={formValue.Phonenumber}
                        onChange={handleChange}
                        class="text"
                      />
                    </div>
                  </div>
                  <hr />
                  <fieldset>
                    <div
                      class="gender-class"
                      role="group"
                      aria-labelledby="gender-group-label"
                    >
                      <label class="label" id="gender-group-label">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Gender
                      </label>
                      {/* <div class="radio-group" id="gender"> */}
                      <label for="female">
                        &nbsp;Female
                        <input
                          type="radio"
                          value="female"
                          name="gender"
                          id="female"
                          // checked={formValue.Gender === "female"}
                          onChange={handleChange}
                        />
                      </label>
                      <label for="male">
                        &nbsp;Male
                        <input
                          type="radio"
                          value="male"
                          name="gender"
                          id="male"
                          // checked={formValue.Gender === "male"}
                          onChange={handleChange}
                        />
                      </label>

                      <label for="private">
                        &nbsp;Rather not say
                        <input
                          type="radio"
                          value="private"
                          name="gender"
                          id="private"
                          // checked={formValue.Gender === "Rather not say"}
                          onChange={handleChange}
                        />
                      </label>

                      {/* </div> */}
                    </div>
                  </fieldset>
                  <hr />
                  <div class="input-group location-city">
                    <label class="label" for="DOB">
                      Date of Birth
                    </label>
                    <div class="autosuggest-wrapper">
                      <input
                        aria-describedby="the_reason"
                        type="date"
                        autoComplete="off"
                        name="DOB"
                        id="DOB"
                        value={formValue.DOB}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <hr />
                  <div class="input-group location-city">
                    <label class="label" for="Country">
                      Address
                    </label>
                    <div class="autosuggest-wrapper">
                      <input
                        aria-describedby="the_reason"
                        type="text"
                        autoComplete="off"
                        name="Address"
                        id="Address"
                        placeholder={ProfileData.Address}
                        value={formValue.Address}
                        onChange={handleChange}
                        class="text"
                      />
                    </div>
                  </div>
                  <hr class="registration-hidden" />
                  <div class="input-group location-city">
                    <label class="label" for="city3">
                      City
                    </label>
                    <div class="autosuggest-wrapper">
                      <input
                        aria-describedby="the_reason"
                        type="text"
                        autoComplete="off"
                        name="City"
                        id="City"
                        placeholder={ProfileData.City}
                        value={formValue.City}
                        onChange={handleChange}
                        class="text"
                      />
                    </div>
                  </div>
                  <hr />
                  <div class="input-group location-city">
                    <label class="label" for="Country">
                      Country
                    </label>
                    <div class="autosuggest-wrapper">
                      <input
                        aria-describedby="the_reason"
                        type="text"
                        autoComplete="off"
                        name="Country"
                        id="Country"
                        placeholder={ProfileData.Country}
                        value={formValue.Country}
                        onChange={handleChange}
                        class="text"
                      />
                    </div>
                  </div>
                  <div class="submit">
                    <input
                      class="btn-primary"
                      type="submit"
                      value="Save Changes"
                      onClick={handleSubmit}
                    />
                  </div>
                </form>
              </div>
            </div>
            {/* </Col> */}
            {/* </Row> */}
            {/* </Container> */}
          </div>
        </div>
        <div className="footer--pin">
          <Footer setcurrencyValue={setcurrencyValue} />
        </div>
      </div>
    </>
  );
};
export default Profile;
