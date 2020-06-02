import React from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Row,
  Col,
  Button,
  FormGroup,
  Label,
} from "reactstrap";
import ReactHtmlParser from "react-html-parser";

import DiptyqueTraduction from "../../../Translation/DiptyqueTraduction/DiptyqueTraduction";

import "./CustomAccordion.css";

const customAccordion = (props) => {
  return (
    <Card>
      <CardHeader>
        {props.data.title}
        <div className="card-header-actions">
          <Badge color="secondary">{props.data.badge}</Badge>
        </div>
      </CardHeader>
      <CardBody>
        <div id="accordion">
          {props.data.headers.map((header, index) => {
            return (
              <Card className="mb-0" key={index}>
                <CardHeader id="headingOne">
                  <Button
                    block
                    color="link"
                    className="text-left m-0 p-0"
                    onClick={() =>
                      props.toggleAccordion(index, props.data.title)
                    }
                    aria-expanded={props.accordion[index]}
                    aria-controls="collapseOne"
                  >
                    {header.title}
                    <div className="card-header-actions">
                      <Badge color={header.color} className="float-right">
                        {header.badge}
                      </Badge>
                    </div>
                  </Button>
                </CardHeader>
                <Collapse
                  isOpen={props.accordion[index]}
                  data-parent="#accordion"
                  id="collapseOne"
                  aria-labelledby="headingOne"
                >
                  <CardBody>
                    {props.traduction ? (
                      <>
                        <DiptyqueTraduction
                          initial_string={props.traduction.initialText}
                          translated_string={props.traduction.translatedText}
                          editable={false}
                          {...props}
                        />

                        <FormGroup className="diptyque-traduction">
                          <Label htmlFor="translationInput">Traduction</Label>
                          <div
                            type="text"
                            className="form-control form-control-success"
                            id="initialText"
                          >
                            {ReactHtmlParser(
                              props.traduction.initialTranslatedText
                            )}
                          </div>
                        </FormGroup>

                        <Row className="align-items-center">
                          <Col
                            col="6"
                            sm="4"
                            md="2"
                            xl
                            className="mb-3 mb-xl-0"
                          >
                            <Button
                              block
                              outline
                              color="success"
                              className="btn-pill"
                              onClick={props.onValidate}
                            >
                              Valider cette traduction
                            </Button>
                          </Col>
                          <Col
                            col="6"
                            sm="4"
                            md="2"
                            xl
                            className="mb-3 mb-xl-0"
                          >
                            <Button
                              block
                              outline
                              color="danger"
                              className="btn-pill"
                              onClick={props.onPass}
                            >
                              Passer
                            </Button>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <div>Aucune donnée</div>
                    )}
                  </CardBody>
                </Collapse>
              </Card>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default customAccordion;
