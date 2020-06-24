import React, { Component, lazy, Suspense } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Label,
  Progress,
  Row,
  Table,
} from "reactstrap";
import { getStyle } from "@coreui/coreui/dist/js/coreui-utilities";
import track from "react-tracking";
import moment from "moment/min/moment-with-locales";
import { connect } from "react-redux";
import {
  cardChartData1,
  cardChartOpts1,
  cardChartData2,
  cardChartOpts2,
  cardChartData3,
  cardChartOpts3,
  cardChartData4,
  cardChartOpts4,
  makeSocialBoxData,
  socialChartOpts,
  makeSparkLineData,
  sparklineChartOpts,
  mainChart,
  mainChartOpts,
} from "./data";
import DateOffset from "../../../components/Functions/DateOffset";
import {
  display_traffic,
  calculate_avg_time,
  execute_search,
} from "./functions";
import API from "../../../utils/API";
import marioProfile from "../../../assets/mario-profile.jpg";

import "./Dashboard.scss";
import { calculFiabilite } from "../../Dispositif/functions";

moment.locale("fr");

const Widget03 = lazy(() => import("../../../components/Widgets/Widget03"));

const brandPrimary = getStyle("--primary");
const brandSuccess = getStyle("--success");
//const brandInfo = getStyle('--info')
const brandWarning = getStyle("--warning");
const brandDanger = getStyle("--danger");

const eventFields = ["layout", "page", "userId"];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.calculate_avg_time = calculate_avg_time.bind(this);
    this.display_traffic = display_traffic.bind(this);
    this.execute_search = execute_search.bind(this);
  }

  state = {
    dropdownOpen: false,
    radioSelected: 3,

    traffic: [],
    error: false,
    mainChart: mainChart,
    mainChartOpts: mainChartOpts,
    max_traffic: 0,
    events: {},
    eventValues: {},
    uniqueUsersDaily: 0,
    uniqueUsersMonthly: 0,
    uniqueUsersYearly: 0,
    onlineUsers: 0,
    averageTimeOnsite: 0,
    nbExportsPDF: 0,
    nbActiveUsers: 0,
    nbDispositifs: 0,
    nbDispositifsActifs: 0,
    nbDemarches: 0,
    nbDemarchesActives: 0,
    users: [],
    avgScore: 0,
    avancementContenu: 0,
  };

  componentDidMount() {
    this.display_traffic(-2 * 7);

    API.distinct_count_event({
      distinct: "cookie",
      query: { created_at: { $gte: DateOffset(new Date(), -1) } },
    }).then((data) => {
      this.setState({ uniqueUsersDaily: data.data.data });
    });
    API.distinct_count_event({
      distinct: "cookie",
      query: { created_at: { $gte: DateOffset(new Date(), -31) } },
    }).then((data) => {
      this.setState({ uniqueUsersMonthly: data.data.data });
    });
    API.distinct_count_event({
      distinct: "cookie",
      query: { created_at: { $gte: DateOffset(new Date(), -365) } },
    }).then((data) => {
      this.setState({ uniqueUsersYearly: data.data.data });
    });

    API.get_event({ query: { action: "click", label: "createPdf" } }).then(
      (data) => {
        this.setState({ nbExportsPDF: data.data.data.length });
      }
    );

    API.distinct_count_event({
      distinct: "userId",
      query: { created_at: { $gte: DateOffset(new Date(), -3 * 30) } },
    }).then((data) => {
      this.setState({ nbActiveUsers: data.data.data });
    });

    API.distinct_count_event({
      distinct: "userId",
      query: { created_at: { $gte: DateOffset(new Date(), 0, -1 / 60) } },
    }).then((data) => {
      this.setState({ onlineUsers: data.data.data });
    });

    API.count_dispositifs({ typeContenu: { $ne: "demarche" } }).then((data) =>
      this.setState({ nbDispositifs: data.data })
    );
    API.count_dispositifs({
      typeContenu: { $ne: "demarche" },
      status: "Actif",
    }).then((data) => this.setState({ nbDispositifsActifs: data.data }));
    API.count_dispositifs({ typeContenu: "demarche" }).then((data) =>
      this.setState({ nbDemarches: data.data })
    );
    API.count_dispositifs({
      typeContenu: "demarche",
      status: "Actif",
    }).then((data) => this.setState({ nbDemarchesActives: data.data }));

    API.get_users({
      query: { status: "Actif" },
      populate: "roles",
    }).then((data) => this.setState({ users: data.data.data }));

    eventFields.map((x) => this._call_distinct_event(x));

    this.calculate_avg_time();
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.dispositifs || []).length > 0 &&
      nextProps.dispositifs.length !== (this.props.dispositifs || []).length
    ) {
      const avgScore =
        nextProps.dispositifs
          .map((x) => calculFiabilite(x))
          .reduce((acc, curr) => (acc += curr || 0), 0) /
        nextProps.dispositifs.length;
      this.setState({ avgScore });
    }
    if (
      (nextProps.dispositifs || []).length > 0 &&
      (nextProps.langues || []).length > 0 &&
      this.state.avancementContenu === 0
    ) {
      const localeArray = (nextProps.langues || [])
        .filter((x) => x.avancement >= 0.8)
        .map((x) => x.i18nCode);
      const avancementContenu =
        nextProps.dispositifs
          .map((x) => x.avancement)
          .reduce((acc, curr) => {
            localeArray.forEach((x) => {
              acc += curr[x] || 0;
            });
            return acc;
          }, 0) /
        (localeArray.length * nextProps.dispositifs.length);
      this.setState({ avancementContenu });
    }
  }

  _call_distinct_event = (field) => {
    API.distinct_event({ distinct: field }).then((data) => {
      this.setState({
        events: {
          ...this.state.events,
          [field]: data.data.data,
        },
      });
    });
  };

  _filterEventChanged = (e) => {
    this.setState(
      {
        eventValues: {
          ...this.state.eventValues,
          [e.target.id]: e.target.value,
        },
      },
      () => {
        let query = { ...this.state.eventValues };
        query.userId = (
          this.state.events.userId.find(
            (x) => x.username === this.state.eventValues.userId
          ) || {}
        )._id;
        API.get_event({ query }).then(() => {});
      }
    );
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  onRadioBtnClick = (radioSelected, duree) => {
    this.display_traffic(-1 * duree);
    this.setState({
      radioSelected: radioSelected,
    });
  };

  createCSV = () => {};

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    const {
      events,
      eventValues,
      uniqueUsersDaily,
      uniqueUsersMonthly,
      nbExportsPDF,
      nbActiveUsers,
      nbDispositifs,
      nbDispositifsActifs,
      nbDemarches,
      nbDemarchesActives,
      users,
      avgScore,
      avancementContenu,
    } = this.state;
    const { langues } = this.props;
    const languesActives = (langues || []).filter((x) => x.avancement >= 0.8);
    return (
      <div className="dashboard-container animated fadeIn">
        <div className="unformatted-data mb-10 ml-12">
          <ul>
            <li>
              Nombre d'exports PDF (global) : <b>{nbExportsPDF}</b>
            </li>
            <li>
              Nombre d'utilisateurs actifs (3 derniers mois) :{" "}
              <b>{nbActiveUsers}</b>
            </li>
            <li>
              Nombre de dispositifs : <b>{nbDispositifs}</b>
            </li>
            <li>
              Nombre de dispositifs actifs : <b>{nbDispositifsActifs}</b>
            </li>
            <li>
              Nombre de démarches : <b>{nbDemarches}</b>
            </li>
            <li>
              Nombre de démarches actives : <b>{nbDemarchesActives}</b>
            </li>
            <li>
              Nombre de contributeurs :{" "}
              <b>
                {
                  (
                    users.filter((x) =>
                      (x.roles || []).some((y) => y.nom === "Contrib")
                    ) || []
                  ).length
                }
              </b>
            </li>
            <li>
              Nombre de traducteurs ou experts :{" "}
              <b>
                {
                  (
                    users.filter((x) =>
                      (x.roles || []).some(
                        (y) => y.nom === "Trad" || y.nom === "ExpertTrad"
                      )
                    ) || []
                  ).length
                }
              </b>
            </li>
            <li>
              Nombre total de langues : <b>{(langues || []).length}</b>
            </li>
            <li>
              Nombre de langues actives : <b>{languesActives.length}</b>
            </li>
            <li>
              Score moyen des contenus :{" "}
              <b>{Math.round(avgScore * 100 * 100, 2) / 100 + " %"}</b>
            </li>
            <li>
              Pourcentage de traduction du site sur les langues actives :{" "}
              <b>
                {Math.round(
                  (languesActives.reduce(
                    (acc, curr) => (acc += curr.avancement || 0),
                    0
                  ) /
                    (languesActives.length || 1)) *
                    100 *
                    100
                ) /
                  100 +
                  " %"}
              </b>
            </li>
            <li>
              Pourcentage de traduction du contenu sur les langues actives :{" "}
              <b>{Math.round(avancementContenu * 100 * 100, 2) / 100 + " %"}</b>
            </li>
            {/* <li>Temps moyen passé sur le site : <b>{averageTimeOnsite && ms(averageTimeOnsite || 0)}</b> - <i>A vérifier</i></li> */}
          </ul>
        </div>
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <ButtonDropdown
                    id="card1"
                    isOpen={this.state.card1}
                    toggle={() => {
                      this.setState({ card1: !this.state.card1 });
                    }}
                  >
                    <DropdownToggle caret className="p-0" color="transparent">
                      <i className="icon-settings"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem disabled>Disabled action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>
                <div className="text-value">{uniqueUsersDaily}</div>
                <div>
                  visiteur{uniqueUsersDaily > 1 ? "s" : ""} unique
                  {uniqueUsersDaily > 1 ? "s" : ""} aujourd'hui
                </div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                <Line
                  data={cardChartData2}
                  options={cardChartOpts2}
                  height={70}
                />
              </div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-primary">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <Dropdown
                    id="card2"
                    isOpen={this.state.card2}
                    toggle={() => {
                      this.setState({ card2: !this.state.card2 });
                    }}
                  >
                    <DropdownToggle className="p-0" color="transparent">
                      <i className="icon-location-pin"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </ButtonGroup>
                <div className="text-value">{uniqueUsersMonthly}</div>
                <div>
                  visiteur{uniqueUsersMonthly > 1 ? "s" : ""} unique
                  {uniqueUsersMonthly > 1 ? "s" : ""} ce mois
                </div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                <Line
                  data={cardChartData1}
                  options={cardChartOpts1}
                  height={70}
                />
              </div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-warning">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <Dropdown
                    id="card3"
                    isOpen={this.state.card3}
                    toggle={() => {
                      this.setState({ card3: !this.state.card3 });
                    }}
                  >
                    <DropdownToggle caret className="p-0" color="transparent">
                      <i className="icon-settings"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </ButtonGroup>
                <div className="text-value">{this.state.uniqueUsersYearly}</div>
                <div>visiteurs uniques ces 12 derniers mois</div>
              </CardBody>
              <div className="chart-wrapper" style={{ height: "70px" }}>
                <Line
                  data={cardChartData3}
                  options={cardChartOpts3}
                  height={70}
                />
              </div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-danger">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <ButtonDropdown
                    id="card4"
                    isOpen={this.state.card4}
                    toggle={() => {
                      this.setState({ card4: !this.state.card4 });
                    }}
                  >
                    <DropdownToggle caret className="p-0" color="transparent">
                      <i className="icon-settings"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>
                <div className="text-value">{this.state.onlineUsers}</div>
                <div>utilisateurs en ligne</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: "70px" }}>
                <Bar
                  data={cardChartData4}
                  options={cardChartOpts4}
                  height={70}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Traffic</CardTitle>
                    <div className="small text-muted">
                      Depuis le {this.state.mainChart.labels[0]}{" "}
                    </div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <Button
                      color="primary"
                      className="float-right"
                      onClick={this.createCSV}
                    >
                      <i className="icon-cloud-download"></i>
                    </Button>
                    <ButtonToolbar
                      className="float-right"
                      aria-label="Toolbar with button groups"
                    >
                      <ButtonGroup className="mr-3" aria-label="First group">
                        <Button
                          color="outline-secondary"
                          onClick={() => this.onRadioBtnClick(1, 1)}
                          active={this.state.radioSelected === 1}
                        >
                          1 jour
                        </Button>
                        <Button
                          color="outline-secondary"
                          onClick={() => this.onRadioBtnClick(2, 7)}
                          active={this.state.radioSelected === 2}
                        >
                          1 semaine
                        </Button>
                        <Button
                          color="outline-secondary"
                          onClick={() => this.onRadioBtnClick(3, 14)}
                          active={this.state.radioSelected === 3}
                        >
                          2 semaines
                        </Button>
                        <Button
                          color="outline-secondary"
                          onClick={() => this.onRadioBtnClick(4, 31)}
                          active={this.state.radioSelected === 4}
                        >
                          1 mois
                        </Button>
                        <Button
                          color="outline-secondary"
                          onClick={() => this.onRadioBtnClick(5, 365)}
                          active={this.state.radioSelected === 5}
                        >
                          12 mois
                        </Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div
                  className="chart-wrapper"
                  style={{ height: 300 + "px", marginTop: 40 + "px" }}
                >
                  <Line
                    data={this.state.mainChart}
                    options={this.state.mainChartOpts}
                    height={300}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <Row className="text-center">
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <div className="text-muted">Visits</div>
                    <strong>29.703 Users (40%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="success"
                      value="40"
                    />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0 d-md-down-none">
                    <div className="text-muted">Unique</div>
                    <strong>24.093 Users (20%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="info"
                      value="20"
                    />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <div className="text-muted">Pageviews</div>
                    <strong>78.706 Views (60%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="warning"
                      value="60"
                    />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <div className="text-muted">New Users</div>
                    <strong>22.123 Users (80%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="danger"
                      value="80"
                    />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0 d-md-down-none">
                    <div className="text-muted">Bounce Rate</div>
                    <strong>Average Rate (40.15%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="primary"
                      value="40"
                    />
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    Formulaire
                    <Form>
                      {eventFields.map((field, key) => (
                        <FormGroup key={key}>
                          <Label for={field}>{field}</Label>
                          <Input
                            type="select"
                            name="select"
                            id={field}
                            value={eventValues[field]}
                            onChange={this._filterEventChanged}
                          >
                            {(events[field] || []).map((option, subkey) => {
                              let value =
                                field === "userId" ? option.username : option;
                              return <option key={subkey}>{value}</option>;
                            })}
                          </Input>
                        </FormGroup>
                      ))}
                    </Form>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    Données
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs="6" sm="6" lg="3">
            <Suspense fallback={this.loading()}>
              <Widget03
                dataBox={() => ({
                  variant: "facebook",
                  friends: "89k",
                  feeds: "459",
                })}
              >
                <div className="chart-wrapper">
                  <Line
                    data={makeSocialBoxData(0)}
                    options={socialChartOpts}
                    height={90}
                  />
                </div>
              </Widget03>
            </Suspense>
          </Col>

          <Col xs="6" sm="6" lg="3">
            <Suspense fallback={this.loading()}>
              <Widget03
                dataBox={() => ({
                  variant: "twitter",
                  followers: "973k",
                  tweets: "1.792",
                })}
              >
                <div className="chart-wrapper">
                  <Line
                    data={makeSocialBoxData(1)}
                    options={socialChartOpts}
                    height={90}
                  />
                </div>
              </Widget03>
            </Suspense>
          </Col>

          <Col xs="6" sm="6" lg="3">
            <Suspense fallback={this.loading()}>
              <Widget03
                dataBox={() => ({
                  variant: "linkedin",
                  contacts: "500+",
                  feeds: "292",
                })}
              >
                <div className="chart-wrapper">
                  <Line
                    data={makeSocialBoxData(2)}
                    options={socialChartOpts}
                    height={90}
                  />
                </div>
              </Widget03>
            </Suspense>
          </Col>

          <Col xs="6" sm="6" lg="3">
            <Suspense fallback={this.loading()}>
              <Widget03
                dataBox={() => ({
                  variant: "google-plus",
                  followers: "894",
                  circles: "92",
                })}
              >
                <div className="chart-wrapper">
                  <Line
                    data={makeSocialBoxData(3)}
                    options={socialChartOpts}
                    height={90}
                  />
                </div>
              </Widget03>
            </Suspense>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardHeader>Traffic {" & "} Sales</CardHeader>
              <CardBody>
                <Row>
                  <Col xs="12" md="6" xl="6">
                    <Row>
                      <Col sm="6">
                        <div className="callout callout-info">
                          <small className="text-muted">New Clients</small>
                          <br />
                          <strong className="h4">9,123</strong>
                          <div className="chart-wrapper">
                            <Line
                              data={makeSparkLineData(0, brandPrimary)}
                              options={sparklineChartOpts}
                              width={100}
                              height={30}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="callout callout-danger">
                          <small className="text-muted">
                            Recurring Clients
                          </small>
                          <br />
                          <strong className="h4">22,643</strong>
                          <div className="chart-wrapper">
                            <Line
                              data={makeSparkLineData(1, brandDanger)}
                              options={sparklineChartOpts}
                              width={100}
                              height={30}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <hr className="mt-0" />
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">Monday</span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress
                          className="progress-xs"
                          color="info"
                          value="34"
                        />
                        <Progress
                          className="progress-xs"
                          color="danger"
                          value="78"
                        />
                      </div>
                    </div>
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">Tuesday</span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress
                          className="progress-xs"
                          color="info"
                          value="56"
                        />
                        <Progress
                          className="progress-xs"
                          color="danger"
                          value="94"
                        />
                      </div>
                    </div>
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">Wednesday</span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress
                          className="progress-xs"
                          color="info"
                          value="12"
                        />
                        <Progress
                          className="progress-xs"
                          color="danger"
                          value="67"
                        />
                      </div>
                    </div>
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">Thursday</span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress
                          className="progress-xs"
                          color="info"
                          value="43"
                        />
                        <Progress
                          className="progress-xs"
                          color="danger"
                          value="91"
                        />
                      </div>
                    </div>
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">Friday</span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress
                          className="progress-xs"
                          color="info"
                          value="22"
                        />
                        <Progress
                          className="progress-xs"
                          color="danger"
                          value="73"
                        />
                      </div>
                    </div>
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">Saturday</span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress
                          className="progress-xs"
                          color="info"
                          value="53"
                        />
                        <Progress
                          className="progress-xs"
                          color="danger"
                          value="82"
                        />
                      </div>
                    </div>
                    <div className="progress-group mb-4">
                      <div className="progress-group-prepend">
                        <span className="progress-group-text">Sunday</span>
                      </div>
                      <div className="progress-group-bars">
                        <Progress
                          className="progress-xs"
                          color="info"
                          value="9"
                        />
                        <Progress
                          className="progress-xs"
                          color="danger"
                          value="69"
                        />
                      </div>
                    </div>
                    <div className="legend text-center">
                      <small>
                        <sup className="px-1">
                          <Badge pill color="info">
                            &nbsp;
                          </Badge>
                        </sup>
                        New clients &nbsp;
                        <sup className="px-1">
                          <Badge pill color="danger">
                            &nbsp;
                          </Badge>
                        </sup>
                        Recurring clients
                      </small>
                    </div>
                  </Col>
                  <Col xs="12" md="6" xl="6">
                    <Row>
                      <Col sm="6">
                        <div className="callout callout-warning">
                          <small className="text-muted">Pageviews</small>
                          <br />
                          <strong className="h4">78,623</strong>
                          <div className="chart-wrapper">
                            <Line
                              data={makeSparkLineData(2, brandWarning)}
                              options={sparklineChartOpts}
                              width={100}
                              height={30}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col sm="6">
                        <div className="callout callout-success">
                          <small className="text-muted">Organic</small>
                          <br />
                          <strong className="h4">49,123</strong>
                          <div className="chart-wrapper">
                            <Line
                              data={makeSparkLineData(3, brandSuccess)}
                              options={sparklineChartOpts}
                              width={100}
                              height={30}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <hr className="mt-0" />
                    <ul>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-user progress-group-icon"></i>
                          <span className="title">Male</span>
                          <span className="ml-auto font-weight-bold">43%</span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress
                            className="progress-xs"
                            color="warning"
                            value="43"
                          />
                        </div>
                      </div>
                      <div className="progress-group mb-5">
                        <div className="progress-group-header">
                          <i className="icon-user-female progress-group-icon"></i>
                          <span className="title">Female</span>
                          <span className="ml-auto font-weight-bold">37%</span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress
                            className="progress-xs"
                            color="warning"
                            value="37"
                          />
                        </div>
                      </div>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-globe progress-group-icon"></i>
                          <span className="title">Organic Search</span>
                          <span className="ml-auto font-weight-bold">
                            191,235{" "}
                            <span className="text-muted small">(56%)</span>
                          </span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress
                            className="progress-xs"
                            color="success"
                            value="56"
                          />
                        </div>
                      </div>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-social-facebook progress-group-icon"></i>
                          <span className="title">Facebook</span>
                          <span className="ml-auto font-weight-bold">
                            51,223{" "}
                            <span className="text-muted small">(15%)</span>
                          </span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress
                            className="progress-xs"
                            color="success"
                            value="15"
                          />
                        </div>
                      </div>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-social-twitter progress-group-icon"></i>
                          <span className="title">Twitter</span>
                          <span className="ml-auto font-weight-bold">
                            37,564{" "}
                            <span className="text-muted small">(11%)</span>
                          </span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress
                            className="progress-xs"
                            color="success"
                            value="11"
                          />
                        </div>
                      </div>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-social-linkedin progress-group-icon"></i>
                          <span className="title">LinkedIn</span>
                          <span className="ml-auto font-weight-bold">
                            27,319{" "}
                            <span className="text-muted small">(8%)</span>
                          </span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress
                            className="progress-xs"
                            color="success"
                            value="8"
                          />
                        </div>
                      </div>
                      <div className="divider text-center">
                        <Button
                          color="link"
                          size="sm"
                          className="text-muted"
                          data-toggle="tooltip"
                          data-placement="top"
                          title=""
                          data-original-title="show more"
                        >
                          <i className="icon-options"></i>
                        </Button>
                      </div>
                    </ul>
                  </Col>
                </Row>
                <br />
                <Table
                  hover
                  responsive
                  className="table-outline mb-0 d-none d-sm-table"
                >
                  <thead className="thead-light">
                    <tr>
                      <th className="text-center">
                        <i className="icon-people"></i>
                      </th>
                      <th>User</th>
                      <th className="text-center">Country</th>
                      <th>Usage</th>
                      <th className="text-center">Payment Method</th>
                      <th>Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img
                            src={marioProfile}
                            className="img-avatar"
                            alt="admin@bootstrapmaster.com"
                          />
                          <span className="avatar-status badge-success"></span>
                        </div>
                      </td>
                      <td>
                        <div>Yiorgos Avraamu</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <i
                          className="flag-icon flag-icon-us h4 mb-0"
                          title="us"
                          id="us"
                        ></i>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>50%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">
                              Jun 11, 2015 - Jul 10, 2015
                            </small>
                          </div>
                        </div>
                        <Progress
                          className="progress-xs"
                          color="success"
                          value="50"
                        />
                      </td>
                      <td className="text-center">
                        <i
                          className="fa fa-cc-mastercard"
                          style={{ fontSize: 24 + "px" }}
                        ></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>10 sec ago</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img
                            src={marioProfile}
                            className="img-avatar"
                            alt="admin@bootstrapmaster.com"
                          />
                          <span className="avatar-status badge-danger"></span>
                        </div>
                      </td>
                      <td>
                        <div>Avram Tarasios</div>
                        <div className="small text-muted">
                          <span>Recurring</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <i
                          className="flag-icon flag-icon-br h4 mb-0"
                          title="br"
                          id="br"
                        ></i>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>10%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">
                              Jun 11, 2015 - Jul 10, 2015
                            </small>
                          </div>
                        </div>
                        <Progress
                          className="progress-xs"
                          color="info"
                          value="10"
                        />
                      </td>
                      <td className="text-center">
                        <i
                          className="fa fa-cc-visa"
                          style={{ fontSize: 24 + "px" }}
                        ></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>5 minutes ago</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img
                            src={marioProfile}
                            className="img-avatar"
                            alt="admin@bootstrapmaster.com"
                          />
                          <span className="avatar-status badge-warning"></span>
                        </div>
                      </td>
                      <td>
                        <div>Quintin Ed</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <i
                          className="flag-icon flag-icon-in h4 mb-0"
                          title="in"
                          id="in"
                        ></i>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>74%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">
                              Jun 11, 2015 - Jul 10, 2015
                            </small>
                          </div>
                        </div>
                        <Progress
                          className="progress-xs"
                          color="warning"
                          value="74"
                        />
                      </td>
                      <td className="text-center">
                        <i
                          className="fa fa-cc-stripe"
                          style={{ fontSize: 24 + "px" }}
                        ></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>1 hour ago</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img
                            src={marioProfile}
                            className="img-avatar"
                            alt="admin@bootstrapmaster.com"
                          />
                          <span className="avatar-status badge-secondary"></span>
                        </div>
                      </td>
                      <td>
                        <div>Enéas Kwadwo</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <i
                          className="flag-icon flag-icon-fr h4 mb-0"
                          title="fr"
                          id="fr"
                        ></i>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>98%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">
                              Jun 11, 2015 - Jul 10, 2015
                            </small>
                          </div>
                        </div>
                        <Progress
                          className="progress-xs"
                          color="danger"
                          value="98"
                        />
                      </td>
                      <td className="text-center">
                        <i
                          className="fa fa-paypal"
                          style={{ fontSize: 24 + "px" }}
                        ></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>Last month</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img
                            src={marioProfile}
                            className="img-avatar"
                            alt="admin@bootstrapmaster.com"
                          />
                          <span className="avatar-status badge-success"></span>
                        </div>
                      </td>
                      <td>
                        <div>Agapetus Tadeáš</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <i
                          className="flag-icon flag-icon-es h4 mb-0"
                          title="es"
                          id="es"
                        ></i>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>22%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">
                              Jun 11, 2015 - Jul 10, 2015
                            </small>
                          </div>
                        </div>
                        <Progress
                          className="progress-xs"
                          color="info"
                          value="22"
                        />
                      </td>
                      <td className="text-center">
                        <i
                          className="fa fa-google-wallet"
                          style={{ fontSize: 24 + "px" }}
                        ></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>Last week</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">
                        <div className="avatar">
                          <img
                            src={marioProfile}
                            className="img-avatar"
                            alt="admin@bootstrapmaster.com"
                          />
                          <span className="avatar-status badge-danger"></span>
                        </div>
                      </td>
                      <td>
                        <div>Friderik Dávid</div>
                        <div className="small text-muted">
                          <span>New</span> | Registered: Jan 1, 2015
                        </div>
                      </td>
                      <td className="text-center">
                        <i
                          className="flag-icon flag-icon-pl h4 mb-0"
                          title="pl"
                          id="pl"
                        ></i>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-left">
                            <strong>43%</strong>
                          </div>
                          <div className="float-right">
                            <small className="text-muted">
                              Jun 11, 2015 - Jul 10, 2015
                            </small>
                          </div>
                        </div>
                        <Progress
                          className="progress-xs"
                          color="success"
                          value="43"
                        />
                      </td>
                      <td className="text-center">
                        <i
                          className="fa fa-cc-amex"
                          style={{ fontSize: 24 + "px" }}
                        ></i>
                      </td>
                      <td>
                        <div className="small text-muted">Last login</div>
                        <strong>Yesterday</strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
    dispositifs: state.dispositif.dispositifs,
  };
};

export default track({
  page: "Dashboard",
})(connect(mapStateToProps)(Dashboard));
