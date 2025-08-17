import styled from 'styled-components';
import SideNavigation from '../conponents/SideNavigation';
import Profile from '../conponents/Profile';
import { Outlet } from 'react-router-dom';


const Container = styled.div`
    display : flex;
    flex-direction : row;
    justify-content : center;
    align-items : center;
    // border : 1px solid blue;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
`;

const LeftContainer = styled.div`
    // border : 1px solid gray;
    width : 100%;
    min-width : fit-content;
    max-width : 320px;
    padding : 8px;
    height : 99.6vh;
    background-color : #f1f5f9;
`;

const MainContainer = styled.div`
    width : 100%;
    max-width : 1200px;
    height : 99.6vh;
    // border : 1px solid blue;
`;

const ContainerHolder = styled.div`
    position : sticky;
    top : 1rem;
`;

const ContainerHolder2 = styled.div`
    display : flex;
    justify-content : center;
    align-items : center;
    position : sticky;
    top : 1rem;
    height : 96vh;
    // border : 1px solid gray;
`;


const DashboardLayout = () => {
    return (
        <Container>
            <LeftContainer>
                <ContainerHolder>
                    <Profile />
                    <SideNavigation />
                </ContainerHolder>
            </LeftContainer>
            <MainContainer>
                <ContainerHolder2>
                    <Outlet />
                </ContainerHolder2>
            </MainContainer>
        </Container>
    )
};

export default DashboardLayout;