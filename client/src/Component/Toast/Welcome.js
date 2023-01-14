import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Welcome = () => {
  const toastShown = useRef(false);

  useEffect(() => {
    console.log(toastShown);
    if (!toastShown.current) {
      toast.info("Welcome to Sales Dashboard", {
        progressClassName: "progress-bar-striped",
        position: toast.POSITION.TOP_RIGHT,
      });
      toastShown.current = true;
    }
  });

  return null;
};

export default Welcome;
