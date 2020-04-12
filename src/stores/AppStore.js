
import React from 'react';
import { useLocalStore } from 'mobx-react';
import { runInAction } from 'mobx';
const StoreContext = React.createContext();

//Steem API
const { Client } = require('dsteem');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    '0000000000000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new Client('https://api.pharesim.me');

export function StoreProvider({ children }) {
    const store = useLocalStore(() => ({

        // State Variables
        //Categories array and active
        categories: [
            "All Categories",
            "Action",
            "Comedy",
            "Drama",
            "Fantasy",
            "Horror",
            "Mystery",
            "Romance",
            "Sci-Fi",
            "Slice Of Life"
        ],
        activeComicCategory: "All Categories",
        activeNovelCategory: "All Categories",

        //Trend active (trending or new)
        activeComicTrend: "all",
        activeNovelTrend: "all",

        //Array for promoted content
        promoArray: [
            {
                title: "Shades Of Men",
                author: "Jrej",
                thumbnail: "https://picsum.photos/500/300",
                link: "http://localhost:3000/comicReader/jrej/ghoulredone"
            },
            {
                title: "IN/SYS",
                author: "Jrej",
                thumbnail: "https://picsum.photos/400/300",
                link: "http://localhost:3000/comicReader/jrej/shadesofmen"
            }
        ],

        //Content Display Data
        trendingComics: [],
        newComics: [],
        trendingNovels: [],
        newNovels: [],
        seriesLinks: [],
        seriesDetail: [],
        clickedSeriesAuthor: "",
        clickedSeriesTitle: "",
        clickedSeriesContent: "",
        startPage: 0,
        currentPage: 0,
        spinnerTimeout: false,

        //Data states
        trendyComicState: "",
        newComicState: "",
        trendyNovelState: "",
        newNovelState: "",
        postDetailState: "",
        seriesDetailState: "",
        commentState: "",

        //Queries
        comicsQuery: {
            tag: "inkito-comics",
            limit: 32,
        },
        novelsQuery: {
            tag: "inkito-novels",
            limit: 32,
        },
        //Actions 

        // categories
        updateActiveComicCategory: className => {
            store.activeComicCategory = className;
        },
        updateActiveNovelCategory: className => {
            store.activeNovelCategory = className
        },
        // Trends
        updateActiveComicTrend: trend => {
            store.activeComicTrend = trend;
        },
        updateActiveNovelTrend: trend => {
            store.activeNovelTrend = trend;
        },
        updateCurrentPage: page => {
            store.currentPage = page;
            store.startPage = page;
        },
        sortByLatestUpdate: content => {
            content = content.sort(function(a,b){
                return new Date(b.last_update) - new Date(a.last_update)
            })
            return content;
        },
        // Removing duplicates from new content data
        removeDuplicateContent: (newIds, trendyIds) => {
            return newIds.filter(id =>
                !trendyIds.includes(id)
            )
        },
        setSpinnerTimeout: (value) => {
            store.spinnerTimeout = value;
        },
        resetSeriesDetail: () => {
            store.seriesDetail = [];
            store.spinnerTimeout = false;
        },
        async fetchSeriesInfo(seriesId, type) {
            try {
                const seriesInfo = await client.database
                    .getDiscussions('created', { tag: seriesId, limit: 100 })
                    .then(result => result.reverse())
                    .then(result => {
                        if (result[0]) {
                            let reward = result[result.length - 1].pending_payout_value !== "0.000 HBD" ? result[result.length - 1].pending_payout_value : result[result.length - 1].total_payout_value;
                            let lastUpdate = result[result.length - 1];
                            return {
                                title: result[0].title,
                                author: result[0].author,
                                image: JSON.parse(result[0].json_metadata).image[0],
                                tags: JSON.parse(result[0].json_metadata).tags,
                                last_payout: reward,
                                last_update: lastUpdate,
                                seriesId: seriesId
                            };
                        }
                    })

                runInAction(() => {
                    if (type === "trendingComics") {
                        this.trendyComicState = "done";
                        this.trendingComics.push(seriesInfo);
                    } else if (type === "newComics") {
                        this.newComicState = "done"
                        this.newComics.push(seriesInfo);
                    } else if (type === "trendingNovels") {
                        this.trendyNovelState = "done";
                        this.trendingNovels.push(seriesInfo);
                    } else if (type === "newNovels") {
                        this.newNovelState = "done"
                        this.newNovels.push(seriesInfo);
                    }
                    return seriesInfo;
                })

            } catch (error) {
                console.log(error)
            }
        },
        //Fetching Comics
        async fetchComics(query) {
            this.trendingComics = []
            this.trendyComicState = "pending"
            try {
                const trendyComicIds = await client.database
                    .getDiscussions("trending", query)
                    .then(result => result.map(object => (
                        JSON.parse(object.json_metadata).tags
                            .filter(tag => tag.includes(object.author))
                    ))).then(result => [...new Set(result.flat())])

                trendyComicIds.forEach(id => store.fetchSeriesInfo(id, "trendingComics"));

                runInAction(async () => {
                    const trendy = await this.trendingComics
                    this.trendingComics = store.sortByLatestUpdate(trendy); 
                })

                this.newComics = []
                this.newComicState = "pending"
                const createdComicIds = await client.database
                    .getDiscussions("created", query)
                    .then(result => result.map(object => (
                        JSON.parse(object.json_metadata).tags
                            .filter(tag => tag.includes(object.author))
                    ))).then(result => [...new Set(result.flat())])

                const newComicIds = this.removeDuplicateContent(createdComicIds, trendyComicIds);
                newComicIds.forEach(id => store.fetchSeriesInfo(id, "newComics"));
                
                runInAction(async () => {
                    const fresh = await this.newComics
                    this.newComics = store.sortByLatestUpdate(fresh); 
                })
                
            } catch (error) {
                console.log(error);
            }
        },
        async fetchNovels(query) {
            this.trendingNovels = []
            this.trendyNovelState = "pending"
            try {
                const trendyNovelIds = await client.database
                    .getDiscussions("trending", query)
                    .then(result => result.map(object => (
                        JSON.parse(object.json_metadata).tags
                            .filter(tag => tag.includes(object.author))
                    ))).then(result => [...new Set(result.flat())])

                trendyNovelIds.forEach(id => store.fetchSeriesInfo(id, "trendingNovels"));
                
                runInAction(async () => {
                    const trendy = await this.trendingNovels
                    this.trendingNovels = store.sortByLatestUpdate(trendy); 
                })

                this.newNovels = []
                this.newNovelState = "pending"
                const createdNovelIds = await client.database
                    .getDiscussions("created", query)
                    .then(result => result.map(object => (
                        JSON.parse(object.json_metadata).tags
                            .filter(tag => tag.includes(object.author))
                    ))).then(result => [...new Set(result.flat())])

                const newNovelIds = this.removeDuplicateContent(createdNovelIds, trendyNovelIds);
                newNovelIds.forEach(id => store.fetchSeriesInfo(id, "newNovels"));
                
                runInAction(async () => {
                    const fresh = await this.newNovels
                    this.newNovels = store.sortByLatestUpdate(fresh); 
                })

            } catch (error) {
                console.log(error);
            }
        },
        async fetchPermlinks(author, seriesTitle) {
            let seriesId = `${author}-${seriesTitle}`
            this.seriesLinks = []
            this.seriesLength = 1
            this.seriesLinkState = "pending"
            try {
                const content = await client.database
                    .getDiscussions('created', { tag: seriesId, limit: 100 })
                    .then(result => {
                        return result.map(object => object.permlink).reverse();
                    })

                runInAction(() => {
                    this.seriesLinkState = "done";
                    this.seriesLinks = content;

                    this.seriesDetail.length = content.length;
                })

            } catch (error) {
                this.seriesLinkState = "error"
                console.log(error)
            }
        },
        async fetchSeriesDetail(author, permlink, page) {
            this.seriesDetailState = "pending"
            try {
                const content = await client.database
                    .call('get_content', [author, permlink])
                    .then(result => {
                        return result;
                    })

                runInAction(async () => {
                    const result = await store.fetchComments(content);
                    this.seriesDetailState = "done";
                    setTimeout(() => {
                        this.seriesDetail[page] = result;
                    }, 500)

                    if (this.seriesDetail[0] === undefined) {
                        store.fetchSeriesDetail(author, store.seriesLinks[0], 0);
                    }
                });

            } catch (error) {
                store.seriesDetailState = "error"
                console.log(error)
            }
        },
        fetchComments: (content) => {
            client.database
                .call('get_content_replies', [content.author, content.permlink])
                .then(result => {
                    if (result.length === 0 || result[0].parent_author.length > 0) {
                        runInAction(async () => {
                            if (result.length > 0) {
                                result.forEach(object => {
                                    store.fetchComments(object)
                                });
                                content.replies = result;
                            } else {
                                return result
                            }
                        })

                    }
                })

            return content
        }
    }));
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
};

export default StoreContext;