import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomeIndex, VerifyPage, IssuePage, CircuitCheck } from './pages';

const Routes = () => {
  return (
    <Suspense fallback={'loading...'}>
      <Switch>
        {/* <Route path="/" exact={true} component={HomeIndex} /> */}
        <Route path="/issue" exact={true} component={IssuePage} />
        <Route path="/verify" exact={true} component={VerifyPage} />
        <Route path="/circuitcheck" exact={true} component={CircuitCheck} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
