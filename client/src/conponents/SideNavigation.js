import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';  // Importing the logout icon
import styled from 'styled-components';
import { sideNavigationLinks } from '../data/sideListNavigation';

export const SideNav = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-width: 260px;
    gap: 1rem;
`;

export const UnorderedList = styled.ul`
    width: 100%;
    background-color: white;
    border-radius: 10px;
    padding-left: 10px;
`;

export const NavLink = styled.li`
    padding: 1px;
    &:hover {
        text-decoration: underline;
    }
`;

export const ItemName = styled.p`
    font-weight: 500;
    color: #4b5563;
    font-size: 16px;
`;

export const LogoutBtn = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: gray;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width : 200px;
    margin-left : auto;
    margin-right : auto;

    &:hover {
        // background-color: #d32f2f;  /* Darker red on hover */
        color : #2685d5 ;
    }

    svg {
        margin-right: 8px;  /* Space between icon and text */
    }
`;

const SideNavigation = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/Login'); // Redirect to Login after logout
    };

    return (
        <SideNav>
            <UnorderedList>
                {sideNavigationLinks.map((data, index) => (
                    <NavLink key={index} onClick={() => navigate(data.url)}>
                        <ItemName>{data.item}</ItemName>
                    </NavLink>
                ))}
            </UnorderedList>
            {isAuthenticated && (
                <LogoutBtn onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </LogoutBtn>
            )}
        </SideNav>
    );
};

export default SideNavigation;
