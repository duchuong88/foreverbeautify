import React from "react";
import { Row, Col } from "framework7-react";
import NewsDataService from "../../../../service/news.service";
import CardServiceItem from "./cardServiceItem";
import SkeletonService from "./SkeletonService";
export default class ListService extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.getServiceHot();
  }

  getServiceHot = () => {

    NewsDataService.getBannerName(this.props.id)
      .then((response) => {
        const arrService = response.data.data;
        this.setState({
          arrService: arrService,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { arrService, isLoading } = this.state;
    const {className} = this.props;
    return (
      <div className={`body-service ${className}`}>
        <Row>
          {!isLoading &&
            arrService &&
            arrService.map((item, index) => {
              if (index > 4) return false;
              return (
                <Col width="25" key={index}>
                  <CardServiceItem OpenStock={this.props.OpenStock} item={item} />
                </Col>
              );
            })}
        </Row>
        {isLoading && <SkeletonService />}
      </div>
    );
  }
}
