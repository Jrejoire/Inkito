import React from 'react';
import StoreContext from '../../stores/AppStore';
import { useObserver } from 'mobx-react';

import Heart from '../Icons/heart.png';
import RedHeart from '../Icons/red-heart.png';
import GreyHeart from '../Icons/grey-heart.png';
import 'wired-elements';
import '../../sass/components/InfoTab.scss';

const HeartElement = ({ content, page }) => {
    const store = React.useContext(StoreContext);
    
    const handleVote = () => {
        store.vote(store.userDetail.name, content.author, content.permlink, 10000, page);
    }

    const isPostActive = (contentDate) => {
        var g1 = new Date().toISOString().substring(0, 10);
        var g2 = contentDate;
        if (g1 >= g2) {
            g1 = g1.split("-");
            g2 = g2.split("-");
            var g3 = [g1[0] - g2[0], g1[1] - g2[1], g1[2] - g2[2]]
            if (g3[0] > 0) {
                return false;
            } else if (g3[1] > 0) {
                return false;
            } else if (g3[2] > 7) {
                return false;
            } else if (g3[2] <= 7) {
                return true;
            }
        }
    }

    return useObserver(() => {
        if (store.userDetail && content.active_votes.length >= 0) {
            if (store.userDetail.name){
                if (store.voteState === content.permlink) {
                    return (
                        <div className="icon heart flex">
                            <wired-spinner class="custom" spinning duration="1000" />
                        </div>
                    )
                } else if (content.active_votes.some(vote => vote.voter === store.userDetail.name)) {
                    return (
                        <img className="icon heart" src={RedHeart} alt="red-heart" onClick={handleVote} />
                    )
                } else if (!content.active_votes.some(vote => vote.voter === store.userDetail.name) && store.voteState !== content.permlink) {
                    if (isPostActive(content.created.slice(0, 10))) {
                        return (
                            <img className="icon heart" src={GreyHeart} alt="grey-heart" onClick={handleVote} />
                        )
                    } else {
                        return (
                            <img className="icon heart" src={Heart} alt="heart" onClick={handleVote} />
                        )
                    }
                }
            } else {
                return (
                    <img className="icon heart" src={Heart} alt="heart" />
                )
            }
        } else {
            return (
                <img className="icon heart" src={Heart} alt="heart" />
            )
        }
    })
}

export default HeartElement;