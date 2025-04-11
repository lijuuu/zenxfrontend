import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import HomeComponent from '@/components/common/Home';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // extract query parameters from the url
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    // if tokens are present in the query parameters, store them in cookies
    if (accessToken && refreshToken) {
      Cookies.set('accessToken', accessToken, {
        expires: 1, // expires in 1 day
        secure: true,
        sameSite: 'Strict',
      });

      Cookies.set('refreshToken', refreshToken, {
        expires: 7, // expires in 7 days
        secure: true,
        sameSite: 'Strict',
      });

      // remove tokens from the url to clean up
      urlParams.delete('accessToken');
      urlParams.delete('refreshToken');
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, document.title, newUrl);

      // optionally navigate to a specific page after storing tokens
      navigate('/dashboard');
    }
  }, [navigate]);

  document.title = 'zenx - online competitive programming platform';

  return <HomeComponent />;
};

export default Home;