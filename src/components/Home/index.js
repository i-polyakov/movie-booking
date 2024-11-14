import Banner from './Banner';
import MainView from './MainView';
import React, {useEffect} from 'react';
import Tags from './Tags';
import agent from '../../agent';
import MovieList from '../MovieList';
import { useDispatch, useSelector } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

const Promise = global.Promise;

// const mapStateToProps = state => ({
//   ...state.home,
//   appName: state.common.appName,
//   token: state.common.token
// });

// const mapDispatchToProps = dispatch => ({
//   onClickTag: (tag, pager, payload) =>
//     dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
//   onLoad: (tab, pager, payload) =>
//     dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
//   onUnload: () =>
//     dispatch({  type: HOME_PAGE_UNLOADED })
// });

export default function Home(){
  const dispatch = useDispatch();

  const movies = useSelector(state => state.home.movies);
  const appName = useSelector(state => state.common.appName);
  const token = useSelector(state => state.common.token);

  const onLoad = (payload) => {
    dispatch({ type: HOME_PAGE_LOADED, payload});
  };

  const onUnload = () => {
    dispatch({ type: HOME_PAGE_UNLOADED });
  };

  useEffect(() => {
    dispatch(onLoad(agent.Movies.all()));
    // Очистка при размонтировании компонента
    // return () => {
    //   dispatch(onUnload());
    // };
  }, [dispatch]); // Зависимости: dispatch и token



  // componentWillMount() {
  //   const tab = this.props.token ? 'feed' : 'all';
  //   const articlesPromise = this.props.token ?
  //     agent.Articles.feed :
  //     agent.Articles.all;

  //   this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAll(), articlesPromise()]));
  // }

  // componentWillUnmount() {
  //   this.props.onUnload();
  // }

  return (
      <div className="home-page">

        <Banner appName={appName} />

        <div className="container page">
         
          
            <MovieList
            movies={movies}/>
        
  
        </div>

      </div>

    )}

