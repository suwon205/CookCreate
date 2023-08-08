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
                    <div className="streamcomponent">
                        <OpenViduVideoComponent
                            videoStyle={this.props.videoStyle}
                            streamManager={this.props.streamManager}
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
