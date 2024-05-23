import { Link } from "framework7-react";
import React from "react";
import { GrCheckmark } from "react-icons/gr";

export default class ScheduleSuccess extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="page-schedule__success">
        <GrCheckmark />
        <h4>Scheduled successfully</h4>
        <div className="desc">
          <span>Congratulations, you have successfully booked your appointment.</span>
          <span>Please wait. We will confirm your booking.</span>
        </div>
        <Link
          noLinkClass
          className="btn-submit-order"
          href="/manage-schedules/"
        >
          Manage scheduling
        </Link>
        <Link
          noLinkClass
          className="btn-submit-step"
          onClick={() => this.props.onResetStep()}
        >
          Set a new schedule
        </Link>
      </div>
    );
  }
}
