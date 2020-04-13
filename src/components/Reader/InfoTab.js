import React from 'react';
import StoreContext from '../../stores/AppStore';
import { useObserver } from 'mobx-react';

/*import StoreContext from '../../stores/AppStore';
import { useObserver } from 'mobx-react';
import ReactMarkdown from 'react-markdown/with-html';*/
import 'wired-elements';
import '../../sass/components/InfoTab.scss';

/*import LeftArrow from '../../icons/left-arrow.png';
import RightArrow from '../../icons/right-arrow.png';*/
import Heart from '../../icons/heart.png';
import DownArrow from '../../icons/down-arrow.png';
import UpArrow from '../../icons/up-arrow.png';
import Clock from '../../icons/clock.png';
/*import Flag from '../../icons/flag.png';
import Bubble from '../../icons/bubble.png';
import Bell from '../../icons/bell.png';
import { Link } from "react-router-dom";*/

import CommentList from './CommentList';
import ContentBody from './ContentBody';

const InfoTab = ({ content, type }) => {
  const store = React.useContext(StoreContext);
  
  return useObserver(() => {
    if (content.pending_payout_value) {

      let reward = content.pending_payout_value === "0.000 HBD" ? content.total_payout_value.replace("HBD", "") : content.pending_payout_value.replace("HBD", "");

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

      return (
        <div className="info-tab">
          <wired-card>
            <div className="info-card">
              <div className="default-banner flex">
                
                  <img className="none active icon up-arrow" src={UpArrow} alt="up-arrow" />
                  <img className="none icon down-arrow" src={DownArrow} alt="down-arrow" />
                  
                  <div className="time-block flex">
                    <img className="icon clock" src={Clock} alt="clock" />
                    <p>{compareDate(store.seriesDetail[store.currentPage].created.slice(0, 10))}</p>
                  </div>
                  
                  <div className="reward-block flex">
                    <p>$ {reward}</p>
                    <img className="sm-icon down-arrow" src={DownArrow} alt="down-arrow" />
                  </div>
                  
                  <div className="vote-block flex">
                    <p>{store.seriesDetail[store.currentPage].active_votes.length}</p>
                    <img className="sm-icon down-arrow" src={DownArrow} alt="down-arrow" />
                  </div>
                

                <img className="icon heart" src={Heart} alt="heart" />
              </div>
              
              <div className="info-banner">

                <div className={type === "Comics" ? "author-info flex" : "author-info flex none"}>
                  <img className="panel-profile-pic" src={`https://steemitimages.com/u/${content.author}/avatar`} alt=" " />
                  <div className="author-name">
                    <p className="capital">{content.author}</p>
                    <p>Creator</p>
                  </div>
                </div>

                <div className={type === "Comics" ? "content-info" : "content-info none"}>
                  <wired-card>
                    <ContentBody content={content}/>
                  </wired-card>
                </div>

              </div>

              <ul className="comments">
                <div className="comment-title flex" key="comment-title">
                  <h3>{content.replies ? `Comments (${content.replies.length})` : "No Comments"} </h3>
                  <div className="line"/>
                </div>
                <CommentList commentData={content}/>
              </ul>
              
            
            </div>
          </wired-card>
        </div>
      );
    } else {
      return ""
    }
  })
}

export default InfoTab;