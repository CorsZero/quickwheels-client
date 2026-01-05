/**
 * Quick Wheel Vehicle Rental App
 * Router Configuration
 * Description: React Router setup with all app routes
 * Tech: React Router + TypeScript
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home/Home';
import Ads from '../pages/Ads/Ads';
import AdDetails from '../pages/AdDetails/AdDetails';
import CreateAd from '../pages/CreateAd/CreateAd';
import Login from '../pages/Login/Login';
import CreateAccount from '../pages/CreateAccount/CreateAccount';
import Profile from '../pages/Profile/Profile';
import ScheduledRideDetails from '../pages/ScheduledRideDetails/ScheduledRideDetails';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'ads',
        element: <Ads />
      },
      {
        path: 'ad/:id',
        element: <AdDetails />
      },
      {
        path: 'create-ad',
        element: <CreateAd />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <CreateAccount />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'scheduled-ride/:id',
        element: <ScheduledRideDetails />
      },
    ]
  }
]);

export default function Router() {
  return <RouterProvider router={router} />;
}