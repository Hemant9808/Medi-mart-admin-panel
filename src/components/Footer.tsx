import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import silverlogo from "../assets/footer_logo.png";
import { AiFillInstagram } from "react-icons/ai";
import { BsFacebook, BsTwitterX, BsYoutube, BsLinkedin } from "react-icons/bs";

const Footer = () => {
 
  return (
    <footer
      className="flex flex-col  bg-teal-700 justify-center "
    >
      <div className="flex pl-12 pb-8 sm:pl-0 justify-around items-start flex-col sm:flex-row gap-9 sm:gap-0 bg-teal-700 sm:pb-8 pt-8">
      <div className="">
          <img
            className="w-[90px]"
            src={silverlogo}
            alt="adiray"
          />
        </div>


        <ul className="flex flex-col ">
          <h2 className="text-md font-semibold font-Mont text-white ">
            quicklinks
          </h2>
          <li>
            <Link className="text-white hover:text-[#ffd700] text-[14px]" to="">
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-[#ffd700] text-[14px]" to="">
              Privacy and Cookies
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-[#ffd700] text-[14px]" to="">
              Licenses
            </Link>
          </li>
        </ul>

        <ul>
          <h2 className="text-md text-white font-semibold mb-2 font-Mont"> Contact</h2>
          <div className="flex gap-6">
            {" "}
            <Link to={"tel:9620199884"}>
              <FiPhone color="white" size={23} />
            </Link>{" "}
            <Link to={"mailto:contact@adirayglobal.com"}>
              <FaEnvelope color="white" size={23} />
            </Link>{" "}
          </div>
        </ul>
        <ul className="flex flex-col  ">
          <h2 className="text-md font-semibold mb-2 font-Mont text-white ">
          Social
          </h2>
          <div className="flex gap-6 ">

            <Link
              className=" "
              to={"https://www.linkedin.com/company/adiray-global"}
            >
              <BsLinkedin className="w-5 h-5 text-white " />
            </Link>

            <Link to={"https://twitter.com/AdirayGlobal"}>
              <BsTwitterX className="w-5 h-5 text-white" />
            </Link>

            
            </div>
              <div className="flex gap-5 mt-4">
              <Link
              to={
                "https://www.facebook.com/share/xDBzdbxqt3TijffV/?mibextid=WC7FNe"
              }
            >
              <BsFacebook className="w-5 h-5 text-white" />
            </Link>
              <Link to={"https://www.instagram.com/adirayglobal/"}>
              <AiFillInstagram className="w-5 h-5 text-white" />
            </Link>

            <Link to={" https://www.youtube.com/@ADIRAYGLOBAL"}>
              <BsYoutube className="w-5 h-5 text-white " />
            </Link>
              </div>
            
         
        </ul>
      </div>
       
        <div className="flex  justify-center items-center text-center p-4 text-white ">
        ©2024 adirayglobal.com{' '}
        
        All rights reserved
      </div>
     
    </footer>
  );
};

export default Footer;
