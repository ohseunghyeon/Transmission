import {inject, observer} from "mobx-react";
import React from "react";
import PropTypes from "prop-types";
import Interval from "./Interval";

@inject('rootStore')
@observer
class SpaceWatcher extends React.Component {
  static propTypes = {
    rootStore: PropTypes.object,
  };

  /**@return {RootStore}*/
  get rootStore() {
    return this.props.rootStore;
  }

  /**@return {SpaceWatcherStore}*/
  get spaceWatcherStore() {
    return this.props.rootStore.spaceWatcher;
  }

  componentDidMount() {
    this.rootStore.createSpaceWatcher();
  }

  componentWillUnmount() {
    this.rootStore.destroySpaceWatcher();
  }

  handleUpdate = (e) => {
    e.preventDefault();
    this.onIntervalFire();
  };

  onIntervalFire = () => {
    this.spaceWatcherStore.fetchDownloadDirs();
  };

  render() {
    if (!this.spaceWatcherStore) return null;

    let title = null;
    let body = null;
    if (this.spaceWatcherStore.state === 'pending') {
      title = 'Loading...';
      body = '...';
    } else
    if (this.spaceWatcherStore.state === 'error') {
      title = this.spaceWatcherStore.errorMessage;
      body = '-';
    } else
    if (this.spaceWatcherStore.state === 'done') {
      const status = [`${chrome.i18n.getMessage('freeSpace')}:`];
      body = this.spaceWatcherStore.downloadDirs.map((directory) => {
        status.push(`${directory.availableStr} (${directory.path})`);
        return (
          <span key={directory.path}>{directory.availableStr} </span>
        );
      });
      title = status.join('\n');
    }

    return (
      <>
        <td className="space disk" onClick={this.handleUpdate} title={title}>{body}</td>
        <Interval interval={60 * 1000} onFire={this.onIntervalFire} onInit={this.onIntervalFire}/>
      </>
    );
  }
}

export default SpaceWatcher;