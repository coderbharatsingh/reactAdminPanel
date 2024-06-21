/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { useTranslation } from 'react-i18next';
import Logout from './pages/auth/Logout';
import { Auth } from './../auth/index';
import { checkToken } from 'state/hooks/useAuth';
import { useState, useEffect } from 'react';
import Login from './pages/auth/Login';
import CheckAuth from 'auth/CheckAuth';
import EduleteSkeleton from 'auth/common/ui/skeleton/EduleteSkeleton';
import '../sass/main.scss';

export function App() {
  const [isApiCalled, apiCalled] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const tokenUpdate = async () => {
    await checkToken();
    apiCalled(true);
  } 

  useEffect(() => {
    tokenUpdate();
  }, [])

  return isApiCalled ? (
    <BrowserRouter basename="/admin">
      <Helmet
        titleTemplate="%s - Edulete Admin"
        defaultTitle="Edulete Admin"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A Edulete Admin application" />
      </Helmet>

      <Switch>
        <CheckAuth auth={false} path="/login" component={Login} />
        <CheckAuth auth={false} path="/logout" component={Logout} />
        <Route component={Auth} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  ) : (
    <EduleteSkeleton type="page-loader" />
  );
}
