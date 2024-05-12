import React, { Component } from 'react';
import {errorMessageLogToServer} from '../../Services/network/network-services'
import StaticData from '../../Variables/StaticData';
import { SystemMaintenance } from '../../Navigation';
class ErrorBoundary extends Component {
    state = {
        hasError: false
    };

    componentDidCatch(error, errorInfo) {
        // console.error("Error caught by ErrorBoundary:", error, errorInfo);
        // console.log("Error caught by ErrorBoundary:", error);
        errorMessageLogToServer("Kiosk: " + StaticData.serialNumber + ' Lỗi: ' + error, "");
        this.setState({ hasError: true });  
    }

    render() {
        if (this.state.hasError) {
        return <SystemMaintenance/>
        }
        return this.props.children;
    }
}

export default ErrorBoundary;