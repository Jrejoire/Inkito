import React from 'react';
import NewIcon from '../../icons/newicon.png';
import '../../sass/components/Panels.scss';
import 'wired-elements';

function NewPanel({ title, creator, reward, image }) {
  
  return (
    <wired-card elevation="2">
      <div className="new-panel">
          <div className="panel-image">
            <img className="panel-main-image" src={image} alt="panel-main-thumbnail"/>
            <img className="panel-icon" src={NewIcon} alt="fire-icon"/>
          </div>
          <div className="panel-banner">
            <img className="panel-profile-pic"src={`https://steemitimages.com/u/${creator}/avatar`} alt=" "/>
            <span className="panel-info">
              <span className="panel-title">{title.length > 60 ? `${title.slice(0,60)}...` : title}</span> 
              <span>{" / "}</span>
              <span className="panel-creator">{creator}</span>
            </span>
            <p className="reward">{reward}</p>
          </div>
      </div>
    </wired-card>
  );
}

export default NewPanel;