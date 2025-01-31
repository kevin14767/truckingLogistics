import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    console.log("Index mounted");
  }, []);

  return <Redirect href="/(auth)/language" />;
}