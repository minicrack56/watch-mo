import React from "react";
import Measure from "react-measure";
import YTPlayer from "react-youtube";
import ReactImageFallback from "react-image-fallback";
import { FALLBACK_IMAGE, IMAGE_URL, youTubeConfig } from "../../constants";
import { Spring, animated } from "react-spring/renderprops";

class Player extends React.Component {
  state = {
    dimensions: {},
  };

  setDimensions = (dimensions) => {
    this.setState({ dimensions });
  };

  componentDidUpdate(prevProps) {
    const { playing } = this.props;
  }

  render() {
    const { videoId, poster, title, playing, handlePlayerState } = this.props;
    const { dimensions } = this.state;

    let playerWidth = Math.round((window.innerWidth * 80) / 100);
    let playerHeight = Math.round((playerWidth / 16) * 9);

    if (window.innerHeight < window.innerWidth) {
      playerHeight = Math.round((window.innerHeight * 80) / 100);
      playerWidth = Math.round((playerHeight / 9) * 16);
    }

    const horzOrigin =
      ((window.innerWidth - playerWidth) / 2).toFixed(2) - dimensions.left;
    const vertOrigin =
      ((window.innerHeight - playerHeight) / 2).toFixed(2) - dimensions.top;

    if (playing) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return (
      <Measure
        bounds
        onResize={(contentRect) => {
          this.setDimensions(contentRect.bounds);
        }}
      >
        {({ measureRef }) => (
          <section
            className={`player-section c-hand position-relative ${
              playing && "is-playing"
            }`}
          >
            <Spring
              from={{
                transform: `translate(0px, 0px)`,
              }}
              to={{
                transform: playing
                  ? `translate(${horzOrigin}px, ${vertOrigin}px)`
                  : `translate(0px, 0px)`,
              }}
            >
              {(props) => (
                <div
                  style={props}
                  ref={measureRef}
                  onClick={handlePlayerState}
                  className="over-shadow yt-player embed-responsive embed-responsive-16by9 overflow-hidden"
                >
                  <div ref={measureRef}>
                    <YTPlayer
                      videoId={videoId}
                      opts={youTubeConfig}
                      containerClassName="yt-container"
                      className="embed-responsive-item"
                    />
                    {!playing && (
                      <ReactImageFallback
                        src={`${IMAGE_URL + "/w780" + poster}`}
                        fallbackImage={FALLBACK_IMAGE}
                        alt={title}
                        className="cover-fit w-100 h-100 position-absolute"
                      />
                    )}
                  </div>
                </div>
              )}
            </Spring>
            <div
              onClick={handlePlayerState}
              className="pl-icon position-absolute p-4 m-4"
            >
              <svg
                id={playing ? "i-pause" : "i-play"}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 36 36"
                width="36"
                height="36"
                fill="none"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path
                  d={
                    playing ? "M2 30 L30 2 M30 30 L2 2" : "M10 2 L10 30 24 16 Z"
                  }
                />
              </svg>
            </div>
            <div
              onClick={handlePlayerState}
              className="position-fixed w-100 h-100 player-bd"
            />
          </section>
        )}
      </Measure>
    );
  }
}

export default Player;
