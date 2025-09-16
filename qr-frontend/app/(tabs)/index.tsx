import { TestScreen } from "../components/TestScreen";
import {Text} from "react-native";

export default function HomeScreen() {
  return (
    <>
      <Text style={{color:"white"}}>Home Screen</Text>
      <TestScreen />
    </>
  );
}
