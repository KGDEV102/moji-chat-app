import { Button } from './ui/button'
import { useAuthStore } from '@/stores/useAuthStore'
import { useNavigate } from 'react-router';
import { authService } from '@/services/auth.service';
const Logout = () => {
  const signOut = useAuthStore(state => state.signOut);
  const navigate = useNavigate();
    const handleLogout = async() => {
      await signOut();
      navigate('/signin');
  }
  const getProfile = async () => {
    const res = await authService.profile();
    return <div>{ res.profile}</div>
  }
  return (
      <div>
          <Button onClick={handleLogout}>Log out</Button>
          <Button onClick={getProfile}>Get Profile</Button>
      </div>
  );
}

export default Logout