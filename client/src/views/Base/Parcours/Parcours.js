import React, { Component } from 'react';
import VisibilitySensor from "react-visibility-sensor";
import liste_parcours from './data';

import './Parcours.css';

class Parcours extends Component {
  render() {  
    return (
      <div className="parcours animated fadeIn">
        <section className="intro">
          <div className="container">
            <h1>Mon parcours d'intégration &darr;</h1>
          </div>
        </section>
        <section className="timeline" id="parcours">
          <ul>
            {liste_parcours.map((element,key) => {
              return (
                <VisibilitySensor key={key}>
                  {({ isVisible }) => {
                    return (
                      <li className={isVisible ? 'in-view' : undefined}>
                        <div>
                          <time>{element.titre}</time> {element.description}
                        </div>
                      </li>
                    );
                  }}
                </VisibilitySensor> );
            })}
          </ul>
        </section>
      </div>
    );
  }
}

export default Parcours;
