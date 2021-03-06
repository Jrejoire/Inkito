import React from 'react';
import StoreContext from '../../../stores/appStore';
import { useObserver } from 'mobx-react';
import { toJS } from 'mobx';

import LeftArrow from '../../../assets/icons/left-arrow.png';
import RightArrow from '../../../assets/icons/right-arrow.png';
import './navreader.scss';

const NavReaderBottom = ({ onClick }) => {
  const store = React.useContext(StoreContext);

  return useObserver(() => {
    if (toJS(store.seriesDetail).length > 0 && toJS(store.seriesDetail)[store.currentPage] && toJS(store.seriesDetail)[0] && store.seriesLinks.length > 0) {
      let page = store.currentPage;
      let length = store.seriesLinks.length;
      let isHidden = store.navIsHidden;
      return (
        <div className={isHidden ? "nav-reader-bottom hidden-bottom" : "nav-reader-bottom"}>
          <ul className="nav-reader-list-bottom">
            <li className="flex-even arrows ">
              <img className="icon first-arrow" src={LeftArrow} alt="first-arrow" onClick={onClick} />
              <div className={page === 0 ? "disabled flex previous" : "flex previous"} onClick={page === 0 ? null : onClick}>
                <img className="icon left-arrow" src={LeftArrow} alt="left-arrow" />
                <p className="left-arrow">Previous</p>
              </div>
              <div className="flex episode-number">
                <p className="episode">{page === 0 ? "" : "Episode"}</p>
                <p>{page === 0 ? "Cover" : page}</p>
              </div>
              <div className={page === length - 1 ? "disabled flex next" : "flex next"} onClick={page === length - 1 ? null : onClick}>
                <p className="right-arrow">Next</p>
                <img className="icon right-arrow" src={RightArrow} alt="right-arrow" />
              </div>
              <img className="icon last-arrow" src={RightArrow} alt="last-arrow" onClick={onClick} />
            </li>
          </ul>
        </div>
      )
    } else {
      return (
        <div className="nav-reader-bottom">
          <ul className="nav-reader-list">
            <li className="flex arrows ">
              <div className="disabled flex previous" >
                <img className="icon left-arrow" src={LeftArrow} alt="left-arrow" />
                <p className="left-arrow">Previous</p>
              </div>
              <div className="disabled flex next">
                <p className="right-arrow">Next</p>
                <img className="icon right-arrow" src={RightArrow} alt="right-arrow" />
              </div>
            </li>
          </ul>
        </div>
      );
    }
  })
}

export default NavReaderBottom;