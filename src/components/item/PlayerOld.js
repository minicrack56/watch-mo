import React, { useState, useEffect } from "react";
import Measure from "react-measure";
import YTPlayer from "react-youtube";
import ReactImageFallback from "react-image-fallback";
import { FALLBACK_IMAGE, IMAGE_URL, youTubeConfig } from "../../constants";
import { useSpring, animated, config } from "react-spring";

const Player = ({ videoId, poster, title, playing, handlePlayerState }) => {
  const [dimensions, setDimensions] = useState({});
  const playerAnimate = useSpring({
    from: {
      opacity: 0,
      transform: "scale(0.5)",
    },
    to: { opacity: 1, transform: "scale(1)" },
  });

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

  useEffect(() => {
    if (playing) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [playing]);

  const { xy, w, h } = useSpring({
    from: { xy: [0, 0], w: "auto", h: "auto" },
    xy: playing ? [horzOrigin, vertOrigin] : [0, 0],
    w: playing ? playerWidth : "auto",
    h: playing ? playerHeight : "auto",
  });

  return (
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
          <animated.div
            style={{
              transform: xy.interpolate((x, y) => `translate(${x}px, ${y}px)`),
              width: w.interpolate((w) => w),
              height: h.interpolate((h) => h),
            }}
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
          </animated.div>
          <animated.div
            style={playerAnimate}
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
                d={playing ? "M2 30 L30 2 M30 30 L2 2" : "M10 2 L10 30 24 16 Z"}
              />
            </svg>
          </animated.div>
          <div
            onClick={handlePlayerState}
            className="position-fixed w-100 h-100 player-bd"
          />
        </section>
      )}
    </Measure>
  );
};

export default Player;
