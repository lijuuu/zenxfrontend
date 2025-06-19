import React, { useState, useEffect, useRef } from "react";
import lottie from "lottie-web";
import { motion } from "framer-motion";
import { IonIcon } from "@ionic/react";
import { addOutline, removeOutline, playSharp, pauseSharp } from "ionicons/icons";

// Define props interface to accept className
interface MusicPlayerProps {
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ className = "" }) => {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    title: "",
    artist: "",
    url: "",
    image: "",
  });
  const [soundBarsLottie, setSoundBarsLottie] = useState<any>(null);
  const audioRef = useRef(new Audio());

  const trackList = [
    {
      title: "Feel",
      artist: "Misanthrop",
      url: "https://azuki-songs.s3.amazonaws.com/f1/11%20-%20Feel.mp3",
      image: "https://elementals-images.b-cdn.net/2461bf97-fd5f-406f-8ea4-81b051e70e9c.png",
    },
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

  ];

  const loadTrack = (index: number) => {
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
    loadTrack(0);
    playPauseTrack();
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
        className="relative flex items-center p-2 rounded-lg shadow-lg overflow-visible"
        initial={{ width: isMinimized ? "70px" : "440px", height: isMinimized ? "66px" : "72px" }}
        animate={{ width: isMinimized ? "70px" : "440px", height: isMinimized ? "66px" : "72px" }}
        transition={{ duration: 0.3, ease: "linear" }}
        style={{
          border: "1px solid rgba(255, 255, 255, 0.18)",
          borderRadius: "16px",
        }}

      >
        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 m-[1.5px]"
          style={{
            backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
            opacity: 1,
            borderRadius: "16px",
            mixBlendMode: "overlay"
          }}
        />

        {/* Background image with blur */}
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

        {/* Content layer with fixed positions */}
        <div className="relative w-full h-full">
          {/* Sound bars at fixed left position */}
          <div
            className={`sound-bars absolute top-1/2 transform -translate-y-1/2 transition-all duration-300`}
            style={{
              width: isMinimized ? "48px" : "40px",
              height: isMinimized ? "48px" : "40px",
              filter: isMinimized ? "brightness(0) invert(1)" : "none",
            }}
          ></div>

          {/* Avatar (pfp) at fixed position when not minimized */}
          {!isMinimized && (
            <div className="w-14 h-14 rounded-full overflow-hidden absolute left-12 top-1/2 transform -translate-y-1/2">
              <img src={currentTrack.image} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Text area (flexible) including minimized state */}
          <div className="flex flex-col justify-center overflow-hidden ml-32 mr-24">
            <span className="font-bold text-lg text-gray-900 drop-shadow-md truncate">{currentTrack.title}</span>
            {!isMinimized && (
              <span className="text-xs text-gray-900  opacity-90 truncate">
                {currentTrack.artist}
              </span>
            )}
          </div>

          {/* Control buttons at fixed right position when not minimized */}
          {!isMinimized && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <motion.button
                className="p-1 w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                onClick={prevTrack}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IonIcon icon={playSharp} className="text-white" style={{ transform: "rotate(180deg)" }} />
              </motion.button>
              <motion.button
                className="p-1 w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                onClick={playPauseTrack}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IonIcon icon={isPlaying ? pauseSharp : playSharp} className="text-white text-lg" />
              </motion.button>
              <motion.button
                className="p-1 w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                onClick={nextTrack}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IonIcon icon={playSharp} className="text-white" />
              </motion.button>
            </div>
          )}

          {/* Minimize button at fixed top-right position */}
          <motion.button
            className={`absolute ${isMinimized ? "top-[-26px] right-[-23px]" : "top-[-23px] right-[-23px]"} w-8 h-8 rounded-full bg-black bg-opacity-50 flex justify-center items-center border border-white border-opacity-10 cursor-pointer`}
            onClick={toggleMinimize}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ zIndex: 10 }}
          >
            <IonIcon icon={isMinimized ? addOutline : removeOutline} className="text-white" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MusicPlayer;