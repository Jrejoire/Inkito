import React from 'react';
import StoreContext from '../../../stores/appStore';
import { useAlert } from 'react-alert'
import { Link } from "react-router-dom";

import CommentList from '../commentlist/commentlist';
import ContentBody from '../contentbody/contentbody';
import CommentInput from '../commentlist/commentinput/commentinput';
import HeartElement from '../../../components/heartelement/heartelement';
import BellElement from '../../../components/bellelement/bellelement';

import DefaultAvatar from '../../../assets/icons/defaultavatar.png';
import DownArrow from '../../../assets/icons/down-arrow.png';
import UpArrow from '../../../assets/icons/up-arrow.png';
import Clock from '../../../assets/icons/clock.png';

import './infotab.scss';

const InfoTab = ({ commentIsActive, content, infoIsActive, onClick, type, zoom, page, replyIsActive, userDetail, seriesInfo, followState, commentState, voteState }) => {
  const store = React.useContext(StoreContext);
  const alert = useAlert();

  if (content) {
    let reward = content.pending_payout_value ? content.pending_payout_value === "0.000 HBD" ? content.total_payout_value.replace("HBD", "") : content.pending_payout_value.replace("HBD", "") : "?";

    const compareDate = (contentDate) => {
      var g1 = new Date().toISOString().substring(0, 10);
      var g2 = contentDate;
      if (g1 >= g2) {
        g1 = g1.split("-");
        g2 = g2.split("-");
        var g3 = [g1[0] - g2[0], g1[1] - g2[1], g1[2] - g2[2]]
        if (g3[0] > 0) {
          return g3[0] === 1 ? `${g3[0]} year ago` : `${g3[0]} years ago`;
        } else if (g3[1] > 0) {
          return g3[1] === 1 ? `${g3[1]} month ago` : `${g3[1]} months ago`;
        } else if (g3[2] > 0) {
          return g3[2] === 1 ? `${g3[2]} day ago` : `${g3[2]} days ago`;
        }
      }
    }

    const ActiveInfoTab = () => {
      if (infoIsActive) {
        return (
          <div className="flex pa-h">
            <button className="hide toggle" onClick={onClick}>
              <img className="icon toggle" src={UpArrow} alt="up-arrow" />
            </button>

            <div className="time-block flex">
              <img className="icon clock" src={Clock} alt="clock" />
              <p>{compareDate(content.created.slice(0, 10))}</p>
            </div>

            <div className="reward-block flex">
              <p>$ {(parseInt(reward, 10) / 2).toFixed(2)}</p>
              <img className="sm-icon down-arrow" src={DownArrow} alt="down-arrow" />
            </div>
            <div className="vote-block flex">
              <p>{content.active_votes.length} likes</p>
              <img className="sm-icon down-arrow" src={DownArrow} alt="down-arrow" />
            </div>

          </div>
        )
      } else {
        return (
          <button className="hide toggle" onClick={onClick}>
            <img className="icon toggle" src={DownArrow} alt="down-arrow" />
          </button>
        )
      }
    }

    const ActiveContent = () => {
      if (infoIsActive) {
        return (
          <div>
            <div className="info-banner">
              <div className="author-info flex col">
                <Link to={`/@${content.author}`}>
                  <img className="panel-profile-pic" src={`https://images.hive.blog/u/${content.author}/avatar` ? `https://images.hive.blog/u/${content.author}/avatar` : seriesInfo.author_image ? seriesInfo.author_image.includes("https") ? seriesInfo.author_image : DefaultAvatar : DefaultAvatar} alt={`${content.author}-avatar`} />
                  <div className="author-name">
                    <p className="capital">{content.author}</p>
                    <p>Creator</p>
                  </div>
                </Link>
                <BellElement className="bellElement" userDetail={userDetail} seriesInfo={seriesInfo} followState={followState} content={content} />
              </div>

              <div className={type === "comics" ? "content-info" : "content-info none"}>
                <wired-card>
                  <ContentBody content={content} description={true} />
                </wired-card>
              </div>
            </div>

            {userDetail.name ?
              <p className="reply flex-end pointer" onClick={() => { store.toggleReplyIsActive(content.permlink) }}>
                <button className="hide" >
                  Reply
                </button>
              </p>
              :
              <p className="reply flex-end pointer" onClick={() => {
                alert.show('Please login first.', {
                  timeout: 2000, // custom timeout just for this one alert
                })
              }}>
                <button className="hide" >
                  Reply
                </button>
              </p>
            }
            <div className="comments">
              {replyIsActive === content.permlink ? <CommentInput content={content} userDetail={userDetail} commentState={commentState} page={page} /> : <div className="hidden"><CommentInput content={content} userDetail={userDetail} commentState={commentState} /></div>}
            </div>

            <ul className="comments">
              <div className="comment-title flex reset" key="comment-title">
                {content.replies.length > 0 ?
                  commentIsActive ?
                    <button className="hide comment" onClick={onClick}>
                      <img className="icon comment" src={UpArrow} alt="up-arrow" />
                    </button>
                    :
                    <button className="hide comment" onClick={onClick}>
                      <img className="icon comment" src={DownArrow} alt="down-arrow" />
                    </button>
                  :
                  ""
                }
                <h3>{content.replies.length > 0 ? `Comments (${content.replies.length})` : "No Comments"} </h3>
                <div className="line" />
              </div>
              {commentIsActive ? <CommentList commentData={content} page={page} replyIsActive={replyIsActive} userDetail={userDetail} commentState={commentState} voteState={voteState} /> : ""}
            </ul>
          </div>
        )
      } else {
        return ""
      }
    }

    return (
      <div className={zoom ? zoom === 90 ? "info-tab zoom-tab" : "info-tab" : "info-tab"}>
        <wired-card>
          <div className="info-card">
            <div className="default-banner flex-between">
              <ActiveInfoTab />
              <HeartElement content={content} className="heartElement" page={page} userDetail={userDetail} voteState={voteState} />
            </div>
            <ActiveContent />
          </div>
        </wired-card>
      </div>
    );
  } else {
    return ""
  }
}

export default InfoTab;
