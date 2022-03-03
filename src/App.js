import React from "react";
import { useState, createRef, useEffect } from "react";
import "./style.scss";
import {
  ReplyIcon,
  LikeIcon,
  RetweetIcon,
  ShareIcon,
  VerifiedIcon,
  TwitterLogo,
} from "./icons";
import { AvatarLoader } from "./loader";
import { useScreenshot } from "use-react-screenshot";
import { language } from "./languages";

function App() {
  const tweetRef = createRef(null);
  const downloadRef = createRef();
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [tweet, setTweet] = useState();
  const [avatar, setAvatar] = useState();
  const [retweets, setRetweets] = useState(0);
  const [replys, setReplys] = useState(0); //quotes
  const [likes, setLikes] = useState(0);
  const [lang, setLang] = useState("tr");
  const [langType, setLangType] = useState();
  const [image, takeScreenshot] = useScreenshot();

  const getImage = () => takeScreenshot(tweetRef.current);

  const tweetFormat = (tweet) => {
    tweet = tweet
      .replace(/@([\w]+)/g, "<span>@$1</span>")
      .replace(/#([\wşçöğüıİ]+)/gi, "<span>#$1</span>")
      .replace(/(https?:\/\/[\w\.\/]+)/, "<span>$1</span>");
    return tweet;
  };

  const NumberFormat = (number) => {
    if (!number) return 0;

    if (number < 1000) {
      return number;
    }
    number /= 1000;
    number = String(number).split(".");
    return (
      number[0] + (number[1] > 100 ? "," + number[1].slice(0, 1) + "B" : "B")
    );
  };

  const avatarHandle = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      setAvatar(this.result);
    });

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (image) {
      downloadRef.current.click();
    }
  }, [image]);

  const fetchTwitterInfo = () => {
    fetch(
      `https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search?q=${username}`
    )
      .then((res) => res.json())
      .then((data) => {
        const twitter = data[0];
        setAvatar(twitter.profile_image_url_https);
        setName(twitter.name);
        setIsVerified(twitter.verified);
        setTweet(twitter.status.text);
        setRetweets(twitter.status.retweet_count);
        setLikes(twitter.status.favorite_count);
      });
  };

  useEffect(() => {
    setLangType(language[lang]);
  }, [lang]);

  return (
    <>
      <div className="tweet-settings">
        <img src={TwitterLogo} alt="twitter logo" />
        <h3>{langType?.settings}</h3>
        <ul>
          <li>
            <label>{langType?.name}</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </li>
          <li>
            <label>{langType?.username}</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </li>
          <li>
            <label>{langType?.tweet}</label>
            <textarea
              className="textarea"
              maxLength="290"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
            />
          </li>
          <li>
            <label>Avatar</label>
            <input type="file" className="input" onChange={avatarHandle} />
          </li>
          <li>
            <label>Retweet</label>
            <input
              type="number"
              className="input"
              value={retweets}
              onChange={(e) => setRetweets(e.target.value)}
            />
          </li>
          <li>
            <label>{langType?.reply}</label>
            <input
              type="number"
              className="input"
              value={replys}
              onChange={(e) => setReplys(e.target.value)}
            />
          </li>
          <li>
            <label>{langType?.likes}</label>
            <input
              type="number"
              className="input"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
            />
          </li>
          <button onClick={getImage}>{langType?.getSS}</button>
          <div className="download-url">
            {image && (
              <a ref={downloadRef} href={image} download="tweet.png">
                Tweetinizi indir
              </a>
            )}
          </div>
        </ul>
      </div>
      <div className="tweet-container">
        <div className="app-language">
          <span
            onClick={() => setLang("tr")}
            className={lang === "tr" && "active"}
          >
            Türkçe
          </span>
          <span
            onClick={() => setLang("en")}
            className={lang === "en" && "active"}
          >
            English
          </span>
        </div>

        <div className="fetch-info">
          <input
            type="text"
            placeholder={langType?.placeholder}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={fetchTwitterInfo}>{langType?.search}</button>
        </div>

        <div className="tweet" ref={tweetRef}>
          <div className="tweet-author">
            {(avatar && <img src={avatar} alt="" />) || <AvatarLoader />}
            <div>
              <div className="name">
                {name || "Name"}
                {isVerified && <VerifiedIcon width={"19"} height={"19"} />}
              </div>
              <div className="username">@{username || "username"}</div>
            </div>
          </div>
          <div className="tweet-content">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  (tweet && tweetFormat(tweet)) ||
                  "Tweet metin alanı. İçeriğinizi buraya yazabilirsiniz!",
              }}
            ></p>
          </div>
          <div className="tweet-stats">
            <span>
              <b>{NumberFormat(retweets)}</b> Retweet
            </span>
            <span>
              <b>{NumberFormat(replys)}</b> {langType?.reply}
            </span>
            <span>
              <b>{NumberFormat(likes)}</b> {langType?.likes}
            </span>
          </div>
          <div className="tweet-actions">
            <span>
              <ReplyIcon />
            </span>
            <span>
              <RetweetIcon />
            </span>
            <span>
              <LikeIcon />
            </span>
            <span>
              <ShareIcon />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
