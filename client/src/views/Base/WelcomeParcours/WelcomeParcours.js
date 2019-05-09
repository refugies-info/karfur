import React from 'react';
import track from 'react-tracking';

import data from './data';
import SpringButton from '../../../components/UI/SpringButton/SpringButton'

import './WelcomeParcours.scss';
import demoScreen from '../../../assets/Virtual-Assistant-single.png';

function WelcomeParcours() {
  return (
    <div className="animated fadeIn welcome-parcours">
      <header className="masthead">
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-lg-7 my-auto">
              <div className="header-content mx-auto">
                <h1 className="mb-5">Bienvenue dans votre parcours personnalisé d'intégration</h1>
                <a href="#situation" className="btn btn-outline btn-xl js-scroll-trigger fullWidth">
                  Commencer maintenant
                </a>
                <hr />
                <p className="fullWidth center">C'est gratuit !</p>
              </div>
            </div>
            <div className="col-lg-5 my-auto">
              <img src={demoScreen} className="img-fluid" alt="" />
            </div>
          </div>
        </div>
      </header>

      <section className="download bg-primary text-center" id="situation">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <h2 className="section-heading">Quelle est votre situation actuelle ?</h2>
              <p>Nous accompagnons les réfugiés depuis leur arrivée en France jusqu'à leur intégration</p>
              <div className="choice-buttons">
                {data.map((mon_element) => {return (
                  <SpringButton key={mon_element.id} element={mon_element} />
                  )}
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Un parcours continu et ininterrompu</h2>
            <p className="text-muted">Nous travaillons main dans la main avec les associations pour vous assurer le meilleur suivi possible</p>
            <hr />
          </div>
          <div className="row">
            <div className="col-lg-4 my-auto">
              <div className="device-container">
                <div className="device-mockup iphone6_plus portrait white">
                  <div className="device">
                    <div className="screen">
                      <img src={demoScreen} className="img-fluid" alt="" />
                    </div>
                    <div className="button">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 my-auto">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-screen-smartphone text-primary"></i>
                      <h3>Device Mockups</h3>
                      <p className="text-muted">Ready to use HTML/CSS device mockups, no Photoshop required!</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-camera text-primary"></i>
                      <h3>Flexible Use</h3>
                      <p className="text-muted">Put an image, video, animation, or anything else in the screen!</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-present text-primary"></i>
                      <h3>Free to Use</h3>
                      <p className="text-muted">As always, this theme is free to download and use for any purpose!</p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="feature-item">
                      <i className="icon-lock-open text-primary"></i>
                      <h3>Open Source</h3>
                      <p className="text-muted">Since this theme is MIT licensed, you can use it commercially!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <div className="container">
            <h2>Stop waiting.<br />Start building.</h2>
            <a href="#contact" className="btn btn-outline btn-xl js-scroll-trigger">Let's Get Started!</a>
          </div>
        </div>
        <div className="overlay"></div>
      </section>

      <section className="contact bg-primary" id="contact">
        <div className="container">
          <h2>We
            <i className="fa fa-heart"></i>
            new friends!</h2>
          <ul className="list-inline list-social">
            <li className="list-inline-item social-twitter">
              <a href="/">
                <i className="fa fa-twitter"></i>
              </a>
            </li>
            <li className="list-inline-item social-facebook">
              <a href="/">
                <i className="fa fa-facebook-f"></i>
              </a>
            </li>
            <li className="list-inline-item social-google-plus">
              <a href="/">
                <i className="fa fa-google-plus-g"></i>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; Your Website 2019. All Rights Reserved.</p>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a href="/">Privacy</a>
            </li>
            <li className="list-inline-item">
              <a href="/">Terms</a>
            </li>
            <li className="list-inline-item">
              <a href="/">FAQ</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default track({
  page: 'WelcomeParcours',
}, { dispatchOnMount: true })(WelcomeParcours);