import './App.css'
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 15,
      isSession: true,
      intervalId: null
    };
    this.onPlayPause = this.onPlayPause.bind(this);
    this.onIntervalChange = this.onIntervalChange.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  onReset() {
    if (this.state.intervalId != null) clearInterval(this.state.intervalId);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      isSession: true,
      intervalId: null
    });
    if ($("#beep")[0].duration > 0 && !$("#beep")[0].paused) {
      $("#beep")[0].pause();
      $("#beep")[0].currentTime = 0;
    }
  }

  onIntervalChange(event) {
    console.log($(event.currentTarget)[0].id);
    switch ($(event.currentTarget)[0].id) {
      case "break-increment":
        if (this.state.breakLength >= 1 && this.state.breakLength < 60) {
          this.setState((state) => ({
            breakLength: state.breakLength + 1
          }));
        }
        break;
      case "break-decrement":
        if (this.state.breakLength > 1 && this.state.breakLength <= 60) {
          this.setState((state) => ({
            breakLength: state.breakLength - 1
          }));
        }
        break;
      case "session-increment":
        if (this.state.sessionLength >= 1 && this.state.sessionLength < 60) {
          this.setState((state) => ({
            sessionLength: state.sessionLength + 1,
            timeLeft: (state.sessionLength + 1) * 60
          }));
        }

        break;
      case "session-decrement":
        if (this.state.sessionLength > 1 && this.state.sessionLength <= 60) {
          this.setState((state) => ({
            sessionLength: state.sessionLength - 1,
            timeLeft: (state.sessionLength - 1) * 60
          }));
        }
        break;
    }
  }
  onPlayPause() {
    if (this.state.intervalId == null) {
      const timer = () => {
        if (this.state.timeLeft == 0) {
          if (this.state.isSession == true) {
            this.setState((state) => ({
              isSession: false,
              timeLeft: state.breakLength * 60
            }));
          } else {
            this.setState((state) => ({
              isSession: true,
              timeLeft: state.sessionLength * 60
            }));
          }
        } else {
          this.setState((state) => ({
            timeLeft: state.timeLeft - 1
          }));
        }
        if (this.state.timeLeft == 7) {
          $("#beep")[0].play();
        }
      };
      const intervalId = setInterval(timer, 1000);
      this.setState((state) => ({
        intervalId: intervalId
      }));
      console.log("interval id", intervalId, this.state.intervalId);
    } else {
      console.log("interval id in else", this.state.intervalId);
      clearInterval(this.state.intervalId);
      this.setState((state) => ({
        intervalId: null
      }));
    }
  }

  render() {
    let { breakLength, sessionLength, timeLeft, isSession } = this.state;
    console.log(sessionLength);

    const minutes =
      Math.floor(timeLeft / 60) < 10
        ? "0" + Math.floor(timeLeft / 60)
        : "" + Math.floor(timeLeft / 60);
    const seconds =
      timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : "" + (timeLeft % 60);
    console.log(minutes, seconds);
    return (
      <div className="row main-row d-flex justify-content-center align-content-center">
        <div className="main-col col-4 card p-0 shadow rounded-10 m-3">
          <div className="card-header text-center fs-5 pomo-title">
            Pomodora Timer
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-6">
                <div className="card shadow">
                  <div
                    className="card-header text-center pomo-title"
                    id="break-label"
                  >
                    Break Length
                  </div>
                  <div className="main-card card-body text-center pomo-title p-2 d-flex justify-content-between">
                    <button
                      className="btn btn-outline-secondary"
                      id="break-decrement"
                      onClick={this.onIntervalChange}
                    >
                      <i className="fa-solid fa-chevron-down"></i>
                    </button>

                    <div
                      className=" fs-4 align-content-center"
                      id="break-length"
                    >
                      {breakLength}
                    </div>

                    <button
                      className="btn btn-outline-secondary"
                      id="break-increment"
                      onClick={this.onIntervalChange}
                    >
                      <i className="fa-solid fa-chevron-up"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card shadow">
                  <div
                    className="card-header text-center pomo-title"
                    id="session-label"
                  >
                    Session Length
                  </div>
                  <div className="main-card card-body text-center pomo-title p-2 d-flex justify-content-between">
                    <button
                      className="btn btn-outline-secondary"
                      id="session-decrement"
                      onClick={this.onIntervalChange}
                    >
                      <i className="fa-solid fa-chevron-down"></i>
                    </button>

                    <div
                      className=" fs-4 align-content-center"
                      id="session-length"
                      onClick={this.onIntervalChange}
                    >
                      {sessionLength}
                    </div>

                    <button
                      className="btn btn-outline-secondary"
                      id="session-increment"
                      onClick={this.onIntervalChange}
                    >
                      <i className="fa-solid fa-chevron-up"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-2 p-2">
              <div className="card shadow col-12 p-0">
                <h5 className="card-header text-center pomo-title" id="timer-label">
                  {isSession ? "Session Active" : "Break Active"}
                </h5>

                <audio
                  src="https://cdn.pixabay.com/audio/2021/08/04/audio_c668156e64.mp3"
                  id="beep"
                ></audio>
                <div className="main-card card-body text-center pomo-title d-flex justify-content-between">
                  <button
                    className="btn btn-outline-secondary btn-lg"
                    id="start_stop"
                    onClick={this.onPlayPause}
                  >
                    <i className="fa-solid fa-play"></i>
                    <i className="fa-solid fa-pause"></i>
                  </button>
                  <div className="card-title fs-2 fw-bold" id="time-left">
                    {minutes}:{seconds}
                  </div>
                  <button
                    className="btn btn-outline-secondary btn-lg"
                    id="reset"
                    onClick={this.onReset}
                  >
                    <i className="fa-solid fa-rotate"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
