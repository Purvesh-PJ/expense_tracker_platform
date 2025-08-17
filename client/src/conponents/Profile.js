import styled from "styled-components";
// import { useEffect, useState } from "react";

// console.log(user);

export const Container = styled.div`
    width : 100%;
    min-width : 180px;
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    box-sizing : border-box;
    padding : 1rem;
    // border : 1px solid gray;
`;

export const Image = styled.img`
    width : 100%;
    min-width : 80px;
    min-height : 80px;
    max-width : 120px;
    max-height : 120px;
    border-radius : 50%;
    object-fit : cover;
`;

export const Name = styled.p`
    font-weight : 500;

`;

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Container>
            <Image src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1732814099~exp=1732817699~hmac=8a370d8f7a0e41fc3fcb9cf1d0e736855087323600134befe6303b40082bd6e6&w=826"/>
            <Name>{user ? user.username : "Unidentified user"}</Name>
        </Container>
    )
}

export default Profile;