import React from "react";
import {
    Link,
    Toolbar,
} from "framework7-react";

export default class ToolBar extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="page-toolbar">
                <ul className="page-toolbar__list toolbar-item-4">
                    <li>
                        <Link href="/news/">
                            <i className="las la-newspaper"></i>
                            <span>Preferential</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/shop/">
                            <i className="las la-shopping-cart"></i>
                            <span>Buy items</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/maps/">
                            <i className="las la-map-marked-alt"></i>
                            <span>Contact</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/users/">
                            <i className="las la-user-circle"></i>
                            <span>Account</span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }
}