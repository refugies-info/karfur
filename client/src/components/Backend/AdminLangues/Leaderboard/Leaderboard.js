import React from 'react';
import {Card, CardBody, CardHeader } from 'reactstrap';

import './Leaderboard.scss'

const leaderboard = (props) => {
  return(
    <Card className="leaderboard">
      <CardHeader className="custom-card-header">
        <i className="icon-trophy icons font-2xl mt-4"></i> 
        Leaderboard
        <small>Nombre de mots traduits</small>
      </CardHeader>
      <CardBody className="no-padding">
        <ol>
          <li value= "6">
            <mark>Soufiane</mark>
            <small>400</small>
          </li>
          <li>
            <mark>Traducteur</mark>
            <small>301</small>
          </li>
          <li>
            <mark>Expert en traduction</mark>
            <small>292</small>
          </li>
          <li>
            <mark>Utilisateur</mark>
            <small>245</small>
          </li>
          <li>
            <mark>Simon</mark>
            <small>203</small>
          </li>
        </ol>
      </CardBody>
    </Card>
  )
}

export default leaderboard;