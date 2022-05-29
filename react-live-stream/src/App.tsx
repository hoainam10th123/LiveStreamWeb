import './App.css';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Home from './features/home/home';
import PrivateWrapper from './features/components/PrivateRoute';
import NotFound from './features/components/NotFound';
import ServerErrorView from './features/errors/ServerError';
import TestErrors from './features/errors/TestError';
import NewFeed from './features/newFeeds/NewFeed';
import DetailPage from './features/DetailPage/DetailPage';
import MenuBar from './features/components/menuBar';
import Login from './features/login/Login';
import Loading from './features/components/Loading';
import { useEffect } from 'react';
import { useStore } from './stores/stores';
import { observer } from 'mobx-react-lite';
import ModalContainer from './common/modals/ModalContainer';

function App() {
  const { userStore, presenceHubStore } = useStore();

  useEffect(() => {
    if (userStore.user) {      
      presenceHubStore.createHubConnection(userStore.user);
      userStore.setAppLoaded();
    }
    else {
      userStore.setAppLoaded();
    }
  },[userStore, presenceHubStore])

  if (!userStore.appLoaded)
    return (
      <div className='centerd-loading'>
        <Loading />
      </div>
    );

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      <ModalContainer />
      <MenuBar />
      <Container>
        <Routes>
          <Route index element={<Home />} />

          <Route path='/login' element={(
            <Login />
          )} />

          <Route path='/video' element={(
            <PrivateWrapper><DetailPage /></PrivateWrapper>            
          )} />

          <Route path='/new-feed' element={(
            <PrivateWrapper><NewFeed /></PrivateWrapper>            
          )} />

          <Route path='/errors' element={(
            <PrivateWrapper><TestErrors /></PrivateWrapper>            
          )} />

          <Route path='/server-error' element={<ServerErrorView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

export default observer(App);
