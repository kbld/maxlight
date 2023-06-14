import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ColorThief from "colorthief";

const App = () => {
  const [songData, setSongData] = useState(null);
  const [gradientColors, setGradientColors] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const audioBlob = new Blob([reader.result], { type: file.type });
      handleAudioRecognition(audioBlob);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAudioRecognition = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");

    const options = {
      method: "POST",
      url: "https://shazam-api7.p.rapidapi.com/songs/recognize-song",
      headers: {
        "X-RapidAPI-Key": "e5794f88a8msh9fedf02c74f4cd0p1a9ea3jsnc4f4b76238f7",
        "X-RapidAPI-Host": "shazam-api7.p.rapidapi.com",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      setSongData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const generateGradient = async () => {
    if (
      songData &&
      songData.track &&
      songData.track.images &&
      songData.track.images.coverart
    ) {
      const colorThief = new ColorThief();
      const img = document.createElement("img");
      img.src = songData.track.images.coverart;
      img.crossOrigin = "Anonymous";

      img.addEventListener("load", () => {
        const colorPalette = colorThief.getPalette(img, 3);
        const gradientColors = colorPalette.map((color, index) => {
          const colorVariable = `--color${index + 1}`;
          document.documentElement.style.setProperty(
            colorVariable,
            `rgb(${color[0]}, ${color[1]}, ${color[2]})`
          );
          return `span-color${index + 1}`;
        });
        setGradientColors(gradientColors);
      });
    }
  };

  useEffect(() => {
    generateGradient();
  }, [songData]);

  const gradientStyle = gradientColors
    ? {
        backgroundImage: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        backgroundSize: "200% auto",
        animation: "gradientAnimation 10s linear infinite",
      }
    : {};

  return (
    <div>
      <div className="gradient-container" style={gradientStyle}>
        <div className="back-circular-blur">
          <span></span>
          <span></span>
          <span></span>
          <div className="overlay-blur"></div>
        </div>

        <div className="navbar">
          <div className="box-navbar">
            <div className="logo-box-navbar">
              <a>MaxLight</a>
            </div>
            <div className="link-box-navbar">
              <a>Comment ça marche ?</a>
              <a>En savoir plus</a>
            </div>
          </div>
        </div>
        <div className="box-vertical-boxs">
          <div className="vertical-light">
            <div className="vertical-light-box">
              <span></span>
              <span></span>
            </div>
            <div className="vertical-light-box">
              <span></span>
              <span></span>
            </div>
            <div className="vertical-light-box">
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="vertical-light">
            <div className="vertical-light-box">
              <span></span>
              <span></span>
            </div>
            <div className="vertical-light-box">
              <span></span>
              <span></span>
            </div>
            <div className="vertical-light-box">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="box-central">
          <div>
            {songData && songData.track && (
              <div className="song-box">
                <img src={songData.track.images.coverart}></img>
                <div className="box-text">
                  <h2>{songData.track.subtitle}</h2>
                  <h3>{songData.track.title}</h3>
                </div>
              </div>
            )}
          </div>

          <div>
          <input
            type="file"
            accept="audio/mp3"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button onClick={() => fileInputRef.current.click()}>
            Sélectionner un fichier MP3
          </button>
        </div>
        </div>

        <footer>
          <a>
            <li>© 2023 Killian Blanchard</li>
            <li>Mentions légales</li>
            <li>Politique de confidentialité</li>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
