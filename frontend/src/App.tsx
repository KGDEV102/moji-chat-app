
import Logout from "./components/Logout"
import { useAuthStore } from "./stores/useAuthStore"


function App() {
 
const user = useAuthStore(state => state.user);
  return (
  
    <div>
      <div>{user?.username}</div>
      <Logout/>
  </div>
  )
}

export default App
