import React, { useState, useEffect } from "react";
import Measure from "react-measure";
import YTPlayer from "react-youtube";
import ReactImageFallback from "react-image-fallback";
import Play from "react-bytesize-icons/Play";
import { FALLBACK_IMAGE, IMAGE_URL, youTubeConfig } from "../../constants";
import { Spring } from "react-spring/renderprops";

const Player = ({ videoId, poster, title, playing, handlePlayerState }) => {
  const [dimensions, setDimensions] = useState({});

  let playerWidth = Math.round((window.innerWidth * 80) / 100);
  let playerHeight = Math.round((playerWidth / 16) * 9);

  if (window.innerHeight < window.innerWidth) {
    playerHeight = Math.round((window.innerHeight * 80) / 100);
    playerWidth = Math.round((playerHeight / 9) * 16);
  }

  let trailerSpring = {
    from: {
      transform: "translate3d(0px, 0px, 0)",
    },
    to: {
      height: "auto",
      width: "auto",
    },
  };
  document.body.classList.remove("modal-open");

  if (playing) {
    const horzOrigin = Math.round(
      (window.innerWidth - playerWidth) / 2 - dimensions.left
    );
    const vertOrigin = Math.round(
      (window.innerHeight - playerHeight) / 2 - dimensions.top
    );
    trailerSpring = {
      ...trailerSpring,
      to: {
        height: playerHeight,
        width: playerWidth,
        transform: `translate3d(${horzOrigin}px, ${vertOrigin}px, 0)`,
      },
    };

    // Prevent body scroll
    document.body.classList.add("modal-open");
  }

  return (
    <Spring {...trailerSpring} reset>
      {(animatedSpring) => (
        <Measure
          bounds
          onResize={(contentRect) => {
            setDimensions(contentRect.bounds);
          }}
        >
          {({ measureRef }) => (
            <section
              className={`player-section c-hand position-relative ${
                playing && "is-playing"
              }`}
            >
              <div
                ref={measureRef}
                onClick={handlePlayerState}
                style={animatedSpring}
                className="over-shadow yt-player embed-responsive embed-responsive-16by9 overflow-hidden"
              >
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
              {!playing && (
                <div
                  onClick={handlePlayerState}
                  className="pl-icon position-absolute p-4 m-4"
                >
                  <Play width="36" height="36" />
                </div>
              )}
              <div
                onClick={handlePlayerState}
                className="position-fixed w-100 h-100 player-bd"
              />
            </section>
          )}
        </Measure>
      )}
    </Spring>
  );
};

export default Player;
