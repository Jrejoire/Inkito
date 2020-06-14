import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";

import StoreContext from '../../stores/AppStore';
import { useObserver } from 'mobx-react';
import { toJS } from 'mobx';

import ProfileEdit from './ProfileEdit';
import SeriesList from './SeriesList';
import Library from './Library';

import Nav from '../Main/Nav';
import Location from '../Icons/location.png';
import Link from '../Icons/link.png';
//import 'wired-elements';
import '../../sass/components/Profile.scss';

const ProfilePage = () => {
    const store = React.useContext(StoreContext);
    //to be changed to false;
    const [isEdited, setEdited] = useState(false);

    var props = {};

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        getUrlVars();
        fetchContent();

        return () => store.toggleNavMenu(false);
    })

    const fetchContent = () => {
        if (store.newComics.length === 0) {
          store.fetchComics();
          store.fetchComics("inkitocomics");
        }
        if (store.newNovels.length === 0) {
          store.fetchNovels();
          store.fetchNovels("inkitonovels");
        }
      }    

    const fetchAuthoInfo = (author) => {
        if (toJS(store.authorInfo) && toJS(store.authorInfo).name !== author) {
            store.fetchAuthoInfo(author);
        } else if (toJS(store.authorInfo).length === 0) {
            store.fetchAuthoInfo(author);
        }
    }

    const getUrlVars = () => {
        var address = window.location.href;

        var indexOfReader = address.indexOf("@");
        address = address.slice(indexOfReader + 1, address.length);

        var params = address.split("/");
        props.author = params[0];

        fetchAuthoInfo(props.author);
        return props;
    }

    const handleEdit = () => {
        setEdited(!isEdited);
    }


    const ProfileInfo = () => {
        return useObserver(() => {
            if (toJS(store.authorInfo)) {
                const author = toJS(store.authorInfo);
                const user = toJS(store.userDetail).name || "";
                return (
                    <div className="profile-info">
                        <div className="edit-banner flex-end">
                            {user === author.name ? <button className="hide" onClick={handleEdit}><p className="edit pointer">Edit</p></button> : ""}
                        </div>
                        <div className="author reset">
                            <img
                                className="panel-profile-pic"
                                src={author.avatar}
                                alt="avatar"
                            />
                            <h2 className="capital">{author.name}</h2>
                        </div>
                        <div className="stats flex pa row">
                            <p>Followers:</p>
                            <p>{author.follow ? author.follow.follower_count : ""}</p>
                            <p>Following:</p>
                            <p>{author.follow ? author.follow.following_count : ""}</p>
                        </div>

                        <div className="description">
                            <p>{author.about}</p>
                        </div>

                        <div className="links">
                            {
                                author.location ?
                                    <div className="location flex row">
                                        <img className="icon location" src={Location} alt="location icon" />
                                        <p>{author.location}</p>
                                    </div>
                                    :
                                    ""
                            }
                            {
                                author.website ?
                                    <div className="link flex row">
                                        <a href={author.website} target="_blank" rel="noopener noreferrer" className="flex row" title="author website">
                                            <img className="icon pointer" src={Link} alt="link-icon" />
                                        Website
                                    </a>
                                    </div>
                                    :
                                    ""
                            }
                        </div>
                    </div>
                )
            } else {
                return <wired-spinner class="custom" spinning duration="1000" />
            }
        })
    }

    const CoverImage = () => {
        return useObserver(() => {
            if (toJS(store.authorInfo)) {
                const author = toJS(store.authorInfo);
                return (
                    <div className="cover-image reset flex">
                        {author.cover ? <img src={author.cover} alt=" " /> : ""}
                    </div>
                )
            } else {
                return <wired-spinner class="custom" spinning duration="1000" />
            }
        })
    }

    const EditPage = () => {
        return useObserver(() => {
            if (store.updateProfileState === "done") {
                window.location.reload();
            }
            if (toJS(store.authorInfo)) {
                return <ProfileEdit isEdited={isEdited} handleEdit={handleEdit} authorInfo={toJS(store.authorInfo)} state={store.updateProfileState} />
            }
        })
    }

    return (
        <>
            <Helmet>
                <html lang="en" />
                <title>Inkito | Profile Page</title>
            </Helmet>
            <div className="profile">
                <Nav />
                <div className="container reset" onClick={() => store.toggleNavMenu(false)}>
                    <div className={isEdited ? "profile-edit" : "profile-page"}>
                        <ProfileInfo />
                        <div className="divider" />
                        <CoverImage />
                        {/*<SeriesList />*/}
                        <Library />
                        <EditPage />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;
