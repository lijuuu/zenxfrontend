import React, { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import { motion } from "framer-motion";
import { IonIcon } from "@ionic/react";
import { addOutline, removeOutline, playSharp, pauseSharp } from "ionicons/icons";

// Define and export Track type
export interface Track {
  title: string;
  artist: string;
  url: string;
  image: string;
}

// Define props interface
interface MusicPlayerProps {
  className?: string;
  newTrack?: Track[];
  audioRefProp?: React.MutableRefObject<HTMLAudioElement>;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  className = "",
  newTrack,
  audioRefProp
}) => {
  const defaultTrack: Track = {
    title: "Feel",
    artist: "Misanthrop",
    url: "https://azuki-songs.s3.amazonaws.com/f1/11%20-%20Feel.mp3",
    image: "https://elementals-images.b-cdn.net/2461bf97-fd5f-406f-8ea4-81b051e70e9c.png",
  };

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultTrack);
  const [soundBarsLottie, setSoundBarsLottie] = useState<any>(null);
  const defaultAudioRef = useRef(new Audio());
  const audioRef = audioRefProp || defaultAudioRef;

  const [trackList, setTrackList] = useState<Track[]>([
    defaultTrack,
    {
      title: "WRATH",
      artist: "FREDDIE DREAD",
      url: "https://azuki-songs.s3.amazonaws.com/f1/3%20-%20Wrath%20[Explicit].mp3",
      image: "https://elementals-images.b-cdn.net/38ba7895-f827-412b-b84c-10e940bb529c.png",
    },
    {
      title: "9mm",
      artist: "Memphis Cult",
      url: "https://azuki-songs.s3.amazonaws.com/f1/5%20-%209mm%20%5BExplicit%5D.mp3",
      image: "https://elementals-images.b-cdn.net/7818fb6f-ff27-4a97-9a82-472fd779618d.png",
    },
    {
      title: "I KNOW ?",
      artist: "Travis Scott",
      url: "https://azuki-songs.s3.amazonaws.com/f1/6%20-%20I%20KNOW%20_%20%5BExplicit%5D.mp3",
      image: "https://elementals-images.b-cdn.net/73110c16-5440-4899-8c87-b02847d9b56c.png",
    },
    {
      title: "Opa Enui",
      artist: "Melokind, Enui",
      url: "https://azuki-songs.s3.amazonaws.com/f1/7%20-%20Opa%20Ga%CC%88a%CC%88rd%20(Enui%20Remix).mp3",
      image: "https://elementals-images.b-cdn.net/e1d5a8ed-bad1-4ffb-9e85-e5fa3801f9fc.png",
    },
    {
      title: "Rave",
      artist: "Lane 8",
      url: "https://azuki-songs.s3.amazonaws.com/f1/10%20-%20Rave.mp3",
      image: "https://elementals-images.b-cdn.net/43d343fc-31b8-4115-bc99-aeb2d39f53db.png",
    },
    {
      title: "Badders",
      artist: "PEEKABOO, Flowdan, Skrillex",
      url: "https://azuki-songs.s3.amazonaws.com/f1/2%20-%20BADDERS%20%5BExplicit%5D.mp3",
      image: "https://elementals-images.b-cdn.net/0ab85d49-16d8-4787-91c3-ec79c7715c56.png",
    },
  ]);

  // Append new tracks if provided and load the first one
  useEffect(() => {
    if (newTrack && newTrack.length > 0) {
      // Validate tracks
      const validTracks = newTrack.filter(track => track && track.url && track.title && track.artist && track.image);
      if (validTracks.length > 0) {
        setTrackList(prev => {
          const newTrackList = [...prev, ...validTracks];
          const newIndex = prev.length; // Index of the first new track
          setTrackIndex(newIndex);
          loadTrack(newIndex);
          return newTrackList;
        });
        console.log("Added new tracks:", validTracks);
      } else {
        console.warn("No valid tracks provided in newTrack array");
      }
    }
  }, [newTrack]);

  // Handle window resize to toggle minimize state
  useEffect(() => {
    const handleResize = () => {
      setIsMinimized(window.innerWidth < 640);
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadTrack = (index: number) => {
    if (!trackList[index]) {
      console.error(`No track found at index ${index}`);
      setCurrentTrack(defaultTrack);
      audioRef.current.src = defaultTrack.url;
      audioRef.current.load();
      setTrackIndex(0);
      return;
    }

    audioRef.current.pause();
    audioRef.current.removeEventListener("ended", nextTrack);
    const track = trackList[index];
    setCurrentTrack(track);
    audioRef.current.src = track.url;
    audioRef.current.load();
    audioRef.current.addEventListener("ended", nextTrack);
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Play failed:", error);
        setIsPlaying(false);
      });
    }
  };

  const playPauseTrack = () => {
    if (!isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Play failed:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
      if (soundBarsLottie) soundBarsLottie.playSegments([0, 120], true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      if (soundBarsLottie) soundBarsLottie.stop();
    }
  };

  const nextTrack = () => {
    const newIndex = (trackIndex + 1) % trackList.length;
    setTrackIndex(newIndex);
    loadTrack(newIndex);
  };

  const prevTrack = () => {
    const newIndex = (trackIndex - 1 + trackList.length) % trackList.length;
    setTrackIndex(newIndex);
    loadTrack(newIndex);
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  useEffect(() => {
    const lottieInstance = lottie.loadAnimation({
      container: document.querySelector(".sound-bars")!,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "https://assets5.lottiefiles.com/packages/lf20_jJJl6i.json",
    });
    setSoundBarsLottie(lottieInstance);
    // Removed playPauseTrack to prevent autoplay
    loadTrack(0);
    return () => lottieInstance.destroy();
  }, []);

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);
    return () => {
      audioRef.current.removeEventListener("play", handlePlay);
      audioRef.current.removeEventListener("pause", handlePause);
      audioRef.current.pause();
    };
  }, []);

  return (
    <div className={`fixed z-20 ${className}`}>
      <motion.div
        className="relative flex items-center p-2 rounded-lg shadow-lg overflow-visible bg-white bg-opacity-10 backdrop-blur-lg"
        initial={{
          width: isMinimized ? "4.5rem" : "min(28rem, 90vw)",
          height: isMinimized ? "4.125rem" : "4.5rem"
        }}
        animate={{
          width: isMinimized ? "4.5rem" : "min(28rem, 90vw)",
          height: isMinimized ? "4.125rem" : "4.5rem"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          border: "1px solid rgba(255, 255, 255, 0.18)",
          borderRadius: "16px",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10 m-[1.5px]"
          style={{
            backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
            opacity: 1,
            borderRadius: "16px",
            mixBlendMode: "overlay"
          }}
        />

        <div
          className="absolute inset-0 border"
          style={{
            backgroundImage: `url(${currentTrack.image})`,
            backgroundSize: "cover",
            backgroundPosition: isMinimized ? "center" : "top left",
            filter: isMinimized ? "blur(9px)" : "blur(7px)",
            zIndex: -1,
            borderRadius: "16px",
          }}
        />

        <div className="relative w-full h-full">
          <div
            className={`sound-bars absolute top-1/2 transform -translate-y-1/2 transition-all duration-300`}
            style={{
              width: isMinimized ? "2.5rem" : "2rem",
              height: isMinimized ? "2.5rem" : "2rem",
              filter: isMinimized ? "brightness(0) invert(1)" : "none",
              left: isMinimized ? "0.5rem" : "0.5rem",
            }}
          ></div>

          {!isMinimized && (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden absolute left-12 top-1/2 transform -translate-y-1/2">
              <img src={currentTrack.image} className="w-full h-full object-cover" />
            </div>
          )}

          <div
            className={`flex flex-col justify-center transition-all duration-300  ${isMinimized
              ? "ml-0"
              : "ml-28"
              }`}
            style={{
              minWidth: isMinimized ? "0" : "0",
              maxWidth: isMinimized ? "calc(100% - 3.5rem)" : "calc(100% - 10rem)",
              flex: "1 1 0%",
              overflow: "hidden",
            }}
          >
            <span
              className={`font-bold truncate drop-shadow-md  ${isMinimized ? "text-sm" : "text-base sm:text-lg"
                } text-gray-900`}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "#111827",
              }}
              title={currentTrack.title}
            >
              {currentTrack.title}
            </span>
            {!isMinimized && (
              <span
                className="text-xs sm:text-sm truncate"
                style={{
                  color: "#111827",
                  opacity: 0.9,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={currentTrack.artist}
              >
                {currentTrack.artist}
              </span>
            )}
          </div>

          {/* Control buttons at fixed right position when not minimized */}
          {!isMinimized && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <motion.button
                className="p-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                onClick={prevTrack}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IonIcon icon={playSharp} className="text-white text-sm sm:text-base" style={{ transform: "rotate(180deg)" }} />
              </motion.button>
              <motion.button
                className="p-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                onClick={playPauseTrack}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IonIcon icon={isPlaying ? pauseSharp : playSharp} className="text-white text-sm sm:text-lg sm:text-center" />
              </motion.button>
              <motion.button
                className="p-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                onClick={nextTrack}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IonIcon icon={playSharp} className="text-white text-sm sm:text-base" />
              </motion.button>
            </div>
          )}

          {/* Minimize button at fixed top-right position */}
          <motion.button
            className={`absolute ${isMinimized ? "top-[-1.5rem] right-[-1.5rem]" : "top-[-1.5rem] right-[-2rem]"} w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black bg-opacity-50 flex justify-center items-center border border-white border-opacity-10 cursor-pointer sm:right-[-2rem] sm:duration-50`}
            onClick={toggleMinimize}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ zIndex: 10 }}
          >
            <IonIcon icon={isMinimized ? addOutline : removeOutline} className="text-white text-sm sm:text-base" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;