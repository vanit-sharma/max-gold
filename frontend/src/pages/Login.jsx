import React from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUserData, setUserDataError } from "../store/userSlice";
import { ensureKeypair } from "../crypto/cryptoKeys";

import "../../src/assets/css/login.css";
 

const LoginSchema = Yup.object().shape({
  uname: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .matches(/^\S*$/, "Username cannot contain spaces")
    .required("Username is required"),
  passpin: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Login mutation function
const loginUser = async (values, publicJwk) => {
  const res = await axiosInstance.post(
    `${process.env.REACT_APP_API_URL}/api/auth/login`,
    { ...values, publicJwk },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // <-- important for cookies
    }
  );
  console.log('getting in login: ', res.data);
  return res.data;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = React.useState("");

  // Use React Query's useMutation without onSuccess/onError in the hook itself
  const { mutate, isLoading } = useMutation({
    mutationFn: async (values) => {
      const { publicJwk } = await ensureKeypair(); // generate before login
      await axiosInstance.post("crypto/register-key", { publicJwk });
      return loginUser(values, publicJwk);
    },
  });

  return (
    <div
      style={{ 
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >   
    <Formik
                  initialValues={{ uname: "", passpin: "" }}
                  validationSchema={LoginSchema}
                  onSubmit={(values, actions) => {
                    setServerError("");
                    mutate(values, {
                      onSuccess: async (data) => {
                       
                        actions.setSubmitting(false); // inform Formik!
                        console.log("Login successful:", data);
                        const user = data.user; 
                        await dispatch(setUserData(user));
                        if (data.user?.user_role === 8) {
                          console.log("Navigating to /home");
                          navigate("/home");
                        } else {
                          navigate("/agent/dashboard");
                        }
                      },
                      onError: (error) => {
                        actions.setSubmitting(false); // inform Formik!
                        setServerError(
                          error?.response?.data?.message ||
                            "Login failed. Please try again."
                        );
                      },
                    });
                  }}
                >
                  {({ isSubmitting }) => (
                <Form
                      id="loginPagefrm"
                      name="loginPagefrm"
                      className="login-form login-form-mobile-views"
                      noValidate
                    >
               <div className="containerz">
                <div className="miniflex">

                  <div className="loginlogo">
                    <img id="Image1" cssclasslass="img-responsive" alt="Logo" src="assets/images/betmax.gold.png"/></div>

                <div className="form-ninput  form-ngroup">

                       <Field
                          className="login_user form-ncontrol"
                          type="text"
                          placeholder="Username"
                          id="uname"
                          name="uname"
                          
                          autoComplete="username"
                        />
                         <ErrorMessage
                          name="uname"
                          component="div"
                          className="text-danger"
                          style={{ fontSize: "14px" }}
                        /> 
                </div>
                <div className="form-ninput form-ngroup">
                   <Field
                          className="login_pass  form-ncontrol"
                          type="password"
                          placeholder="Password"
                          name="passpin"
                          id="passpin"
                          autoComplete="current-password"
                        />

                      <ErrorMessage
                          name="passpin"
                          component="div"
                          className="text-danger"
                          style={{ fontSize: "14px" }}
                        /> 
                </div>

               
                
                <div className="form-ngroup text-center">
                    <input  type="submit" name="LinkButton1" value="Log In"  id="LinkButton1" 
                     disabled={isSubmitting || isLoading}
                    className="btnz btnz-primary"/>
                </div>
                    <div className="form-ngroup text-center">
                   
                      <a href="#" className="btn btnz btn-primary btn-ct">Complaint</a>
                </div>
               <div className="form-ngroup text-center" style={{display:"none"}}>
                   
                       <a href="#" className="btn btn-default btn-ct">
                        <img src="./assets/images/wapp.png" className="img-responsive"/> WhatsApp </a>
                </div>
				
				  <div className="m-t-20 text-center download-apk">
<a href="https://betmax.gold/betmax.gold.apk" id="apk" download="" className="btnz btnz-primary btn-android">
<span><img src="assets/images/google-android.png" className="img-responsive"/><b></b></span>
</a>

	 
				

 
</div>

            
					
				
				
				 <div className="footer-logo">
                    <img src="assets/images/powered_by_betfair_dark.svg"/></div>
                
            </div>
                </div>
                </Form>
              )}

</Formik>

            <ul className="bg-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <style>
              {
                `
                body {
                  font-weight: 300;
                   background: #fdcf00;
                   background-repeat: no-repeat;
                   height: 100vh;
                   background-size: contain;
                     background-position: -35px -54px;
                 
               }

               .miniflex {
   
                -webkit-box-shadow: 0 2px 10px rgb(0 0 0 / 5%);
                box-shadow: 0 2px 10px rgb(0 0 0 / 5%);
                border-radius: 21% 7%;
                
            }

            form input[type=submit] {
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              outline: 0;
              background-color: white;
              border: 0;
              padding: 10px 15px;
              color: #000000; 
              background: -webkit-linear-gradient(top, #8f6B29, #FDE08D, #DF9F28);
              background: linear-gradient(top, #8f6B29, #FDE08D, #DF9F28);
              border: #8f6B29 2px solid;
              border-radius: 3px;
              width: 250px;
              cursor: pointer;
              font-size: 18px;
              transition-duration: 0.25s;
          }

          .btn {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: 0;
            background-color: white;
            border: 0;
            padding: 10px 15px;
            color: #000000;
            font-weight: bold;
            background: -webkit-linear-gradient(top, #8f6B29, #FDE08D, #DF9F28);
            background: linear-gradient(top, #8f6B29, #FDE08D, #DF9F28);
            border: #8f6B29 2px solid;
            border-radius: 3px;
            width: 250px;
            cursor: pointer;
            font-size: 18px;
            transition-duration: 0.25s;
        }
            
            @media(max-width:768px) {
            body {
               background: #fdcf00;
            }
             
            
            }
             
                `
              }
            </style>
      
    </div>

  );
};

export default Login;
