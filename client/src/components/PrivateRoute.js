import React from 'react';
import API from '../utils/API';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, socket, socketFn, ...rest }) => (
    <Route {...rest} render={(props) => {
        var path = props.location.pathname;
        if(API.isAuth()===false && path !== "/" && path !== "/homepage" && !path.includes('article')){
            return(<Redirect to='/login' />)
        }
        else{
            return( <Component {...props} 
                  socket = { socket } 
                  socketFn = { socketFn }/> )
        }
    }} />
)