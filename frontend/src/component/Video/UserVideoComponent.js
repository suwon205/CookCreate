import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default class UserVideoComponent extends Component {

    getNicknameTag() {
        // Gets the nickName of the user
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData.nickname;
        
    }

    render() {
        return (
            <div>
                {this.props.streamManager !== undefined ? (
                    <div className="stream-component">
                        <OpenViduVideoComponent
                            videoStyle={this.props.videoStyle}
                            streamManager={this.props.streamManager}
                            gesture={this.props.gesture}
                        />
                        <div>
                            <p>{this.getNicknameTag()}</p>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
