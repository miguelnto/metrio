import Home from "../screens/home"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "./types"

const Stack = createNativeStackNavigator<RootStackParamList>()

const Navigation = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: '#0c0c0c'
      },
      headerTitleStyle: {
        color: 'white',
      }
    }}>
      <Stack.Screen name="Home" options={{ title: 'Home' }} component={Home} />
    </Stack.Navigator>
  )
}

export default Navigation
