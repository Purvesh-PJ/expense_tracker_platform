import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiTrendingUp, FiTrendingDown, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const SidebarContainer = styled.aside`
  width: 260px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.gradients.dark};
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
`;

const Logo = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    background: linear-gradient(135deg, #818CF8 0%, #C084FC 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.neutral[400]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${({ theme }) => theme.colors.neutral[200]};
  }

  &.active {
    background: ${({ theme }) => theme.colors.gradients.primary};
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserSection = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.gradients.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[200]};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral[400]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: rgba(244, 63, 94, 0.1);
    color: ${({ theme }) => theme.colors.secondary[400]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Sidebar = () => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <SidebarContainer>
      <Logo>
        <h1>💰 ExpenseTracker</h1>
      </Logo>

      <Nav>
        <NavItem to="/dashboard">
          <FiHome />
          Dashboard
        </NavItem>
        <NavItem to="/income">
          <FiTrendingUp />
          Income
        </NavItem>
        <NavItem to="/expenses">
          <FiTrendingDown />
          Expenses
        </NavItem>
      </Nav>

      <UserSection>
        <UserInfo>
          <Avatar>{getInitials(user?.username)}</Avatar>
          <UserName>{user?.username || 'User'}</UserName>
        </UserInfo>
        <LogoutButton onClick={logout}>
          <FiLogOut />
          Logout
        </LogoutButton>
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar;
